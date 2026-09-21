import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../prisma";
import { getAiAlerts } from "./predictor";

export interface BusinessSummary {
  businessName: string;
  ownerName: string;
  period: string;
  revenueThisWeek: number;
  revenueLastWeek: number;
  revenueChangePercent: number;
  expensesThisWeek: number;
  expensesLastWeek: number;
  netProfitThisWeek: number;
  topSellingItems: { name: string; qty: number; revenue: number }[];
  slowMovingItems: { name: string; currentStock: number }[];
  activeAlerts: string[];
}

export async function getBusinessSummaryContext(
  userId: string
): Promise<BusinessSummary> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, buisnessName: true },
  });

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(now.getDate() - 14);

  // Sales
  const salesThisWeek = await prisma.sale.findMany({
    where: { userId, createdAt: { gte: sevenDaysAgo } },
    include: { item: true },
  });

  const salesLastWeek = await prisma.sale.findMany({
    where: {
      userId,
      createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
    },
  });

  const revenueThisWeek = salesThisWeek.reduce(
    (sum, s) => sum + Number(s.totalAmount),
    0
  );
  const revenueLastWeek = salesLastWeek.reduce(
    (sum, s) => sum + Number(s.totalAmount),
    0
  );

  const revenueChangePercent =
    revenueLastWeek > 0
      ? Math.round(((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100)
      : 0;

  // Expenses
  const expensesThisWeekData = await prisma.expense.findMany({
    where: { userId, createdAt: { gte: sevenDaysAgo } },
  });

  const expensesLastWeekData = await prisma.expense.findMany({
    where: {
      userId,
      createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
    },
  });

  const expensesThisWeek = expensesThisWeekData.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );
  const expensesLastWeek = expensesLastWeekData.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const netProfitThisWeek = revenueThisWeek - expensesThisWeek;

  // Top Selling Items this week
  const itemSalesMap: Record<
    string,
    { name: string; qty: number; revenue: number }
  > = {};

  for (const sale of salesThisWeek) {
    const itemName =
      sale.item?.name || sale.customItemName || "General Product";
    if (!itemSalesMap[itemName]) {
      itemSalesMap[itemName] = { name: itemName, qty: 0, revenue: 0 };
    }
    itemSalesMap[itemName].qty += sale.quantity;
    itemSalesMap[itemName].revenue += Number(sale.totalAmount);
  }

  const sortedTopItems = Object.values(itemSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 3);

  // Items with low/zero sales in last 14 days
  const allItems = await prisma.item.findMany({
    where: { userId },
    select: { id: true, name: true, currentStock: true },
  });

  const activeItemIdsWithSales = new Set(
    salesThisWeek.map((s) => s.itemId).filter(Boolean)
  );

  const slowMovingItems = allItems
    .filter(
      (item) => !activeItemIdsWithSales.has(item.id) && item.currentStock > 0
    )
    .slice(0, 3)
    .map((item) => ({ name: item.name, currentStock: item.currentStock }));

  // AI Alerts
  const alerts = await getAiAlerts(userId);
  const activeAlertTitles = alerts.map((a) => `${a.title}: ${a.message}`);

  return {
    businessName: user?.buisnessName || "My Store",
    ownerName: user?.name || "Trader",
    period: "Last 7 Days",
    revenueThisWeek,
    revenueLastWeek,
    revenueChangePercent,
    expensesThisWeek,
    expensesLastWeek,
    netProfitThisWeek,
    topSellingItems: sortedTopItems,
    slowMovingItems,
    activeAlerts: activeAlertTitles,
  };
}

const SYSTEM_INSTRUCTION = `
You are 'Oga BizSense', an intelligent, warm, encouraging, and highly practical AI coach for micro and small enterprise (MSME) merchants in Nigeria.

Your Capabilities:
1. Store & Ledger Analytics: Answer questions about the merchant's LedgerLite sales, profit, inventory, and expense numbers provided in the context JSON.
2. Real-World Knowledge: Answer real-world questions (e.g. Nigerian politics/governors, business registration/CAC, general market advice, daily life facts, weather) in fluent Nigerian Pidgin English.

Rules for Oga BizSense:
1. Language & Tone: Speak in warm, fluent Nigerian Pidgin English. Use natural expressions like "Oga", "Market dey move", "Sharp sharp", "No worry", "Make we check".
2. Grounding: When answering store ledger questions, use the exact numbers from the Business Context JSON. When answering real-world questions, use your general world knowledge.
3. Conciseness: Keep responses concise (2 to 4 sentences maximum), direct, and easy to read on mobile screens.
4. Positivity: Always encourage the merchant at the end of your reply!
`;

