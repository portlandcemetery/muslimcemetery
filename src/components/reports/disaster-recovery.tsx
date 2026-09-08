"use client";

import { useState } from "react";
import { Check as CheckIcon, Download, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INCLUDED = [
  { title: "Per-garden plot registries", desc: "One organized folder per garden, every plot as a readable record." },
  { title: "Full plot registry (CSV + JSON)", desc: "Deceased, purchaser, dates, status, and payment fields." },
  { title: "Attached documents", desc: "Burial permits, deeds, and signed transfers, filed by plot." },
  { title: "Payment ledger", desc: "Schedules, amounts received, and outstanding balances." },
  { title: "Audit log", desc: "Every change and sign-in, with operator and timestamp." },
];

const FORMATS = [
  { key: "folders", title: "Organized folders", desc: "Human-readable folder tree, one per garden" },
  { key: "zip", title: "Single ZIP archive", desc: "Everything compressed into one download" },
  { key: "pdf", title: "PDF summary book", desc: "Printable bound register of all records" },
];

function Check({ className }: { className?: string }) {
  return <CheckIcon size={18} strokeWidth={2.2} className={className} />;
}

export function DisasterRecovery() {
  const [format, setFormat] = useState("folders");
  const [weekly, setWeekly] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  return (
    <Card className="border-primary/25 rounded-[20px] overflow-hidden p-0 gap-0 mb-[34px]">
      {/* banner */}
      <div className="bg-primary py-[22px] px-[30px] flex items-center gap-[14px]">
        <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center flex-none">
          <History size={22} strokeWidth={2} className="text-accent" />
        </div>
        <div>
          <div className="font-extrabold text-[21px] text-primary-foreground">
            Disaster Recovery &amp; Export
          </div>
          <div className="text-[13.5px] text-primary-foreground/70">
            Download the entire cemetery archive in a readable, organized structure.
          </div>
        </div>
      </div>

      {/* body */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="py-7 px-[30px] border-b md:border-b-0 md:border-r border-muted">
          <div className="text-[13px] font-bold tracking-[0.06em] uppercase text-muted-foreground/90 mb-4">
            Included in every backup
          </div>
          <div className="flex flex-col gap-[13px]">
            {INCLUDED.map((i) => (
              <div key={i.title} className="flex gap-3 items-start">
                <Check className="text-primary flex-none mt-[2px]" />
                <div>
                  <div className="text-[15px] font-semibold text-card-foreground">
                    {i.title}
                  </div>
                  <div className="text-[13px] text-muted-foreground/90">
                    {i.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-7 px-[30px]">
          <div className="text-[13px] font-bold tracking-[0.06em] uppercase text-muted-foreground/90 mb-3">
            Export format
          </div>
          <div className="flex flex-col gap-[9px] mb-[22px]">
            {FORMATS.map((f) => {
              const on = format === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFormat(f.key)}
                  className={`flex items-center gap-3 py-[13px] px-[15px] rounded-xl border-[1.5px] text-left transition-colors cursor-pointer ${
                    on ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <span
                    className={`w-[18px] h-[18px] rounded-full border-2 flex-none flex items-center justify-center ${
                      on ? "border-primary" : "border-muted-foreground/40"
                    }`}
                  >
                    {on && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[14.5px] font-semibold text-card-foreground">
                      {f.title}
                    </span>
                    <span className="block text-[12.5px] text-muted-foreground/90">
                      {f.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setDownloaded(true)}
            className="w-full p-[15px] bg-primary text-primary-foreground text-[15.5px] font-bold rounded-xl cursor-pointer flex items-center justify-center gap-[10px] transition-colors hover:bg-primary/90"
          >
            <Download size={19} strokeWidth={2} />
            Download Full Backup
          </button>

          {downloaded && (
            <div className="mt-3 py-[11px] px-[14px] bg-primary/10 border border-primary/25 rounded-[10px] text-[13.5px] text-primary flex gap-[9px] items-center">
              <Check className="text-primary flex-none" />
              Archive prepared — al-jannah-backup.zip
            </div>
          )}
        </div>
      </div>

      {/* schedule — hidden for now */}
      {false && (
      <div className="border-t border-muted py-[22px] px-[30px] flex items-center gap-5 flex-wrap bg-secondary">
        <div className="flex items-center gap-[14px] flex-1 min-w-[280px]">
          <Switch
            checked={weekly}
            onCheckedChange={setWeekly}
            aria-label="Toggle weekly backup"
            className="h-[26px] w-[46px]"
          />
          <div>
            <div className="text-[15px] font-bold text-foreground">
              Automatic weekly backup
            </div>
            <div className="text-[13px] text-muted-foreground/90">
              A full archive is generated and stored every week.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          <Select
            defaultValue="friday"
            items={[
              { value: "friday", label: "Every Friday" },
              { value: "sunday", label: "Every Sunday" },
              { value: "monday", label: "Every Monday" },
            ]}
          >
            <SelectTrigger className="data-[size=default]:h-11 rounded-[10px] bg-card text-[14.5px] text-card-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friday">Every Friday</SelectItem>
              <SelectItem value="sunday">Every Sunday</SelectItem>
              <SelectItem value="monday">Every Monday</SelectItem>
            </SelectContent>
          </Select>
          <Select
            defaultValue="2am"
            items={[
              { value: "2am", label: "02:00 AM" },
              { value: "6am", label: "06:00 AM" },
              { value: "11pm", label: "11:00 PM" },
            ]}
          >
            <SelectTrigger className="data-[size=default]:h-11 rounded-[10px] bg-card text-[14.5px] text-card-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2am">02:00 AM</SelectItem>
              <SelectItem value="6am">06:00 AM</SelectItem>
              <SelectItem value="11pm">11:00 PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-[13px] text-muted-foreground/90 w-full">
          Last backup:{" "}
          <span className="text-primary font-semibold">
            Friday, Aug 22 · 02:00 AM
          </span>{" "}
          · 214 MB
        </div>
      </div>
      )}
    </Card>
  );
}
