import prisma from "@/app/lib/prisma";
import { existsSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { Result } from "pg";

export async function GET() {
    try {
        const allSales = await prisma.sales.findMany()
        if (allSales.length === 0) {
            return NextResponse.json({
                success: true, message: "No sales currently recorded"
            })
        }

        return NextResponse.json({
            success: true, message: "successfully retrieved all sales", allSales
        }, { status: 200 })
    } catch (error) {
        console.log("Error retrieving sales log")
        return NextResponse.json({
            success: true, message: "internal server error"
        }, { status: 500 })
    }
}


export async function POST(req: NextRequest) {
    const { id, unitPrice, quantity, customItemName, itemId, createdAt } = await req.json()
    const price = Number(unitPrice)
    const qty = Number(quantity)

    if (!quantity) {
        return NextResponse.json({
            success: false, message: `quantity is required!`
        }, { status: 400 })
    }
    if (!unitPrice) {
        return NextResponse.json({
            success: false, message: `unitprice is required!`
        }, { status: 400 })
    }

    const totalAmount = qty * price
    //how to make a sale
    //check if the sales already exist (offline mode)
    // check if the product exists
    // check if the existing product is greater than the quantity you want to sale
    // deduct the quantity from the currentstock.
    // create the sales record. if we are unable to create sales record reverse the deducted quantity
    let result;
    if (id) {
        const completedSale = await prisma.sales.findUnique({
            where: { id }
        })

        if (completedSale) {
            return NextResponse.json({
                success: true, message: "sales already completed!"
            }, { status: 200 })
        }
    }
    result = await prisma.$transaction(async (tsx) => {
        const productIsExist = await prisma.item.findUnique({
            where: { id: itemId }
        })

        if (!productIsExist) {
            throw new Error("Product does not exist; create a product before you can record a sale")
        }

        if (productIsExist.currentStock < qty) {
            throw new Error(`insufficient stock!!: available stock is ${productIsExist.currentStock}`)
        }

        await tsx.item.update({
            where: { id: itemId },
            data: {
                currentStock: {
                    decrement: qty
                }
            }
        })

        const soldItem = await tsx.sales.create({
            data: {
                id: id || undefined,
                unitPrice: price,
                quantity: qty,
                totalAmount,
                customItemName: customItemName ? customItemName : null,
                itemId,
                createdAt: createdAt ? new Date(createdAt) : undefined
            }
        })
        return soldItem;
    })

    return NextResponse.json({
        success: true, message: "item sold successfully!"
    })
}

