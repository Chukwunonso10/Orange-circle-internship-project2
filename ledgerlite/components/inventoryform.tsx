"use client"
import { useState } from "react";
import { X, Plus} from "lucide-react";

export default function InventoryForm() {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [stock, setStock] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
    const [threshhold, setThreshold] = useState("");




  function resetForm() {
    setProduct("");
    setStock("");
    setCostPrice("");
    setSellingPrice("");
    setThreshold("");
  }

  function handleSave(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const inventory = { product, stock, costPrice,sellingPrice , threshhold};
    console.log("Save inventory", inventory);
    setOpen(false);
    resetForm();
  }

  return (
    <div className="px-4 py-6">
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-2 md:px-5 py-3  text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
        >
          <Plus size={18} />
          <span className="px-1 ">Add</span>
          Products
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
                  <h2 className="text-xl font-semibold">Add Product</h2>
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
                    htmlFor="product"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Products
                  </label>
                  <input
                    id="product"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="Eg rice,tomatoe paste"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Quantity in Stock
                  </label>
                  <input
                    id="stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="cost"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      ₦ Cost Price
                    </label>
                    <input
                      id="cost"
                      type="number"
                      // min={1}
                      placeholder="0"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      ₦ Selling Price
                    </label>
                    <input
                      id="price"
                      type="number"
                      placeholder="0"
                      // min={0}
                      // step={0.01}
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-primary[#0b7a75] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-100"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="thresh"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Low stock threshold
                  </label>
                  <input
                    id="thresh"
                    type="number"
                    placeholder="0"
                    // min={0}
                    // step={0.01}
                    value={threshhold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-primary[#0b7a75] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-100"
                    required
                  />
                  <p className="text-xs text-gray-700">
                    we will alert you when stock falls below this level{" "}
                  </p>
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
                    className="inline-flex justify-center rounded-2xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover cursor-pointer"
                  >
                    Save product
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
