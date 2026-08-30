import { SectionHeading } from "./section-heading";
import { Field } from "./field";

export function ReservationPurchaser() {
  return (
    <>
      <SectionHeading title="Reservation & Purchaser" />
      <div className="mb-[22px]">
        <Field
          id="holder"
          label="Reservation Holder Name"
          defaultValue="Hassan Family Trust"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px]">
        <Field id="purchaser" label="Purchaser Name" defaultValue="Tariq Hassan" required />
        <Field id="phone" label="Phone Number" defaultValue="+1 (503) 555-0322" />
        <Field id="email" label="Email Address" defaultValue="tariq.h@hassanemail.com" />
        <Field
          id="address"
          label="Address"
          defaultValue="442 Crescent Ave, Portland, OR 97204"
        />
      </div>
    </>
  );
}
