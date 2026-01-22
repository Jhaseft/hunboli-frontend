'use client';
import { HeroSection } from '../components/Home/HeroSection/HeroSection';
import { FeaturesSection } from '../components/Home/FeaturesSection';
import { StatsSection } from '../components/Home/StatsSection';
import { AdoptionSection } from '../components/Home/AdoptionSection';
import { FooterSection } from '../components/Home/FooterSection';
//cambios pequeños
export default function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <AdoptionSection />
      <FooterSection />
    </div>
  );
}