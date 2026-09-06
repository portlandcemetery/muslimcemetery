"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function PlotFooter({ pending }: { pending: boolean }) {
  return (
    <div className="sticky bottom-0 bg-background/90 backdrop-blur-lg border-t border-border py-4 px-5 sm:px-8 lg:px-[44px] flex flex-wrap items-center justify-end gap-[14px]">
      <Link
        href="/gardens"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-auto py-[13px] px-6 bg-card border-input rounded-xl text-[15px] font-semibold text-foreground/85 hover:bg-card hover:border-muted-foreground hover:text-foreground"
        )}
      >
        Cancel
      </Link>
      <Button
        type="submit"
        disabled={pending}
        className="h-auto py-[13px] px-7 rounded-xl text-[15px] font-bold hover:bg-primary/90"
      >
        {pending ? "Saving…" : "Save & Record Changes"}
      </Button>
    </div>
  );
}
