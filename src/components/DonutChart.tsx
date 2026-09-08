import React, { useState } from 'react';
import { PieChart as PieIcon, Info } from 'lucide-react';
import { AllocationRatios, AllocationCategory } from '../types';
import { formatRupiah } from '../utils/formatters';

interface DonutChartProps {
  ratios: AllocationRatios;
  income: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ ratios, income }) => {
  const [hoveredCategory, setHoveredCategory] = useState<AllocationCategory | null>(null);

  const needsAngle = (ratios.needs / 100) * 360;
  const wantsAngle = (ratios.wants / 100) * 360;

  // Pure CSS Conic Gradient Angles
  // Needs: from 0deg to needsAngle deg
  // Wants: from needsAngle deg to (needsAngle + wantsAngle) deg
  // Savings: from (needsAngle + wantsAngle) deg to 360 deg
  const conicBackground = `conic-gradient(
    #0284c7 0deg ${needsAngle}deg,
    #6366f1 ${needsAngle}deg ${needsAngle + wantsAngle}deg,
    #10b981 ${needsAngle + wantsAngle}deg 360deg
  )`;

  const needsNominal = (income * ratios.needs) / 100;
  const wantsNominal = (income * ratios.wants) / 100;
  const savingsNominal = (income * ratios.savings) / 100;

  const getHoverDisplay = () => {
    if (hoveredCategory === 'needs') {
      return {
        label: 'Kebutuhan Pokok',
        pct: ratios.needs,
        nominal: needsNominal,
        color: 'text-sky-500'
      };
    }
    if (hoveredCategory === 'wants') {
      return {
        label: 'Keinginan & Rekreasi',
        pct: ratios.wants,
        nominal: wantsNominal,
        color: 'text-indigo-500'
      };
    }
    if (hoveredCategory === 'savings') {
      return {
        label: 'Tabungan & Investasi',
        pct: ratios.savings,
        nominal: savingsNominal,
        color: 'text-emerald-500'
      };
    }
    return {
      label: 'Total Anggaran',
      pct: 100,
      nominal: income,
      color: 'text-slate-800 dark:text-slate-100'
    };
  };

  const currentDisplay = getHoverDisplay();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm transition-colors flex flex-col items-center justify-between">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Pure CSS Donut Chart
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visualisasi proporsional real-time tanpa library eksternal
            </p>
          </div>
        </div>
      </div>

      {/* Pure CSS Donut Container */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Outer subtle glow ring */}
        <div className="absolute inset-0 rounded-full bg-sky-400/10 blur-xl pointer-events-none"></div>

        {/* The Pure CSS Conic Gradient Donut Wheel */}
        <div
          id="pure-css-donut-wheel"
          style={{
            background: conicBackground,
            transition: 'background 0.25s ease-out'
          }}
          className="w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center shadow-lg relative p-2"
        >
          {/* Donut Center Hole (Card Background) */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white dark:bg-slate-900 shadow-inner flex flex-col items-center justify-center text-center p-2 z-10 transition-colors">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
              {currentDisplay.label}
            </span>
            <span className={`text-lg sm:text-xl font-extrabold font-display ${currentDisplay.color}`}>
              {formatRupiah(currentDisplay.nominal, true)}
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {currentDisplay.pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Legend Items */}
      <div className="w-full space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Legend 1 */}
        <div
          onMouseEnter={() => setHoveredCategory('needs')}
          onMouseLeave={() => setHoveredCategory(null)}
          className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
            hoveredCategory === 'needs'
              ? 'bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0"></span>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Kebutuhan (Needs)
              </span>
              <span className="text-[10px] text-slate-400">
                Makan, transportasi, pokok
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block font-display">
              {formatRupiah(needsNominal)}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {ratios.needs}%
            </span>
          </div>
        </div>

        {/* Legend 2 */}
        <div
          onMouseEnter={() => setHoveredCategory('wants')}
          onMouseLeave={() => setHoveredCategory(null)}
          className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
            hoveredCategory === 'wants'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 shrink-0"></span>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Keinginan (Wants)
              </span>
              <span className="text-[10px] text-slate-400">
                Jajan, hiburan, game
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block font-display">
              {formatRupiah(wantsNominal)}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {ratios.wants}%
            </span>
          </div>
        </div>

        {/* Legend 3 */}
        <div
          onMouseEnter={() => setHoveredCategory('savings')}
          onMouseLeave={() => setHoveredCategory(null)}
          className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
            hoveredCategory === 'savings'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Tabungan & Investasi (Savings)
              </span>
              <span className="text-[10px] text-slate-400">
                Compound interest & darurat
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block font-display">
              {formatRupiah(savingsNominal)}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {ratios.savings}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
