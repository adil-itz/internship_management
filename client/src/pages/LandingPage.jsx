import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import ProblemSolution from '../components/ProblemSolution';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import UserRoles from '../components/UserRoles';
import DashboardPreview from '../components/DashboardPreview';
import Benefits from '../components/Benefits';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function LandingPage({ darkMode: propDarkMode, setDarkMode: propSetDarkMode }) {
  const [localDarkMode, setLocalDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const darkMode = propDarkMode !== undefined ? propDarkMode : localDarkMode;
  const setDarkMode = propSetDarkMode || setLocalDarkMode;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1">
        <Hero />
        <Stats />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <UserRoles />
        <DashboardPreview />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
