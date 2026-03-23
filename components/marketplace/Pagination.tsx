"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  // Show up to 5 page numbers with ellipsis
  function getPageNumbers(): (number | "ellipsis")[] {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("ellipsis");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("ellipsis");

    // Always show last page
    pages.push(totalPages);
    return pages;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1.5">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex items-center gap-1 h-9 px-3 rounded-xl
                     font-inter text-sm font-semibold text-lk-primary
                     border border-lk-primary/20 hover:bg-lk-primary-pale transition-colors"
        >
          <ChevronLeft size={14} />
          Prev
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 h-9 px-3 rounded-xl
                     font-inter text-sm font-semibold text-lk-dark/20
                     border border-lk-neutral-mid cursor-not-allowed"
        >
          <ChevronLeft size={14} />
          Prev
        </span>
      )}

      {/* Page numbers */}
      {pageNumbers.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`e-${i}`}
            className="w-9 h-9 flex items-center justify-center font-inter text-sm text-lk-dark/30"
          >
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl font-inter text-sm font-semibold transition-colors ${
              p === currentPage
                ? "bg-lk-primary text-white"
                : "text-lk-dark/60 hover:bg-lk-primary-pale hover:text-lk-primary"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex items-center gap-1 h-9 px-3 rounded-xl
                     font-inter text-sm font-semibold text-lk-primary
                     border border-lk-primary/20 hover:bg-lk-primary-pale transition-colors"
        >
          Next
          <ChevronRight size={14} />
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 h-9 px-3 rounded-xl
                     font-inter text-sm font-semibold text-lk-dark/20
                     border border-lk-neutral-mid cursor-not-allowed"
        >
          Next
          <ChevronRight size={14} />
        </span>
      )}
    </div>
  );
}
