export type CsvValue = string | number | null | undefined;

function escapeCell(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  let s = String(value);
  // Formula-injection guard: Excel executes cells starting with = + - @ or tab/CR
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(s)) {
    s = `'${s}`;
  }
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers: string[], rows: CsvValue[][]): string {
  const lines = [headers, ...rows].map((row) => row.map(escapeCell).join(","));
  // BOM so Excel detects UTF-8 (Arabic garden names)
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}
