import React, { useRef } from 'react';
import { Sliders, RotateCcw, Zap, Sparkles } from 'lucide-react';
import { AllocationRatios } from '../types';
import { soundFx } from '../utils/audio';

interface AllocationSlidersProps {
  ratios: AllocationRatios;
  onChangeRatios: (newRatios: AllocationRatios) => void;
}

const PRESET_RATIOS: { label: string; sublabel: string; ratios: AllocationRatios }[] = [
  {
    label: '50 / 30 / 20',
    sublabel: 'Standar Klasik',
    ratios: { needs: 50, wants: 30, savings: 20 }
  },
  {
    label: '60 / 20 / 20',
    sublabel: 'Hemat Mahasiswa',
    ratios: { needs: 60, wants: 20, savings: 20 }
  },
  {
    label: '40 / 20 / 40',
    sublabel: 'Investasi Prioritas',
    ratios: { needs: 40, wants: 20, savings: 40 }
  },
  {
    label: '40 / 40 / 20',
    sublabel: 'Gaya Hidup Santai',
    ratios: { needs: 40, wants: 40, savings: 20 }
  }
];

export const AllocationSliders: React.FC<AllocationSlidersProps> = ({
  ratios,
  onChangeRatios
}) => {
  const barRef = useRef<HTMLDivElement>(null);

  // Dynamic normalization function: keeps sum at strictly 100%
  const handleSliderChange = (changedKey: keyof AllocationRatios, rawValue: number) => {
    const val = Math.max(0, Math.min(100, Math.round(rawValue)));
    soundFx.playSliderTick(350 + val * 3);

    const remaining = 100 - val;

    if (changedKey === 'needs') {
      const otherSum = ratios.wants + ratios.savings;
      let newWants = otherSum > 0 ? Math.round(remaining * (ratios.wants / otherSum)) : Math.floor(remaining / 2);
      let newSavings = remaining - newWants;

      if (newWants < 0) { newWants = 0; newSavings = remaining; }
      if (newSavings < 0) { newSavings = 0; newWants = remaining; }

      onChangeRatios({ needs: val, wants: newWants, savings: newSavings });
    } else if (changedKey === 'wants') {
      const otherSum = ratios.needs + ratios.savings;
      let newNeeds = otherSum > 0 ? Math.round(remaining * (ratios.needs / otherSum)) : Math.floor(remaining / 2);
      let newSavings = remaining - newNeeds;

      if (newNeeds < 0) { newNeeds = 0; newSavings = remaining; }
      if (newSavings < 0) { newSavings = 0; newNeeds = remaining; }

      onChangeRatios({ needs: newNeeds, wants: val, savings: newSavings });
    } else {
      const otherSum = ratios.needs + ratios.wants;
      let newNeeds = otherSum > 0 ? Math.round(remaining * (ratios.needs / otherSum)) : Math.floor(remaining / 2);
      let newWants = remaining - newNeeds;

      if (newNeeds < 0) { newNeeds = 0; newWants = remaining; }
      if (newWants < 0) { newWants = 0; newNeeds = remaining; }

      onChangeRatios({ needs: newNeeds, wants: newWants, savings: val });
    }
  };

  const handleApplyPreset = (preset: AllocationRatios) => {
    soundFx.playClick();
    onChangeRatios(preset);
  };

  // Drag handler for visual ratio divider 1 (between needs and wants)
  const handleDragDivider1 = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const bar = barRef.current;
    if (!bar) return;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const rect = bar.getBoundingClientRect();
      const pct = Math.max(5, Math.min(85, Math.round(((clientX - rect.left) / rect.width) * 100)));

      // pct is the new 'needs'
      const remainingForOthers = 100 - pct;
      const otherSum = ratios.wants + ratios.savings;
      const newWants = otherSum > 0 ? Math.round(remainingForOthers * (ratios.wants / otherSum)) : Math.floor(remainingForOthers / 2);
      const newSavings = remainingForOthers - newWants;

      onChangeRatios({
        needs: pct,
        wants: Math.max(0, newWants),
        savings: Math.max(0, newSavings)
      });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
  };

  // Drag handler for visual ratio divider 2 (between wants and savings)
  const handleDragDivider2 = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const bar = barRef.current;
    if (!bar) return;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const rect = bar.getBoundingClientRect();
      const currentPosPct = Math.max(ratios.needs + 5, Math.min(95, Math.round(((clientX - rect.left) / rect.width) * 100)));

      // Wants goes from ratios.needs to currentPosPct
      const newWants = Math.max(5, currentPosPct - ratios.needs);
      const newSavings = Math.max(0, 100 - ratios.needs - newWants);

      onChangeRatios({
        needs: ratios.needs,
        wants: newWants,
        savings: newSavings
      });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
  };

  const total = ratios.needs + ratios.wants + ratios.savings;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Dynamic Normalization Sliders</span>
              <span className="text-[10px] font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full">
                Auto-Balance 100%
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Geser slider kategori manapun, sistem otomatis menyeimbangkan total rasio tepat 100%
            </p>
          </div>
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={() => handleApplyPreset({ needs: 50, wants: 30, savings: 20 })}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Kembalikan ke rasio default 50/30/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset 50/30/20</span>
        </button>
      </div>

      {/* Interactive Visual Draggable Ratio Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          <span>Visualisasi Distribusi & Handle Drag-and-Drop:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">Total: {total}%</span>
        </div>

        <div
          ref={barRef}
          className="relative h-9 rounded-xl overflow-hidden flex select-none shadow-inner border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
        >
          {/* Needs Segment */}
          <div
            style={{ width: `${ratios.needs}%` }}
            className="h-full bg-gradient-to-r from-sky-600 to-sky-500 flex items-center justify-center text-white text-xs font-bold transition-[width] duration-75 relative overflow-hidden"
            title={`Kebutuhan: ${ratios.needs}%`}
          >
            {ratios.needs >= 12 && (
              <span className="truncate px-1 drop-shadow-xs">
                Kebutuhan {ratios.needs}%
              </span>
            )}
          </div>

          {/* Draggable divider handle 1 */}
          <div
            onMouseDown={handleDragDivider1}
            onTouchStart={handleDragDivider1}
            className="w-3 -ml-1.5 h-full bg-white dark:bg-slate-700 hover:bg-sky-400 cursor-ew-resize z-10 flex items-center justify-center shadow-md transition-colors border border-slate-300 dark:border-slate-600"
            title="Tarik untuk menyesuaikan batas Kebutuhan & Keinginan"
          >
            <div className="w-0.5 h-4 bg-slate-400 dark:bg-slate-300 rounded-full"></div>
          </div>

          {/* Wants Segment */}
          <div
            style={{ width: `${ratios.wants}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold transition-[width] duration-75 relative overflow-hidden"
            title={`Keinginan: ${ratios.wants}%`}
          >
            {ratios.wants >= 12 && (
              <span className="truncate px-1 drop-shadow-xs">
                Keinginan {ratios.wants}%
              </span>
            )}
          </div>

          {/* Draggable divider handle 2 */}
          <div
            onMouseDown={handleDragDivider2}
            onTouchStart={handleDragDivider2}
            className="w-3 -ml-1.5 h-full bg-white dark:bg-slate-700 hover:bg-indigo-400 cursor-ew-resize z-10 flex items-center justify-center shadow-md transition-colors border border-slate-300 dark:border-slate-600"
            title="Tarik untuk menyesuaikan batas Keinginan & Tabungan"
          >
            <div className="w-0.5 h-4 bg-slate-400 dark:bg-slate-300 rounded-full"></div>
          </div>

          {/* Savings Segment */}
          <div
            style={{ width: `${ratios.savings}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold transition-[width] duration-75 relative overflow-hidden"
            title={`Tabungan: ${ratios.savings}%`}
          >
            {ratios.savings >= 12 && (
              <span className="truncate px-1 drop-shadow-xs">
                Tabungan {ratios.savings}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* The 3 Sliders with Custom Gradients */}
      <div className="space-y-4 mb-6">
        {/* Slider 1: Kebutuhan */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 shadow-xs shadow-sky-500/50"></span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                1. Kebutuhan Pokok (Needs)
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                • Makan, Transport, Pulsa
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400 font-display">
                {ratios.needs}%
              </span>
            </div>
          </div>
          <div className="relative flex items-center">
            <input
              id="slider-needs"
              type="range"
              min="0"
              max="90"
              step="1"
              value={ratios.needs}
              onChange={(e) => handleSliderChange('needs', Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-sky-500"
            />
          </div>
        </div>

        {/* Slider 2: Keinginan */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500/50"></span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                2. Keinginan & Rekreasi (Wants)
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                • Jajan, Kopi, Game, Hobi
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-display">
                {ratios.wants}%
              </span>
            </div>
          </div>
          <div className="relative flex items-center">
            <input
              id="slider-wants"
              type="range"
              min="0"
              max="90"
              step="1"
              value={ratios.wants}
              onChange={(e) => handleSliderChange('wants', Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-indigo-500"
            />
          </div>
        </div>

        {/* Slider 3: Tabungan */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50"></span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                3. Tabungan & Investasi (Savings)
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                • Dana Darurat & Reksadana/Saham
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
                {ratios.savings}%
              </span>
            </div>
          </div>
          <div className="relative flex items-center">
            <input
              id="slider-savings"
              type="range"
              min="0"
              max="90"
              step="1"
              value={ratios.savings}
              onChange={(e) => handleSliderChange('savings', Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Preset Strategy Quick-Select */}
      <div>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-2">
          Pilihan Strategi Rasio Populer:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_RATIOS.map((item) => {
            const isMatch =
              ratios.needs === item.ratios.needs &&
              ratios.wants === item.ratios.wants &&
              ratios.savings === item.ratios.savings;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleApplyPreset(item.ratios)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  isMatch
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-sky-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold font-display">{item.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {item.sublabel}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
