import { TopRibbon } from "@/components/landing/top-ribbon";
import { SiteHeader } from "@/components/landing/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { MissionSection } from "@/components/landing/mission-section";
import { RulesSection } from "@/components/landing/rules-section";
import { PortalSection } from "@/components/landing/portal-section";
import { ContactSection } from "@/components/landing/contact-section";
import { SiteFooter } from "@/components/landing/site-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground leading-[1.6] antialiased font-hanken">
      <TopRibbon />
      <SiteHeader />
      <main id="top">
        <HeroSection />
        <MissionSection />
        <RulesSection />
        <PortalSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
