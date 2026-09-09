const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.icop.info";

const CEMETERY = {
  "@context": "https://schema.org",
  "@type": "Cemetery",
  name: "Muslim Cemetery of Portland",
  alternateName: "MCOP",
  description:
    "Portland's only all-Muslim cemetery — a dignified, 100% Sunnah-compliant resting place dedicated exclusively to Muslims, and affordable to Sunni and Shia families alike.",
  url: SITE_URL,
  email: "portlandicp@gmail.com",
  telephone: "+1-503-998-2498",
  foundingDate: "2015",
  address: {
    "@type": "PostalAddress",
    streetAddress: "21207 NW St Helens Rd",
    addressLocality: "Portland",
    addressRegion: "OR",
    postalCode: "97231",
    addressCountry: "US",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "Islamic Center of Portland",
    address: {
      "@type": "PostalAddress",
      streetAddress: "6940 SW Hall Blvd",
      addressLocality: "Beaverton",
      addressRegion: "OR",
      postalCode: "97008",
      addressCountry: "US",
    },
  },
  sameAs: [
    "https://www.facebook.com/groups/47040881309/",
    "https://www.instagram.com/pdxyouthofahlulbayt/",
    "https://www.youtube.com/@islamiccenterportland",
  ],
};

const FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who should be contacted to arrange a burial at MCOP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The family of the deceased should contact Ali Houdroge at 503-998-2498.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a burial plot cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An adult plot is $2,500 and a child plot (ages 3–12) is $1,000. Burial of infants under 3, premature infants and miscarriages is free of charge.",
      },
    },
    {
      "@type": "Question",
      name: "Where is the body washed and shrouded?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The body is washed (ghusl) and shrouded (kafan) by MCOP volunteers at a funeral home of your choice, at no charge, then transported to MCOP for burial.",
      },
    },
    {
      "@type": "Question",
      name: "Can women attend the funeral service?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, they can." },
    },
  ],
};

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CEMETERY) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ) }}
      />
    </>
  );
}
