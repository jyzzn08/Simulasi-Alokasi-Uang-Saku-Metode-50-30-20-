import React, { useState } from 'react';
import {
  BookmarkPlus,
  Trash2,
  FolderOpen,
  X,
  Edit2,
  Check,
  RotateCcw,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { AllocationSnapshot, AllocationRatios, SubItem } from '../types';
import { formatRupiah } from '../utils/formatters';
import { soundFx } from '../utils/audio';

interface ActionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: AllocationSnapshot[];
  currentIncome: number;
  currentRatios: AllocationRatios;
  currentItems: SubItem[];
  onSaveCurrentAsSnapshot: (title: string, notes?: string) => void;
  onLoadSnapshot: (snapshot: AllocationSnapshot) => void;
  onDeleteSnapshot: (snapshotId: string) => void;
  onResetToDefault: () => void;
}

export const ActionHistoryModal: React.FC<ActionHistoryModalProps> = ({
  isOpen,
  onClose,
  snapshots,
  currentIncome,
  currentRatios,
  currentItems,
  onSaveCurrentAsSnapshot,
  onLoadSnapshot,
  onDeleteSnapshot,
  onResetToDefault
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim() || `Alokasi ${new Date().toLocaleDateString('id-ID')}`;
    soundFx.playSuccess();
    onSaveCurrentAsSnapshot(title, newNotes.trim());
    setNewTitle('');
    setNewNotes('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Menu Aksi: Simpan & Riwayat Skenario
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simpan skenario berbeda dan muat kembali kapan saja
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current State Summary */}
        <div className="my-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Status Alokasi Saat Ini:</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">
              {formatRupiah(currentIncome)} • Rasio {currentRatios.needs}/{currentRatios.wants}/{currentRatios.savings}
            </span>
          </div>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Simpan Snapshot</span>
            </button>
          )}
        </div>

        {/* Create Form */}
        {isCreating && (
          <form onSubmit={handleSave} className="mb-4 p-3.5 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Judul Skenario:
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Rencana Uang Saku UTS, Target Nabung Liburan..."
                autoFocus
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Tambahan (Opsional):
              </label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Catatan tujuan atau prioritas pos pengeluaran..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs rounded-lg bg-sky-600 text-white hover:bg-sky-700 font-bold"
              >
                Simpan ke Brankas
              </button>
            </div>
          </form>
        )}

        {/* Saved Snapshots List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Daftar Skenario Tersimpan ({snapshots.length})
          </div>

          {snapshots.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Layers className="w-7 h-7 mx-auto mb-2 opacity-30 text-sky-500" />
              Belum ada skenario yang disimpan. Klik tombol Simpan Snapshot di atas.
            </div>
          ) : (
            snapshots.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 hover:border-sky-300 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {formatRupiah(item.income)} • Rasio {item.ratios.needs}/{item.ratios.wants}/{item.ratios.savings} • {item.createdAt}
                  </div>
                  {item.notes && (
                    <div className="text-[10px] text-slate-400 italic mt-0.5 truncate">
                      "{item.notes}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      soundFx.playSuccess();
                      onLoadSnapshot(item);
                      onClose();
                    }}
                    className="p-1.5 px-2.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-100/60 dark:hover:bg-sky-950/60 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    title="Terapkan skenario ini"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Muat</span>
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playDelete();
                      if (confirm(`Hapus skenario "${item.title}"?`)) {
                        onDeleteSnapshot(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                    title="Hapus skenario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions: Reset Default */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              soundFx.playClick();
              if (confirm('Yakin ingin mereset seluruh data alokasi saat ini ke konfigurasi default 50/30/20?')) {
                onResetToDefault();
                onClose();
              }
            }}
            className="text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Default 50/30/20</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
