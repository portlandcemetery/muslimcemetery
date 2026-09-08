"use client";

import { startTransition, useActionState, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
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
import { addPayment, deletePayment, type PaymentActionState } from "@/lib/actions/payments";
import type { Payment } from "@/lib/types";

const METHODS = ["Cash", "Check", "Card", "Other"];

const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function PaymentsDialog({
  plotId,
  plotSlug,
  price,
  payments,
  canEdit,
  children,
}: {
  plotId: string;
  plotSlug: string;
  price: number;
  payments: Payment[];
  canEdit: boolean;
  children: React.ReactNode;
}) {
  const [method, setMethod] = useState("Cash");
  const [deleting, startDelete] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const addFormRef = useRef<HTMLFormElement>(null);
  const [addState, addAction, adding] = useActionState<PaymentActionState, FormData>(
    async (prev, formData) => {
      const result = await addPayment(plotId, plotSlug, prev, formData);
      if (!result.error) {
        toast.success("Payment recorded.");
        addFormRef.current?.reset();
      }
      return result;
    },
    { error: null }
  );

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const outstanding = price - totalPaid;
  const overpaid = totalPaid - price;
  // Local date, not UTC — evening entries must not prefill tomorrow
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <Dialog>
      <DialogTrigger nativeButton={false} render={<span className="contents" />}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-y-auto p-6 gap-0">
        <DialogHeader className="p-0 mb-4">
          <DialogTitle className="text-[17px] font-bold">
            Payment Record
          </DialogTitle>
        </DialogHeader>

        {payments.length === 0 ? (
          <div className="text-[14px] text-muted-foreground bg-secondary/60 rounded-[11px] py-4 px-4 mb-4">
            No payments recorded yet.
          </div>
        ) : (
          <div className="flex flex-col gap-[6px] mb-4">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-white/50 border border-border rounded-[11px] py-[10px] px-[14px]"
              >
                <span className="text-[14px] font-semibold text-card-foreground w-[110px] flex-none">
                  {fmtDate(p.paid_at)}
                </span>
                <span className="text-[14.5px] font-bold text-foreground flex-none">
                  {fmtMoney(Number(p.amount))}
                </span>
                <span className="flex-1 min-w-0 truncate text-[12.5px] text-muted-foreground/80">
                  {[p.method, p.reference_no].filter(Boolean).join(" · ")}
                </span>
                {canEdit && (
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={() => setDeleteTarget(p)}
                    aria-label="Delete payment"
                    className="flex-none text-muted-foreground/60 hover:text-destructive transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {addState.error && (
          <div className="mb-4 text-[13.5px] font-semibold text-destructive">
            {addState.error}
          </div>
        )}

        <ConfirmDialog
          open={deleteTarget !== null}
          onOpenChange={(next) => {
            if (!next) setDeleteTarget(null);
          }}
          title="Delete this payment?"
          description={
            deleteTarget
              ? `${fmtMoney(Number(deleteTarget.amount))} paid on ${fmtDate(deleteTarget.paid_at)} will be removed from the ledger. This cannot be undone.`
              : ""
          }
          confirmLabel="Delete Payment"
          pending={deleting}
          onConfirm={() => {
            const target = deleteTarget;
            if (!target) return;
            startDelete(async () => {
              const res = await deletePayment(target.id, plotSlug);
              if (res.error) {
                toast.error(res.error);
              } else {
                toast.success("Payment deleted.");
              }
              setDeleteTarget(null);
            });
          }}
        />

        {canEdit && (
          <form
            ref={addFormRef}
            // Manual dispatch: keeps typed input when the action returns an error
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              startTransition(() => addAction(formData));
            }}
            className="border-t border-border pt-4 mb-4"
          >
            <div className="text-[13.5px] font-bold mb-3">Add Payment</div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label htmlFor="pay-date" className="text-[12.5px] font-semibold text-foreground/85 mb-1">
                  Date
                </Label>
                <Input
                  id="pay-date"
                  name="paid_at"
                  type="date"
                  required
                  defaultValue={today}
                  className="h-[44px] rounded-[10px] bg-white/50"
                />
              </div>
              <div>
                <Label htmlFor="pay-amount" className="text-[12.5px] font-semibold text-foreground/85 mb-1">
                  Amount ($)
                </Label>
                <Input
                  id="pay-amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="300.00"
                  className="h-[44px] rounded-[10px] bg-white/50"
                />
              </div>
              <div>
                <Label className="text-[12.5px] font-semibold text-foreground/85 mb-1">
                  Method
                </Label>
                <Select
                  items={METHODS.map((m) => ({ value: m, label: m }))}
                  value={method}
                  onValueChange={(v) => v && setMethod(v)}
                >
                  <SelectTrigger className="w-full data-[size=default]:h-[44px] rounded-[10px] bg-white/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METHODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="method" value={method} />
              </div>
              <div>
                <Label htmlFor="pay-ref" className="text-[12.5px] font-semibold text-foreground/85 mb-1">
                  Reference # (optional)
                </Label>
                <Input
                  id="pay-ref"
                  name="reference_no"
                  placeholder="Check no., receipt…"
                  className="h-[44px] rounded-[10px] bg-white/50"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={adding}
              className="w-full h-[46px] rounded-[11px] font-bold"
            >
              {adding ? "Recording…" : "Record Payment"}
            </Button>
          </form>
        )}

        <div className="border-t border-border pt-4 text-[14.5px]">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Total Plot Value</span>
            <span className="font-bold">
              {price > 0 ? fmtMoney(price) : "Not set"}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Amount Received</span>
            <span className="font-bold text-yellow-700">{fmtMoney(totalPaid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Outstanding Balance</span>
            <span className="font-extrabold text-orange-800">
              {price > 0 ? fmtMoney(Math.max(0, outstanding)) : "—"}
            </span>
          </div>
          {overpaid > 0.005 && price > 0 && (
            <div className="flex justify-between mt-2">
              <span className="text-muted-foreground">Overpaid (credit)</span>
              <span className="font-extrabold text-cyan-700">
                {fmtMoney(overpaid)}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
