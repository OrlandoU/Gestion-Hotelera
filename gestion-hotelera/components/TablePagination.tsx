'use client';

import { Dispatch, SetStateAction } from "react";

type TablePaginationProps = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  totalItems: number;
  label?: string;
};

const getPageItems = (page: number, totalPages: number) => {
  const pages: Array<number | "..."> = [];
  const left = Math.max(1, page - 1);
  const right = Math.min(totalPages, page + 1);

  if (left > 1) pages.push(1);
  if (left > 2) pages.push("...");

  for (let i = left; i <= right; i += 1) {
    pages.push(i);
  }

  if (right < totalPages - 1) pages.push("...");
  if (right < totalPages) pages.push(totalPages);

  return pages;
};

export default function TablePagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalItems,
  label = "registros",
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
      <div className="text-[13px] text-slate-600">
        Mostrando <span className="font-semibold text-slate-900">{startItem}</span> - <span className="font-semibold text-slate-900">{endItem}</span> de <span className="font-semibold text-slate-900">{totalItems}</span> {label}
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center">
        <div className="inline-flex items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white pl-3 pr-2 shadow-sm">
          <label className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-500">Mostrar</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-9 rounded-lg border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-900 outline-none transition focus:border-[#008cc7] focus:ring-1 focus:ring-[#008cc7]"
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="inline-flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
            className="inline-flex h-9 min-w-[38px] items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 hover:bg-slate-100"
          >
            «
          </button>
          <button
            type="button"
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-9 min-w-[38px] items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 hover:bg-slate-100"
          >
            ‹
          </button>
          {pageItems.map((item, index) =>
            item === "..." ? (
              <span key={`ellipsis-${index}`} className="inline-flex h-9 items-center justify-center px-3 text-[13px] text-slate-500">…</span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => setPage(item)}
                className={`inline-flex h-9 min-w-[38px] items-center justify-center rounded-lg border px-3 text-[13px] font-semibold transition ${item === currentPage ? 'border-[#008cc7] bg-[#e0f2ff] text-[#0b63a3]' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                {item}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex h-9 min-w-[38px] items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 hover:bg-slate-100"
          >
            ›
          </button>
          <button
            type="button"
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages}
            className="inline-flex h-9 min-w-[38px] items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 hover:bg-slate-100"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
