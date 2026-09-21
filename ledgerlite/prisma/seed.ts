import "dotenv/config";
import prisma from "../app/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting BizSense AI Seed Process...");

  // 1. Create or Find Demo User
  const hashedPassword = await bcrypt.hash("Password123!", 10);
  const user = await prisma.user.upsert({
    where: { email: "trader@ledgerlite.com" },
    update: {
      buisnessName: "Ogbete Provision Store",
      name: "Oga Jude",
    },
    create: {
      email: "trader@ledgerlite.com",
      name: "Oga Jude",
      buisnessName: "Ogbete Provision Store",
      passwordHash: hashedPassword,
      isVerified: true,
      hasInventory: true,
    },
  });

  console.log(`👤 Demo User set: ${user.name} (${user.buisnessName})`);

  // Clean existing data for this user to ensure reproducible AI alerts
  await prisma.sale.deleteMany({ where: { userId: user.id } });
  await prisma.expense.deleteMany({ where: { userId: user.id } });
  await prisma.item.deleteMany({ where: { userId: user.id } });

  // 2. Create Items with distinct stock profiles to test all AI alert types
  const indomie = await prisma.item.create({
    data: {
      name: "Indomie Onion (Pack)",
      costPrice: 220,
      sellingPrice: 280,
      currentStock: 14, // Will trigger CRITICAL STOCKOUT (<3 days left at 5 sales/day)
      lowStock: 30,
      userId: user.id,
    },
  });

  const sugar = await prisma.item.create({
    data: {
      name: "Golden Penny Sugar 1kg",
      costPrice: 850,
      sellingPrice: 1100,
      currentStock: 8, // Will trigger LOW STOCK THRESHOLD
      lowStock: 15,
      userId: user.id,
    },
  });

  const peakMilk = await prisma.item.create({
    data: {
      name: "Peak Evaporated Milk (Tin)",
      costPrice: 480,
      sellingPrice: 580,
      currentStock: 75, // Will trigger DEADSTOCK ALERT (0 sales in last 14 days)
      lowStock: 15,
      userId: user.id,
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // Created 40 days ago
    },
  });

  const coke = await prisma.item.create({
    data: {
      name: "Coca-Cola 50cl (Crate)",
      costPrice: 2400,
      sellingPrice: 3000,
      currentStock: 40,
      lowStock: 10,
      userId: user.id,
    },
  });

  const oil = await prisma.item.create({
    data: {
      name: "Kings Vegetable Oil 1L",
      costPrice: 1900,
      sellingPrice: 2400,
      currentStock: 25,
      lowStock: 8,
      userId: user.id,
    },
  });

  console.log("📦 Created 5 Products with distinct stock levels.");

  // 3. Generate 30 days of Historical Sales & Expenses
  const now = new Date();
  const salesToInsert = [];
  const expensesToInsert = [];

  for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
    const logDate = new Date(now);
    logDate.setDate(now.getDate() - dayOffset);

    // Indomie sells heavily every day (4-7 packs per day)
    const indomieQty = Math.floor(Math.random() * 4) + 4;
    salesToInsert.push({
      userId: user.id,
      itemId: indomie.id,
      quantity: indomieQty,
      unitPrice: indomie.sellingPrice,
      totalAmount: Number(indomie.sellingPrice) * indomieQty,
      createdAt: logDate,
    });

    // Sugar sells moderately (1-3 packs per day)
    const sugarQty = Math.floor(Math.random() * 3) + 1;
    salesToInsert.push({
      userId: user.id,
      itemId: sugar.id,
      quantity: sugarQty,
      unitPrice: sugar.sellingPrice,
      totalAmount: Number(sugar.sellingPrice) * sugarQty,
      createdAt: logDate,
    });

    // Coke sold heavily in days 30-8, but dropped off in days 7-0 (simulating anomaly/drop)
    if (dayOffset > 7) {
      const cokeQty = Math.floor(Math.random() * 3) + 2;
      salesToInsert.push({
        userId: user.id,
        itemId: coke.id,
        quantity: cokeQty,
        unitPrice: coke.sellingPrice,
        totalAmount: Number(coke.sellingPrice) * cokeQty,
        createdAt: logDate,
      });
    }

    // Kings Oil sells occasionally
    if (dayOffset % 3 === 0) {
      salesToInsert.push({
        userId: user.id,
        itemId: oil.id,
        quantity: 2,
        unitPrice: oil.sellingPrice,
        totalAmount: Number(oil.sellingPrice) * 2,
        createdAt: logDate,
      });
    }

    // Peak Milk: Only sold in days 30-15, zero sales in last 14 days!
    if (dayOffset >= 16 && dayOffset % 4 === 0) {
      salesToInsert.push({
        userId: user.id,
        itemId: peakMilk.id,
        quantity: 1,
        unitPrice: peakMilk.sellingPrice,
        totalAmount: Number(peakMilk.sellingPrice) * 1,
        createdAt: logDate,
      });
    }

    // Add Expenses
    if (dayOffset % 7 === 0) {
      expensesToInsert.push({
        userId: user.id,
        category: "Transport",
        amount: 8500,
        description: "Market goods transport from main depot",
        createdAt: logDate,
      });
    }

    if (dayOffset === 3) {
      // Recent expense spike for anomaly detection
      expensesToInsert.push({
        userId: user.id,
        category: "Utilities & Security",
        amount: 25000,
        description: "Market stall levies and power generator maintenance",
        createdAt: logDate,
      });
    }
  }

  await prisma.sale.createMany({ data: salesToInsert });
  await prisma.expense.createMany({ data: expensesToInsert });

  console.log(
    `✅ Successfully seeded ${salesToInsert.length} sales and ${expensesToInsert.length} expenses!`
  );
  console.log("🚀 BizSense AI Seed Completed Successfully!");
  process.exit(0);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  });
