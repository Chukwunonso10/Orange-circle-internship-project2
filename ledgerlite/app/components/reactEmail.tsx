import * as React from 'react';
import { Html, Head, Body, Container, Text } from '@react-email/components';

export function EmailTemplate({ code }: { code: string }) {
  return (
    <Html>
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Brand Logo Header */}
          <div style={logoWrapperStyle}>
            <span style={logoTextStyle}>
              Ledger<span style={logoSubStyle}>Lite</span>
            </span>
          </div>

          <Text style={titleStyle}>
            Verify Your Account
          </Text>
          
          <Text style={descriptionStyle}>
            Thank you for registering with LedgerLite. Use the 6-digit verification code below to secure and activate your account:
          </Text>
          
          {/* Verification Code Box */}
          <div style={codeBoxWrapper}>
            <div style={codeBoxStyle}>
              {code}
            </div>
          </div>

          <Text style={footerStyle}>
            This code will expire in <span style={expiryHighlightStyle}>3 minutes</span>.
          </Text>

          <Text style={disclaimerStyle}>
            If you did not request this verification, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Inline CSS styles (100% compatible with all email clients)
const mainStyle = {
  backgroundColor: '#F4F8F8', // Soft teal-gray page bg
  padding: '60px 0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const containerStyle = {
  backgroundColor: '#FFFFFF', // Clean white card
  border: '1px solid #E2E8F0',
  borderRadius: '16px',
  padding: '40px 30px',
  maxWidth: '440px',
  margin: '0 auto',
  textAlign: 'center' as const,
  boxShadow: '0 4px 20px rgba(11, 122, 117, 0.04)', // Tinted brand shadow
};

const logoWrapperStyle = {
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const logoTextStyle = {
  fontSize: '26px',
  fontWeight: '800',
  color: '#0B7A75', // Brand Teal
  letterSpacing: '-0.5px',
};

const logoSubStyle = {
  color: '#0F172A', // Dark Slate
};

const titleStyle = {
  color: '#0F172A', // Dark Slate
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 12px 0',
  textAlign: 'center' as const,
  letterSpacing: '-0.25px',
};

const descriptionStyle = {
  color: '#475569', // Slate-600
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0 0 28px 0',
  textAlign: 'center' as const,
};

const codeBoxWrapper = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const codeBoxStyle = {
  fontSize: '36px',
  fontWeight: '800',
  letterSpacing: '8px',
  color: '#0B7A75', // Brand Teal
  backgroundColor: '#F0FDFA', // Very light teal-green background
  padding: '16px 32px',
  borderRadius: '12px',
  border: '1px solid #BCE0DE',
  display: 'inline-block',
  margin: '0 auto',
};

const footerStyle = {
  color: '#64748B', // Slate-500
  fontSize: '14px',
  margin: '24px 0 8px 0',
  textAlign: 'center' as const,
};

const expiryHighlightStyle = {
  fontWeight: '700',
  color: '#EF4444', // Red-500
};

const disclaimerStyle = {
  color: '#94A3B8', // Slate-400
  fontSize: '12px',
  lineHeight: '18px',
  margin: '16px 0 0 0',
  textAlign: 'center' as const,
  borderTop: '1px solid #F1F5F9',
  paddingTop: '16px',
};