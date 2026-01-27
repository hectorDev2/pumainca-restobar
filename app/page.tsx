"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { RecommendationsSection } from '@/components/home/RecommendationsSection';
import { HistoryPhilosophySection } from '@/components/home/HistoryPhilosophySection';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <RecommendationsSection />
      <HistoryPhilosophySection />
      <CTASection />
      <Footer />
    </div>
  );
}
