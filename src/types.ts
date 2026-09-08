export type AllocationCategory = 'needs' | 'wants' | 'savings';

export interface SubItem {
  id: string;
  category: AllocationCategory;
  name: string;
  amount: number;
}

export interface AllocationRatios {
  needs: number;   // e.g. 50%
  wants: number;   // e.g. 30%
  savings: number; // e.g. 20%
}

export interface InvestmentConfig {
  instrumentId: string;
  instrumentName: string;
  annualReturnRate: number; // in percentage e.g. 14 for 14%
  customReturnRate?: number;
  monthlyDepositBonus?: number;
}

export interface AllocationSnapshot {
  id: string;
  title: string;
  createdAt: string;
  income: number;
  ratios: AllocationRatios;
  items: SubItem[];
  notes?: string;
}

export interface UserProfileData {
  userName: string;
  income: number;
  period: 'bulanan' | 'mingguan';
  ratios: AllocationRatios;
  items: SubItem[];
  investmentConfig: InvestmentConfig;
  snapshots: AllocationSnapshot[];
  updatedAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}
