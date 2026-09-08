import React, { useState, useEffect } from 'react';
import { Banknote, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { formatRupiah, parseRupiahInput } from '../utils/formatters';
import { soundFx } from '../utils/audio';
import { AllocationRatios } from '../types';

interface IncomeInputProps {
  income: number;
  period: 'bulanan' | 'mingguan';
  ratios: AllocationRatios;
  onChangeIncome: (newIncome: number) => void;
  onChangePeriod: (period: 'bulanan' | 'mingguan') => void;
}

const PRESET_AMOUNTS = [
  { label: '300 Rb', value: 300000 },
  { label: '500 Rb', value: 500000 },
  { label: '1 Jt', value: 1000000 },
  { label: '2.5 Jt', value: 2500000 },
  { label: '5 Jt', value: 5000000 },
];

export const IncomeInput: React.FC<IncomeInputProps> = ({
  income,
  period,
  ratios,
  onChangeIncome,
  onChangePeriod
}) => {
  const [displayValue, setDisplayValue] = useState(income.toLocaleString('id-ID'));

  useEffect(() => {
    setDisplayValue(income.toLocaleString('id-ID'));
  }, [income]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const parsed = parseRupiahInput(rawVal);
    setDisplayValue(parsed ? parsed.toLocaleString('id-ID') : '');
    onChangeIncome(parsed);
  };

  const handleSelectPreset = (val: number) => {
    soundFx.playClick();
    setDisplayValue(val.toLocaleString('id-ID'));
    onChangeIncome(val);
  };

  const needsNominal = (income * ratios.needs) / 100;
  const wantsNominal = (income * ratios.wants) / 100;
  const savingsNominal = (income * ratios.savings) / 100;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Banknote className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Total Uang Saku & Pendapatan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Masukkan total uang saku yang Anda terima untuk disimulasikan
            </p>
          </div>
        </div>

        {/* Period Selector: Bulanan vs Mingguan */}
        <div className="flex items-center self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onChangePeriod('bulanan');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              period === 'bulanan'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Bulanan
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onChangePeriod('mingguan');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              period === 'mingguan'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Mingguan
          </button>
        </div>
      </div>

      {/* Big Currency Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-bold text-lg">
          Rp
        </div>
        <input
          id="input-total-income"
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          placeholder="0"
          className="w-full pl-12 pr-4 py-3.5 text-2xl sm:text-3xl font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-display tracking-tight transition"
        />
        {income > 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aktif Terdistribusi</span>
          </div>
        )}
      </div>

      {/* Preset Amount Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1">
          Preset Cepat:
        </span>
        {PRESET_AMOUNTS.map((item) => {
          const isSelected = income === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelectPreset(item.value)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                isSelected
                  ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-300 hover:bg-sky-50/50 dark:hover:bg-slate-700'
              }`}
            >
              Rp {item.label}
            </button>
          );
        })}
      </div>

      {/* Quick Summary Chips for Immediate Allocation Result */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wide block">
              Kebutuhan ({ratios.needs}%)
            </span>
            <span className="text-sm font-bold text-sky-900 dark:text-sky-100">
              {formatRupiah(needsNominal)}
            </span>
          </div>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 px-2 py-0.5 rounded-full font-medium">
            Makan & Transport
          </span>
        </div>

        <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide block">
              Keinginan ({ratios.wants}%)
            </span>
            <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
              {formatRupiah(wantsNominal)}
            </span>
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full font-medium">
            Jajan & Game
          </span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide block">
              Tabungan ({ratios.savings}%)
            </span>
            <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
              {formatRupiah(savingsNominal)}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full font-medium">
            Investasi & Darurat
          </span>
        </div>
      </div>
    </div>
  );
};
