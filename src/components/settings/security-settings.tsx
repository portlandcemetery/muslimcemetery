"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsSection } from "./settings-section";

type ToggleKey = "twoFA" | "ipLock" | "alerts";

const TOGGLES: { key: ToggleKey; title: string; desc: string }[] = [
  { key: "twoFA", title: "Two-factor authentication", desc: "Require a verification code at every sign-in." },
  { key: "ipLock", title: "Restrict to office network", desc: "Only allow the portal from approved IP addresses." },
  { key: "alerts", title: "Email alerts on sensitive changes", desc: "Notify admins when a burial or deed is edited." },
];

function Row({
  title,
  desc,
  control,
}: {
  title: string;
  desc: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-4 border-t border-border">
      <div className="flex-1">
        <div className="text-[15px] font-bold text-foreground">{title}</div>
        <div className="text-[13px] text-muted-foreground/90">{desc}</div>
      </div>
      {control}
    </div>
  );
}

export function SecuritySettings() {
  const [state, setState] = useState<Record<ToggleKey, boolean>>({
    twoFA: true,
    ipLock: false,
    alerts: true,
  });

  return (
    <SettingsSection title="Security">
      {TOGGLES.map((t) => (
        <Row
          key={t.key}
          title={t.title}
          desc={t.desc}
          control={
            <Switch
              checked={state[t.key]}
              onCheckedChange={(checked) =>
                setState((s) => ({ ...s, [t.key]: checked }))
              }
              className="h-[26px] w-[46px]"
            />
          }
        />
      ))}
      <Row
        title="Session timeout"
        desc="Automatically sign out inactive operators."
        control={
          <Select
            defaultValue="30m"
            items={[
              { value: "30m", label: "After 30 minutes" },
              { value: "1h", label: "After 1 hour" },
              { value: "4h", label: "After 4 hours" },
            ]}
          >
            <SelectTrigger className="data-[size=default]:h-11 rounded-[10px] bg-card text-[14.5px] text-card-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30m">After 30 minutes</SelectItem>
              <SelectItem value="1h">After 1 hour</SelectItem>
              <SelectItem value="4h">After 4 hours</SelectItem>
            </SelectContent>
          </Select>
        }
      />
    </SettingsSection>
  );
}
