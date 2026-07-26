import { getCurrentUser } from '@/app/lib/authhelper';
import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, error: 'Verification code is required' }, { status: 400 });
    }

    if (!user.phoneNumber || !user.phoneNumberVerificationToken || !user.phoneNumberVerifiesExpiresAt) {
      return NextResponse.json({
        success: false,
        error: 'No active phone verification request found. Please request a verification code first.'
      }, { status: 400 });
    }

    const now = new Date();

    // 1. Check expiration threshold (3 mins lifespan limit)
    if (now > new Date(user.phoneNumberVerifiesExpiresAt)) {
      // Clear token since it expired
      await prisma.user.update({
        where: { id: user.id },
        data: {
          phoneNumberVerificationToken: null,
          phoneNumberVerifiesExpiresAt: null,
          phoneNumberVerificatonAttemps: 0,
        },
      });
      return NextResponse.json({
        success: false,
        error: 'The verification code has expired. Please request a new one.'
      }, { status: 400 });
    }

    // 2. Check brute force attempt limit
    if (user.phoneNumberVerificatonAttemps >= 3) {
      return NextResponse.json({
        success: false,
        error: 'Too many verification attempts. Please request a new code.'
      }, { status: 400 });
    }

    // 3. Process matches
    if (code.trim() === user.phoneNumberVerificationToken) {
      // Success! Mark phone verified
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          phoneNumberIsVerified: true,
          phoneNumberVerificationToken: null,
          phoneNumberVerifiesExpiresAt: null,
          phoneNumberVerificatonAttemps: 0,
        },
      });

      console.log(`Phone verified successfully for user ${user.email} (Phone: ${updatedUser.phoneNumber})`);

      return NextResponse.json({
        success: true,
        message: 'Phone number verified successfully!',
        profile: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          phoneNumber: updatedUser.phoneNumber,
          phoneNumberVerified: updatedUser.phoneNumberIsVerified,
          createdAt: updatedUser.createdAt,
        }
      });
    } else {
      // Incorrect code. Increment verification attempts
      const nextAttempts = user.phoneNumberVerificatonAttemps + 1;

      if (nextAttempts >= 3) {
        // Brute-force lockout triggered! Immediately invalidate the token
        await prisma.user.update({
          where: { id: user.id },
          data: {
            phoneVerificationToken: null,
            phoneVerificationExpires: null,
            phoneVerificationAttempts: 0,
          },
        });
        return NextResponse.json({
          success: false,
          error: 'Too many incorrect attempts. This code has been invalidated for security. Please request a new verification code.'
        }, { status: 400 });
      }

      // Increment attempt count in DB
      await prisma.user.update({
        where: { id: user.id },
        data: {
          phoneVerificationAttempts: nextAttempts,
        },
      });

      return NextResponse.json({
        success: false,
        error: `Invalid verification code. You have ${3 - nextAttempts} attempts remaining.`
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Verify phone OTP error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
