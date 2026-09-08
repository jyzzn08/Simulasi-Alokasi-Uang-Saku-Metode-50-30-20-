import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  CheckCircle2,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';
import {
  UserProfileData,
  AllocationRatios,
  AllocationCategory,
  SubItem,
  InvestmentConfig,
  AllocationSnapshot,
  ToastMessage
} from './types';
import {
  getActiveUserName,
  setActiveUserName,
  loadUserProfile,
  saveUserProfile,
  deleteUserProfile,
  createDefaultProfile
} from './utils/storage';
import { formatRupiah, calculateCompoundInterest } from './utils/formatters';
import { exportToCSV, exportToPDF } from './utils/export';
import { soundFx } from './utils/audio';

import { Header } from './components/Header';
import { IncomeInput } from './components/IncomeInput';
import { AllocationSliders } from './components/AllocationSliders';
import { DonutChart } from './components/DonutChart';
import { CategoryCards } from './components/CategoryCards';
import { InvestmentProjection } from './components/InvestmentProjection';
import { UserLoginModal } from './components/UserLoginModal';
import { ActionHistoryModal } from './components/ActionHistoryModal';
import { ScrollTopBottom } from './components/ScrollTopBottom';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

export default function App() {
  // Theme State: default to dark fintech UI as requested in prompt, with toggle
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('uang_saku_theme');
      if (savedTheme) return savedTheme === 'dark';
      return true; // Fintech dark mode default
    }
    return true;
  });

  // Sound & Voice State
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // User and Profile State
  const [activeUser, setActiveUser] = useState<string>('');
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState<boolean>(false);

  // Sync state & Toasts
  const [lastSavedTime, setLastSavedTime] = useState<string>('Baru saja');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Dark Mode class with <html> element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('uang_saku_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('uang_saku_theme', 'light');
    }
  }, [isDark]);

  // Initial Load: Check if there is an active user stored in Local Storage
  useEffect(() => {
    const storedUser = getActiveUserName();
    if (storedUser) {
      const loaded = loadUserProfile(storedUser);
      setActiveUser(storedUser);
      setProfile(loaded);
    } else {
      // Default to "Pelajar/Mahasiswa" or show login modal
      const defaultUser = 'Mahasiswa Cerdas';
      const loaded = loadUserProfile(defaultUser);
      setActiveUser(defaultUser);
      setProfile(loaded);
    }
  }, []);

  // Real-time autosave to localStorage whenever profile state changes
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (profile && profile.userName) {
      saveUserProfile(profile);
      setLastSavedTime(
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }
  }, [profile]);

  // Handle Switch / Select User
  const handleSelectUser = (name: string) => {
    const loaded = loadUserProfile(name);
    setActiveUser(name);
    setProfile(loaded);
    setActiveUserName(name);
    setIsLoginModalOpen(false);
    addToast('success', 'Brankas Profil Terbuka', `Memuat data alokasi untuk "${name}".`);
  };

  // Handle Delete User
  const handleDeleteUser = (name: string) => {
    deleteUserProfile(name);
    if (activeUser === name) {
      const fallbackUser = 'Pengguna Baru';
      const fallbackProfile = loadUserProfile(fallbackUser);
      setActiveUser(fallbackUser);
      setProfile(fallbackProfile);
    }
    addToast('info', 'Profil Dihapus', `Data brankas "${name}" berhasil dihapus.`);
  };

  // Profile Update Handlers
  const handleIncomeChange = (newIncome: number) => {
    if (!profile) return;
    setProfile((prev) => (prev ? { ...prev, income: newIncome } : prev));
  };

  const handlePeriodChange = (newPeriod: 'bulanan' | 'mingguan') => {
    if (!profile) return;
    setProfile((prev) => (prev ? { ...prev, period: newPeriod } : prev));
  };

  const handleRatiosChange = (newRatios: AllocationRatios) => {
    if (!profile) return;
    setProfile((prev) => (prev ? { ...prev, ratios: newRatios } : prev));
  };

  const handleInvestmentConfigChange = (newConfig: InvestmentConfig) => {
    if (!profile) return;
    setProfile((prev) => (prev ? { ...prev, investmentConfig: newConfig } : prev));
  };

  // Sub-items CRUD
  const handleAddItem = (category: AllocationCategory, name: string, amount: number) => {
    if (!profile) return;
    const newItem: SubItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      category,
      name,
      amount
    };
    setProfile((prev) => (prev ? { ...prev, items: [...prev.items, newItem] } : prev));
    addToast('success', 'Sub-Item Ditambahkan', `${name} (${formatRupiah(amount)}) berhasil dimasukkan.`);
  };

  const handleUpdateItem = (id: string, name: string, amount: number) => {
    if (!profile) return;
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((i) => (i.id === id ? { ...i, name, amount } : i))
          }
        : prev
    );
    addToast('info', 'Item Diperbarui', `Perubahan berhasil disimpan.`);
  };

  const handleDeleteItem = (id: string) => {
    if (!profile) return;
    setProfile((prev) =>
      prev ? { ...prev, items: prev.items.filter((i) => i.id !== id) } : prev
    );
    addToast('info', 'Item Dihapus', 'Sub-item berhasil dihapus dari pos pengeluaran.');
  };

  // Snapshots & Menu Aksi (Simpan-Hapus-Edit)
  const handleSaveSnapshot = (title: string, notes?: string) => {
    if (!profile) return;
    const newSnapshot: AllocationSnapshot = {
      id: `snap-${Date.now()}`,
      title,
      createdAt: new Date().toLocaleDateString('id-ID', { dateStyle: 'medium' }),
      income: profile.income,
      ratios: { ...profile.ratios },
      items: [...profile.items],
      notes
    };
    setProfile((prev) => (prev ? { ...prev, snapshots: [newSnapshot, ...prev.snapshots] } : prev));
    addToast('success', 'Skenario Disimpan', `Skenario "${title}" berhasil disimpan ke brankas.`);
  };

  const handleLoadSnapshot = (snapshot: AllocationSnapshot) => {
    if (!profile) return;
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            income: snapshot.income,
            ratios: { ...snapshot.ratios },
            items: [...snapshot.items]
          }
        : prev
    );
    addToast('success', 'Skenario Dimuat', `Alokasi "${snapshot.title}" aktif diterapkan.`);
  };

  const handleDeleteSnapshot = (id: string) => {
    if (!profile) return;
    setProfile((prev) =>
      prev ? { ...prev, snapshots: prev.snapshots.filter((s) => s.id !== id) } : prev
    );
    addToast('info', 'Skenario Dihapus', 'Skenario berhasil dihapus dari riwayat.');
  };

  const handleResetToDefault = () => {
    if (!profile) return;
    const fresh = createDefaultProfile(profile.userName);
    setProfile(fresh);
    soundFx.playSuccess();
    addToast('info', 'Reset Berhasil', 'Konfigurasi dikembalikan ke default 50/30/20.');
  };

  // Export handlers
  const handleExportCSV = () => {
    if (!profile) return;
    exportToCSV(profile);
    addToast('success', 'Ekspor CSV Berhasil', 'File tabel CSV telah diunduh ke komputer Anda.');
  };

  const handleExportPDF = () => {
    if (!profile) return;
    exportToPDF(profile);
    addToast('success', 'Ekspor PDF Berhasil', 'Dokumen PDF format tabel rapi telah diunduh.');
  };

  // Voice Over Narration Engine
  const handleVoiceOver = () => {
    if (!profile) return;

    if (isSpeaking) {
      soundFx.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    const needsNominal = (profile.income * profile.ratios.needs) / 100;
    const wantsNominal = (profile.income * profile.ratios.wants) / 100;
    const savingsNominal = (profile.income * profile.ratios.savings) / 100;
    const proj3 = calculateCompoundInterest(savingsNominal, profile.investmentConfig.annualReturnRate, 3);

    const speechScript = `Halo ${profile.userName}. Berikut adalah ringkasan simulasi alokasi uang saku Anda. Total pendapatan yang diatur adalah ${formatRupiah(profile.income)}. Berdasarkan rasio keuangan yang Anda pilih: Porsi Kebutuhan pokok adalah ${profile.ratios.needs} persen atau sebesar ${formatRupiah(needsNominal)}. Porsi Keinginan dan hiburan adalah ${profile.ratios.wants} persen atau sebesar ${formatRupiah(wantsNominal)}. Dan porsi Tabungan serta investasi rutin adalah ${profile.ratios.savings} persen atau sebesar ${formatRupiah(savingsNominal)}. Jika dana tabungan ini diinvestasikan secara disiplin ke instrumen ${profile.investmentConfig.instrumentName}, dalam tiga tahun ke depan, akumulasi dana Anda diproyeksikan berkembang mencapai ${formatRupiah(proj3.futureValue)}. Pertahankan disiplin keuangan Anda!`;

    soundFx.speak(speechScript);

    // Reset speaking flag after reasonable speech duration or on end
    setTimeout(() => {
      setIsSpeaking(false);
    }, 24000);
  };

  const toggleSound = () => {
    soundFx.soundEnabled = !soundFx.soundEnabled;
    setIsMuted(!soundFx.soundEnabled);
    if (soundFx.soundEnabled) {
      soundFx.playClick();
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
          <span>Memuat Brankas Alokasi...</span>
        </div>
      </div>
    );
  }

  const savingsMonthly = (profile.income * profile.ratios.savings) / 100;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white transition-colors">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main Top Navigation / Header */}
      <Header
        userName={profile.userName}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onVoiceOver={handleVoiceOver}
        isSpeaking={isSpeaking}
        onOpenProfileModal={() => setIsLoginModalOpen(true)}
        onOpenSnapshotModal={() => setIsSnapshotModalOpen(true)}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Real-time sync indicator banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-800 dark:text-sky-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold">Brankas Aktif:</span>
            <span>{profile.userName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400">Tersimpan otomatis: {lastSavedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSnapshotModalOpen(true)}
              className="text-xs font-bold text-sky-700 dark:text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simpan Skenario Snapshot</span>
            </button>
          </div>
        </div>

        {/* Section 1: Income Input */}
        <IncomeInput
          income={profile.income}
          period={profile.period}
          ratios={profile.ratios}
          onChangeIncome={handleIncomeChange}
          onChangePeriod={handlePeriodChange}
        />

        {/* Section 2: Dynamic Normalization Sliders & Pure CSS Donut Chart (2-column layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sliders (8 columns on large screens) */}
          <div className="lg:col-span-7">
            <AllocationSliders
              ratios={profile.ratios}
              onChangeRatios={handleRatiosChange}
            />
          </div>

          {/* Donut Chart (5 columns on large screens) */}
          <div className="lg:col-span-5">
            <DonutChart ratios={profile.ratios} income={profile.income} />
          </div>
        </div>

        {/* Section 3: Detailed Category Cards (Needs, Wants, Savings with itemized budgets) */}
        <CategoryCards
          income={profile.income}
          ratios={profile.ratios}
          items={profile.items}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />

        {/* Section 4: Smart Investment Projection (Gamifikasi & Compound Interest) */}
        <InvestmentProjection
          savingsMonthlyAmount={savingsMonthly}
          config={profile.investmentConfig}
          onChangeConfig={handleInvestmentConfigChange}
        />
      </main>

      {/* Modals */}
      <UserLoginModal
        isOpen={isLoginModalOpen}
        currentUserName={profile.userName}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectUser={handleSelectUser}
        onDeleteUser={handleDeleteUser}
      />

      <ActionHistoryModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        snapshots={profile.snapshots}
        currentIncome={profile.income}
        currentRatios={profile.ratios}
        currentItems={profile.items}
        onSaveCurrentAsSnapshot={handleSaveSnapshot}
        onLoadSnapshot={handleLoadSnapshot}
        onDeleteSnapshot={handleDeleteSnapshot}
        onResetToDefault={handleResetToDefault}
      />

      {/* Floating Scroll-to-Top and Bottom controls */}
      <ScrollTopBottom />

      {/* Footer */}
      <Footer />
    </div>
  );
}
