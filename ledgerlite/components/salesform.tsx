"use client"
import { useState } from "react";
import { X, Plus} from "lucide-react";

export default function SalesForm() {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);
  // const [updateError, setUpdateError] = useState<string | null>(null);
  // const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  function resetForm() {
    setItem("");
    setQuantity(1);
    setAmount(0);
  }

  function handleSave(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const sale = { item, quantity, amount };
    console.log("Save sales", sale);
    // setUpdateSuccess("items added successsfully");
    setOpen(false);
    resetForm();
  }

  return (
    <div className="px-4 py-6">
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b7a75] px-3 py-3 md:px-5 md:py-3 text-sm font-semibold text-white shadow-lg shadow-[#0b7a75]/20 transition duration-200 hover:bg-[#09615e] hover:shadow-xl hover:shadow-[#0b7a75]/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0b7a75]/50 cursor-pointer"
        >
          <Plus
            size={18}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          <span>Add</span>
          Sales
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-in fade-in duration-150">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          <div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 dark:bg-slate-900 dark:ring-white/10"
            style={{
              animation:
                "modal-slide-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <div className="transform rounded-3xl transition duration-300 ease-out scale-100 opacity-100">
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-zinc-800">
                <div>
                  <h2 className="text-xl font-semibold">Add Sales</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Fill item, quantity, and amount to save a sale.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900 hover:rotate-90 dark:hover:bg-zinc-800 dark:hover:text-slate-100 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              {/* sales form */}
              <form onSubmit={handleSave} className="space-y-5 px-6 py-6">
                {/* {updateError && (
                  <div className="bg-red-100 text-red-700 p-2 rounded-md mb-3 text-sm">
                    {updateError}
                  </div>
                )} */}
                {/* { {updateSuccess && (
                  <div className="bg-green-100 text-green-700 p-2 rounded-md mb-3 text-sm">
                    {updateSuccess}
                  </div>
                )} */}
                <div
                  className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 fill-mode-both"
                  style={{ animationDelay: "50ms" }}
                >
                  <label
                    htmlFor="item"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Item
                  </label>
                  <input
                    id="item"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="Enter item name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-[#0b7a75] focus:outline-none focus:ring-2 focus:ring-[#0b7a75]/20 focus:shadow-md dark:border-zinc-700 dark:bg-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div
                    className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 fill-mode-both"
                    style={{ animationDelay: "100ms" }}
                  >
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-[#0b7a75] focus:outline-none focus:ring-2 focus:ring-[#0b7a75]/20 focus:shadow-md dark:border-zinc-700 dark:bg-slate-800 dark:text-slate-100"
                      required
                    />
                  </div>

                  <div
                    className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 fill-mode-both"
                    style={{ animationDelay: "150ms" }}
                  >
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Amount
                    </label>
                    <input
                      id="amount"
                      type="number"
                      min={0}
                      step={0.01}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-[#0b7a75] focus:outline-none focus:ring-2 focus:ring-[#0b7a75]/20 focus:shadow-md dark:border-zinc-700 dark:bg-slate-800 dark:text-slate-100"
                      required
                    />
                  </div>
                </div>

                <div
                  className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both dark:border-zinc-800"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="flex sm:flex-row sm:justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setOpen(false);
                      }}
                      className="inline-flex justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-100 hover:border-slate-400 active:scale-95 cursor-pointer dark:border-zinc-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-2xl bg-[#0b7a75] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0b7a75]/20 transition duration-200 hover:bg-[#09615e] hover:shadow-xl hover:shadow-[#0b7a75]/30 active:scale-95 cursor-pointer"
                    >
                      Save sales
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

