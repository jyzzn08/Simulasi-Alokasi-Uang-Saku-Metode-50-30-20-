import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserProfileData } from '../types';
import { formatRupiah, calculateCompoundInterest } from './formatters';

export function exportToCSV(profile: UserProfileData): void {
  const needsNominal = (profile.income * profile.ratios.needs) / 100;
  const wantsNominal = (profile.income * profile.ratios.wants) / 100;
  const savingsNominal = (profile.income * profile.ratios.savings) / 100;

  const projection1 = calculateCompoundInterest(savingsNominal, profile.investmentConfig.annualReturnRate, 1);
  const projection3 = calculateCompoundInterest(savingsNominal, profile.investmentConfig.annualReturnRate, 3);
  const projection5 = calculateCompoundInterest(savingsNominal, profile.investmentConfig.annualReturnRate, 5);
  const projection10 = calculateCompoundInterest(savingsNominal, profile.investmentConfig.annualReturnRate, 10);

  const lines: string[] = [
    `"LAPORAN SIMULASI ALOKASI UANG SAKU (METODE 50/30/20)"`,
    `"Nama Pengguna","${profile.userName}"`,
    `"Periode","${profile.period === 'bulanan' ? 'Bulanan' : 'Mingguan'}"`,
    `"Total Uang Saku","${formatRupiah(profile.income)}"`,
    `"Tanggal Ekspor","${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}"`,
    ``,
    `"=== RINGKASAN ALOKASI UTAMA ==="`,
    `"Kategori","Rasio Persentase","Nominal (IDR)","Keterangan"`,
    `"Kebutuhan (Needs)","${profile.ratios.needs}%","${needsNominal}","Makanan, transportasi, tagihan pokok, kebutuhan esensial"`,
    `"Keinginan (Wants)","${profile.ratios.wants}%","${wantsNominal}","Jajan, hiburan, hobi, rekreasi, belanja pribadi"`,
    `"Tabungan (Savings)","${profile.ratios.savings}%","${savingsNominal}","Dana darurat & investasi rutin compound interest"`,
    `"Total","100%","${profile.income}","Total Seimbang"`,
    ``,
    `"=== RINCIAN ANGGARAN ITEM PENGELUARAN ==="`,
    `"No","Nama Item Pengeluaran","Kategori","Nominal Anggaran (IDR)"`,
    ...profile.items.map((item, index) => {
      const catLabel = item.category === 'needs' ? 'Kebutuhan' : item.category === 'wants' ? 'Keinginan' : 'Tabungan';
      return `"${index + 1}","${item.name.replace(/"/g, '""')}","${catLabel}","${item.amount}"`;
    }),
    ``,
    `"=== SIMULASI PROYEKSI INVESTASI BUNGA MAJEMUK (GAMIFIKASI) ==="`,
    `"Instrumen Terpilih","${profile.investmentConfig.instrumentName}"`,
    `"Estimasi Return Tahunan","${profile.investmentConfig.annualReturnRate}% / tahun"`,
    `"Setoran Rutin Bulanan","${formatRupiah(savingsNominal)}"`,
    `"Jangka Waktu","Total Modal Disetor (IDR)","Keuntungan Bunga Majemuk (IDR)","Total Akumulasi Akhir (IDR)","ROI (%)"`,
    `"1 Tahun","${projection1.totalDeposit}","${projection1.interestEarned}","${projection1.futureValue}","${projection1.roiPercentage.toFixed(1)}%"`,
    `"3 Tahun","${projection3.totalDeposit}","${projection3.interestEarned}","${projection3.futureValue}","${projection3.roiPercentage.toFixed(1)}%"`,
    `"5 Tahun","${projection5.totalDeposit}","${projection5.interestEarned}","${projection5.futureValue}","${projection5.roiPercentage.toFixed(1)}%"`,
    `"10 Tahun","${projection10.totalDeposit}","${projection10.interestEarned}","${projection10.futureValue}","${projection10.roiPercentage.toFixed(1)}%"`,
    ``,
    `"Catatan","Copyright (c) 2025 Aplikasi Agenda Kerja Harian. All Rights Reserved."`
  ];

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Alokasi_Uang_Saku_${profile.userName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(profile: UserProfileData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const needsNominal = (profile.income * profile.ratios.needs) / 100;
  const wantsNominal = (profile.income * profile.ratios.wants) / 100;
  const savingsNominal = (profile.income * profile.ratios.savings) / 100;

  // Primary Header Banner
  doc.setFillColor(2, 132, 199); // Sky blue #0284c7
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('SIMULASI ALOKASI UANG SAKU (METODE 50/30/20)', 105, 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Laporan Perencanaan Finansial & Proyeksi Investasi Cerdas', 105, 19, { align: 'center' });

  // Metadata Card
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Profil Pengguna: ${profile.userName}`, 14, 38);
  doc.text(`Total Uang Saku: ${formatRupiah(profile.income)} (${profile.period === 'bulanan' ? 'Per Bulan' : 'Per Minggu'})`, 14, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}`, 140, 38);
  doc.text(`Status Rasio: ${profile.ratios.needs}% Kebutuhan / ${profile.ratios.wants}% Keinginan / ${profile.ratios.savings}% Tabungan`, 140, 44);

  // Table 1: Alokasi Utama
  autoTable(doc, {
    startY: 50,
    head: [['Kategori', 'Porsi', 'Nominal (Rupiah)', 'Fokus Peruntukan']],
    body: [
      ['Kebutuhan Pokok (Needs)', `${profile.ratios.needs}%`, formatRupiah(needsNominal), 'Makan, transportasi harian, bensin, pulsa, kos'],
      ['Keinginan (Wants)', `${profile.ratios.wants}%`, formatRupiah(wantsNominal), 'Jajan, kopi, belanja hobi, bioskop, game'],
      ['Tabungan & Investasi (Savings)', `${profile.ratios.savings}%`, formatRupiah(savingsNominal), 'Dana darurat & instrumen investasi compound interest'],
      ['TOTAL SEIMBANG', '100%', formatRupiah(profile.income), 'Teralokasi Penuh (Normalisasi Otomatis)']
    ],
    headStyles: {
      fillColor: [3, 105, 161],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [240, 249, 255]
    },
    theme: 'grid'
  });

  // Table 2: Rincian Anggaran Detail
  const lastTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 95;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(3, 105, 161);
  doc.text('Rincian Sub-Item Anggaran', 14, lastTableY + 8);

  const itemsBody = profile.items.map((item, idx) => {
    const catText = item.category === 'needs' ? 'Kebutuhan' : item.category === 'wants' ? 'Keinginan' : 'Tabungan';
    return [
      (idx + 1).toString(),
      item.name,
      catText,
      formatRupiah(item.amount)
    ];
  });

  autoTable(doc, {
    startY: lastTableY + 11,
    head: [['No', 'Nama Item', 'Kategori', 'Nominal']],
    body: itemsBody.length > 0 ? itemsBody : [['-', 'Belum ada rincian item', '-', '-']],
    headStyles: {
      fillColor: [56, 189, 248],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    theme: 'striped'
  });

  // Table 3: Proyeksi Investasi
  const table2Y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 160;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(3, 105, 161);
  doc.text(`Simulasi Efek Bunga Majemuk (${profile.investmentConfig.instrumentName})`, 14, table2Y + 8);

  const proj1 = calculateCompoundInterest(savingsNominal, profile.investmentConfig.annualReturnRate, 1);
  const proj3 = calculateCompoundInterest(savingsNominal, profile.investmentConfig.annualReturnRate, 3);
  const proj5 = calculateCompoundInterest(savingsNominal, profile.investmentConfig.annualReturnRate, 5);
  const proj10 = calculateCompoundInterest(savingsNominal, profile.investmentConfig.annualReturnRate, 10);

  autoTable(doc, {
    startY: table2Y + 11,
    head: [['Periode', 'Setoran Rutin', 'Total Modal Disetor', 'Keuntungan Bunga', 'Nilai Akumulasi Akhir']],
    body: [
      ['1 Tahun (12 Bln)', `${formatRupiah(savingsNominal)}/bln`, formatRupiah(proj1.totalDeposit), `+${formatRupiah(proj1.interestEarned)}`, formatRupiah(proj1.futureValue)],
      ['3 Tahun (36 Bln)', `${formatRupiah(savingsNominal)}/bln`, formatRupiah(proj3.totalDeposit), `+${formatRupiah(proj3.interestEarned)}`, formatRupiah(proj3.futureValue)],
      ['5 Tahun (60 Bln)', `${formatRupiah(savingsNominal)}/bln`, formatRupiah(proj5.totalDeposit), `+${formatRupiah(proj5.interestEarned)}`, formatRupiah(proj5.futureValue)],
      ['10 Tahun (120 Bln)', `${formatRupiah(savingsNominal)}/bln`, formatRupiah(proj10.totalDeposit), `+${formatRupiah(proj10.interestEarned)}`, formatRupiah(proj10.futureValue)],
    ],
    headStyles: {
      fillColor: [14, 165, 233],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [240, 249, 255]
    },
    theme: 'grid'
  });

  // Footer text
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 260;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Copyright (c) 2025 Aplikasi Agenda Kerja Harian. All Rights Reserved.', 105, Math.min(285, Math.max(finalY + 12, 275)), { align: 'center' });

  doc.save(`Alokasi_50_30_20_${profile.userName.replace(/\s+/g, '_')}.pdf`);
}
