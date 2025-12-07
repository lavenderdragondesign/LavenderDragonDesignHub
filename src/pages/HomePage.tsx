import React from 'react';
import HeaderNav from '../components/HeaderNav';
import HeroSection from '../components/HeroSection';
import ToolsGrid from '../components/ToolsGrid';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slatebg text-slate-100 flex flex-col">
      <HeaderNav />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg p-6 sm:p-8">
          <HeroSection />
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Tools</h2>
            <p className="text-[11px] text-slate-400">Everything lives in the browser. No install.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg p-5 sm:p-6">
            <ToolsGrid />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
