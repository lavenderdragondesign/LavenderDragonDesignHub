import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>LavenderDragonDesign • LDDTools.lol</span>
        <span>© {new Date().getFullYear()} • Built for designers, Etsy sellers & coders.</span>
      </div>
    </footer>
  );
};

export default Footer;
