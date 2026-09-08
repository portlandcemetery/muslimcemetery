"use client";

import { useActionState, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  requestPasswordReset,
  signIn,
  type ResetState,
  type SignInState,
} from "@/lib/actions/auth";

export function PortalSignIn() {
  const [showPw, setShowPw] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "reset">("sign-in");
  const [state, formAction, pending] = useActionState<SignInState, FormData>(
    signIn,
    { error: null }
  );
  const [resetState, resetAction, resetPending] = useActionState<
    ResetState,
    FormData
  >(requestPasswordReset, { error: null, sent: false });

  const fieldCls = "h-[54px] text-base bg-card rounded-xl";

  if (mode === "reset") {
    return (
      <Card className="w-full max-w-[460px] p-0 gap-0 border-border border-t-[3px] border-t-primary rounded-[5px_5px_18px_18px] shadow-[0_26px_60px_-34px_rgba(34,39,31,.5)]">
        <form action={resetAction} className="p-9">
          <h3 className="font-extrabold text-[22px] tracking-[-0.02em] mb-[6px]">
            Reset your password
          </h3>
          <p className="text-[14.5px] text-foreground/70 mb-[22px]">
            We&apos;ll email you a link to set a new password.
          </p>
          <Label
            htmlFor="reset-email"
            className="text-sm font-semibold text-card-foreground mb-[9px]"
          >
            Email address
          </Label>
          <Input
            id="reset-email"
            name="email"
            type="email"
            required
            placeholder="operator@icportland.org"
            className={`${fieldCls} mb-[22px]`}
          />
          <Button
            type="submit"
            disabled={resetPending || resetState.sent}
            className="w-full h-14 text-[16.5px] font-bold rounded-[13px]"
          >
            {resetPending ? "Sending…" : "Send reset link"}
          </Button>

          {resetState.sent && (
            <Alert className="mt-[18px] bg-primary/10 border-primary/25">
              <AlertDescription>
                If that email is registered, a reset link is on its way. Check
                your inbox.
              </AlertDescription>
            </Alert>
          )}
          {resetState.error && (
            <Alert className="mt-[18px] bg-destructive/10 border-destructive/25 text-destructive">
              <AlertDescription className="text-destructive">
                {resetState.error}
              </AlertDescription>
            </Alert>
          )}

          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className="mt-[22px] w-full text-center text-[13.5px] text-primary hover:text-primary/80 bg-transparent cursor-pointer"
          >
            Back to sign in
          </button>
        </form>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[460px] p-0 gap-0 border-border border-t-[3px] border-t-primary rounded-[5px_5px_18px_18px] shadow-[0_26px_60px_-34px_rgba(34,39,31,.5)]">
      <form action={formAction} className="p-9">
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

        <button
          type="button"
          onClick={() => setMode("reset")}
          className="mt-[16px] w-full text-center text-[13.5px] text-primary hover:text-primary/80 bg-transparent cursor-pointer"
        >
          Forgot your password?
        </button>

        {state.error && (
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
            <AlertDescription className="text-destructive">
              {state.error}
            </AlertDescription>
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
