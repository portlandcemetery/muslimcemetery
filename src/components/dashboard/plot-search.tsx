"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export function PlotSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative mb-[30px] max-w-[620px]">
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-4 top-4 text-muted-foreground/90 pointer-events-none"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search plots by name or reference — e.g. Ahmad Hassan or AB2"
        className="h-[52px] pl-[46px] pr-4 text-[15.5px] bg-card rounded-[13px]"
      />
    </div>
  );
}
