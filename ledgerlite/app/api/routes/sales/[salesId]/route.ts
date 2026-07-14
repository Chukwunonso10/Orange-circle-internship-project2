import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { salesId: string } }) {
    try {
        const { salesId } = await params
        const { id, unitPrice, quantity, totalAmount, customItemName } = await req.json()

        if (id) {
            const updatedSales = await prisma.sale.findUnique({
                where: { id }
            })

            if (updatedSales) {
                return NextResponse.json({
                    success: true, message: "duplicate: already updated sales record"
                }, { status: 409 })
            }
        }

        const updatedSales = await prisma.sale.update({
            where: { id: salesId },
            data: {
                unitPrice: unitPrice ? Number(unitPrice) : undefined,
                quantity: quantity ? Number(quantity) : undefined,
                totalAmount: totalAmount ? totalAmount : undefined,
                customItemName: customItemName ? customItemName : undefined,

            }
        })

        if (!updatedSales) {
            return NextResponse.json({
                success: false, message: "failed to update sales record"
            })
        }

        return NextResponse.json({
            success: true, message: "updated sales record successfully", updatedSales
        }, { status: 200 })

    } catch (error) {
        console.error("database Error: Failed to update sales record", error)
        return NextResponse.json({
            success: false, message: "internal serve error"
        }, { status: 500 })
    }
}
export async function DELETE(req: NextRequest, { params }: { params: { salesId: string } }) {
    try {
        const { salesId } = await params
        const { id} = await req.json()

        if (id) {
            const deletedSales = await prisma.sale.findUnique({
                where: { id }
            })

            if (deletedSales) {
                return NextResponse.json({
                    success: true, message: "duplicate: already deleted sales record"
                }, { status: 409 })
            }
        }

        const deletedSales = await prisma.sale.delete({
            where: { id: salesId }
        })

        if (!deletedSales) {
            return NextResponse.json({
                success: false, message: "failed to delete sales record"
            })
        }

        return NextResponse.json({
            success: true, message: "Deleted sales record successfully"
        }, { status: 200 })

    } catch (error) {
        console.error("database Error: Failed to Deleted sales record", error)
        return NextResponse.json({
            success: false, message: "internal serve error"
        }, { status: 500 })
    }
}