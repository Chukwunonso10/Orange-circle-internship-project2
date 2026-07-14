import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        const allSales = await prisma.sale.findMany({
            include: { item: { select: { name: true } } }
        })
        if (allSales.length === 0) {
            return NextResponse.json({
                success: true, message: "No sales currently recorded"
            })
        }

        return NextResponse.json({
            success: true, message: "successfully retrieved all sales", data: allSales.map((each) => ({ ...each }))
        }, { status: 200 })
    } catch (error) {
        console.log("Error retrieving sales log")
        return NextResponse.json({
            success: true, message: "internal server error"
        }, { status: 500 })
    }
}


export async function POST(req: NextRequest) {
    try {
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
        
        let result;
        if (id) {
            const completedSale = await prisma.sale.findUnique({
                where: { id }
            })

            if (completedSale) {
                return NextResponse.json({
                    success: true, message: "sales already completed!"
                }, { status: 200 })
            }
        }

        result = await prisma.$transaction(async (tsx) => {
            if (itemId) {
                const productIsExist = await tsx.item.findUnique({
                    where: { id: itemId }
                })

                if (!productIsExist) {
                    throw new Error("Product does not exist; create a product before you can record a sale")
                }

                if (productIsExist.currentStock < qty) {
                    throw new Error(`insufficient stock!!: available stock is ${productIsExist.currentStock}`)
                }
                if (qty <= 0) {
                    throw new Error(`Bad request: quantity should be greater than 0`)
                }

                await tsx.item.update({
                    where: { id: itemId },
                    data: {
                        currentStock: {
                            decrement: qty
                        }
                    }
                })
            }

            const soldItem = await tsx.sale.create({
                data: {
                    id: id || undefined,
                    unitPrice: price,
                    quantity: qty,
                    totalAmount,
                    customItemName: customItemName ? customItemName : null,
                    itemId: itemId ? itemId : undefined,
                    createdAt: createdAt ? new Date(createdAt) : undefined
                }
            })
            return soldItem;
        })
        console.log("result is..", result)
        return NextResponse.json({
            success: true, message: "item sold successfully!", result
        }, { status: 200 })

    } catch (error) {
        console.log("Error: sales couldnt be completed", error)
        return NextResponse.json({
            success: false, message: `internal server error`
        }, { status: 500 })
    }
}

