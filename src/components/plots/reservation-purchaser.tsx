import type { PlotRow } from "@/lib/types";
import { SectionHeading } from "./section-heading";
import { Field } from "./field";

export function ReservationPurchaser({
  plot,
  readOnly,
}: {
  plot: PlotRow;
  readOnly: boolean;
}) {
  return (
    <>
      <SectionHeading title="Reservation & Purchaser" />
      <div className="mb-[22px]">
        <Field
          id="reservation_holder"
          label="Reservation Holder Name"
          defaultValue={plot.reservation_holder ?? ""}
          readOnly={readOnly}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px]">
        <Field
          id="purchaser_name"
          label="Purchaser Name"
          defaultValue={plot.purchaser_name ?? ""}
          readOnly={readOnly}
        />
        <Field
          id="purchaser_phone"
          label="Phone Number"
          defaultValue={plot.purchaser_phone ?? ""}
          readOnly={readOnly}
        />
        <Field
          id="purchaser_email"
          label="Email Address"
          defaultValue={plot.purchaser_email ?? ""}
          readOnly={readOnly}
        />
        <Field
          id="purchaser_address"
          label="Address"
          defaultValue={plot.purchaser_address ?? ""}
          readOnly={readOnly}
        />
      </div>
    </>
  );
}
