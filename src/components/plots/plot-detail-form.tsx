"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/services/trpc/client";
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
import {
  isStaff,
  type Payment,
  type PlotDocument,
  type PlotRow,
  type UserRole,
} from "@/lib/types";
import type { PlotStatus } from "./plot-status-data";

const FIELDS = [
  "deceased_name",
  "date_of_birth",
  "date_of_death",
  "burial_date",
  "id_tag_number",
  "case_number",
  "county_of_death",
  "reservation_holder",
  "purchaser_name",
  "purchaser_phone",
  "purchaser_email",
  "purchaser_address",
  "notes",
  "general_note",
] as const;

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
  const [status, setStatus] = useState<PlotStatus>(plot.status);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const save = useMutation(
    trpc.plots.save.mutationOptions({
      onSuccess: () => {
        toast.success("Changes saved and recorded to the audit log.");
        queryClient.invalidateQueries();
      },
      onError: (e) => toast.error(e.message),
    })
  );

  return (
    <form
      // Manual dispatch instead of the action prop: keeps typed input intact
      // when a save fails (React 19 resets uncontrolled fields on form actions).
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const priceRaw = String(fd.get("price") ?? "").replace(/[$,]/g, "");
        const price = priceRaw === "" ? 0 : Number(priceRaw);
        if (!Number.isFinite(price) || price < 0 || price > 99_999_999) {
          toast.error("Total plot value must be a valid amount.");
          return;
        }
        const values = Object.fromEntries(
          FIELDS.map((k) => [k, String(fd.get(k) ?? "")])
        );
        save.mutate({
          gardenId: plot.garden_id,
          ref: plot.ref,
          status,
          price,
          ...values,
        });
      }}
      className="flex min-h-full flex-col"
    >
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
              gardenId={plot.garden_id}
              plotRef={plot.ref}
              price={Number(plot.price)}
              payments={payments}
              canEdit={!readOnly}
            />
            <AttachedDocuments documents={documents} readOnly={readOnly} />
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

      {!readOnly && <PlotFooter pending={save.isPending} />}
    </form>
  );
}
