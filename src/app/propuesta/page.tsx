'use client';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { StatsSection } from './components/StatsSection';
import { AdoptionSection } from './components/AdoptionSection';
import { UseCasesSection } from './components/UseCasesSection';
import { FooterSection } from './components/FooterSection';
import { Dashboard } from './components/Dashboard';
import { useState } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Navbar onLoginSuccess={() => setIsLoggedIn(true)} />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <AdoptionSection />
      <UseCasesSection />
      <FooterSection />
    </div>
  );
}