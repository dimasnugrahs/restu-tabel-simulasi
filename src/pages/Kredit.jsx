import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import InputSectionKredit from "../components/kredit/InputSectionKredit";
import SummaryCardKredit from "../components/kredit/SummaryCardKredit";
import ResultTableKredit from "../components/kredit/ResultTableKredit";

const getTodayDate = () => new Date().toISOString().split("T")[0];

export default function Kredit() {
  const [formData, setFormData] = useState({
    plafon: 5000000,
    bungaTahunan: 18,
    tenorBulan: 12,
    tanggalPengajuan: getTodayDate(),
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
    const {
      plafon,
      tenorBulan: tenor,
      bungaTahunan,
      tanggalPengajuan,
    } = formData;
    const bungaBulanan = bungaTahunan / 100 / 12;
    const angsuranPokokTetap = plafon / tenor;
    let sisaPinjaman = plafon;

    // Base date untuk perhitungan bulan
    const baseDate = new Date(tanggalPengajuan);

    for (let i = 1; i <= tenor; i++) {
      const bungaBulanIni = sisaPinjaman * bungaBulanan;
      const totalAngsuran = angsuranPokokTetap + bungaBulanIni;
      sisaPinjaman -= angsuranPokokTetap;

      // Hitung Tanggal Penagihan (setiap bulan berikutnya)
      const tglTagihan = new Date(baseDate);
      tglTagihan.setMonth(baseDate.getMonth() + i);

      dataSimulasi.push({
        bulan: i,
        tanggal: tglTagihan.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
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
    const isCalculated = hasil.length > 0;

    const tglJatuhTempo = isCalculated ? hasil[hasil.length - 1].tanggal : "-";
    const tglPengajuanIndo = new Date(
      formData.tanggalPengajuan,
    ).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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
    doc.text(`Tanggal Pengajuan: ${tglPengajuanIndo}`, 14, 48);
    doc.text(`Jumlah Pinjaman: ${formatIDR(formData.plafon)}`, 14, 54);
    doc.text(`Lama Pinjaman: ${formData.tenorBulan} Bulan`, 14, 60);
    doc.text(`Bunga Per Tahun: ${formData.bungaTahunan}%`, 14, 66);
    doc.text(`Sistem Bunga: Efektif`, 14, 72);

    const totalBunga = hasil.reduce((acc, curr) => acc + curr.bunga, 0);
    const totalPengembalian = formData.plafon + totalBunga;

    doc.setFont("helvetica", "bold");
    doc.text(`Jatuh Tempo Akhir: ${tglJatuhTempo}`, 110, 48);
    doc.text(`Total Beban Bunga: ${formatIDR(totalBunga)}`, 110, 54);
    doc.text(`Total Pengembalian: ${formatIDR(totalPengembalian)}`, 110, 60);

    const tableRows = hasil.map((row) => [
      row.bulan,
      row.tanggal,
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
          "Tanggal Tagihan",
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
        1: { halign: "center", fontStyle: "bold" },
        2: { textColor: [220, 38, 38] },
        4: { fontStyle: "bold" },
        5: { halign: "right" },
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
