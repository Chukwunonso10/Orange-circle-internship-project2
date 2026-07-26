"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number
}

export default function Pagination({ currentPage, totalPages, pageSize }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname()

    function handlePageChange(pageNumber: number) {

        if (pageNumber < 1 || pageNumber > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(pageNumber));
        router.replace(`${pathname}?${params.toString()}`);
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

            {Array.from({ length: Math.ceil(totalPages) }, (_, index) => {
                const pageIndex = index + 1
                const isCurrent = pageIndex === currentPage
                console.log(pageIndex, currentPage)

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handlePageChange(pageIndex)}

                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer ${isCurrent ? "bg-green-500" : ""} disabled: cursor-not-allowed`}
                        title="Next page"
                    >
                        {pageIndex}
                    </button>
                )
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