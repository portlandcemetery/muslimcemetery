"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        style: {
          fontFamily: "var(--font-hanken), sans-serif",
          borderRadius: "13px",
          border: "1px solid var(--border)",
          background: "var(--card)",
          color: "var(--card-foreground)",
          fontSize: "14.5px",
        },
      }}
      richColors
      {...props}
    />
  );
}
