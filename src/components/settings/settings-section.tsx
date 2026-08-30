import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type SettingsSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function SettingsSection({
  title,
  description,
  action,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <Card className="border-border rounded-[18px] px-5 sm:px-8 py-[30px] gap-0">
      <div
        className={
          action
            ? "flex flex-wrap items-center justify-between gap-4 mb-[22px]"
            : description
              ? "mb-[22px]"
              : "mb-[22px]"
        }
      >
        <div>
          <h2 className="font-extrabold text-xl">{title}</h2>
          {description && (
            <p className="text-[13.5px] text-muted-foreground/90 mt-1">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}
