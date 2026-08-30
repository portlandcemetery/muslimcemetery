import { SectionHeading } from "./section-heading";
import { Field } from "./field";

export function DeceasedInfo() {
  return (
    <>
      <SectionHeading title="Deceased Information" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px] mb-[34px]">
        <Field id="deceased-name" label="Deceased Name" defaultValue="Ahmad Hassan" required />
        <Field id="dob" label="Date of Birth" defaultValue="May 12, 1948" />
        <Field id="dod" label="Date of Death" defaultValue="October 14, 2024" />
        <Field id="burial-date" label="Date of Burial" defaultValue="October 15, 2024" />
      </div>
    </>
  );
}
