import { getCurrentUserId } from "./authhelper"
import prisma from "./prisma"

export async function Metrics() {
    const userId = await getCurrentUserId()
    if (!userId) return null

    const now = new Date()
    //todays date 00: 00: 00: 00
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)

    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)

    const yesterdayEnd = new Date(todayEnd)
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1)

    const [TodayTotalRevenue, TodayTotalExpenses, todayTotalRevenue, todayTotalExpenses, todayTotalSales, yesterdaytotalSales] = await Promise.all([
        prisma.sale.aggregate({
            where: { userId },
            _sum: { totalAmount: true },
        }),

        prisma.expense.aggregate({
            where: { userId },
            _sum: { amount: true },
        }),

        prisma.sale.aggregate({
            where: { userId, createdAt: { gt: todayStart, lt: todayEnd } },
            _sum: { totalAmount: true },
        }),

        prisma.expense.aggregate({
            where: { userId, createdAt: { gt: todayStart, lt: todayEnd } },
            _sum: { amount: true },
        }),

        prisma.sale.aggregate({
            where: { userId, createdAt: { gt: todayStart, lt: todayEnd } },
            _sum: { totalAmount: true },
            _count: { id: true }
        }),

        prisma.sale.aggregate({
            where: { userId, createdAt: { gt: yesterdayStart, lt: yesterdayEnd } },
            _sum: { totalAmount: true },
            _count: { id: true }
        }),





    ])
}