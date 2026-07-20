import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import { TrendingUp, TrendingDown, ShoppingBag, Banknote } from "lucide-react";
import { NextResponse } from "next/server";
import prisma from "../lib/prisma";
import { getCurrentUserId } from "../lib/authhelper";
import { redirect } from "next/navigation";
import { Metrics } from "../lib/metrics";

interface Profile {
  id: string
  name: string
  buisnessName: string

}
export default async function Dashboard() {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/signin")
  let profile: any;

  profile = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, buisnessName: true } })
  const { id, name, buisnessName } = profile

  if (!profile) {
    throw new Error("profile not found")
  }
  const [revenue, expenses] = await Promise.all([

    prisma.sale.aggregate
      ({
        where: { userId: userId },
        _sum: { totalAmount: true }
      }),

    prisma.expense.aggregate({
      where: {userId},
      _sum: {amount: true}
    })
  ])

  const totalRevenue = Number(revenue._sum.totalAmount) ?? 0.00;
  const totalExpenses = Number(expenses._sum.amount) ?? 0.00;
  console.log(totalRevenue)
  console.log(totalExpenses)
  Metrics()
  return (
    <div>
      {/* imported side navigation routes bar */}
      <div>
        <SideNav />
      </div>
      <div className="ml-0 md:ml-70 sm:ml-0">
        <UserNav id={id} name={name} buisnessName={buisnessName} />
      </div>
      <main className="ml-10 md:ml-72 sm:ml-10  p-6">
        {/* heading */}
        <section>
          <div className="space-y-6">
            <div>
              {/*title heading */}
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Dashboard Page
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                This is the dashboard page. You can manage your dashboard here.
              </p>
            </div>
          </div>
        </section>

        {/* dashboard boxes(insight card) money in, money out, total profit, total sale  */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-5">
            {/* box1 money in */}
            <div className="p-5 border border-[#6DAFAC] rounded-lg ">
              <div className="p-2 w-10 bg-[#e4f5ed] text-[#02ad5e] rounded-lg">
                <TrendingUp size={18} />
              </div>

              <p className="text-[14-x]">MONEY IN</p>

              <h3 className="font-bold text-[#032523] text-[40px]">₦{totalRevenue}</h3>

              <p className="text-xs">yesterday:₦0000</p>
            </div>

            {/* box 2 money out*/}

            <div className="p-5 border border-[#6DAFAC] rounded-lg ">
              <div className="p-2 w-10 bg-[#f9e6e8] text-[#d01527] rounded-lg ">
                <TrendingDown size={18} />
              </div>

              <p className="text-[14-x]">MONEY OUT</p>

              <h3 className="font-bold text-[#032523] text-[40px]">₦{totalExpenses} </h3>

              <p className="text-xs">yesterday:₦0000</p>
            </div>

            {/* box 3 today's profit */}

            <div className="p-5 border border-[#6DAFAC] rounded-lg ">
              <div className="p-2 w-10 bg-[#f4f8f8] text-slate-500 rounded-lg">
                <Banknote size={18} />
              </div>

              <p className="text-[14-x]">TODAY'S PROFIT</p>

              <h3 className="font-bold text-[#032523] text-[40px]">₦0000 </h3>

              <p className="text-xs">yesterday:₦0000</p>
            </div>

            {/* box 4 total sales today */}

            <div className="p-5 border border-[#6DAFAC] rounded-lg ">
              <div className="p-2 w-10 bg-[#f4f8f8] text-slate-500 rounded-lg">
                <ShoppingBag size={18} />
              </div>

              <p className="text-[14-x]">TOTAL SALES TODAY</p>

              <h3 className="font-bold text-[#032523] text-[40px]">0000 </h3>

              <p className="text-xs">yesterday:0000</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
