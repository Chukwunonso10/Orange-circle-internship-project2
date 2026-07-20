"use client"
import { useState } from "react";
import { X, Plus} from "lucide-react";

export default function InventoryForm() {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);

  function resetForm() {
    setItem("");
    setQuantity(1);
    setAmount(0);
  }

  function handleSave(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const sale = { item, quantity, amount };
    console.log("Save sales", sale);
    setOpen(false);
    resetForm();
  }

  return (
    <div className="px-4 py-6">
      <div >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-[#0b7a75] px-2 md:px-5 py-3  text-sm font-semibold text-white shadow-sm transition hover:bg-[#09615e] focus:outline-none focus:ring-2 focus:ring-[#0b7a75]/50 cursor-pointer"
        >
          <Plus size={18} />
           <span className="px-1 ">Add</span>
           Inventory
        </button>
       
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          <div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 "
            style={{ animation: "modal-enter 240ms ease-out forwards" }}
          >
            <div className="transform rounded-3xl transition duration-300 ease-out scale-100 opacity-100">
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-zinc-800">
                <div>
                  <h2 className="text-xl font-semibold">Add Inventory</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Fill item, quantity, and amount to save an invetory.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              {/* inventry form */}
              <form onSubmit={handleSave} className="space-y-5 px-6 py-6">
                <div className="space-y-2">
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
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-[#0b7a75] focus:outline-none focus:ring-2 focus:ring-[#0b7a75]/20"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
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
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-[#0b7a75] focus:outline-none focus:ring-2 focus:ring-[#0b7a75]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
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
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-[#0b7a75] focus:outline-none focus:ring-2 focus:ring-[#0b7a75]/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-100"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-200  sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                    }}
                    className="inline-flex justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-2xl bg-[#0b7a75] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#09615e] cursor-pointer"
                  >
                    Save Inventory
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
