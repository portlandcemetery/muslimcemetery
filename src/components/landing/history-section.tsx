import { Diamond } from "@/components/diamond";

const PARAS = [
  "For years, Portland had no all-Muslim cemetery. Many families had no choice but to bury their loved ones in public cemeteries that did not conform to Islamic burial law — often at prohibitive cost, and without control of the grounds.",
  "Faced with these difficulties, the Islamic Center of Portland set out to build an all-Muslim cemetery that would fully comply with Islamic burial law — for Sunni and Shia alike — and remain affordable to all. In 2011, Alhamdulillah, we located 5.5 acres about fifteen minutes from downtown, along Highway 30 (St. Helens Road).",
  "After a tremendous effort to secure permits from Multnomah County and the Oregon Board of Mortuary, we took ownership of the property in February 2015. By the grace of God, we continue to improve the grounds every day.",
];

export function HistorySection() {
  return (
    <section id="about" className="scroll-mt-[100px] bg-background">
      <div className="max-w-[1120px] mx-auto py-[88px] px-9 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <div className="flex items-center gap-[14px] mb-[18px]">
            <Diamond size={18} className="text-accent" />
            <span className="text-[12.5px] font-bold tracking-[0.16em] uppercase text-accent">
              Our history
            </span>
          </div>
          <h2 className="font-extrabold text-[34px] md:text-[40px] tracking-[-0.02em] leading-[1.1] mb-6">
            From Allah we come, to Him we return
          </h2>
          <div className="flex flex-col gap-4">
            {PARAS.map((p, i) => (
              <p key={i} className="text-[16.5px] leading-[1.7] text-foreground/75">
                {p}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] overflow-hidden border border-border shadow-[0_30px_60px_-42px_rgba(31,91,69,.45)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/cemetery-2.jpg"
            alt="The grounds of the Muslim Cemetery of Portland"
            className="w-full h-full object-cover aspect-[4/3]"
          />
        </div>
      </div>
    </section>
  );
}
