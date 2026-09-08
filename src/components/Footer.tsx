import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <Shield className="w-3.5 h-3.5 text-sky-500" />
          <span>Simulasi Alokasi Uang Saku • Metode Keuangan 50/30/20</span>
        </div>
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Copyright © 2025 Aplikasi Agenda Kerja Harian. All Rights Reserved.
        </p>
        <p className="text-[11px] text-slate-400">
          Data tersimpan permanen di Local Storage browser Anda (Penyimpanan Offline & Multi-Profil Aman)
        </p>
      </div>
    </footer>
  );
};
