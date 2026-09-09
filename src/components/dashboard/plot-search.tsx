"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/services/trpc/client";
import { STATUS_META } from "@/components/gardens/garden-data";

export function PlotSearch() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();

  useEffect(() => {
    const q = query.trim();
    const timer = setTimeout(() => setDebounced(q.length >= 2 ? q : ""), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useQuery(
    trpc.plots.search.queryOptions(
      { query: debounced, limit: 8 },
      { enabled: debounced.length >= 2 }
    )
  );
  const rows = results.data ?? [];

  return (
    <div className="relative mb-[30px] max-w-[620px]">
      <Search
        size={19}
        strokeWidth={2}
        className="absolute left-4 top-4 text-muted-foreground/90 pointer-events-none"
      />
      <Input
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          setOpen(value.trim().length >= 2);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => rows.length > 0 && setOpen(true)}
        placeholder="Search plots by name or reference — e.g. Ahmad Hassan or AB2"
        className="h-[52px] pl-[46px] pr-4 text-[15.5px] bg-card rounded-[13px]"
      />
      {open && debounced.length >= 2 && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute z-20 top-[58px] left-0 right-0 bg-card border border-border rounded-[13px] shadow-lg overflow-hidden"
        >
          {rows.length === 0 ? (
            <div className="py-3 px-4 text-[14px] text-muted-foreground">
              {results.isFetching ? "Searching…" : "No plots found."}
            </div>
          ) : (
            rows.map((p) => (
              <Link
                key={p.id}
                href={`/plots/${p.garden_id}-${p.ref}`}
                className="flex items-center gap-3 py-3 px-4 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
              >
                <span
                  className={`w-[9px] h-[9px] rounded-full flex-none ${STATUS_META[p.status].dot}`}
                />
                <span className="font-bold text-[14px]">
                  {p.ref} · Garden {p.garden_id.toUpperCase()}
                </span>
                {p.deceased_name && (
                  <span className="text-[13.5px] text-muted-foreground truncate">
                    {p.deceased_name}
                  </span>
                )}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
