import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const HeaderNav: React.FC = () => {
  const location = useLocation();

  const linkClasses = (path: string) =>
    `text-xs sm:text-sm px-3 py-1.5 rounded-full border transition ${
      location.pathname === path
        ? 'border-lddpurple bg-lddpurple/20 text-white'
        : 'border-slate-700 text-slate-300 hover:border-lddpurple/70 hover:text-white'
    }`;

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-lddpurple to-lddemerald flex items-center justify-center text-xs font-bold">
            L
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-100">
            LDDTools.lol
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/" className={linkClasses('/')}>
            Home
          </Link>
          <Link to="/resizer" className={linkClasses('/resizer')}>
            Bulk Resizer
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default HeaderNav;
