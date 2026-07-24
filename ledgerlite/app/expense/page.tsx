"use client";
import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import ExpenseForm from "@/components/expenseform";
import EspenseCard from "@/components/espensecard";

import { ShoppingBag, TrendingDown, Search } from "lucide-react";
import { useState } from "react";

export default function Expense() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <div>
        <div>
          <SideNav />
        </div>
        <div className="ml-0 md:ml-70 sm:ml-0">
          <UserNav />
        </div>
        <main className="ml-0 md:ml-72 sm:ml-10  p-6">
          <div className="border border-gray-300 my-5 shadow-sm p-6 rounded-4xl">
            <div>
              <h2 className="text-[#032523] text-2xl font-bold">Expense</h2>

              <p className="py-2 text-sm text-gray-700">
                Manage your Expense in your dashboard and view it
                anytime
              </p>
            </div>

            <div className="md:flex justify-between items-center gap-10">
              <div className="relative w-full max-w-lg ">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search item"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-12 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0b7a75] focus:ring-2 focus:ring-[#6DAFAC]/6 "
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ExpenseForm />
              </div>
            </div>
          </div>
          <div className="">
            <div className="">
              <div className="max-w-sm rounded-3xl border border-[#6DAFAC]  p-6 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                  <TrendingDown className="text-red-700" size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  MONEY OUT
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-slate-100">
                  ₦0
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Yesterday: 0
                </p>
              </div>

              {/* <div className="max-w-sm rounded-3xl border border-[#6DAFAC] bg-[#f4faf9] p-6 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b7a75]/10 text-[#0b7a75]">
                  <ShoppingBag size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Total expense today
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-slate-100">
                  0
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Yesterday: 0
                </p>
              </div>

              <div className="hidden md:block max-w-sm rounded-3xl border border-[#6DAFAC] bg-[#f4faf9] p-6 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b7a75]/10 text-[#0b7a75]">
                  <ShoppingBag size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Total expense today
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-slate-100">
                  0
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Yesterday: 0
                </p>
              </div>

              <div className="hidden md:block max-w-sm rounded-3xl border border-[#6DAFAC] bg-[#f4faf9] p-6 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b7a75]/10 text-[#0b7a75]">
                  <ShoppingBag size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Total expense today
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-slate-100">
                  0
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Yesterday: 0
                </p>
              </div> */}
            </div>

            <aside className=" rounded-4xl my-10 border border-[#6DAFAC] bg-white/95 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Expense history
              </h2>
              <p className="py-3 text-sm text-slate-600 dark:text-slate-400">
                Your Expense will appear here once they are saved.
              </p>
              <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0b7a75]/10 text-[#0b7a75]">
                  <ShoppingBag size={22} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Espense records will appear below
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  When you save an expense, it will appear in this section for
                  quick review.
                </p>
                <div>
                  <ExpenseForm />
                </div>
              </div>
              <div className="py-5">
                <EspenseCard />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
