"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Transaction = {
  id: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  category: string;
  description: string;
  date: Date | string;
  essential: boolean;
};

export default function LaporanClient({ transactions }: { transactions: Transaction[] }) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  // Filter Data
  const filteredData = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  // Calculate Summary
  const totalIncome = filteredData
    .filter(t => t.type === "CREDIT")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = filteredData
    .filter(t => t.type === "DEBIT")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFont("courier");
    doc.setFontSize(18);
    doc.text("CATATAN DUIT - LAPORAN KEUANGAN", 14, 20);

    doc.setFontSize(10);
    doc.text(`Periode: ${months[selectedMonth]} ${selectedYear}`, 14, 28);
    doc.text(`Dicetak pada: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: idLocale })}`, 14, 33);

    // Summary
    doc.setDrawColor(0);
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 40, 180, 25, "F");

    doc.setFont("courier", "bold");
    doc.text(`PEMASUKAN : Rp ${totalIncome.toLocaleString("id-ID")}`, 20, 48);
    doc.text(`PENGELUARAN: Rp ${totalExpense.toLocaleString("id-ID")}`, 20, 55);
    doc.text(`SISA DUIT  : Rp ${balance.toLocaleString("id-ID")}`, 20, 62);

    // Table
    const tableData = filteredData.map(t => [
      format(new Date(t.date), "dd/MM/yyyy"),
      t.description,
      t.category,
      t.type,
      `Rp ${t.amount.toLocaleString("id-ID")}`
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0], textColor: [0, 255, 0], font: "courier" },
      bodyStyles: { font: "courier", textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    doc.save(`Laporan_Keuangan_${months[selectedMonth]}_${selectedYear}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-carbon-900 border border-carbon-700 p-6 shadow-[8px_8px_0_#000]">
        <div>
          <h2 className="text-2xl font-black uppercase text-white mb-2">Pusat Laporan</h2>
          <p className="font-mono text-xs text-carbon-400">Analisa dosa dan pahala keuangan lo di sini.</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-black border border-carbon-500 text-white p-2 font-mono text-sm focus:border-neon-green outline-none"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-black border border-carbon-500 text-white p-2 font-mono text-sm focus:border-neon-green outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="outline" className="p-6 text-center">
          <h4 className="text-xs font-mono uppercase text-carbon-400 mb-2">Total Pemasukan</h4>
          <p className="text-2xl font-bold text-neon-green">Rp {totalIncome.toLocaleString("id-ID")}</p>
        </Card>
        <Card variant="outline" className="p-6 text-center">
          <h4 className="text-xs font-mono uppercase text-carbon-400 mb-2">Total Pengeluaran</h4>
          <p className="text-2xl font-bold text-red-500">Rp {totalExpense.toLocaleString("id-ID")}</p>
        </Card>
        <Card variant="outline" className="p-6 text-center">
          <h4 className="text-xs font-mono uppercase text-carbon-400 mb-2">Sisa Duit</h4>
          <p className={`text-2xl font-bold ${balance < 0 ? 'text-red-500' : 'text-blue-400'}`}>Rp {balance.toLocaleString("id-ID")}</p>
        </Card>
      </div>

      <Card variant="concrete" className="p-6">
        <div className="flex justify-between items-center mb-6 border-b border-gray-600 pb-4">
          <h3 className="font-bold uppercase text-lg">Rincian Transaksi</h3>
          <Button variant="outline" onClick={handleExportPDF} className="text-xs" disabled={filteredData.length === 0}>
            📥 DOWNLOAD PDF
          </Button>
        </div>

        <div className="overflow-x-auto">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-carbon-400 font-mono">
              DATA KOSONG BOS. BULAN INI LO PUASA DULU?
            </div>
          ) : (
            <table className="w-full font-mono text-sm text-left">
              <thead className="bg-black text-neon-green uppercase border-b-2 border-neon-green">
                <tr>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Deskripsi</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((t) => (
                  <tr key={t.id} className="border-b border-carbon-800 hover:bg-carbon-800/50">
                    <td className="p-3">{format(new Date(t.date), "dd/MM/yyyy")}</td>
                    <td className="p-3 font-bold">{t.description}</td>
                    <td className="p-3">
                      <span className="bg-carbon-700 px-2 py-1 text-[10px] rounded">{t.category}</span>
                      {t.essential && <span className="ml-1 text-red-500">*</span>}
                    </td>
                    <td className={`p-3 text-right font-bold ${t.type === 'DEBIT' ? 'text-white' : 'text-neon-green'}`}>
                      {t.type === 'DEBIT' ? '-' : '+'} Rp {t.amount.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
