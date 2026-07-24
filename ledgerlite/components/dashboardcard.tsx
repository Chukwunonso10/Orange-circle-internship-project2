import { Trash2, Eye } from "lucide-react";

interface DashboardItem {
  id: string;
  transaction: string;
  type: string;
  amount: number;
  timestamp: string;
}

interface DashboardCardProps {
  dashboard?: DashboardItem[];
}

export default function DashboardCard({ dashboard = [] }: DashboardCardProps) {
  // Sample data if none provided
  const sampleDashboard: DashboardItem[] = [
    {
      id: "1",
      transaction: "Laptop",
      type:"sales",
      amount: 2400,
      timestamp: "2025-01-15 10:30 AM",
    },
    {
      id: "2",
      transaction: "Mouse",
      type: "espense",
      amount: 125,
      timestamp: "2025-01-15 11:15 AM",
    },
    {
      id: "3",
      transaction: "Keyboard",
      type: "sales",
      amount: 225,
      timestamp: "2025-01-15 02:45 PM",
    },
    {
      id: "4",
      transaction: "Laptop",
      type: "espense",
      amount: 2400,
      timestamp: "2025-01-15 10:30 AM",
    },
    {
      id: "5",
      transaction: "Mouse",
      type: "sale",
      amount: 125,
      timestamp: "2025-01-15 11:15 AM",
    },
    {
      id: "6",
      transaction: "Keyboard",
      type: "espense",
      amount: 225,
      timestamp: "2025-01-15 02:45 PM",
    },
  ];

  const displayDashboard = dashboard;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
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
          <tbody className="divide-y divide-slate-100">
            {displayDashboard.map((item) => (
              <tr key={item.id} className="transition hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">
                    {item.transaction}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center rounded-lg bg-brand-primary/10 px-3 py-1 text-sm font-semibold text-brand-primary">
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    ₦{item.amount.toLocaleString()}
                  </p>
                </td>
                <td className="px-0 py-4">
                  <p className="text-xs text-slate-500">{item.timestamp}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-brand-primary/5 hover:text-brand-primary"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayDashboard.length === 0 && (
        <div className="flex items-center justify-center px-6 py-12">
          <p className="text-sm text-slate-500">No transaction records found.</p>
        </div>
      )}

      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
        <p className="text-xs text-slate-600">
          Total records:{" "}
          <span className="font-semibold text-slate-900">
            {displayDashboard.length}
          </span>
        </p>
      </div>
    </div>
  );
}