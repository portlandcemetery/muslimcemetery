export function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <h1 className="font-extrabold text-[38px] tracking-[-0.02em] mb-[6px]">
        {title}
      </h1>
      <p className="text-[15.5px] text-muted-foreground">
        This section is coming soon.
      </p>
    </div>
  );
}
