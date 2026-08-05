import React, { useState } from "react";
import { Download } from "lucide-react";

/**
 * LedgerLite - Export Summary Panel
 * Left: Period + Format radio options, Export/Cancel actions
 * Right: Live "Summary Preview" of the selected period's figures
 */

type Period = "today" | "week" | "month";
type ExportFormat = "pdf" | "image";

const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

const FORMAT_OPTIONS: { id: ExportFormat; label: string }[] = [
  { id: "pdf", label: "Export PDF" },
  { id: "image", label: "Export image" },
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

// Mock figures per period — swap for real data from  backend
const SUMMARY_BY_PERIOD: Record<Period, SummaryData> = {
  today: {
    moneyIn: 250000,
    moneyOut: 120000,
    profit: 130000,
    totalSales: 24,
    totalExpenses: 5,
  },
  week: {
    moneyIn: 1450000,
    moneyOut: 620000,
    profit: 830000,
    totalSales: 142,
    totalExpenses: 31,
  },
  month: {
    moneyIn: 5200000,
    moneyOut: 2100000,
    profit: 3100000,
    totalSales: 510,
    totalExpenses: 98,
  },
};

function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
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
      onClick={onSelect}
      className="flex w-full items-center justify-between rounded-xl py-3 text-left transition-colors hover:bg-slate-50"
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

export default function LedgerLiteExportSummary({
  businessName = "businessName",
  onExport,
  onCancel,
}: {
  businessName?: string;
  onExport?: (period: Period, format: ExportFormat) => void;
  onCancel?: () => void;
}) {
  const [period, setPeriod] = useState<Period>("today");
  const [format, setFormat] = useState<ExportFormat>("pdf");

  const data = SUMMARY_BY_PERIOD[period];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col  overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 lg:flex-row">
      {/* Left panel: options */}
      <div className="w-full border-b  border-slate-100 px-4 py-6 sm:px-6 lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
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
            onClick={() => onExport?.(period, format)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={onCancel}
            className="w-full cursor-pointer rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Right panel: live preview */}
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Summary Preview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Period: {PERIOD_LABELS[period]}
        </p>

        <h3 className="mt-6 mb-5 text-lg font-semibold text-slate-800 sm:text-xl">
          {businessName}
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <StatCard label="Money In" value={formatNaira(data.moneyIn)} />
          <StatCard label="Money Out" value={formatNaira(data.moneyOut)} />
          <StatCard label="Profit" value={formatNaira(data.profit)} />
          <StatCard label="Total Sales" value={String(data.totalSales)} />
          <StatCard label="Total Expenses" value={String(data.totalExpenses)} />
        </div>
      </div>
    </div>
  );
}
