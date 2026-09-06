import type { PlotRow } from "@/lib/types";
import { SectionHeading } from "./section-heading";
import { Field } from "./field";

export function DeceasedInfo({
  plot,
  readOnly,
}: {
  plot: PlotRow;
  readOnly: boolean;
}) {
  return (
    <>
      <SectionHeading title="Deceased Information" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px] mb-[34px]">
        <Field
          id="deceased_name"
          label="Deceased Name"
          defaultValue={plot.deceased_name ?? ""}
          readOnly={readOnly}
        />
        <Field
          id="date_of_birth"
          label="Date of Birth"
          type="date"
          defaultValue={plot.date_of_birth ?? ""}
          readOnly={readOnly}
        />
        <Field
          id="date_of_death"
          label="Date of Death"
          type="date"
          defaultValue={plot.date_of_death ?? ""}
          readOnly={readOnly}
        />
        <Field
          id="burial_date"
          label="Date of Burial"
          type="date"
          defaultValue={plot.burial_date ?? ""}
          readOnly={readOnly}
        />
        <Field
          id="id_tag_number"
          label="ID Tag Number"
          defaultValue={plot.id_tag_number ?? ""}
          readOnly={readOnly}
        />
        <Field
          id="case_number"
          label="Case Number"
          defaultValue={plot.case_number ?? ""}
          readOnly={readOnly}
        />
        <Field
          id="county_of_death"
          label="County of Death"
          defaultValue={plot.county_of_death ?? ""}
          readOnly={readOnly}
        />
      </div>
    </>
  );
}
