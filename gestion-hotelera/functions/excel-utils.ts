'use client';

import { utils, writeFile } from "xlsx";

type ExportRow = Record<string, any>;

export function exportToExcel(rows: ExportRow[], fileName: string, sheetName = "Reporte") {
  const normalized = rows.map((row) => {
    const result: ExportRow = {};
    Object.entries(row).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        result[key] = "";
      } else if (typeof value === "object") {
        result[key] = JSON.stringify(value);
      } else {
        result[key] = value;
      }
    });
    return result;
  });

  const worksheet = utils.json_to_sheet(normalized);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, sheetName);
  writeFile(workbook, fileName);
}
