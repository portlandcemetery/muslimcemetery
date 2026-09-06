"use client";

import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { SettingsSection } from "./settings-section";
import {
  createUser,
  deleteUser,
  updateUser,
  type UserActionState,
} from "@/lib/actions/users";
import type { Profile, UserRole } from "@/lib/types";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  operator: "Operator",
  viewer: "Viewer",
};

const AVATAR_COLORS = ["bg-primary", "bg-accent", "bg-chart-3", "bg-chart-4", "bg-chart-5"];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

function EditMemberDialog({
  member,
  isSelf,
  currentPlots,
}: {
  member: Profile;
  isSelf: boolean;
  currentPlots: string;
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(member.role);
  const [state, formAction, pending] = useActionState<UserActionState, FormData>(
    async (prev, formData) => {
      const result = await updateUser(member.id, prev, formData);
      if (result.success) {
        setOpen(false);
        toast.success(`${member.full_name || member.email} updated.`);
      }
      return result;
    },
    { error: null }
  );

  const needsPlots = role === "viewer";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setRole(member.role);
      }}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={`Edit ${member.full_name || member.email}`}
            className="flex-none text-muted-foreground/60 hover:text-primary transition-colors"
          />
        }
      >
        <Pencil size={16} strokeWidth={2} />
      </DialogTrigger>
      <DialogContent className="p-6 gap-0">
        <DialogHeader className="p-0 mb-4">
          <DialogTitle className="text-[17px] font-bold">
            Edit {member.full_name || member.email}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-3">
          <div>
            <Label className="text-[12.5px] font-semibold mb-1">Role</Label>
            <Select
              items={(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => ({
                value: r,
                label: ROLE_LABELS[r],
              }))}
              value={role}
              onValueChange={(v) => v && setRole(v as UserRole)}
              disabled={isSelf}
            >
              <SelectTrigger className="w-full data-[size=default]:h-[44px] rounded-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="role" value={role} />
            {isSelf && (
              <div className="mt-1 text-[12px] text-muted-foreground">
                You cannot change your own role.
              </div>
            )}
          </div>
          {needsPlots && (
            <div>
              <Label htmlFor={`edit-plots-${member.id}`} className="text-[12.5px] font-semibold mb-1">
                Linked plots (comma-separated, e.g. a-AA1, b-CB2)
              </Label>
              <Input
                id={`edit-plots-${member.id}`}
                name="plot_refs"
                defaultValue={currentPlots}
                placeholder="a-AA1, a-AA2"
                className="h-[44px] rounded-[10px]"
              />
            </div>
          )}
          {state.error && (
            <div className="text-[13.5px] font-semibold text-destructive">
              {state.error}
            </div>
          )}
          <Button type="submit" disabled={pending} className="h-[46px] rounded-[11px] font-bold mt-1">
            {pending ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TeamMembers({
  members,
  currentUserId,
  plotsByMember,
}: {
  members: Profile[];
  currentUserId: string;
  plotsByMember: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("operator");
  const [removing, startRemove] = useTransition();
  const [removeTarget, setRemoveTarget] = useState<Profile | null>(null);
  const [state, formAction, pending] = useActionState<UserActionState, FormData>(
    async (prev, formData) => {
      const result = await createUser(prev, formData);
      if (result.success) {
        setOpen(false);
        toast.success("Account created.");
      }
      return result;
    },
    { error: null }
  );

  const needsPlots = role === "viewer";

  return (
    <SettingsSection
      title="Team Members"
      description="Accounts are created here — there is no public sign-up."
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="h-auto py-[11px] px-[18px] text-sm font-semibold rounded-[11px]" />
            }
          >
            + Add Member
          </DialogTrigger>
          <DialogContent className="p-6 gap-0">
            <DialogHeader className="p-0 mb-4">
              <DialogTitle className="text-[17px] font-bold">
                Add Member
              </DialogTitle>
            </DialogHeader>
            <form action={formAction} className="flex flex-col gap-3">
              <div>
                <Label htmlFor="member-name" className="text-[12.5px] font-semibold mb-1">
                  Full Name
                </Label>
                <Input id="member-name" name="full_name" required className="h-[44px] rounded-[10px]" />
              </div>
              <div>
                <Label htmlFor="member-email" className="text-[12.5px] font-semibold mb-1">
                  Email
                </Label>
                <Input id="member-email" name="email" type="email" required className="h-[44px] rounded-[10px]" />
              </div>
              <div>
                <Label htmlFor="member-password" className="text-[12.5px] font-semibold mb-1">
                  Password (share it with them directly)
                </Label>
                <Input
                  id="member-password"
                  name="password"
                  type="text"
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="h-[44px] rounded-[10px]"
                />
              </div>
              <div>
                <Label className="text-[12.5px] font-semibold mb-1">Role</Label>
                <Select
                  items={(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => ({
                    value: r,
                    label: ROLE_LABELS[r],
                  }))}
                  value={role}
                  onValueChange={(v) => v && setRole(v as UserRole)}
                >
                  <SelectTrigger className="w-full data-[size=default]:h-[44px] rounded-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="role" value={role} />
              </div>
              {needsPlots && (
                <div>
                  <Label htmlFor="member-plots" className="text-[12.5px] font-semibold mb-1">
                    Linked plots (comma-separated, e.g. a-AA1, b-CB2)
                  </Label>
                  <Input
                    id="member-plots"
                    name="plot_refs"
                    placeholder="a-AA1, a-AA2"
                    className="h-[44px] rounded-[10px]"
                  />
                </div>
              )}
              {state.error && (
                <div className="text-[13.5px] font-semibold text-destructive">
                  {state.error}
                </div>
              )}
              <Button type="submit" disabled={pending} className="h-[46px] rounded-[11px] font-bold mt-1">
                {pending ? "Creating…" : "Create Account"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <ConfirmDialog
        open={removeTarget !== null}
        onOpenChange={(next) => {
          if (!next) setRemoveTarget(null);
        }}
        title={`Remove ${removeTarget?.full_name || removeTarget?.email || "member"}?`}
        description="They will no longer be able to sign in. Their plot links are removed as well. This cannot be undone."
        confirmLabel="Remove Member"
        pending={removing}
        onConfirm={() => {
          const target = removeTarget;
          if (!target) return;
          startRemove(async () => {
            const res = await deleteUser(target.id);
            if (res.error) {
              toast.error(res.error);
            } else {
              toast.success(`${target.full_name || target.email} removed.`);
            }
            setRemoveTarget(null);
          });
        }}
      />
      {members.map((m, i) => (
        <div
          key={m.id}
          className="flex flex-wrap items-center gap-x-[14px] gap-y-1 py-[14px] border-t border-border"
        >
          <Avatar className="size-[42px]">
            <AvatarFallback
              className={`${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-white font-bold text-[15px]`}
            >
              {initials(m.full_name || m.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-foreground">
              {m.full_name || m.email}
              {m.id === currentUserId && (
                <span className="ml-2 text-[12px] font-semibold text-muted-foreground">
                  (you)
                </span>
              )}
            </div>
            <div className="text-[13px] text-muted-foreground/90">{m.email}</div>
          </div>
          <span className="py-[5px] px-3 rounded-full bg-primary/10 text-primary text-[12.5px] font-bold flex-none">
            {ROLE_LABELS[m.role]}
          </span>
          <EditMemberDialog
            member={m}
            isSelf={m.id === currentUserId}
            currentPlots={plotsByMember[m.id] ?? ""}
          />
          {m.id !== currentUserId && (
            <button
              type="button"
              disabled={removing}
              onClick={() => setRemoveTarget(m)}
              aria-label={`Remove ${m.full_name || m.email}`}
              className="flex-none text-muted-foreground/60 hover:text-destructive transition-colors disabled:opacity-40"
            >
              <Trash2 size={17} strokeWidth={2} />
            </button>
          )}
        </div>
      ))}
    </SettingsSection>
  );
}
