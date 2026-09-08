import { UserProfileData, SubItem } from '../types';

const STORAGE_USERS_KEY = 'uang_saku_vault_users_v2';
const STORAGE_ACTIVE_USER_KEY = 'uang_saku_active_username_v2';

export const DEFAULT_SUB_ITEMS: SubItem[] = [
  { id: 'item-1', category: 'needs', name: 'Makan & Minum Harian', amount: 300000 },
  { id: 'item-2', category: 'needs', name: 'Transportasi / Bensin', amount: 120000 },
  { id: 'item-3', category: 'needs', name: 'Paket Data / Internet', amount: 80000 },
  { id: 'item-4', category: 'wants', name: 'Jajan, Kopi & Nongkrong', amount: 180000 },
  { id: 'item-5', category: 'wants', name: 'Game & Langganan Hiburan', amount: 120000 },
  { id: 'item-6', category: 'savings', name: 'Tabungan Dana Darurat', amount: 100000 },
  { id: 'item-7', category: 'savings', name: 'Investasi Rutin Saham/Reksadana', amount: 100000 },
];

export function createDefaultProfile(name: string): UserProfileData {
  return {
    userName: name.trim(),
    income: 1000000,
    period: 'bulanan',
    ratios: {
      needs: 50,
      wants: 30,
      savings: 20,
    },
    items: DEFAULT_SUB_ITEMS.map(i => ({ ...i, id: `${i.id}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}` })),
    investmentConfig: {
      instrumentId: 'saham-bluechip',
      instrumentName: 'Saham Blue Chip (BBCA, JSMR, AGRO)',
      annualReturnRate: 14.5,
    },
    snapshots: [],
    updatedAt: new Date().toISOString(),
  };
}

export function getAllSavedProfiles(): Record<string, UserProfileData> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getSavedProfileNames(): string[] {
  const profiles = getAllSavedProfiles();
  return Object.keys(profiles);
}

export function loadUserProfile(name: string): UserProfileData {
  const cleanName = name.trim();
  const profiles = getAllSavedProfiles();

  if (profiles[cleanName]) {
    return profiles[cleanName];
  }

  // If new user, create default and persist
  const newProfile = createDefaultProfile(cleanName);
  saveUserProfile(newProfile);
  return newProfile;
}

export function saveUserProfile(data: UserProfileData): void {
  if (typeof window === 'undefined' || !data.userName) return;
  try {
    const profiles = getAllSavedProfiles();
    profiles[data.userName.trim()] = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(profiles));
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, data.userName.trim());
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function deleteUserProfile(name: string): void {
  if (typeof window === 'undefined') return;
  try {
    const profiles = getAllSavedProfiles();
    delete profiles[name.trim()];
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(profiles));

    const currentActive = getActiveUserName();
    if (currentActive === name.trim()) {
      localStorage.removeItem(STORAGE_ACTIVE_USER_KEY);
    }
  } catch (err) {
    console.error('Failed to delete user profile:', err);
  }
}

export function getActiveUserName(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_ACTIVE_USER_KEY);
}

export function setActiveUserName(name: string | null): void {
  if (typeof window === 'undefined') return;
  if (name) {
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, name.trim());
  } else {
    localStorage.removeItem(STORAGE_ACTIVE_USER_KEY);
  }
}
