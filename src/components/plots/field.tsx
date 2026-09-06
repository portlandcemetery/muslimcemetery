import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function Field({
  id,
  name,
  label,
  defaultValue,
  type = "text",
  required = false,
  readOnly = false,
}: {
  id: string;
  name?: string;
  label: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="text-[13.5px] font-semibold text-foreground/85 mb-2"
      >
        {label}
        {required && <span className="text-orange-800">*</span>}
      </Label>
      <Input
        id={id}
        name={name ?? id}
        type={type}
        defaultValue={defaultValue}
        readOnly={readOnly}
        className="h-[50px] px-[15px] text-[15.5px] bg-white/50 rounded-[11px] read-only:opacity-70"
      />
    </div>
  );
}
