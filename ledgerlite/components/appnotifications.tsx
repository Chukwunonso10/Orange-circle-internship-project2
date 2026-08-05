import React, { useState } from "react";
import {
  ChevronLeft,
  AlertTriangle,
  FileDown,
  PackageCheck,
  Inbox,
  Download,
} from "lucide-react";
import InventoryForm from "@/components/inventoryform";
import { useRouter } from "next/navigation";
import Link from "next/link";


/**
 * LedgerLite - Notifications Panel
 * Supports three notification kinds (low stock, export ready, restock)
 * plus an empty state when there's nothing to show.
 */

type NotificationKind = "low-stock" | "export-ready" | "restock";

interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  meta?: {
    fileSize?: string;
  };
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    kind: "low-stock",
    title: "Low Stock Alert: Organic Coffee Beans",
    message:
      'Inventory level for "Organic Coffee Beans (Medium Roast)" has dropped below the threshold of 5kg. Current stock: 1.2kg.',
    timestamp: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    kind: "export-ready",
    title: "Export Ready: Total Sales for 17th July 2026",
    message:
      "Your total sales summary PDF has been generated and is ready for download.",
    timestamp: "2 mins ago",
    read: false,
    meta: { fileSize: "2.4 MB" },
  },
  {
    id: "3",
    kind: "restock",
    title: "Restock Alert: 50 bottle water",
    message: "Your restock of bottle water has been added.",
    timestamp: "2 mins ago",
    read: true,
  },
];

const KIND_STYLES: Record<
  NotificationKind,
  { icon: React.ReactNode; card: string }
> = {
  "low-stock": {
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    card: "border-red-200 bg-red-50/60",
  },
  "export-ready": {
    icon: <FileDown className="h-5 w-5 text-teal-600" />,
    card: "border-slate-200 bg-white",
  },
  restock: {
    icon: <PackageCheck className="h-5 w-5 text-teal-600" />,
    card: "border-slate-200 bg-white",
  },
};

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <Inbox className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">No notifications</h3>
      <p className="mt-1 text-sm text-slate-400">
        Important updates and alerts will appear here
      </p>
    </div>
  );
}

function NotificationCard({
  notification,
  onRestock,
  onDownload,
}: {
  notification: AppNotification;
  onRestock?: (id: string) => void;
  onDownload?: (id: string) => void;
}) {
  const style = KIND_STYLES[notification.kind];

  return (
    <div className={`rounded-2xl border px-5 py-4 ${style.card}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0">{style.icon}</span>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              {notification.title}
            </h4>
            <p className="mt-1 py-3 text-sm leading-relaxed text-slate-500">
              {notification.message}
            </p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap text-xs font-medium uppercase tracking-wide text-slate-400">
          {notification.timestamp}
        </span>
      </div>

      {notification.kind === "low-stock" && (
        <Link href="/inventory"
          onClick={() => onRestock?.(notification.id)}
          className="ml-8 mt-4 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700"
        >
          Restock
        </Link>
      )}

      {notification.kind === "export-ready" && (
        <button
          onClick={() => onDownload?.(notification.id)}
          className="ml-8 mt-4 flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:underline"
        >
          <Download className="h-4 w-4" />
          Download PDF{" "}
          {notification.meta?.fileSize && `(${notification.meta.fileSize})`}
        </button>
      )}
    </div>
  );
}

// back icon button
function BackIconButton() {
  const router = useRouter();

  // Typed click handler function
  const handleBack = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    router.back();
  };
  return (
    <button
      className="bg-[#F4F8F8] p-2 md:p-3 rounded-full text-teal-700 cursor-pointer"
      type="button"
      onClick={handleBack}
      aria-label="Go back"
    >
      <ChevronLeft className="h-7 w-7 "/>
    </button>
  );
}

export default function LedgerLiteNotifications({
  onBack,
}: {
  onBack?: () => void;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS,
  );

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleRestock = (id: string) => {
    // wire up real restock flow here
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleDownload = (id: string) => {
    // wire up real download here
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <div className="mx-auto flex min-h-150 w-full max-w-3xl flex-col rounded-2xl bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
       
        <div className="flex items-center gap-3 text-lg font-bold text-slate-900">
          <BackIconButton />
          Notifications
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-teal-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 py-6">
        {notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onRestock={handleRestock}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
