"use client";

import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import LedgerLiteExportSummary from "@/components/exportsummary";

export default function ExportSummary() {
  return (
    <div>
      <div>
        <SideNav />
        <div className="ml-0 md:ml-60 sm:ml-0">
          <UserNav />
        </div>

        <main className="min-h-screen ml-0 md:ml-62 p-6 bg-slate-50">
          <div className="max-w-6xl mx-auto space-y-8">
            <section>
              <LedgerLiteExportSummary />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
