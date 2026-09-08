import React, { useState } from 'react';
import {
  Utensils,
  Gamepad2,
  PiggyBank,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { AllocationCategory, SubItem, AllocationRatios } from '../types';
import { formatRupiah, parseRupiahInput } from '../utils/formatters';
import { soundFx } from '../utils/audio';

interface CategoryCardsProps {
  income: number;
  ratios: AllocationRatios;
  items: SubItem[];
  onAddItem: (category: AllocationCategory, name: string, amount: number) => void;
  onUpdateItem: (id: string, name: string, amount: number) => void;
  onDeleteItem: (id: string) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  income,
  ratios,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) => {
  // Add item form state per category
  const [addingCategory, setAddingCategory] = useState<AllocationCategory | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  // Editing item state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const handleStartAdd = (cat: AllocationCategory) => {
    soundFx.playClick();
    setAddingCategory(cat);
    setNewItemName('');
    setNewItemAmount('');
  };

  const handleSaveAdd = (cat: AllocationCategory) => {
    const trimmed = newItemName.trim();
    const parsedAmount = parseRupiahInput(newItemAmount);
    if (!trimmed || parsedAmount <= 0) return;

    soundFx.playSuccess();
    onAddItem(cat, trimmed, parsedAmount);
    setAddingCategory(null);
    setNewItemName('');
    setNewItemAmount('');
  };

  const handleStartEdit = (item: SubItem) => {
    soundFx.playClick();
    setEditingId(item.id);
    setEditName(item.name);
    setEditAmount(item.amount.toString());
  };

  const handleSaveEdit = (id: string) => {
    const trimmed = editName.trim();
    const parsedAmount = parseRupiahInput(editAmount);
    if (!trimmed || parsedAmount <= 0) return;

    soundFx.playClick();
    onUpdateItem(id, trimmed, parsedAmount);
    setEditingId(null);
  };

  const categoriesConfig: {
    key: AllocationCategory;
    title: string;
    subtitle: string;
    ratio: number;
    icon: React.ReactNode;
    color: string;
    badgeBg: string;
    border: string;
    barColor: string;
  }[] = [
    {
      key: 'needs',
      title: 'Kebutuhan (Needs)',
      subtitle: 'Makan, transport, kos, tagihan pokok',
      ratio: ratios.needs,
      icon: <Utensils className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      color: 'text-sky-600 dark:text-sky-400',
      badgeBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      border: 'border-sky-200 dark:border-sky-900/50',
      barColor: 'bg-sky-500'
    },
    {
      key: 'wants',
      title: 'Keinginan (Wants)',
      subtitle: 'Jajan, kopi, game, streaming, hobi',
      ratio: ratios.wants,
      icon: <Gamepad2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      color: 'text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      border: 'border-indigo-200 dark:border-indigo-900/50',
      barColor: 'bg-indigo-500'
    },
    {
      key: 'savings',
      title: 'Tabungan & Investasi',
      subtitle: 'Dana darurat, reksadana, saham dividen',
      ratio: ratios.savings,
      icon: <PiggyBank className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      border: 'border-emerald-200 dark:border-emerald-900/50',
      barColor: 'bg-emerald-500'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Rincian Alokasi Per Kategori (Edit & Sub-Item)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kustomisasi pos belanja spesifik Anda untuk memantau sisa anggaran
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {categoriesConfig.map((cat) => {
          const categoryItems = items.filter((i) => i.category === cat.key);
          const budgetedNominal = (income * cat.ratio) / 100;
          const totalSpent = categoryItems.reduce((acc, curr) => acc + curr.amount, 0);
          const difference = budgetedNominal - totalSpent;
          const percentUsed = budgetedNominal > 0 ? (totalSpent / budgetedNominal) * 100 : 0;

          return (
            <div
              key={cat.key}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border ${cat.border} shadow-sm flex flex-col justify-between transition-colors`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-xs">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {cat.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border font-display ${cat.badgeBg}`}>
                    {cat.ratio}%
                  </span>
                </div>

                {/* Budget Stat Box */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-3 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Batas Anggaran:
                    </span>
                    <span className="text-base font-extrabold font-display text-slate-800 dark:text-slate-100">
                      {formatRupiah(budgetedNominal)}
                    </span>
                  </div>

                  {/* Progress Bar of Sub-Items */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden my-2">
                    <div
                      style={{ width: `${Math.min(100, percentUsed)}%` }}
                      className={`h-full ${percentUsed > 100 ? 'bg-rose-500' : cat.barColor} transition-all duration-300`}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">
                      Terpakai: {formatRupiah(totalSpent)}
                    </span>
                    {difference >= 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Sisa: {formatRupiah(difference)}
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Kurang: {formatRupiah(Math.abs(difference))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-Items List */}
                <div className="space-y-2 mb-3 min-h-[140px] max-h-52 overflow-y-auto pr-1">
                  {categoryItems.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      Belum ada sub-item. Klik tambah di bawah.
                    </div>
                  ) : (
                    categoryItems.map((item) => {
                      const isEditing = editingId === item.id;

                      if (isEditing) {
                        return (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl border border-sky-400 bg-sky-50/50 dark:bg-sky-950/30 space-y-2"
                          >
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                              placeholder="Nama pengeluaran"
                            />
                            <div className="flex gap-1.5 items-center">
                              <input
                                type="text"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                placeholder="Nominal Rp"
                              />
                              <button
                                onClick={() => handleSaveEdit(item.id)}
                                className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition"
                                title="Simpan Perubahan"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 rounded bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                                title="Batal"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/70 transition group text-xs"
                        >
                          <div className="truncate mr-2">
                            <span className="font-semibold text-slate-700 dark:text-slate-200 block truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {budgetedNominal > 0 ? `${((item.amount / budgetedNominal) * 100).toFixed(0)}% dari pos` : '0%'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="font-bold text-slate-800 dark:text-slate-200 font-display">
                              {formatRupiah(item.amount)}
                            </span>
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1 text-slate-400 hover:text-sky-600 transition cursor-pointer"
                              title="Edit item ini"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                soundFx.playDelete();
                                onDeleteItem(item.id);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                              title="Hapus item ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Add Item Trigger / Form */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                {addingCategory === cat.key ? (
                  <div className="space-y-2 p-2 rounded-xl bg-sky-50/40 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 animate-fade-in">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Contoh: Bensin, Pulsa, Kopi..."
                      autoFocus
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newItemAmount}
                        onChange={(e) => setNewItemAmount(e.target.value)}
                        placeholder="Nominal Rp (cth: 50000)"
                        className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                      <button
                        onClick={() => handleSaveAdd(cat.key)}
                        disabled={!newItemName.trim() || !newItemAmount}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 transition cursor-pointer"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setAddingCategory(null)}
                        className="px-2 py-1.5 text-xs rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartAdd(cat.key)}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50/50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Sub-Item Pengeluaran</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
