"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";

// Supabase recovery links land here with the session in the URL fragment.
// createBrowserClient parses the fragment on load (detectSessionInUrl) and
// fires PASSWORD_RECOVERY, which unlocks the form below.
export default function UpdatePasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [noSession, setNoSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    // If the fragment was already consumed (e.g. a hard refresh), fall back to
    // whatever session is on the client.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setTimeout(() => setNoSession((s) => (ready ? s : true)), 1500);
    });
    return () => sub.subscription.unsubscribe();
  }, [ready]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.replace("/dashboard"), 1200);
  }

  const fieldCls = "h-[54px] text-base bg-card rounded-xl";

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-6 py-16 font-hanken">
      <Card className="w-full max-w-[460px] p-0 gap-0 border-border border-t-[3px] border-t-primary rounded-[5px_5px_18px_18px] shadow-[0_26px_60px_-34px_rgba(34,39,31,.5)]">
        <div className="p-9">
          <h1 className="font-extrabold text-[26px] tracking-[-0.02em] mb-[6px]">
            Set a new password
          </h1>
          <p className="text-[15px] text-foreground/70 mb-[26px]">
            Choose a new password for your account.
          </p>

          {done ? (
            <Alert className="bg-primary/10 border-primary/25">
              <AlertDescription>
                Password updated. Redirecting to your dashboard…
              </AlertDescription>
            </Alert>
          ) : noSession && !ready ? (
            <Alert className="bg-destructive/10 border-destructive/25 text-destructive">
              <AlertDescription className="text-destructive">
                This reset link is invalid or has expired. Request a new one
                from the sign-in page.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={onSubmit}>
              <Label
                htmlFor="new-password"
                className="text-sm font-semibold text-card-foreground mb-[9px]"
              >
                New password
              </Label>
              <div className="relative mb-[22px]">
                <Input
                  id="new-password"
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`${fieldCls} pr-[54px]`}
                  disabled={!ready}
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

              <Label
                htmlFor="confirm-password"
                className="text-sm font-semibold text-card-foreground mb-[9px]"
              >
                Confirm new password
              </Label>
              <Input
                id="confirm-password"
                type={showPw ? "text" : "password"}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••••••"
                className={`${fieldCls} mb-[26px]`}
                disabled={!ready}
              />

              <Button
                type="submit"
                disabled={!ready || pending}
                className="w-full h-14 text-[16.5px] font-bold rounded-[13px]"
              >
                {pending
                  ? "Updating…"
                  : ready
                    ? "Update password"
                    : "Verifying link…"}
              </Button>

              {error && (
                <Alert className="mt-[18px] bg-destructive/10 border-destructive/25 text-destructive">
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
