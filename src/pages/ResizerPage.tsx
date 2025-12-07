import React from 'react';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import BulkResizer from '../resizer/BulkResizer';

const ResizerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slatebg text-slate-100 flex flex-col">
      <HeaderNav />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-white">Bulk Resizer</h1>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Upload images, pick recommended POD sizes or custom dimensions, then export everything as a ZIP.
            </p>
          </div>
        </div>
        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg overflow-hidden">
          <BulkResizer />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResizerPage;
