import { Spinner } from "@/components/ui/spinner";

// Full-region centered loading state for client pages.
export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[70svh] w-full flex-col items-center justify-center gap-4">
      <Spinner className="size-14 text-primary [animation-duration:1.1s]" />
      <span className="text-[14px] font-medium tracking-wide text-muted-foreground/80">
        {label}
      </span>
    </div>
  );
}
