import React, { useState, useEffect } from 'react';
import { User, Plus, Trash2, ArrowRight, ShieldCheck, X, HardDrive } from 'lucide-react';
import { getAllSavedProfiles } from '../utils/storage';
import { formatRupiah } from '../utils/formatters';
import { soundFx } from '../utils/audio';

interface UserLoginModalProps {
  isOpen: boolean;
  currentUserName: string;
  onClose?: () => void;
  onSelectUser: (userName: string) => void;
  onDeleteUser?: (userName: string) => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  currentUserName,
  onClose,
  onSelectUser,
  onDeleteUser
}) => {
  const [inputName, setInputName] = useState('');
  const [profiles, setProfiles] = useState<ReturnType<typeof getAllSavedProfiles>>({});

  useEffect(() => {
    if (isOpen) {
      setProfiles(getAllSavedProfiles());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (nameToLogin: string) => {
    const trimmed = nameToLogin.trim();
    if (!trimmed) return;
    soundFx.playSuccess();
    onSelectUser(trimmed);
    setInputName('');
  };

  const profileKeys = Object.keys(profiles);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
        {/* Background accent glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-sky-500/10 blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Masuk ke Brankas Pengguna
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Penyimpanan lokal aman tanpa server
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Input Name Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(inputName);
          }}
          className="mb-5"
        >
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Masukkan Nama Anda / Profil Baru:
          </label>
          <div className="flex gap-2">
            <input
              id="input-login-username"
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Contoh: Budi, Sarah, Rizky..."
              maxLength={30}
              autoFocus
              className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            <button
              id="btn-login-submit"
              type="submit"
              disabled={!inputName.trim()}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white shadow-md shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Buka</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Saved Profiles List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Profil Tersimpan di Komputer ({profileKeys.length})
            </span>
          </div>

          {profileKeys.length === 0 ? (
            <div className="text-center py-6 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 text-xs">
              <HardDrive className="w-6 h-6 mx-auto mb-1.5 opacity-40 text-sky-500" />
              Belum ada profil tersimpan. Masukkan nama Anda di atas untuk mulai membuat alokasi.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {profileKeys.map((name) => {
                const profile = profiles[name];
                const isActive = name === currentUserName;
                return (
                  <div
                    key={name}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      isActive
                        ? 'border-sky-500/60 bg-sky-50/60 dark:bg-sky-950/30 text-sky-900 dark:text-sky-200 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                    }`}
                  >
                    <button
                      onClick={() => handleLogin(name)}
                      className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <span>{name}</span>
                          {isActive && (
                            <span className="text-[10px] bg-sky-500 text-white px-1.5 py-0.2 rounded font-normal">
                              Aktif
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {profile ? `${formatRupiah(profile.income)} • Rasio ${profile.ratios.needs}/${profile.ratios.wants}/${profile.ratios.savings}` : 'Data tersimpan'}
                        </div>
                      </div>
                    </button>

                    {onDeleteUser && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.playDelete();
                          if (confirm(`Yakin ingin menghapus seluruh data brankas untuk "${name}"?`)) {
                            onDeleteUser(name);
                            setProfiles(getAllSavedProfiles());
                          }
                        }}
                        title="Hapus profil ini dari penyimpanan"
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Security badge / Local Storage Explanation */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            Privasi 100% terjaga: Data disimpan di browser lokal Anda (Local Storage) dan otomatis tersinkronisasi setiap kali slider digeser.
          </span>
        </div>
      </div>
    </div>
  );
};
