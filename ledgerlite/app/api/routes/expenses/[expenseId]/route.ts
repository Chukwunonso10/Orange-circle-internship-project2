import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { expenseId: string } }) {
    try {
        const { id, amount, description, category } = await req.json()
        const { expenseId } = await params

        if (id) {
            const isUpdatedExpenses = await prisma.expense.findUnique({ where: { id } })
            if (isUpdatedExpenses) {
                return NextResponse.json({
                    success: true, message: "conflict: Expenses already updated"
                }, { status: 409 })
            }
        }
        const updateExpense = await prisma.expense.update({
            where: { id: expenseId ? expenseId : undefined },
            data: {
                amount: amount ? amount : undefined,
                description: description ? description : undefined,
                category: category ? category : undefined
            }
        })

        if (!updateExpense) {
            return NextResponse.json({
                success: false, message: "update Error: failed to update Expenses"
            })
        }

        return NextResponse.json({
            success: true, message: "Expenses successfully updated"
        }, { status: 200 })

    } catch (error) {
    console.error("Error updating fields", error)
    return NextResponse.json({
        success: false, message: "internal server error"
    }, { status: 500 })
}
}


export async function DELETE(req: NextRequest, { params }: { params: { expenseId: string } }) {
    try {
        const { id } = await req.json()
        const { expenseId } = await params

        if (id) {
            const isDeletedExpenses = await prisma.expense.findUnique({ where: { id } })
            if (isDeletedExpenses) {
                return NextResponse.json({
                    success: true, message: "conflict: Expenses already Deleted"
                }, { status: 409 })
            }
        }
        const deletedExpense = await prisma.expense.delete({
            where: { id: expenseId }
        })

        if (!deletedExpense) {
            return NextResponse.json({
                success: false, message: "Deleting Error...: failed to Delete Expenses"
            })
        }


        return NextResponse.json({
            success: true, message: "Expenses Deleted successfully"
        }, { status: 200 })

    } catch (error) {
        console.error("Error Deleting fields", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}