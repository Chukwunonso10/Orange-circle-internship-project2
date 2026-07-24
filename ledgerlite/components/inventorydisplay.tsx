"use client";
import { useState } from "react";
import { X, Plus, Eye } from "lucide-react";

export default function InventoryDisplay() {
  const [open, setOpen] = useState(false);
 

  return (
    <div className="px-4 py-6">
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-2 md:px-5 py-3  text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
        >
          <Eye size={18} />
          <span className="px-1 ">View</span>
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
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 ">
                <div className="">
                  <h2 className="text-xl font-semibold py-2">Low Stock</h2>
                  <div className="flex items-center py-1 px-4 bg-red-100 rounded-xl ">
                    <p className=" items-center text-sm text-red-700 ">
                      3 Alerts
                    </p>
                  </div>
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
              {/* alert */}
              <div>
                <div className="flex justify-between gap-10 py-4 px-6">
                  <div className="flex items-center  px-4 bg-red-100 rounded-xl ">
                    <p className=" items-center text-sm text-red-700 ">
                      low stock
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">
                      Oganic Coffee Beans
                    </h4>
                    <p className="text-sm text-slate-600 ">
                      2kg left . Min 10kg
                    </p>
                  </div>
                  <div>
                    <Plus className="text-[#0B7A75]" size={18} />
                  </div>
                </div>

                <div className="flex justify-between gap-10 py-4 px-6">
                  <div className="flex items-center  px-4 bg-red-100 rounded-xl ">
                    <p className=" items-center text-sm text-red-700 ">
                      low stock
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">
                      Oganic Coffee Beans
                    </h4>
                    <p className="text-sm text-slate-600 ">
                      2kg left . Min 10kg
                    </p>
                  </div>
                  <div>
                    <Plus className="text-[#0B7A75]" size={18} />
                  </div>
                </div>

                <div className="flex justify-between gap-10 py-4 px-6">
                  <div className="flex items-center  px-4 bg-red-100 rounded-xl ">
                    <p className=" items-center text-sm text-red-700 ">
                      low stock
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">
                      Oganic Coffee Beans
                    </h4>
                    <p className="text-sm text-slate-600 ">
                      2kg left . Min 10kg
                    </p>
                  </div>
                  <div>
                    <Plus className="text-[#0B7A75]" size={18} />
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
