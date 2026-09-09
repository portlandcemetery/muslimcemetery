import { Diamond } from "@/components/diamond";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Who should be contacted to arrange a burial at MCOP?",
    a: "The family of the deceased should contact Ali Houdroge at 503-646-5799. If there is no answer, call 503-998-2498.",
  },
  {
    q: "Do I have to fill out any papers at the cemetery?",
    a: "Yes. The responsible party fills out a form provided by MCOP. Families are also encouraged to write a short biography of the deceased for our records and for future generations.",
  },
  {
    q: "Where is the body washed?",
    a: "The body is washed and shrouded by MCOP volunteers at a funeral home of your choice, then transported to MCOP for burial. We have negotiated reduced Islamic-service rates with several local funeral homes.",
  },
  {
    q: "How is the body recovered from the hospital?",
    a: "Contact one of the listed funeral homes. Once the hospital releases the body, the funeral home — authorized by the family — recovers it and transports it to the funeral home.",
  },
  {
    q: "What is needed to prepare the body?",
    a: "MCOP provides the cloth needed for shrouding (kafan) and for washing the body.",
  },
  {
    q: "Who pays the funeral home?",
    a: "Paying all funeral-home charges is the sole responsibility of the deceased's family. Funeral homes normally expect to be paid in full on the day services are rendered.",
  },
  {
    q: "Where is the Salatul Janazah held?",
    a: "At the MCOP. If the body is brought to the center before Zuhr prayer, the funeral prayer is held after salat so the body may be buried before Maghrib.",
  },
  {
    q: "Who assigns and digs the grave?",
    a: "MCOP assigns the gravesite on a first-come, first-served basis. Grave digging is coordinated by MCOP with an outside company and is paid by the family.",
  },
  {
    q: "Are there any other costs?",
    a: "In addition to funeral-home and grave-digging charges, MCOP requests a comfortable donation to cover expenses and ensure a lifetime of cemetery maintenance.",
  },
  {
    q: "What about grave markers?",
    a: "MCOP has a standard grave-marker size. Allowable information is limited to the name and the dates of birth and death. Markers must sit flush with the ground.",
  },
  {
    q: "Can I pay MCOP to handle all expenses?",
    a: "No. Payment should be made directly to each service provider. MCOP cannot assume responsibility for payment on your behalf.",
  },
  {
    q: "Can women attend the funeral service?",
    a: "Yes, they can.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-[100px] bg-secondary/60 border-y border-border">
      <div className="max-w-[860px] mx-auto py-[88px] px-9">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-[14px] mb-[14px]">
            <span className="w-10 h-px bg-accent/50" />
            <Diamond size={16} className="text-accent" />
            <span className="w-10 h-px bg-accent/50" />
          </div>
          <h2 className="font-extrabold text-[40px] tracking-[-0.02em] mb-[14px]">
            Frequently asked questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-[14px] border border-border bg-card px-6 [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer py-[18px] text-[16.5px] font-semibold text-card-foreground">
                {f.q}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-none text-primary transition-transform duration-200 group-open:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="pb-[20px] -mt-1 text-[15.5px] leading-[1.7] text-foreground/75">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
