import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const ScrollTopBottom: React.FC = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    soundFx.playClick();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-30 flex flex-col gap-2">
      {showTop && (
        <button
          id="btn-scroll-top"
          onClick={scrollToTop}
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-sky-600 transition-all cursor-pointer animate-fade-in"
          title="Gulir ke Atas (Scroll Up)"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
      <button
        id="btn-scroll-bottom"
        onClick={scrollToBottom}
        className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-sky-600 transition-all cursor-pointer"
        title="Gulir ke Bawah (Scroll Down)"
      >
        <ArrowDown className="w-4 h-4" />
      </button>
    </div>
  );
};
