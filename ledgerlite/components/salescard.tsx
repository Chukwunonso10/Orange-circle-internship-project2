"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, X, Loader2 } from "lucide-react";

interface SalesItem {
  id: string;
  itemName?: string;
  item?: { name: string } | null;
  customItemName?: string | null;
  quantity: number;
  amount?: number;
  totalAmount?: any;
  createdAt: string | Date;
}

interface SalesCardProps {
  sales?: SalesItem[];
}

export default function SalesCard({ sales = [] }: SalesCardProps) {
  const router = useRouter();
  
  // Details Modal State
  const [selectedSale, setSelectedSale] = useState<SalesItem | null>(null);
  
  // Deleting State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sample data if none provided
  const sampleSales: SalesItem[] = [
    {
      id: "1",
      itemName: "Laptop",
      quantity: 2,
      amount: 2400,
      createdAt: "2025-01-15 10:30 AM",
    },
    {
      id: "2",
      itemName: "Mouse",
      quantity: 5,
      amount: 125,
      createdAt: "2025-01-15 11:15 AM",
    },
    {
      id: "3",
      itemName: "Keyboard",
      quantity: 3,
      amount: 225,
      createdAt: "2025-01-15 02:45 PM",
    },
  ];

  const displaySales = sales.length > 0 ? sales : sampleSales;

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this sale? This will restore inventory stock counts for tracked items.")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/routes/sales/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        router.refresh();
      } else {
        alert(result.message || "Failed to delete sale.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Network error: Could not delete sale.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Item Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Time
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displaySales.map((item) => {
              const name = item.itemName || item.item?.name || item.customItemName || "Untracked Item";
              const amountValue = item.amount !== undefined ? item.amount : (item.totalAmount !== undefined ? Number(item.totalAmount) : 0);
              
              // Safely format Date
              let formattedDate = String(item.createdAt);
              if (item.createdAt && !isNaN(Date.parse(String(item.createdAt)))) {
                formattedDate = new Date(item.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short"
                });
              }

              const isDeleting = deletingId === item.id;

              return (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center rounded-lg bg-[#0b7a75]/10 px-3 py-1 text-sm font-semibold text-[#0b7a75]">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      ₦{amountValue.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-0 py-4">
                    <p className="text-xs text-slate-500">{formattedDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSale(item)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-[#0b7a75]/5 hover:text-[#0b7a75] disabled:opacity-50 cursor-pointer"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50 cursor-pointer"
                        title="Delete"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {displaySales.length === 0 && (
        <div className="flex items-center justify-center px-6 py-12">
          <p className="text-sm text-slate-500">No sales records found.</p>
        </div>
      )}

      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
        <p className="text-xs text-slate-600">
          Total records:{" "}
          <span className="font-semibold text-slate-900">
            {displaySales.length}
          </span>
        </p>
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (() => {
        const name = selectedSale.itemName || selectedSale.item?.name || selectedSale.customItemName || "Untracked Item";
        const total = selectedSale.amount !== undefined ? selectedSale.amount : (selectedSale.totalAmount !== undefined ? Number(selectedSale.totalAmount) : 0);
        const qty = selectedSale.quantity;
        const unit = qty > 0 ? (total / qty) : 0;
        
        let formattedDate = String(selectedSale.createdAt);
        if (selectedSale.createdAt && !isNaN(Date.parse(String(selectedSale.createdAt)))) {
          formattedDate = new Date(selectedSale.createdAt).toLocaleString(undefined, {
            dateStyle: "long",
            timeStyle: "medium"
          });
        }

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
              aria-hidden="true"
              onClick={() => setSelectedSale(null)}
            />

            <div
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 dark:bg-slate-900 dark:ring-white/10"
              style={{
                animation: "modal-slide-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-zinc-800">
                <div>
                  <h2 className="text-xl font-semibold">Sale Transaction Details</h2>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    ID: {selectedSale.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSale(null)}
                  className="rounded-full p-2 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900 hover:rotate-90 dark:hover:bg-zinc-800 dark:hover:text-slate-100 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-6 space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-sm text-slate-500">Item Name</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-sm text-slate-500">Quantity Sold</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{qty}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-sm text-slate-500">Unit Price</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">₦{unit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-sm text-slate-500 font-medium">Total Amount</span>
                  <span className="text-base font-bold text-[#0b7a75]">₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-slate-500">Time Logged</span>
                  <span className="text-xs text-slate-700 dark:text-slate-300">{formattedDate}</span>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-zinc-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedSale(null)}
                    className="rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 px-5 py-3 text-sm font-semibold transition active:scale-95 cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
