"use client";

import { useState } from "react";
import { PlotHeader } from "./plot-header";
import { DeceasedInfo } from "./deceased-info";
import { ReservationPurchaser } from "./reservation-purchaser";
import { PlotStatusSelect } from "./plot-status-select";
import { PaymentSchedule } from "./payment-schedule";
import { AttachedDocuments } from "./attached-documents";
import { PlotNotes } from "./plot-notes";
import { PlotFooter } from "./plot-footer";
import { SectionHeading } from "./section-heading";
import type { PlotDetailStatus } from "./plot-status-data";

export function PlotDetailForm({ plotId }: { plotId: string }) {
  const [status, setStatus] = useState<PlotDetailStatus>("partial");
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 px-5 sm:px-8 lg:px-[44px] pt-6 sm:pt-8 pb-10">
        <PlotHeader plotId={plotId} status={status} />

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] bg-card border border-border rounded-[20px] overflow-hidden">
          <div className="py-[34px] px-5 sm:px-[38px] lg:border-r border-muted">
            <DeceasedInfo />
            <ReservationPurchaser />
          </div>

          <div className="py-[34px] px-5 sm:px-[34px]">
            <SectionHeading title="Plot Status & Payment" />
            <PlotStatusSelect
              value={status}
              onChange={(s) => {
                setStatus(s);
                setSaved(false);
              }}
            />
            <PaymentSchedule />
            <AttachedDocuments />
            <PlotNotes />
          </div>
        </div>
      </div>

      <PlotFooter saved={saved} onSave={() => setSaved(true)} />
    </div>
  );
}
