import prisma from "../prisma";

export interface AiAlert {
  id: string;
  type: "stockout" | "low_stock" | "deadstock" | "anomaly";
  severity: "high" | "medium" | "low";
  title: string;
  message: string;
  actionHint: string;
  itemId?: string;
}

export async function getAiAlerts(userId: string): Promise<AiAlert[]> {
  const alerts: AiAlert[] = [];

  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch user items
    const items = await prisma.item.findMany({
      where: { userId },
    });

    for (const item of items) {
      // Get sales for this item in the last 14 days
      const sales = await prisma.sale.findMany({
        where: {
          userId,
          itemId: item.id,
          createdAt: { gte: fourteenDaysAgo },
        },
      });

      const totalQuantitySold14Days = sales.reduce(
        (sum, sale) => sum + sale.quantity,
        0
      );

      const dailyVelocity = totalQuantitySold14Days / 14;

      if (dailyVelocity > 0 && item.currentStock > 0) {
        const daysLeft = item.currentStock / dailyVelocity;

        if (daysLeft <= 3) {
          alerts.push({
            id: `stockout-${item.id}`,
            type: "stockout",
            severity: "high",
            title: `Critical Stockout Risk: ${item.name}`,
            message: `${item.name} has only ${item.currentStock} units left. At your current sales rate of ${dailyVelocity.toFixed(1)} units/day, you will run out in ${daysLeft < 1 ? "less than 1 day" : `${daysLeft.toFixed(1)} days`}.`,
            actionHint: `Reorder at least ${Math.ceil(dailyVelocity * 14)} units to cover the next 2 weeks.`,
            itemId: item.id,
          });
        } else if (daysLeft <= 7) {
          alerts.push({
            id: `stockout-warning-${item.id}`,
            type: "stockout",
            severity: "medium",
            title: `Upcoming Restock Needed: ${item.name}`,
            message: `${item.name} stock (${item.currentStock} units) is projected to run out in ${daysLeft.toFixed(0)} days based on recent demand.`,
            actionHint: `Plan supplier reorder soon.`,
            itemId: item.id,
          });
        }
      } else if (item.currentStock <= item.lowStock && item.currentStock > 0) {
        alerts.push({
          id: `lowstock-${item.id}`,
          type: "low_stock",
          severity: "medium",
          title: `Low Stock Threshold Reached: ${item.name}`,
          message: `${item.name} is down to ${item.currentStock} units (your low stock limit is ${item.lowStock}).`,
          actionHint: `Restock now to prevent missed sales.`,
          itemId: item.id,
        });
      }

      // Deadstock Detection (No sales in 14 days + significant stock tied up)
      if (
        totalQuantitySold14Days === 0 &&
        item.currentStock >= 10 &&
        new Date(item.createdAt) < thirtyDaysAgo
      ) {
        const tiedCapital = Number(item.costPrice) * item.currentStock;
        alerts.push({
          id: `deadstock-${item.id}`,
          type: "deadstock",
          severity: "low",
          title: `Deadstock Alert: ${item.name}`,
          message: `${item.name} (${item.currentStock} units in stock) has 0 sales in the last 14 days. You have ₦${tiedCapital.toLocaleString()} tied up in unsold inventory.`,
          actionHint: `Consider running a discount promo or bundle deal to free up capital.`,
          itemId: item.id,
        });
      }
    }

    // Anomaly Detection: Compare recent 7-day average daily sales vs historical 30-day average
    const recent7Days = new Date();
    recent7Days.setDate(recent7Days.getDate() - 7);

    const salesLast30Days = await prisma.sale.findMany({
      where: { userId, createdAt: { gte: thirtyDaysAgo } },
    });

    const expensesLast30Days = await prisma.expense.findMany({
      where: { userId, createdAt: { gte: thirtyDaysAgo } },
    });

    const sales7Days = salesLast30Days.filter(
      (s) => new Date(s.createdAt) >= recent7Days
    );
    const totalSales30 = salesLast30Days.reduce(
      (acc, s) => acc + Number(s.totalAmount),
      0
    );
    const totalSales7 = sales7Days.reduce(
      (acc, s) => acc + Number(s.totalAmount),
      0
    );

    const avgDaily30 = totalSales30 / 30;
    const avgDaily7 = totalSales7 / 7;

    if (avgDaily30 > 1000 && avgDaily7 < avgDaily30 * 0.5) {
      const dropPercentage = Math.round((1 - avgDaily7 / avgDaily30) * 100);
      alerts.push({
        id: "anomaly-sales-drop",
        type: "anomaly",
        severity: "high",
        title: "Significant Sales Velocity Drop",
        message: `Your daily sales average over the past 7 days (₦${Math.round(avgDaily7).toLocaleString()}/day) is ${dropPercentage}% lower than your 30-day average (₦${Math.round(avgDaily30).toLocaleString()}/day).`,
        actionHint: "Check for unrecorded sales, staff cash handling, or market foot traffic changes.",
      });
    }

    const totalExpenses30 = expensesLast30Days.reduce(
      (acc, e) => acc + Number(e.amount),
      0
    );
    const expenses7Days = expensesLast30Days.filter(
      (e) => new Date(e.createdAt) >= recent7Days
    );
    const totalExpenses7 = expenses7Days.reduce(
      (acc, e) => acc + Number(e.amount),
      0
    );

    const avgDailyExp30 = totalExpenses30 / 30;
    const avgDailyExp7 = totalExpenses7 / 7;

    if (avgDailyExp30 > 500 && avgDailyExp7 > avgDailyExp30 * 1.8) {
      alerts.push({
        id: "anomaly-expense-spike",
        type: "anomaly",
        severity: "medium",
        title: "Expense Spike Detected",
        message: `Your average daily expenses over the past 7 days (₦${Math.round(avgDailyExp7).toLocaleString()}/day) spiked by ${Math.round((avgDailyExp7 / avgDailyExp30 - 1) * 100)}% compared to your 30-day baseline.`,
        actionHint: "Review recent supplier bills and transport costs to control overhead.",
      });
    }
  } catch (error) {
    console.error("Error generating AI alerts:", error);
  }

  return alerts;
}
