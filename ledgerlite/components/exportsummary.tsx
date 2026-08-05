"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Period = "today" | "week" | "month";
type ExportFormat = "pdf" | "image";

const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

const FORMAT_OPTIONS: { id: ExportFormat; label: string }[] = [
  { id: "pdf", label: "Export PDF" },
  { id: "image", label: "Export Image" },
];

const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
};

interface SummaryData {
  moneyIn: number;
  moneyOut: number;
  profit: number;
  totalSales: number;
  totalExpenses: number;
}

function formatNaira(value: number) {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  return `${isNegative ? "-" : ""}₦${absValue.toLocaleString("en-NG")}`;
}

function RadioRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between rounded-xl py-3 text-left transition-colors hover:bg-slate-50 cursor-pointer"
    >
      <span className="text-sm text-slate-700 sm:text-[15px]">{label}</span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-teal-600" : "border-slate-300"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />}
      </span>
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-4 sm:px-6 sm:py-5">
      <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
      <p className="mt-1.5 text-xl font-bold text-teal-700 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

export default function LedgerLiteExportSummary() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("today");
  const [format, setFormat] = useState<ExportFormat>("pdf");

  // Fetch business name from user profile
  const { data: profileData } = useQuery<{
    success: boolean;
    profile: { buisnessName: string; name: string };
  }>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/protected/profile");
      if (!res.ok) throw new Error("Failed to load user profile");
      return res.json();
    },
  });

  const businessName =
    profileData?.profile?.buisnessName || "My Business Ledger";

  // Fetch summary data dynamically from DB via React Query
  const {
    data: summaryData,
    isPending,
    error,
  } = useQuery<SummaryData>({
    queryKey: ["summary", period],
    queryFn: async () => {
      const res = await fetch(`/api/protected/summary?period=${period}`);
      if (!res.ok) throw new Error("Failed to load summary statistics");
      return res.json();
    },
  });

  const handleExport = () => {
    if (format === "pdf") {
      const previewEl = document.getElementById("export-report-preview");
      if (!previewEl) return;

      const printContent = previewEl.innerHTML;
      const printWindow = window.open("", "_blank");

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${businessName} - Summary Report</title>
              <style>
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  padding: 40px;
                  color: #1e293b;
                  background: white;
                }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .items-center { align-items: center; }
                .border-b { border-bottom: 1px solid #f1f5f9; }
                .pb-4 { padding-bottom: 16px; }
                .mt-6 { margin-top: 24px; }
                .mb-5 { margin-bottom: 20px; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .rounded-2xl { border-radius: 16px; }
                .border { border: 1px solid #f1f5f9; }
                .bg-slate-50\\/60 { background-color: #f8fafc; }
                .px-4 { padding-left: 16px; padding-right: 16px; }
                .py-4 { padding-top: 16px; padding-bottom: 16px; }
                .px-6 { padding-left: 24px; padding-right: 24px; }
                .py-5 { padding-top: 20px; padding-bottom: 20px; }
                .text-xs { font-size: 12px; }
                .text-sm { font-size: 14px; }
                .text-slate-500 { color: #64748b; }
                .text-slate-900 { color: #0f172a; }
                .text-teal-700 { color: #0f766e; }
                .text-xl { font-size: 20px; }
                .text-2xl { font-size: 24px; }
                .font-bold { font-weight: 700; }
                .font-semibold { font-weight: 600; }
                .mt-1.5 { margin-top: 6px; }
                .mt-16 { margin-top: 64px; }
                .border-t { border-top: 1px solid #e2e8f0; }
                .border-dashed { border-style: dashed; }
                .pt-6 { padding-top: 24px; }
                .text-slate-400 { color: #94a3b8; }
                .print\\:block { display: block !important; }
                .hidden { display: none; }
                .col-span-2 { grid-column: span 2; }
                .col-span-1 { grid-column: span 1; }
                .inline-flex { display: inline-flex; }
                .rounded-full { border-radius: 9999px; }
                .bg-teal-50 { background-color: #f0fdfa; }
                .px-3 { padding-left: 12px; padding-right: 12px; }
                .py-1 { padding-top: 4px; padding-bottom: 4px; }
                .font-semibold { font-weight: 600; }
              </style>
            </head>
            <body>
              <div style="max-width: 700px; margin: 0 auto;">
                ${printContent}
              </div>
              <script>
                // Execute printing once DOM rendering settles
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 300);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      alert(
        "To save as Image, you can use your device screenshot shortcut or choose standard PDF print export instead."
      );
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 lg:flex-row">
      {/* Left panel: options */}
      <div className="w-full border-b border-slate-100 px-4 py-6 sm:px-6 lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <h3 className="mb-2 text-sm font-semibold text-slate-800">Period</h3>
        <div className="mb-2 divide-y divide-slate-50">
          {PERIOD_OPTIONS.map((opt) => (
            <RadioRow
              key={opt.id}
              label={opt.label}
              selected={period === opt.id}
              onSelect={() => setPeriod(opt.id)}
            />
          ))}
        </div>

        <h3 className="mb-2 mt-8 text-sm font-semibold text-slate-800">
          Format
        </h3>
        <div className="mb-8 divide-y divide-slate-50">
          {FORMAT_OPTIONS.map((opt) => (
            <RadioRow
              key={opt.id}
              label={opt.label}
              selected={format === opt.id}
              onSelect={() => setFormat(opt.id)}
            />
          ))}
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={isPending}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full cursor-pointer rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Right panel: live preview */}
      <div
        id="export-report-preview"
        className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 bg-white"
      >
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Ledger Summary Report
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Period: {PERIOD_LABELS[period]}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              LedgerLite Verified
            </span>
          </div>
        </div>

        <h3 className="mt-6 mb-5 text-lg font-bold text-slate-800 sm:text-xl">
          {businessName}
        </h3>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
            <p className="mt-2 text-sm text-slate-500">
              Loading summary figures...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600 text-center">
            Failed to load report summary data.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <StatCard
              label="Money In"
              value={formatNaira(summaryData.moneyIn)}
            />
            <StatCard
              label="Money Out"
              value={formatNaira(summaryData.moneyOut)}
            />
            <StatCard
              label="Net Profit"
              value={formatNaira(summaryData.profit)}
            />
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-4 sm:px-6 sm:py-5 col-span-1 sm:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 sm:text-sm">Total Sales Count</p>
                <p className="mt-1 text-lg font-bold text-teal-700">
                  {summaryData.totalSales} sales
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 sm:text-sm">Total Expenses Count</p>
                <p className="mt-1 text-lg font-bold text-teal-700">
                  {summaryData.totalExpenses} expenses
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer signature line visible ONLY when printing */}
        <div className="mt-16 border-t border-dashed border-slate-200 pt-6 hidden print:block">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <p>Generated dynamically on: {new Date().toLocaleDateString()}</p>
            <p>Sign-off Stamp: ____________________</p>
          </div>
        </div>
      </div>
    </div>
  );
}
