import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SettingsSection } from "./settings-section";

const FIELDS = [
  { id: "org-name", label: "Organization Name", value: "Islamic Center of Portland" },
  { id: "cemetery-name", label: "Cemetery Name", value: "Memorial Gardens" },
  { id: "contact-email", label: "Contact Email", value: "gardens@icportland.org" },
  { id: "phone", label: "Phone", value: "+1 (503) 555-0142" },
];

export function OrganizationProfile() {
  return (
    <SettingsSection
      title="Organization Profile"
      description="Details shown on records, receipts, and exports."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FIELDS.map((f) => (
          <div key={f.id}>
            <Label
              htmlFor={f.id}
              className="text-[13.5px] font-semibold text-foreground/85 mb-2"
            >
              {f.label}
            </Label>
            <Input
              id={f.id}
              defaultValue={f.value}
              className="h-12 px-[15px] text-[15px] bg-card rounded-[11px]"
            />
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}
