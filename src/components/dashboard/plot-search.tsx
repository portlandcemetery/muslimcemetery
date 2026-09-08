"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { STATUS_META } from "@/components/gardens/garden-data";
import type { MapPlot } from "@/lib/types";

export function PlotSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MapPlot[]>([]);
  const [open, setOpen] = useState(false);
  const supabase = useRef(createClient());

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    // ignore flag: a slow in-flight response must not overwrite newer results
    // or reopen the dropdown after the query was cleared
    let ignore = false;
    const timer = setTimeout(async () => {
      const { data, error } = await supabase.current.rpc("search_map_plots", {
        p_query: q,
        p_limit: 8,
      });
      if (ignore || error) return;
      setResults(((data ?? []) as MapPlot[]));
      setOpen(true);
    }, 250);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query]);

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
          if (value.trim().length < 2) {
            setResults([]);
            setOpen(false);
          }
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Search plots by name or reference — e.g. Ahmad Hassan or AB2"
        className="h-[52px] pl-[46px] pr-4 text-[15.5px] bg-card rounded-[13px]"
      />
      {open && (
        <div
          // keep the input focused so blur can't unmount the list mid-click
          onMouseDown={(e) => e.preventDefault()}
          className="absolute z-20 top-[58px] left-0 right-0 bg-card border border-border rounded-[13px] shadow-lg overflow-hidden"
        >
          {results.length === 0 ? (
            <div className="py-3 px-4 text-[14px] text-muted-foreground">
              No plots found.
            </div>
          ) : (
            results.map((p) => (
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
