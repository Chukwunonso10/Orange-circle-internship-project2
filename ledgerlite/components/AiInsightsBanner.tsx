"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  TrendingDown,
  PackageX,
  RefreshCw,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { AiAlert } from "@/app/lib/ai/predictor";

export default function AiInsightsBanner() {
  const [alerts, setAlerts] = useState<AiAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/ai/alerts");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to fetch AI alerts:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 p-4 text-white shadow-md animate-pulse flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-teal-400 animate-spin" />
        <span className="text-sm font-medium text-slate-200">
          BizSense AI is analyzing your sales velocity and inventory patterns...
        </span>
      </div>
    );
  }

  if (error || alerts.length === 0) {
    return (
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 p-4 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-teal-500/20 p-2.5 text-teal-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              BizSense AI Assistant
              <span className="rounded-full bg-teal-400/20 px-2 py-0.5 text-xs text-teal-300 font-normal">
                Active
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Your business data looks stable! No immediate stockouts or sales anomalies detected.
            </p>
          </div>
        </div>
        <button
          onClick={fetchAlerts}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-slate-200 text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh AI
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-5 text-white shadow-lg border border-slate-700/50">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-teal-500/20 p-2 text-teal-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              BizSense AI Proactive Insights
              <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-xs text-amber-300 font-semibold">
                {alerts.length} {alerts.length === 1 ? "Alert" : "Alerts"}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time predictive restock signals & financial loss prevention
            </p>
          </div>
        </div>
        <button
          onClick={fetchAlerts}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-slate-300 text-xs flex items-center gap-1"
          title="Re-run AI Analysis"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl p-3.5 border transition flex items-start gap-3 ${
              alert.severity === "high"
                ? "bg-rose-950/40 border-rose-500/40 text-rose-100"
                : alert.severity === "medium"
                ? "bg-amber-950/40 border-amber-500/40 text-amber-100"
                : "bg-slate-800/60 border-slate-700 text-slate-200"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {alert.type === "stockout" && (
                <AlertTriangle className="h-5 w-5 text-rose-400" />
              )}
              {alert.type === "low_stock" && (
                <PackageX className="h-5 w-5 text-amber-400" />
              )}
              {alert.type === "deadstock" && (
                <TrendingDown className="h-5 w-5 text-indigo-400" />
              )}
              {alert.type === "anomaly" && (
                <ShieldAlert className="h-5 w-5 text-rose-400" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm">{alert.title}</h4>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    alert.severity === "high"
                      ? "bg-rose-500/20 text-rose-300"
                      : alert.severity === "medium"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {alert.message}
              </p>
              {alert.actionHint && (
                <p className="text-xs font-medium text-teal-300 mt-1.5 flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  {alert.actionHint}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
