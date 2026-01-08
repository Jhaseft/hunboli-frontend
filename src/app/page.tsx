'use client';
import { Navbar } from '../components/Home/Navbar';
import { HeroSection } from '../components/Home/HeroSection/HeroSection';
import { FeaturesSection } from '../components/Home/FeaturesSection';
import { StatsSection } from '../components/Home/StatsSection';
import { AdoptionSection } from '../components/Home/AdoptionSection';
import { UseCasesSection } from '../components/Home/UseCasesSection';
import { FooterSection } from '../components/Home/FooterSection';

export default function App() {


  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Navbar  />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <AdoptionSection />
      <UseCasesSection />
      <FooterSection />
    </div>
  );
}