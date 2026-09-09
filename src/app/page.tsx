import { TopRibbon } from "@/components/landing/top-ribbon";
import { SiteHeader } from "@/components/landing/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { MissionSection } from "@/components/landing/mission-section";
import { HistorySection } from "@/components/landing/history-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProcessSection } from "@/components/landing/process-section";
import { FaqSection } from "@/components/landing/faq-section";
import { RulesSection } from "@/components/landing/rules-section";
import { PortalSection } from "@/components/landing/portal-section";
import { ContactSection } from "@/components/landing/contact-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { StructuredData } from "@/components/landing/structured-data";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground leading-[1.6] antialiased font-hanken">
      <StructuredData />
      <TopRibbon />
      <SiteHeader />
      <main id="top">
        <HeroSection />
        <StatsSection />
        <MissionSection />
        <HistorySection />
        <PricingSection />
        <ProcessSection />
        <FaqSection />
        <RulesSection />
        <PortalSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
