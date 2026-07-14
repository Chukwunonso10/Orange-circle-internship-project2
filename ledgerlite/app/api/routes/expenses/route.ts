import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const allExpenses = await prisma.expense.findMany()

        if (allExpenses.length === 0) {
            return NextResponse.json({
                success: false, message: "No expenses recorded currently"
            }, { status: 200 })
        }

        return NextResponse.json({
            success: true, message: "expenses Record Retrieved successfully!", allExpenses
        }, { status: 200 })
    } catch (error) {
        console.error("Error retrieving expenses", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}




export async function POST(req: NextRequest) {
    const { id, amount, category, description, createdAt } = await req.json()

    if (!amount || !category) {
        return NextResponse.json({
            success: true, message: "Enter an expense amount or category"
        }, { status: 400 })
    }

    try {
        if (id) {
            const expense = await prisma.item.findUnique({ where: { id } })
            if (expense){
                return NextResponse.json({
                    success: false, message: "Expense Record already created!!"
                }, { status: 429 })
            }
        }
        const expenses = await prisma.expense.create({
            data: {
                id: id ? id : undefined,
                amount,
                description: description || null,
                category,
                createdAt: createdAt ? new Date(createdAt) : undefined
            }
        })

        return NextResponse.json({
            success: true, message: "expenses recorded successfully", expenses
        }, { status: 200 })
    } catch (error) {
        console.log("failed to record expenses", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}
