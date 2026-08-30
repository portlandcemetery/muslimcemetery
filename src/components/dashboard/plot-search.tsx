"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PlotSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative mb-[30px] max-w-[620px]">
      <Search
        size={19}
        strokeWidth={2}
        className="absolute left-4 top-4 text-muted-foreground/90 pointer-events-none"
      />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search plots by name or reference — e.g. Ahmad Hassan or AB2"
        className="h-[52px] pl-[46px] pr-4 text-[15.5px] bg-card rounded-[13px]"
      />
    </div>
  );
}
