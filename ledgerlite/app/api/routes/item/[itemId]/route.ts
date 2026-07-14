import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { itemId: string } }) {
    try {
        const { itemId } = await params
        const { id, name, lowStock, currentStock } = await req.json()


        if (name === "" || name === "." ) {
            return NextResponse.json({
                success: false, message: "Bad Request: Update fields cannot be empty"
            }, { status: 400 })
        }

        if (id) {
            const updatedItem = await prisma.item.findUnique({ where: { id } })
            if (updatedItem) {
                return NextResponse.json({
                    success: true, message: "conflict: Already updated!!!"
                }, { status: 409 })
            }
        }

        const updatedItem = await prisma.item.update({
            where: { id: itemId },
            data: {
                name: name !== undefined ? name.trim() : undefined,
                lowStock: lowStock ? Number(lowStock):  undefined,
                currentStock: currentStock ? Number(currentStock): undefined,
            }
        })

        if (!updatedItem) {
            return NextResponse.json({
                success: false, message: "Error updating the fields"
            })
        }

        return NextResponse.json({
            success: true, message: "successfully updated item", updatedItem
        }, { status: 200 })

    } catch (error) {
        console.error("failed to update items")
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { itemId: string } }) {
    try {
        const { itemId } = await params
        const { id } = await req.json()

        if (id) {
            const deletedItem = await prisma.item.findUnique({ where: { id } })
            if (deletedItem) {
                return NextResponse.json({
                    success: true, message: "conflict: Already deleted!!!"
                }, { status: 409 })
            }
        }

        const deletedItem = await prisma.item.delete({
            where: { id: itemId },
        })

        if (!deletedItem) {
            return NextResponse.json({
                success: false, message: "Error deleting the item"
            })
        }

        return NextResponse.json({
            success: true, message: "successfully deleted item", deletedItem
        }, { status: 200 })

    } catch (error) {
        console.error("failed to deleted items")
        return NextResponse.json({
            success: true, message: "internal server error"
        }, { status: 500 })
    }
}