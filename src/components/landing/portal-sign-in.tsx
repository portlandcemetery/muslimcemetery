"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/services/auth/auth-client";

export function PortalSignIn() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const fieldCls = "h-[54px] text-base bg-card rounded-xl";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setError(null);
    setPending(true);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      setError("Invalid email or password.");
      setPending(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-[460px] p-0 gap-0 border-border border-t-[3px] border-t-primary rounded-[5px_5px_18px_18px] shadow-[0_26px_60px_-34px_rgba(34,39,31,.5)]">
      <form onSubmit={onSubmit} className="p-9">
        <Label htmlFor="portal-email" className="text-sm font-semibold text-card-foreground mb-[9px]">
          Email address
        </Label>
        <Input
          id="portal-email"
          name="email"
          type="email"
          required
          placeholder="operator@icportland.org"
          className={`${fieldCls} mb-[22px]`}
        />

        <Label htmlFor="portal-password" className="text-sm font-semibold text-card-foreground mb-[9px]">
          Password
        </Label>
        <div className="relative mb-[26px]">
          <Input
            id="portal-password"
            name="password"
            type={showPw ? "text" : "password"}
            required
            placeholder="••••••••••••"
            className={`${fieldCls} pr-[54px]`}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            aria-label="Toggle password visibility"
            className="absolute right-[9px] top-[9px] h-9 w-9 bg-transparent text-muted-foreground rounded-[9px] cursor-pointer flex items-center justify-center transition-colors hover:bg-secondary hover:text-foreground/85"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-14 text-[16.5px] font-bold rounded-[13px]"
        >
          {pending ? "Signing in…" : "Sign In to Management"}
        </Button>

        {error && (
          <Alert className="mt-[18px] bg-destructive/10 border-destructive/25 text-destructive">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-[22px] flex gap-[9px] items-center text-muted-foreground justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-none"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
          <span className="text-[13.5px]">
            Need help?{" "}
            <a href="#contact" className="text-primary hover:text-primary/80">
              Contact the office.
            </a>
          </span>
        </div>
      </form>
    </Card>
  );
}
