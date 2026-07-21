import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import { TrendingUp, TrendingDown, ShoppingBag, Banknote } from "lucide-react";
import prisma from "../lib/prisma";
import { getCurrentUserId } from "../lib/authhelper";
import { redirect } from "next/navigation";
import { getMetrics} from "../lib/metrics";

interface Profile {
  id: string
  name: string
  buisnessName: string

}

export default async function Dashboard() {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/signin")

  let profile: any;

  profile = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, buisnessName: true } })
  const { name, buisnessName } = profile

  if (!profile) {
    throw new Error("profile not found")
  }
  const metrics = await getMetrics()
  console.log(metrics)

  return (
    <div>
      {/* imported side navigation routes bar */}
      <div>
        <SideNav />
      </div>
      <div className="ml-0 md:ml-70 sm:ml-0">
        <UserNav name={name} buisnessName={buisnessName} />
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

              <h3 className="font-bold text-[#032523] text-[40px]">₦{metrics?.TotalMoneyIn}</h3>

              <p className="text-xs">yesterday:₦{metrics?.moneyInYesterday}</p>
            </div>

            {/* box 2 money out*/}

            <div className="p-5 border border-[#6DAFAC] rounded-lg ">
              <div className="p-2 w-10 bg-[#f9e6e8] text-[#d01527] rounded-lg ">
                <TrendingDown size={18} />
              </div>

              <p className="text-[14-x]">MONEY OUT</p>

              <h3 className="font-bold text-[#032523] text-[40px]">₦{metrics?.totalMoneyOut}</h3>

              <p className="text-xs">yesterday:₦{metrics?.moneyOutYesterday}</p>
            </div>

            {/* box 3 today's profit */}

            <div className="p-5 border border-[#6DAFAC] rounded-lg ">
              <div className="p-2 w-10 bg-[#f4f8f8] text-slate-500 rounded-lg">
                <Banknote size={18} />
              </div>

              <p className="text-[14-x]">TODAY'S PROFIT</p>

              <h3 className="font-bold text-[#032523] text-[40px]">₦{metrics?.profitToday} </h3>

              <p className="text-xs">yesterday:₦{metrics?.profitYesterday}</p>
            </div>

            {/* box 4 total sales today */}

            <div className="p-5 border border-[#6DAFAC] rounded-lg ">
              <div className="p-2 w-10 bg-[#f4f8f8] text-slate-500 rounded-lg">
                <ShoppingBag size={18} />
              </div>

              <p className="text-[14-x]">TOTAL SALES TODAY</p>

              <h3 className="font-bold text-[#032523] text-[40px]">{metrics?.totalsalescountToday} </h3>

              <p className="text-xs">yesterday:{metrics?.totalSalesCountyesterday}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
