export function PaymentSchedule() {
  return (
    <div className="bg-primary-foreground border border-border rounded-[14px] py-5 px-[22px] mb-[30px]">
      <div className="font-bold text-[15px] mb-4">Payment Schedule</div>
      <div className="flex justify-between text-[15px] mb-3">
        <span className="text-muted-foreground">Total Plot Value</span>
        <span className="font-bold text-foreground">$2,500.00</span>
      </div>
      <div className="flex justify-between text-[15px] mb-3">
        <span className="text-muted-foreground">Amount Received</span>
        <span className="font-bold text-yellow-700">$1,250.00</span>
      </div>
      <div className="h-px bg-border my-[14px]" />
      <div className="flex justify-between text-[15px]">
        <span className="text-muted-foreground">Outstanding Balance</span>
        <span className="font-extrabold text-orange-800">$1,250.00</span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-border overflow-hidden">
        <span className="block h-full w-1/2 bg-yellow-700" />
      </div>
      <div className="mt-[9px] text-[12.5px] text-muted-foreground/90">
        50% received · next installment due Jan 2026
      </div>
    </div>
  );
}
