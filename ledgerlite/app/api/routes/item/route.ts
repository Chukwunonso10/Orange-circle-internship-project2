import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const allProducts = await prisma.item.findMany()

        if (allProducts.length === 0) {
            return NextResponse.json({
                success: true, message: "No products found in the database!"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true, message: "successfully retrived products", allProducts
        }, { status: 200 })

    } catch (error) {
        console.log("Error retrieving items", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}


export async function POST(req: NextRequest) {
    try {
        const { id, name, lowStock, currentStock, createdAt } = await req.json()

        if (!name) {
            return NextResponse.json({
                success: false, message: "Bad Request: Name is required from payload"
            }, { status: 400 })
        }

        if (id) {
            const newProduct = await prisma.item.upsert({
                where: { id },
                update: {
                    name,
                    lowStock: lowStock !== undefined ? Number(lowStock) : undefined,
                    currentStock: currentStock !== undefined ? Number(currentStock) : undefined,
                    createdAt: createdAt ? new Date(createdAt) : undefined
                },
                create: {
                    id: id ? id : undefined,
                    name,
                    lowStock: lowStock !== undefined ? Number(lowStock) : undefined,
                    currentStock: currentStock !== undefined ? Number(currentStock) : undefined,
                    createdAt: createdAt ? new Date(createdAt) : undefined

                }
            })
        } else {
            const newProduct = await prisma.item.create({
                data: {
                    name,
                    lowStock: lowStock !== undefined ? Number(lowStock) : undefined,
                    currentStock: currentStock !== undefined ? Number(currentStock) : undefined,
                    createdAt: createdAt ? new Date(createdAt) : undefined
                }
            })

            if (!newProduct) {
                return NextResponse.json({
                    success: false, message: "failed to create product"
                })
            }
        }


        return NextResponse.json({
            success: true, message: "product successfully created"
        }, { status: 201 })



    } catch (error) {
        console.log("product creation failed", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }


}