"use client";

import { startTransition, useActionState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "./settings-section";
import {
  saveOrganizationSettings,
  type OrgSettingsState,
} from "@/lib/actions/organization";
import type { OrganizationSettings } from "@/lib/types";

const FIELDS = [
  { name: "org_name", label: "Organization Name", type: "text" },
  { name: "cemetery_name", label: "Cemetery Name", type: "text" },
  { name: "contact_email", label: "Contact Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
] as const;

export function OrganizationProfileForm({
  settings,
}: {
  settings: OrganizationSettings;
}) {
  const [, formAction, pending] = useActionState<OrgSettingsState, FormData>(
    async (prev, formData) => {
      const result = await saveOrganizationSettings(prev, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Organization profile saved.");
      }
      return result;
    },
    { error: null, savedAt: null }
  );

  return (
    <form
      // Manual dispatch: React 19 resets uncontrolled fields after a form
      // action even on error — this keeps typed input intact when a save fails.
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => formAction(formData));
      }}
    >
      <SettingsSection
        title="Organization Profile"
        description="Details shown on records, receipts, and exports."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FIELDS.map((f) => (
            <div key={f.name}>
              <Label
                htmlFor={f.name}
                className="text-[13.5px] font-semibold text-foreground/85 mb-2"
              >
                {f.label}
              </Label>
              <Input
                id={f.name}
                name={f.name}
                type={f.type}
                defaultValue={settings[f.name]}
                className="h-12 px-[15px] text-[15px] bg-card rounded-[11px]"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-[22px]">
          <Button
            type="submit"
            disabled={pending}
            className="h-auto py-[13px] px-7 rounded-xl text-[15px] font-bold hover:bg-primary/90"
          >
            {pending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </SettingsSection>
    </form>
  );
}
