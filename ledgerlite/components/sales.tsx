"use client";

import SideNav from "@/components/sideNav";
import SalesForm from "@/components/salesform";
import { ReceiptText } from "lucide-react";
import SearchForm from "./searchform";



export function SalesClient({ moneyinToday, moneyInYesterday, sales }: { moneyinToday: number, moneyInYesterday: number, sales: any[] }) {


  return (
    <div>
      <div>
        <div>
          <SideNav />
        </div>
        <div className="ml-0 md:ml-70 sm:ml-0">
          {/* <UserNav /> */}
        </div>
        <main className="ml-10 md:ml-72 sm:ml-10 p-6">
          <div className="border border-gray-300 my-5 rounded-4xl p-5 shadow-sm">
            <div >
              <h2 className="text-[#032523] text-2xl font-bold">Sales</h2>

              <p className="py-2 text-sm text-gray-700">
                Manage your Sales and sales to your dashboard and view it
                anytime
              </p>
            </div>

            <div className="md:flex justify-between items-center gap-10 animate-in fade-in slide-in-from-top duration-500">
              <div className="relative w-full max-w-lg transition-all duration-300">
                <SearchForm />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <SalesForm />
              </div>
            </div>
          </div>

          <div className="">
            <div className="grid  gap-10 px-4 md:grid-cols-2 lg:grid-cols-4">
              <div
                className="max-w-sm rounded-3xl border border-[#6DAFAC] bg-[#f4faf9] p-6 shadow-sm transition-all  hover:shadow-md hover:border-[#0b7a75] animate-in fade-in slide-in-from-left duration-500"
                style={{ animationFillMode: "both", animationDelay: "100ms" }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b7a75]/10 text-[#0b7a75] transition-transform duration-300 hover:scale-110">
                  <ReceiptText size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500 ">
                  Total sales today
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900  transition-colors duration-300">
                  {moneyinToday}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Yesterday: {moneyInYesterday}
                </p>
              </div>

              <div
                className="max-w-sm rounded-3xl border border-[#6DAFAC] bg-[#f4faf9] p-6 shadow-sm transition-all  hover:shadow-md hover:border-[#0b7a75] animate-in fade-in slide-in-from-left duration-500"
                style={{ animationFillMode: "both", animationDelay: "100ms" }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b7a75]/10 text-[#0b7a75] transition-transform duration-300 hover:scale-110">
                  <ReceiptText size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500 ">
                  Total sales today
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900  transition-colors duration-300">
                  0
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Yesterday: 0
                </p>
              </div>

              <div
                className="max-w-sm rounded-3xl border border-[#6DAFAC] bg-[#f4faf9] p-6 shadow-sm transition-all  hover:shadow-md hover:border-[#0b7a75] animate-in fade-in slide-in-from-left duration-500"
                style={{ animationFillMode: "both", animationDelay: "100ms" }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b7a75]/10 text-[#0b7a75] transition-transform duration-300 hover:scale-110">
                  <ReceiptText size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500 ">
                  Total sales today
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900  transition-colors duration-300">
                  0
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Yesterday: 0
                </p>
              </div>

              <div
                className="max-w-sm rounded-3xl border border-[#6DAFAC] bg-[#f4faf9] p-6 shadow-sm transition-all  hover:shadow-md hover:border-[#0b7a75] animate-in fade-in slide-in-from-left duration-500"
                style={{ animationFillMode: "both", animationDelay: "100ms" }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b7a75]/10 text-[#0b7a75] transition-transform duration-300 hover:scale-110">
                  <ReceiptText size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500 ">
                  Total sales today
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900  transition-colors duration-300">
                  0
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Yesterday: 0
                </p>
              </div>
            </div>
            <aside
              className="rounded-4xl my-10 border border-[#6DAFAC] bg-white/95 p-6 shadow-lg transition-all  hover:shadow-xl hover:border-[#0b7a75] animate-in fade-in slide-in-from-bottom duration-500"
              style={{ animationFillMode: "both", animationDelay: "200ms" }}
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Sales history
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Your sales appear here once they are saved.
              </p>
              {sales.length === 0 ? (
                <div className="flex flex-col items-center mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0b7a75]/10 text-[#0b7a75]">
                    <ReceiptText size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900 ">
                    No sales records yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    When you save a sale, it will appear in this section for quick
                    review.
                  </p>
                  <div>
                    <SalesForm />
                  </div>
                </div>
              ) : (
                <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white">
                  <table className="w-full border-collapse text-left text-sm text-slate-600">
                    <thead className="bg-[#f4faf9] text-xs uppercase tracking-wider text-slate-700 border-b border-[#6DAFAC]/30">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-[#032523]">Item</th>
                        <th className="px-6 py-4 font-semibold text-[#032523]">Quantity</th>
                        <th className="px-6 py-4 font-semibold text-[#032523]">Unit Price</th>
                        <th className="px-6 py-4 font-semibold text-[#032523]">Total Amount</th>
                        <th className="px-6 py-4 font-semibold text-[#032523]">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {sale.item?.name || sale.customItemName || "Untracked Item"}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-700">{sale.quantity}</td>
                          <td className="px-6 py-4 text-slate-600">₦{Number(sale.unitPrice).toLocaleString()}</td>
                          <td className="px-6 py-4 font-bold text-[#0b7a75]">
                            ₦{Number(sale.totalAmount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {new Date(sale.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
