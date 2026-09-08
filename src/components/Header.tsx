import React from 'react';
import {
  Wallet,
  Volume2,
  VolumeX,
  Mic,
  Moon,
  Sun,
  User,
  LogOut,
  FileSpreadsheet,
  FileText,
  BookmarkPlus
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  userName: string;
  isDark: boolean;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onVoiceOver: () => void;
  isSpeaking: boolean;
  onOpenProfileModal: () => void;
  onOpenSnapshotModal: () => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  isDark,
  onToggleTheme,
  isMuted,
  onToggleSound,
  onVoiceOver,
  isSpeaking,
  onOpenProfileModal,
  onOpenSnapshotModal,
  onExportCSV,
  onExportPDF
}) => {
  return (
    <header className="w-full border-b border-sky-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left / Center Branding: Header Judul Aplikasi - Rata Tengah on mobile, left-centered on desktop */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-500/20 text-white shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-700 via-sky-500 to-cyan-500 dark:from-sky-400 dark:via-cyan-300 dark:to-blue-400 bg-clip-text text-transparent">
              Simulasi Alokasi Uang Saku
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 justify-center md:justify-start">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Metode Keuangan 50/30/20 • Brankas Lokal Aktif
            </p>
          </div>
        </div>

        {/* User Account & Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Active User Chip */}
          <button
            id="btn-user-profile"
            onClick={() => {
              soundFx.playClick();
              onOpenProfileModal();
            }}
            title="Kelola Profil & Brankas Penyimpanan"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
          >
            <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold uppercase">
              {userName ? userName.charAt(0) : 'U'}
            </div>
            <span className="max-w-[110px] truncate">{userName || 'Tamu'}</span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
              Ganti
            </span>
          </button>

          {/* Snapshot / Menu Aksi Simpan */}
          <button
            id="btn-open-snapshots"
            onClick={() => {
              soundFx.playClick();
              onOpenSnapshotModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-xs"
            title="Menu Aksi: Simpan & Riwayat Skenario"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Skenario</span>
          </button>

          {/* Quick Export Group */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
            <button
              id="btn-export-csv"
              onClick={() => {
                soundFx.playClick();
                onExportCSV();
              }}
              className="px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700 flex items-center gap-1 transition cursor-pointer border-r border-slate-200 dark:border-slate-700"
              title="Ekspor Laporan Format CSV (Excel)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              id="btn-export-pdf"
              onClick={() => {
                soundFx.playClick();
                onExportPDF();
              }}
              className="px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700 flex items-center gap-1 transition cursor-pointer"
              title="Ekspor Laporan Tabel Rapi PDF"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>

          {/* Voice Over Narration Button */}
          <button
            id="btn-voice-over"
            onClick={onVoiceOver}
            className={`p-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
              isSpeaking
                ? 'bg-sky-500 text-white border-sky-600 animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-700'
            }`}
            title={isSpeaking ? 'Hentikan Suara Narasi' : 'Dengarkan Ringkasan Suara (Voice Over)'}
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Sound FX Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={() => {
              onToggleSound();
            }}
            className="p-2 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-700 transition cursor-pointer"
            title={isMuted ? 'Aktifkan Efek Suara' : 'Matikan Efek Suara'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={() => {
              soundFx.playClick();
              onToggleTheme();
            }}
            className="p-2 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-700 transition cursor-pointer"
            title={isDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
