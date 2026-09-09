"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "./settings-section";
import { useTRPC } from "@/services/trpc/client";
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
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const save = useMutation(
    trpc.organization.save.mutationOptions({
      onSuccess: () => {
        toast.success("Organization profile saved.");
        queryClient.invalidateQueries();
      },
      onError: (e) => toast.error(e.message),
    })
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        save.mutate({
          org_name: String(fd.get("org_name") ?? ""),
          cemetery_name: String(fd.get("cemetery_name") ?? ""),
          contact_email: String(fd.get("contact_email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
        });
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
            disabled={save.isPending}
            className="h-auto py-[13px] px-7 rounded-xl text-[15px] font-bold hover:bg-primary/90"
          >
            {save.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </SettingsSection>
    </form>
  );
}
