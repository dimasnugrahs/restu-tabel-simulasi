import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import InputSectionKredit from "../components/kredit/InputSectionKredit";
import SummaryCardKredit from "../components/kredit/SummaryCardKredit";
import ResultTableKredit from "../components/kredit/ResultTableKredit";

export default function Kredit() {
  const [formData, setFormData] = useState({
    plafon: 50000000,
    bungaTahunan: 10,
    tenorBulan: 12,
  });

  const [hasil, setHasil] = useState([]);

  const formatIDR = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  const hitungSimulasi = () => {
    let dataSimulasi = [];
    const plafon = formData.plafon;
    const tenor = formData.tenorBulan;
    const bungaBulanan = formData.bungaTahunan / 100 / 12;

    const angsuranPokokTetap = plafon / tenor;

    let sisaPinjaman = plafon;

    for (let i = 1; i <= tenor; i++) {
      const bungaBulanIni = sisaPinjaman * bungaBulanan;

      const totalAngsuran = angsuranPokokTetap + bungaBulanIni;

      sisaPinjaman -= angsuranPokokTetap;

      dataSimulasi.push({
        bulan: i,
        cicilan: totalAngsuran,
        pokok: angsuranPokokTetap,
        bunga: bungaBulanIni,
        sisaPinjaman: Math.abs(sisaPinjaman) < 0.01 ? 0 : sisaPinjaman,
      });
    }
    setHasil(dataSimulasi);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const namaApp = "SIMURES";

    // 1. Header & Judul
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175);
    doc.text(namaApp, 14, 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(150);
    doc.text("- RESTU DEWATA", 48, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Laporan Simulasi Kredit (Bunga Efektif)", 14, 28);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan Parameter:", 14, 42);

    doc.setFont("helvetica", "normal");
    doc.text(`Jumlah Pinjaman: ${formatIDR(formData.plafon)}`, 14, 48);
    doc.text(`Lama Pinjaman: ${formData.tenorBulan} Bulan`, 14, 54);
    doc.text(`Bunga Per Tahun: ${formData.bungaTahunan}%`, 14, 60);
    doc.text(`Sistem Bunga: Efektif (Sliding)`, 14, 66);

    const totalBunga = hasil.reduce((acc, curr) => acc + curr.bunga, 0);
    const totalPengembalian = formData.plafon + totalBunga;

    doc.setFont("helvetica", "bold");
    doc.text(`Total Beban Bunga: ${formatIDR(totalBunga)}`, 110, 48);
    doc.text(`Total Pengembalian: ${formatIDR(totalPengembalian)}`, 110, 54);

    const tableRows = hasil.map((row) => [
      row.bulan,
      formatIDR(row.bunga),
      formatIDR(row.pokok),
      formatIDR(row.cicilan),
      formatIDR(row.sisaPinjaman),
    ]);

    autoTable(doc, {
      startY: 75,
      head: [
        [
          "Bulan",
          "Angsuran Bunga",
          "Angsuran Pokok",
          "Total Angsuran",
          "Sisa Pinjaman",
        ],
      ],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235], halign: "center" },
      columnStyles: {
        0: { halign: "center" },
        1: { textColor: [220, 38, 38] },
        3: { fontStyle: "bold" },
        4: { halign: "right" },
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text(
      "Catatan: Perhitungan menggunakan metode Suku Bunga Efektif dengan Angsuran Pokok tetap.",
      14,
      finalY,
    );
    doc.text(
      "Simulasi ini merupakan ilustrasi. Perhitungan sebenarnya mengikuti sistem Bank Restu Dewata.",
      14,
      finalY + 5,
    );

    doc.save(`Simulasi_Kredit_${Date.now()}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-black text-brand-900 tracking-tight">
          Kalkulator Kredit
        </h2>
        <p className="text-gray-500 mt-2">
          Simulasi cicilan bulanan dengan sistem bunga efektif/anuitas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <InputSectionKredit
          formData={formData}
          setFormData={setFormData}
          onHitung={hitungSimulasi}
        />
        <SummaryCardKredit
          formData={formData}
          hasil={hasil}
          formatIDR={formatIDR}
        />
      </div>

      {hasil.length > 0 && (
        <ResultTableKredit
          hasil={hasil}
          formatIDR={formatIDR}
          onExport={exportToPDF}
        />
      )}
    </div>
  );
}
