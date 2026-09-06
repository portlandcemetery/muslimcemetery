"use client";

import { Button } from "@/components/ui/button";
import type { Payment } from "@/lib/types";
import { PaymentsDialog } from "./payments-dialog";

const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function PaymentSchedule({
  plotId,
  plotSlug,
  price,
  payments,
  canEdit,
}: {
  plotId: string;
  plotSlug: string;
  price: number;
  payments: Payment[];
  canEdit: boolean;
}) {
  // Summary is always derived from the ledger — mirrors the DB view, never stored
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const outstanding = Math.max(0, price - totalPaid);
  const pct = price > 0 ? Math.min(100, Math.round((totalPaid / price) * 100)) : 0;

  return (
    <div className="bg-primary-foreground border border-border rounded-[14px] py-5 px-[22px] mb-[30px]">
      <div className="font-bold text-[15px] mb-4">Payment Schedule</div>
      <div className="flex justify-between text-[15px] mb-3">
        <span className="text-muted-foreground">Total Plot Value</span>
        <span className="font-bold text-foreground">
          {price > 0 ? fmtMoney(price) : "Not set"}
        </span>
      </div>
      <div className="flex justify-between text-[15px] mb-3">
        <span className="text-muted-foreground">Amount Received</span>
        <span className="font-bold text-yellow-700">{fmtMoney(totalPaid)}</span>
      </div>
      <div className="h-px bg-border my-[14px]" />
      <div className="flex justify-between text-[15px]">
        <span className="text-muted-foreground">Outstanding Balance</span>
        <span className="font-extrabold text-orange-800">
          {price > 0 ? fmtMoney(outstanding) : "—"}
        </span>
      </div>
      {price > 0 && (
        <>
          <div className="mt-4 h-2 rounded-full bg-border overflow-hidden">
            <span
              className="block h-full bg-yellow-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-[9px] text-[12.5px] text-muted-foreground/90">
            {pct}% received · {payments.length}{" "}
            {payments.length === 1 ? "payment" : "payments"} recorded
          </div>
        </>
      )}
      <PaymentsDialog
        plotId={plotId}
        plotSlug={plotSlug}
        price={price}
        payments={payments}
        canEdit={canEdit}
      >
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full h-auto py-[11px] bg-card border-input rounded-[11px] text-[14px] font-semibold"
        >
          {canEdit ? "View / Add Payments" : "View Payments"}
        </Button>
      </PaymentsDialog>
    </div>
  );
}
