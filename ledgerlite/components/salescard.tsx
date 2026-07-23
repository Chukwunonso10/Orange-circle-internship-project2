"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, X, Loader2 } from "lucide-react";
import Pagination from "./pagination";

interface SalesItem {
  id: string;
  itemName?: string;
  item?: { name: string } | null;
  customItemName?: string | null;
  quantity: number;
  amount?: number;
  totalAmount?: any;
  createdAt?: string | Date;
  timestamp?: string;
}

interface SalesCardProps {
  sales?: any[];
  currentPage?: number;
  totalPages?: number;
  totalSales?: number;
  pageSize: number
}

export default function SalesCard({
  sales = [],
  currentPage = 1,
  totalPages = 1,
  totalSales = 0,
  pageSize,
}: SalesCardProps) {
  const router = useRouter();
  
  // Details Modal State
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  
  // Deleting Loading State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const displaySales = sales;

  // Handle Delete Action
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
              
              let formattedDate = "";
              if (item.createdAt && !isNaN(Date.parse(String(item.createdAt)))) {
                formattedDate = new Date(item.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                });
              } else if (item.timestamp) {
                formattedDate = item.timestamp;
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

      {/* Footer Page Indicators */}
      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
        <p className="text-xs text-slate-600">
          Showing <span className="font-semibold text-slate-900">{displaySales.length}</span> of{" "}
          <span className="font-semibold text-slate-900">{totalSales}</span> records
        </p>
        <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} />
      </div>

      {/* Dynamic View Transaction Details Modal */}
      {selectedSale && (() => {
        const name = selectedSale.itemName || selectedSale.item?.name || selectedSale.customItemName || "Untracked Item";
        const total = selectedSale.amount !== undefined ? selectedSale.amount : (selectedSale.totalAmount !== undefined ? Number(selectedSale.totalAmount) : 0);
        const qty = selectedSale.quantity;
        const unit = qty > 0 ? (total / qty) : 0;
        
        let formattedDate = "";
        if (selectedSale.createdAt && !isNaN(Date.parse(String(selectedSale.createdAt)))) {
          formattedDate = new Date(selectedSale.createdAt).toLocaleString(undefined, {
            dateStyle: "long",
            timeStyle: "medium",
          });
        } else if (selectedSale.timestamp) {
          formattedDate = selectedSale.timestamp;
        }

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
              aria-hidden="true"
              onClick={() => setSelectedSale(null)}
            />

            <div
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10"
              style={{
                animation: "modal-slide-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Sale Transaction Details</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    ID: {selectedSale.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSale(null)}
                  className="rounded-full p-2 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900 hover:rotate-90 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-6 space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Item Name</span>
                  <span className="text-sm font-semibold text-slate-900">{name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Quantity Sold</span>
                  <span className="text-sm font-semibold text-slate-900">{qty}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Unit Price</span>
                  <span className="text-sm font-semibold text-slate-900">
                    ₦{unit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500 font-medium">Total Amount</span>
                  <span className="text-base font-bold text-[#0b7a75]">₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-slate-500">Time Logged</span>
                  <span className="text-xs text-slate-700">{formattedDate}</span>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedSale(null)}
                    className="rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 px-5 py-3 text-sm font-semibold transition active:scale-95 cursor-pointer"
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