// Offline Knowledge & Business Fallback Engine
function generateOfflinePidginAdvice(
  userQuestion: string,
  ctx: BusinessSummary
): string {
  const q = userQuestion.toLowerCase();

  // Real-world knowledge fallbacks when offline
  if (q.includes("governor") && q.includes("enugu")) {
    return `Oga ${ctx.ownerName}, the governor of Enugu State na Dr. Peter Mbah! Hope market for Enugu state dey move sharp sharp for your shop!`;
  }

  if (q.includes("governor") && q.includes("lagos")) {
    return `Oga ${ctx.ownerName}, the governor of Lagos State na Babajide Sanwo-Olu! Market for Center of Excellence dey booming!`;
  }

  if (q.includes("cac") || q.includes("register business")) {
    return `Oga ${ctx.ownerName}, to register your business with CAC, visit cac.gov.ng, reserve your business name, and upload your ID document sharp sharp!`;
  }

  if (q.includes("market") || q.includes("week") || q.includes("profit") || q.includes("sales") || q.includes("going")) {
    if (ctx.revenueThisWeek > 0) {
      return `Oga ${ctx.ownerName}! Market for ${ctx.businessName} make ₦${ctx.revenueThisWeek.toLocaleString()} this week! After expenses of ₦${ctx.expensesThisWeek.toLocaleString()}, your net profit na ₦${ctx.netProfitThisWeek.toLocaleString()}. ${ctx.topSellingItems[0] ? `Your top seller na ${ctx.topSellingItems[0].name}!` : "Keep pushing your fast-moving items!"}`;
    } else {
      return `Oga ${ctx.ownerName}, market slow small this week — no sales recorded yet. Check your top items and make sure your price dey competitive!`;
    }
  }

  if (q.includes("reorder") || q.includes("stock") || q.includes("product") || q.includes("buy")) {
    if (ctx.activeAlerts.length > 0) {
      return `Oga ${ctx.ownerName}, check your stock sharp sharp! ${ctx.activeAlerts[0]}. Reorder am fast before stock hit zero!`;
    } else if (ctx.topSellingItems.length > 0) {
      return `Oga, your fast-moving product na ${ctx.topSellingItems[0].name}! Make sure you keep stock inside shop so you no go miss sales!`;
    } else {
      return `Oga ${ctx.ownerName}, all your stock levels dey stable for now! Keep tracking your sales daily.`;
    }
  }

  return `Oga ${ctx.ownerName}! Business update for ${ctx.businessName}: You make ₦${ctx.revenueThisWeek.toLocaleString()} sales this week with ₦${ctx.netProfitThisWeek.toLocaleString()} net profit. Ask me any question about your shop or general business!`;
}

export async function askOgaBizSense(
  userQuestion: string,
  userId: string
): Promise<string> {
  const businessContext = await getBusinessSummaryContext(userId);

  // 1. Try Groq API (Ultra-Fast, 14,400 Free Requests/Day)
  const groqApiKey = process.env.GROQ_API_KEY;
  if (groqApiKey && groqApiKey.startsWith("gsk_")) {
    try {
      const groq = new Groq({ apiKey: groqApiKey });
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          {
            role: "user",
            content: `Business Context JSON:\n${JSON.stringify(businessContext, null, 2)}\n\nMerchant Question: "${userQuestion}"`,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.6,
        max_tokens: 250,
      });

      const reply = chatCompletion.choices[0]?.message?.content;
      if (reply) return reply;
    } catch (err: any) {
      console.warn("Groq API error, falling back:", err.message);
    }
  }

  // 2. Try Gemini API
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey && !geminiApiKey.startsWith("your-")) {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
      const prompt = `${SYSTEM_INSTRUCTION}\n\nBusiness Context JSON:\n${JSON.stringify(businessContext, null, 2)}\n\nMerchant Question: "${userQuestion}"`;

      const result = await model.generateContent(prompt);
      const reply = result.response.text();
      if (reply) return reply;
    } catch (err: any) {
      console.warn("Gemini API error, falling back:", err.message);
    }
  }

  // 3. Dual-Domain Offline Engine (Store Analytics + Real-World Knowledge)
  return generateOfflinePidginAdvice(userQuestion, businessContext);
}
