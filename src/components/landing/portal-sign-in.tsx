"use client";

import { useState } from "react";

export function PortalSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const inputCls =
    "w-full h-[54px] text-base text-foreground bg-field border border-input rounded-xl font-[inherit] placeholder:text-taupe-light focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/[0.14]";

  return (
    <div className="w-full max-w-[460px] bg-card border border-card-border border-t-[3px] border-t-primary rounded-[5px_5px_18px_18px] shadow-[0_26px_60px_-34px_rgba(34,39,31,.5)]">
      <div className="p-9">
        <label className="block text-sm font-semibold text-ink-strong mb-[9px]">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="operator@icportland.org"
          className={`${inputCls} px-4 mb-[22px]`}
        />

        <label className="block text-sm font-semibold text-ink-strong mb-[9px]">
          Password
        </label>
        <div className="relative mb-[26px]">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className={`${inputCls} pl-4 pr-[54px]`}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            aria-label="Toggle password visibility"
            className="absolute right-[9px] top-[9px] h-9 w-9 border-none bg-transparent text-taupe rounded-[9px] cursor-pointer flex items-center justify-center transition-colors hover:bg-secondary hover:text-slate"
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

        <button
          type="button"
          onClick={() => setSignedIn(true)}
          className="w-full h-14 bg-primary text-primary-foreground text-[16.5px] font-bold border-none rounded-[13px] cursor-pointer transition-colors hover:bg-primary-hover"
        >
          Sign In to Management
        </button>

        {signedIn && (
          <div className="mt-[18px] py-[13px] px-[15px] bg-success border border-success-border rounded-[11px] flex gap-[10px] items-start">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-none mt-px"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span className="text-sm text-primary leading-[1.5]">
              Credentials accepted. The management dashboard opens in the next
              build stage.
            </span>
          </div>
        )}

        <div className="mt-[22px] flex gap-[9px] items-center text-taupe justify-center">
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
            <a href="#contact" className="text-primary hover:text-primary-hover">
              Contact the office.
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
