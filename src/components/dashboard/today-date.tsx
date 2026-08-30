"use client";

import { useEffect, useState } from "react";

export function TodayDate() {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  return <span suppressHydrationWarning>{today}</span>;
}
