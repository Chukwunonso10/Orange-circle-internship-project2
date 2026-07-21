"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    function handlePageChange(pageNumber: number) {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(pageNumber));
        router.push(`?${params.toString()}`);
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                title="Previous page"
            >
                <ChevronLeft size={14} />
            </button>

            {Array.from({  }, (_, index) => {
                const pageIndex = index + 1
                const pathname = usePathname
                return <div key={index}>
                    <button
                        type="button"
                        onClick={() => handlePageChange(currentPage)}
                        
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                        title="Next page"
                    >
                      {pageIndex}
                    </button>
                </div>
})}

            <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                title="Next page"
            >
                <ChevronRight size={14} />
            </button>
        </div>
    );
}