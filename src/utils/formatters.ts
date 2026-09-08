export function formatRupiah(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }

  if (compact && Math.abs(amount) >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(2)} M`;
  }
  if (compact && Math.abs(amount) >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(2)} Jt`;
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)} Rb`;
  }

  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

export function parseRupiahInput(value: string): number {
  const clean = value.replace(/[^0-9]/g, '');
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export interface CompoundResult {
  years: number;
  months: number;
  totalDeposit: number;
  futureValue: number;
  interestEarned: number;
  roiPercentage: number;
}

export function calculateCompoundInterest(
  monthlyDeposit: number,
  annualRatePercentage: number,
  years: number
): CompoundResult {
  const months = years * 12;
  const monthlyRate = annualRatePercentage / 100 / 12;

  let futureValue = 0;
  if (monthlyRate === 0) {
    futureValue = monthlyDeposit * months;
  } else {
    // Formula for annuity future value where deposit is at the end or start of each month
    futureValue = monthlyDeposit * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }

  const totalDeposit = monthlyDeposit * months;
  const interestEarned = Math.max(0, futureValue - totalDeposit);
  const roiPercentage = totalDeposit > 0 ? (interestEarned / totalDeposit) * 100 : 0;

  return {
    years,
    months,
    totalDeposit,
    futureValue,
    interestEarned,
    roiPercentage
  };
}

export const INVESTMENT_PORTFOLIOS = [
  {
    id: 'saham-bluechip',
    name: 'Saham Blue Chip (BBCA, JSMR, AGRO)',
    category: 'Saham & Dividen',
    defaultReturn: 14.5,
    risk: 'Tinggi - Agresif',
    description: 'Portofolio saham unggulan perbankan & infrastruktur dengan dividen solid dan potensi pertumbuhan modal.',
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
  },
  {
    id: 'reksadana-saham',
    name: 'Reksadana Indeks / Saham',
    category: 'Reksadana',
    defaultReturn: 11.5,
    risk: 'Moderat - Tinggi',
    description: 'Dikelola oleh Manajer Investasi profesional mengikuti performa indeks IHSG/LQ45.',
    badgeColor: 'text-sky-500 bg-sky-500/10 border-sky-500/30'
  },
  {
    id: 'reksadana-pendapatan-tetap',
    name: 'Reksadana Pendapatan Tetap (Obligasi)',
    category: 'Obligasi',
    defaultReturn: 8.0,
    risk: 'Moderat',
    description: 'Berisi obligasi pemerintah (SBN/Sukuk) & korporasi dengan yield imbal hasil stabil.',
    badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    id: 'reksadana-pasar-uang',
    name: 'Reksadana Pasar Uang (RDPU)',
    category: 'Pasar Uang',
    defaultReturn: 5.5,
    risk: 'Rendah (Aman)',
    description: 'Sangat likuid, bebas biaya pencairan, cocok untuk dana darurat dan target jangka pendek.',
    badgeColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30'
  },
  {
    id: 'kustom',
    name: 'Instrumen Kustom / Pilihan Sendiri',
    category: 'Kustom',
    defaultReturn: 12.0,
    risk: 'Dapat Disesuaikan',
    description: 'Tentukan sendiri estimasi persentase imbal hasil tahunan yang Anda harapkan.',
    badgeColor: 'text-purple-500 bg-purple-500/10 border-purple-500/30'
  }
];
