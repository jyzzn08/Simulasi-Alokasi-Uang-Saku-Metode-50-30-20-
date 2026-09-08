import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Sparkles,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvestmentConfig } from '../types';
import {
  INVESTMENT_PORTFOLIOS,
  calculateCompoundInterest,
  formatRupiah
} from '../utils/formatters';
import { soundFx } from '../utils/audio';

interface InvestmentProjectionProps {
  savingsMonthlyAmount: number;
  config: InvestmentConfig;
  onChangeConfig: (newConfig: InvestmentConfig) => void;
}

export const InvestmentProjection: React.FC<InvestmentProjectionProps> = ({
  savingsMonthlyAmount,
  config,
  onChangeConfig
}) => {
  const [selectedYears, setSelectedYears] = useState<number>(3);
  const [customRate, setCustomRate] = useState<number>(config.annualReturnRate);

  const currentRate =
    config.instrumentId === 'kustom'
      ? customRate
      : config.annualReturnRate;

  // Compounding for multiple periods: 1, 3, 5, 10 years
  const proj1 = calculateCompoundInterest(savingsMonthlyAmount, currentRate, 1);
  const proj3 = calculateCompoundInterest(savingsMonthlyAmount, currentRate, 3);
  const proj5 = calculateCompoundInterest(savingsMonthlyAmount, currentRate, 5);
  const proj10 = calculateCompoundInterest(savingsMonthlyAmount, currentRate, 10);

  const selectedProj =
    selectedYears === 1
      ? proj1
      : selectedYears === 3
      ? proj3
      : selectedYears === 5
      ? proj5
      : proj10;

  // Milestone gamification logic
  const getMilestone = (fv: number) => {
    if (fv >= 50000000) {
      return {
        level: 4,
        title: 'Calon Sultan Mandiri',
        desc: 'Portofolio Anda telah melampaui Rp 50 Juta! Kebebasan finansial di depan mata.',
        badgeBg: 'from-amber-500 to-yellow-400 text-slate-900',
        icon: '👑'
      };
    }
    if (fv >= 15000000) {
      return {
        level: 3,
        title: 'Portofolio Menggelembung',
        desc: 'Bunga majemuk mulai bekerja pesat melipatgandakan tabungan rutin Anda.',
        badgeBg: 'from-purple-500 to-indigo-500 text-white',
        icon: '🚀'
      };
    }
    if (fv >= 5000000) {
      return {
        level: 2,
        title: 'Disiplin Investor Cerdas',
        desc: 'Kebiasaan menyisihkan uang saku mulai memperlihatkan fondasi yang solid.',
        badgeBg: 'from-sky-500 to-cyan-400 text-white',
        icon: '💎'
      };
    }
    return {
      level: 1,
      title: 'Pondasi Finansial Pemula',
      desc: 'Langkah pertama yang luar biasa. Konsistensi kecil menghasilkan lompatan besar.',
      badgeBg: 'from-emerald-500 to-teal-400 text-white',
      icon: '🌱'
    };
  };

  const milestone = getMilestone(selectedProj.futureValue);

  const triggerCelebration = () => {
    soundFx.playMilestone();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }
  };

  const handleSelectPortfolio = (portfolio: (typeof INVESTMENT_PORTFOLIOS)[0]) => {
    soundFx.playClick();
    if (portfolio.id === 'kustom') {
      onChangeConfig({
        instrumentId: 'kustom',
        instrumentName: portfolio.name,
        annualReturnRate: customRate
      });
    } else {
      onChangeConfig({
        instrumentId: portfolio.id,
        instrumentName: portfolio.name,
        annualReturnRate: portfolio.defaultReturn
      });
    }
  };

  const handleCustomRateChange = (rate: number) => {
    setCustomRate(rate);
    onChangeConfig({
      ...config,
      annualReturnRate: rate
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm transition-colors">
      {/* Header with Gamified Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Smart Investment Projection</span>
              <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Efek Compound Interest
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simulasi bunga majemuk jika porsi tabungan rutin diinvestasikan ke instrumen finansial
            </p>
          </div>
        </div>

        {/* Gamified Celebration Button */}
        <button
          onClick={triggerCelebration}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 text-xs font-bold shadow-sm shadow-amber-500/30 transition transform active:scale-95 cursor-pointer"
          title="Rayakan Progres Tabungan Anda!"
        >
          <PartyPopper className="w-3.5 h-3.5" />
          <span>Rayakan Target!</span>
        </button>
      </div>

      {/* Portfolio Selector Grid */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Pilih Instrumen Portofolio Investasi:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {INVESTMENT_PORTFOLIOS.map((item) => {
            const isSelected = config.instrumentId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPortfolio(item)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 text-sky-950 dark:text-sky-100 ring-2 ring-sky-500/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-sky-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-extrabold text-sky-600 dark:text-sky-400">
                      ~{item.defaultReturn}%
                    </span>
                  </div>
                  <div className="text-xs font-bold leading-tight mb-1">
                    {item.name}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {item.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Rate Slider if custom selected */}
        {config.instrumentId === 'kustom' && (
          <div className="mt-3 p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-purple-900 dark:text-purple-200 font-medium">
              Atur Ekspektasi Imbal Hasil Tahunan Kustom:
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={customRate}
                onChange={(e) => handleCustomRateChange(Number(e.target.value))}
                className="w-36 accent-purple-600"
              />
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300 font-display">
                {customRate}% / thn
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Time Horizon Selector Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Simulasi Jangka Waktu:
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {[1, 3, 5, 10].map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSelectedYears(yr);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedYears === yr
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {yr} Tahun
            </button>
          ))}
        </div>
      </div>

      {/* Main Projection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Card 1: Modal Pokok Disetor */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Total Modal Disetor
          </span>
          <div className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">
            {formatRupiah(selectedProj.totalDeposit)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {formatRupiah(savingsMonthlyAmount)} x {selectedProj.months} bulan
          </p>
        </div>

        {/* Card 2: Keuntungan Bunga Majemuk */}
        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Keuntungan Bunga (Profit)
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.2 rounded">
              +{selectedProj.roiPercentage.toFixed(1)}% ROI
            </span>
          </div>
          <div className="text-xl font-bold font-display text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-5 h-5 shrink-0" />
            <span>+{formatRupiah(selectedProj.interestEarned)}</span>
          </div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">
            Hasil compounding aset bertumbuh
          </p>
        </div>

        {/* Card 3: Nilai Akumulasi Akhir */}
        <div className="p-4 rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50">
          <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wider block mb-1">
            Total Nilai Akumulasi ({selectedYears} Thn)
          </span>
          <div className="text-2xl font-extrabold font-display text-sky-700 dark:text-sky-300">
            {formatRupiah(selectedProj.futureValue)}
          </div>
          <p className="text-[11px] text-sky-600/80 dark:text-sky-400/80 mt-1">
            Modal pokok + bunga majemuk
          </p>
        </div>
      </div>

      {/* Multi-Year Comparison Visual Table */}
      <div className="mb-6 overflow-x-auto">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Perbandingan Multi-Tahun Pertumbuhan Modal:
        </div>
        <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="py-2.5 px-3">Horizon Waktu</th>
              <th className="py-2.5 px-3">Setoran Rutin</th>
              <th className="py-2.5 px-3">Total Modal Pokok</th>
              <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">Profit Bunga Majemuk</th>
              <th className="py-2.5 px-3 font-bold text-sky-600 dark:text-sky-400">Nilai Akhir (FV)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {[proj1, proj3, proj5, proj10].map((item) => (
              <tr
                key={item.years}
                className={`transition ${
                  selectedYears === item.years
                    ? 'bg-sky-50/70 dark:bg-sky-950/40 font-semibold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }`}
              >
                <td className="py-2.5 px-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>{item.years} Tahun ({item.months} bln)</span>
                </td>
                <td className="py-2.5 px-3">{formatRupiah(savingsMonthlyAmount)}</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{formatRupiah(item.totalDeposit)}</td>
                <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">
                  +{formatRupiah(item.interestEarned)} ({item.roiPercentage.toFixed(0)}%)
                </td>
                <td className="py-2.5 px-3 font-bold text-sky-700 dark:text-sky-300">
                  {formatRupiah(item.futureValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Milestone Badge (Gamifikasi) */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
            {milestone.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white uppercase">
                Milestone Level {milestone.level}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {milestone.title}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {milestone.desc}
            </p>
          </div>
        </div>

        <button
          onClick={triggerCelebration}
          className="shrink-0 p-2 text-sky-600 dark:text-sky-400 hover:bg-sky-100/50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
          title="Rayakan!"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
