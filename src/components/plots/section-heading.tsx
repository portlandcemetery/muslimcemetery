export function SectionHeading({
  title,
  small = false,
}: {
  title: string;
  small?: boolean;
}) {
  return (
    <>
      <h2
        className={`font-extrabold tracking-[-0.01em] mb-[6px] ${
          small ? "text-xl" : "text-[22px]"
        }`}
      >
        {title}
      </h2>
      <div className={`h-px bg-muted ${small ? "mb-[18px]" : "mb-6"}`} />
    </>
  );
}
