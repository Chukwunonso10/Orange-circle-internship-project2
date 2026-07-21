import { SalesClient } from "@/components/sales";
import { getMetrics } from "../lib/metrics";
import { getCurrentUserId } from "../lib/authhelper";
import prisma from "../lib/prisma";
import { NextRequest } from "next/server";
import { Prisma } from "../generated/prisma/client";

export default async function Sales({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> | { [key: string]: string | undefined } }) {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error("authentication error")
  }
  
  const metrics = await getMetrics()
  if (!metrics) return null

  // Safely await searchParams if it is a Promise (Next.js 15+)
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const search = resolvedSearchParams?.search || "";

  let query: Prisma.SaleWhereInput = {}

  if (search) {
    query.OR = [
      {
        item: {
          name: {
            contains: search,
            mode: "insensitive"
          }
        }
      },
      {
        customItemName: {
          contains: search,
          mode: "insensitive"
        }
      }
    ]
  }

  const sales = await prisma.sale.findMany({
    where: { userId, ...query },
    include: {
      item: {
        select: {
          name: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const moneyInToday = Number(metrics.moneyinToday)
  const moneyInYesterday = Number(metrics.moneyInYesterday)

  return (
    <div>
      <SalesClient 
        moneyinToday={moneyInToday} 
        moneyInYesterday={moneyInYesterday} 
        sales={sales} 
      />
    </div>
  )
}