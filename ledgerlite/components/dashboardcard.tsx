"use client";

import { useState, useEffect } from "react";
import { Trash2, Eye, ReceiptText, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import SalesForm from "@/components/salesform";

interface DashboardItem {
  id: string;
  transaction: string;
  type: string;
  amount: number;
  timestamp: string;
}

interface DashboardCardProps {
  dashboard?: DashboardItem[];
  page?: number;
  totalPages?: number;
  totalEntries?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  isFetching?: boolean;
}

export default function DashboardCard({
  dashboard = [],
  page,
  totalPages,
  totalEntries,
  limit,
  onPageChange,
  isFetching = false,
}: DashboardCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTx, setSelectedTx] = useState<DashboardItem | null>(null);

  const showPagination =
    typeof page === "number" &&
    typeof totalPages === "number" &&
    typeof totalEntries === "number" &&
    typeof limit === "number" &&
    onPageChange;

  const startRange = showPagination ? (page - 1) * limit + 1 : 1;
  const endRange = showPagination
    ? Math.min(page * limit, totalEntries)
    : dashboard.length;

  const getPageNumbers = () => {
    if (!totalPages) return [];
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page! <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page! >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(page! - 1);
        pages.push(page!);
        pages.push(page! + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto relative">
        {/* Subtle fetching overlay indicator */}
        {isFetching && (
          <div className="absolute right-6 top-4 z-10 flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-semibold text-teal-700 border border-teal-100 shadow-sm animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping" />
            Updating...
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Transaction
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Date
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-slate-100 transition-opacity duration-200 ${isFetching ? "opacity-60" : "opacity-100"}`}
          >
            {dashboard.map((item) => {
              const isSale =
                item.type.toLowerCase() === "sale" ||
                item.type.toLowerCase() === "sales";

              return (
                <tr key={item.id} className="transition hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <p className="text-[10px] md:text-sm font-medium text-slate-900">
                      {item.transaction}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-[10px] md:text-xs font-semibold ${isSale
                          ? "bg-[#e4f5ed] text-[#02ad5e]"
                          : "bg-[#f9e6e8] text-[#d01527]"
                        }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`text-[10px] md:text-sm font-bold ${isSale ? "text-[#02ad5e]" : "text-[#d01527]"
                        }`}
                    >
                      {isSale ? "+" : "-"}₦{item.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className=" text-[10px] md:text-xs text-slate-500">{item.timestamp}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTx(item)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-brand-primary/5 hover:text-brand-primary cursor-pointer"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {dashboard.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-10">
          <ReceiptText className="text-slate-400 h-8 w-8" />
          <h4 className="text-sm text-slate-900 font-semibold">
            No recent activities.
          </h4>
          <h4 className="text-center text-xs text-slate-500">
            Your sales and expense will appear here once you start recording transactions
          </h4>

          <div className="mt-2">
            <SalesForm />
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="border-t border-slate-100 bg-slate-50/75 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        {showPagination ? (
          <>
            {/* Left: showing 1 to 3 of 54 entries */}
            <p className="font-medium text-slate-500">
              {totalEntries === 0
                ? "showing 0 to 0 of 0 entries"
                : `showing ${startRange} to ${endRange} of ${totalEntries} entries`}
            </p>

            {/* Right: < 1 2 3 > pagination buttons */}
            <nav className="flex items-center gap-1.5" aria-label="Pagination">
              <button
                onClick={() => onPageChange(page! - 1)}
                disabled={page === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {getPageNumbers().map((num, idx) => {
                if (num === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="inline-flex h-8 w-8 items-center justify-center text-slate-400"
                    >
                      ...
                    </span>
                  );
                }

                const isActive = num === page;
                return (
                  <button
                    key={`page-${num}`}
                    onClick={() => onPageChange(num as number)}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-semibold transition-colors cursor-pointer ${isActive
                        ? "bg-teal-600 text-white shadow-sm shadow-teal-600/10"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {num}
                  </button>
                );
              })}

              <button
                onClick={() => onPageChange(page! + 1)}
                disabled={page === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </>
        ) : (
          <>
            <p className="text-slate-500">Showing last 5 transactions</p>
            <div className="flex gap-4">
              <Link
                href="/sales"
                className="text-[#0B7A75] font-semibold hover:underline cursor-pointer"
              >
                View All Sales
              </Link>
              <span className="text-slate-300">|</span>
              <Link
                href="/expense"
                className="text-[#0B7A75] font-semibold hover:underline cursor-pointer"
              >
                View All Expenses
              </Link>
            </div>
          </>
        )}
      </div>

      {selectedTx && (
        <TransactionActionModal
          txId={selectedTx.id}
          txType={selectedTx.type}
          onClose={() => setSelectedTx(null)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}

/* ---------------- Transaction Action Modal Component ---------------- */

interface TransactionActionModalProps {
  txId: string;
  txType: string;
  onClose: () => void;
  onSuccess: () => void;
}

function TransactionActionModal({
  txId,
  txType,
  onClose,
  onSuccess,
}: TransactionActionModalProps) {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [detail, setDetail] = useState<any>(null);

  // Form states for sales
  const [editPrice, setEditPrice] = useState("");
  const [editQty, setEditQty] = useState("");
  const [editCustomName, setEditCustomName] = useState("");
  const [editItemId, setEditItemId] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  // Form states for expenses
  const [editAmount, setEditAmount] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("Other");

  const isSale = txType.toLowerCase() === "sale" || txType.toLowerCase() === "sales";

  // Fetch transaction details
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const endpoint = isSale ? `/api/routes/sales/${txId}` : `/api/routes/expenses/${txId}`;
        const res = await fetch(endpoint);
        const data = await res.json();

        if (res.ok && data.success) {
          const item = isSale ? data.sale : data.expense;
          setDetail(item);

          if (isSale) {
            setEditPrice(String(item.unitPrice));
            setEditQty(String(item.quantity));
            setEditCustomName(item.customItemName || "");
            setEditItemId(item.itemId || "");
          } else {
            setEditAmount(String(item.amount));
            setEditDesc(item.description || "");
            setEditCategory(item.category || "Other");
          }
        } else {
          toast.error("Failed to load details");
          onClose();
        }
      } catch (err) {
        console.error(err);
        toast.error("Network error");
        onClose();
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [txId, isSale, onClose]);

  // Fetch items list for Sales editing select menu
  useEffect(() => {
    if (isSale && mode === "edit") {
      fetch("/api/routes/item")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProducts(data.allProducts || []);
          }
        })
        .catch(console.error);
    }
  }, [isSale, mode]);

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const endpoint = isSale ? `/api/routes/sales/${txId}` : `/api/routes/expenses/${txId}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Deleted successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const endpoint = isSale ? `/api/routes/sales/${txId}` : `/api/routes/expenses/${txId}`;
      const body = isSale
        ? {
            unitPrice: Number(editPrice),
            quantity: Number(editQty),
            customItemName: editItemId ? null : editCustomName,
            itemId: editItemId || null,
          }
        : {
            amount: Number(editAmount),
            description: editDesc,
            category: editCategory,
          };

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Updated successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => !submitting && onClose()} />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {mode === "view" && "Transaction Details"}
              {mode === "edit" && "Edit Transaction"}
              {mode === "delete" && "Delete Transaction"}
            </h3>
            <p className="text-xs text-slate-500">
              Type: {isSale ? "Sale (Money In)" : "Expense (Money Out)"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 min-h-[160px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
              <p className="mt-2 text-xs text-slate-500">Fetching transaction details...</p>
            </div>
          ) : mode === "view" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Name / Description</span>
                  <p className="text-sm font-semibold text-slate-800">
                    {isSale 
                      ? (detail?.item?.name || detail?.customItemName || "Untracked Sale")
                      : (detail?.description || detail?.category || "General Expense")}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Amount</span>
                  <p className={`text-sm font-bold ${isSale ? "text-emerald-600" : "text-rose-600"}`}>
                    ₦{isSale ? Number(detail?.totalAmount).toLocaleString() : Number(detail?.amount).toLocaleString()}
                  </p>
                </div>
                {isSale && (
                  <>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Quantity Sold</span>
                      <p className="text-sm font-semibold text-slate-800">{detail?.quantity} units</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Unit Price</span>
                      <p className="text-sm font-semibold text-slate-800">₦{Number(detail?.unitPrice).toLocaleString()}</p>
                    </div>
                  </>
                )}
                {!isSale && (
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Category</span>
                    <p className="text-sm font-semibold text-slate-800">{detail?.category}</p>
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Date Logged</span>
                  <p className="text-sm text-slate-600">
                    {detail?.createdAt ? new Date(detail.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : ""}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Edit details
                </button>
                <button
                  type="button"
                  onClick={() => setMode("delete")}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-55 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : mode === "delete" ? (
            <div className="space-y-4 text-center py-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Are you absolutely sure?</p>
                <p className="text-xs text-slate-500 mt-1">
                  This will permanently delete this {isSale ? "sale record" : "expense log"} from your cashflow history.
                  {isSale && " Stock counts for tracked products will be restored."}
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode("view")}
                  disabled={submitting}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : "Yes, Delete"}
                </button>
              </div>
            </div>
          ) : (
            // Edit Mode Form
            <form onSubmit={handleUpdate} className="space-y-4 text-left">
              {isSale ? (
                <>
                  {products.length > 0 && (
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">Product Source</label>
                      <select
                        value={editItemId ? "tracked" : "custom"}
                        onChange={(e) => {
                          if (e.target.value === "custom") setEditItemId("");
                          else if (products.length > 0) setEditItemId(products[0].id);
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="tracked">Tracked Inventory Product</option>
                        <option value="custom">Custom Untracked Descriptor</option>
                      </select>
                    </div>
                  )}

                  {editItemId ? (
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">Inventory Item</label>
                      <select
                        value={editItemId}
                        onChange={(e) => setEditItemId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Stock: {p.currentStock})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">Custom Item Name</label>
                      <input
                        type="text"
                        value={editCustomName}
                        onChange={(e) => setEditCustomName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        required
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">Quantity</label>
                      <input
                        type="number"
                        value={editQty}
                        onChange={(e) => setEditQty(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">Unit Price (₦)</label>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">New Total:</span>
                    <span className="font-bold text-teal-600">₦{(Number(editPrice || 0) * Number(editQty || 0)).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Expense Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                    >
                      <option value="Rent">Rent</option>
                      <option value="Inventory / Stock">Inventory / Stock</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Logistics / Transport">Logistics / Transport</option>
                      <option value="Repairs">Repairs</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Description</label>
                    <input
                      type="text"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Amount (₦)</label>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setMode("view")}
                  disabled={submitting}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}