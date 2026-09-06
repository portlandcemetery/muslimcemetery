"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";
import { PlotHeader } from "./plot-header";
import { DeceasedInfo } from "./deceased-info";
import { ReservationPurchaser } from "./reservation-purchaser";
import { PlotStatusSelect } from "./plot-status-select";
import { PaymentSchedule } from "./payment-schedule";
import { AttachedDocuments } from "./attached-documents";
import { PlotNotes } from "./plot-notes";
import { PlotFooter } from "./plot-footer";
import { SectionHeading } from "./section-heading";
import { Field } from "./field";
import { savePlot, type SavePlotState } from "@/lib/actions/plots";
import {
  isStaff,
  type Payment,
  type PlotDocument,
  type PlotRow,
  type UserRole,
} from "@/lib/types";
import type { PlotStatus } from "./plot-status-data";

export function PlotDetailForm({
  plot,
  gardenName,
  gardenArabic,
  payments,
  documents,
  role,
}: {
  plot: PlotRow;
  gardenName: string;
  gardenArabic: string;
  payments: Payment[];
  documents: PlotDocument[];
  role: UserRole;
}) {
  const readOnly = !isStaff(role);
  const plotSlug = `${plot.garden_id}-${plot.ref}`;
  const [status, setStatus] = useState<PlotStatus>(plot.status);
  const [, formAction, pending] = useActionState<SavePlotState, FormData>(
    async (prev, formData) => {
      const result = await savePlot(plot.id, plot.garden_id, plot.ref, prev, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Changes saved and recorded to the audit log.");
      }
      return result;
    },
    { error: null, savedAt: null }
  );

  return (
    <form action={formAction} className="flex min-h-full flex-col">
      <input type="hidden" name="status" value={status} />
      <div className="flex-1 px-5 sm:px-8 lg:px-[44px] pt-6 sm:pt-8 pb-10">
        <PlotHeader
          plotRef={plot.ref}
          gardenId={plot.garden_id}
          gardenName={gardenName}
          gardenArabic={gardenArabic}
          status={status}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] bg-card border border-border rounded-[20px] overflow-hidden">
          <div className="py-[34px] px-5 sm:px-[38px] lg:border-r border-muted">
            <DeceasedInfo plot={plot} readOnly={readOnly} />
            <ReservationPurchaser plot={plot} readOnly={readOnly} />
          </div>

          <div className="py-[34px] px-5 sm:px-[34px]">
            <SectionHeading title="Plot Status & Payment" />
            {readOnly ? null : (
              <PlotStatusSelect
                value={status}
                onChange={setStatus}
                isAdmin={role === "admin"}
              />
            )}
            {!readOnly && (
              <div className="mb-[22px]">
                <Field
                  id="price"
                  label="Total Plot Value ($)"
                  type="number"
                  defaultValue={plot.price > 0 ? String(plot.price) : ""}
                />
              </div>
            )}
            <PaymentSchedule
              plotId={plot.id}
              plotSlug={plotSlug}
              price={Number(plot.price)}
              payments={payments}
              canEdit={!readOnly}
            />
            <AttachedDocuments
              plotId={plot.id}
              documents={documents}
              readOnly={readOnly}
            />
            <PlotNotes defaultValue={plot.notes ?? ""} readOnly={readOnly} />
            <div className="mt-[22px]">
              <Field
                id="general_note"
                label="General Note"
                defaultValue={plot.general_note ?? ""}
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>
      </div>

      {!readOnly && <PlotFooter pending={pending} />}
    </form>
  );
}
