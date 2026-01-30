"use client";

import Hero from '@/components/landing/Hero';
import Benefits from '@/components/landing/Benefits';
import About from '@/components/landing/About';
import Featured from '@/components/landing/Featured';
import CTA from '@/components/landing/CTA';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import colors from '@/theme/colors';

export default function LandingPage() {

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}>
      <Header />
      {/* Import all section components */}
      <Hero />
      <Benefits />
      <About />
      <Featured />
      <CTA />
      <Footer />
    </div>
  );
}