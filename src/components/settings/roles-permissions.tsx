import { Check as CheckIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SettingsSection } from "./settings-section";

type Role = {
  name: string;
  desc: string;
  view: boolean;
  edit: boolean;
  burial: boolean;
  export: boolean;
  admin: boolean;
};

const ROLES: Role[] = [
  { name: "Administrator", desc: "Full control, including settings and roles", view: true, edit: true, burial: true, export: true, admin: true },
  { name: "Operator", desc: "Manage plots, reservations, and burials", view: true, edit: true, burial: true, export: true, admin: false },
  { name: "Family Representative", desc: "View assigned plots and make payments", view: true, edit: false, burial: false, export: false, admin: false },
  { name: "Viewer / Auditor", desc: "Read-only access to records and logs", view: true, edit: false, burial: false, export: false, admin: false },
];

const COLS = ["view", "edit", "burial", "export", "admin"] as const;
const HEADS = ["View", "Edit", "Burial", "Export", "Admin"];

function Check() {
  return <CheckIcon size={20} strokeWidth={2.4} className="text-primary" />;
}

function Dash() {
  return <span className="block w-4 h-[2px] rounded-[2px] bg-muted-foreground/40" />;
}

export function RolesPermissions() {
  return (
    <SettingsSection
      title="Roles & Permissions"
      description="What each role is allowed to do across the system."
    >
      <div className="border border-border rounded-[14px] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary border-0">
              <TableHead className="h-auto py-3 px-[18px] text-[12.5px] font-bold tracking-[0.04em] uppercase text-muted-foreground/90">
                Role
              </TableHead>
              {HEADS.map((h) => (
                <TableHead
                  key={h}
                  className="h-auto py-3 px-[18px] text-center text-[12.5px] font-bold tracking-[0.04em] uppercase text-muted-foreground/90"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROLES.map((r) => (
              <TableRow key={r.name} className="border-t border-border hover:bg-transparent">
                <TableCell className="py-[15px] px-[18px] align-middle">
                  <div className="text-[15px] font-bold text-foreground">
                    {r.name}
                  </div>
                  <div className="text-[12.5px] text-muted-foreground/90">
                    {r.desc}
                  </div>
                </TableCell>
                {COLS.map((c) => (
                  <TableCell key={c} className="py-[15px] px-[18px]">
                    <div className="flex justify-center">
                      {r[c] ? <Check /> : <Dash />}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SettingsSection>
  );
}
