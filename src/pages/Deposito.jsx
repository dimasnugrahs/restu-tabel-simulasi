import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import InputSectionDeposito from "../components/deposito/InputSectionDeposito";
import SummaryCardDeposito from "../components/deposito/SummaryCardDeposito";
import ResultTableDeposito from "../components/deposito/ResultTableDeposito";

const getTodayDate = () => new Date().toISOString().split("T")[0];

export default function Deposito() {
  const [formData, setFormData] = useState({
    nominalDeposito: 1000000,
    bungaTahunan: 5,
    tenorBulan: 12,
    tanggalMulai: getTodayDate(),
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
    const pokok = formData.nominalDeposito;
    const bungaPerTahun = formData.bungaTahunan / 100;
    const { tanggalMulai } = formData;
    const baseDate = new Date(tanggalMulai);

    const bungaBrutoBulanan = (pokok * bungaPerTahun) / 12;

    const nominalPajakBulanan = pokok >= 7500000 ? bungaBrutoBulanan * 0.2 : 0;
    const bungaNetBulanan = bungaBrutoBulanan - nominalPajakBulanan;

    let totalAkumulasiBunga = 0;

    for (let i = 1; i <= formData.tenorBulan; i++) {
      totalAkumulasiBunga += bungaNetBulanan;

      const tglBunga = new Date(baseDate);
      tglBunga.setMonth(baseDate.getMonth() + i);

      dataSimulasi.push({
        bulan: i,
        tanggal: tglBunga.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        bungaBruto: bungaBrutoBulanan,
        pajak: nominalPajakBulanan,
        bungaNet: bungaNetBulanan,
        saldoAkhir: pokok + totalAkumulasiBunga,
      });
    }
    setHasil(dataSimulasi);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const namaApp = "SIMURES";
    const isCalculated = hasil.length > 0;
    const tglCair = isCalculated ? hasil[hasil.length - 1].tanggal : "-";

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
    doc.text("Laporan Simulasi Deposito Berjangka", 14, 28);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan Parameter:", 14, 42);

    doc.setFont("helvetica", "normal");
    doc.text(
      `Nominal Penempatan: ${formatIDR(formData.nominalDeposito)}`,
      14,
      48,
    );
    doc.text(`Tenor: ${formData.tenorBulan} Bulan`, 14, 54);
    doc.text(`Tanggal Jatuh Tempo: ${tglCair}`, 14, 60);
    doc.text(
      `Bunga Tahunan: ${formData.bungaTahunan}% (Pajak 20% jika saldo >= 7.5jt)`,
      14,
      66,
    );

    // 3. Ringkasan Hasil
    const totalBungaNet = hasil.reduce((acc, curr) => acc + curr.bungaNet, 0);
    const saldoAkhir = hasil[hasil.length - 1].saldoAkhir;

    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Keuntungan Bunga (Net): ${formatIDR(totalBungaNet)}`,
      110,
      48,
    );
    doc.text(`Total Akumulasi Dana: ${formatIDR(saldoAkhir)}`, 110, 54);

    // 4. Tabel Rincian (Disesuaikan Kolomnya)
    const tableRows = hasil.map((row) => [
      row.bulan,
      row.tanggal,
      formatIDR(row.bungaBruto),
      row.pajak > 0 ? formatIDR(row.pajak) : "Bebas Pajak",
      formatIDR(row.bungaNet),
      formatIDR(row.saldoAkhir),
    ]);

    autoTable(doc, {
      startY: 75,
      head: [
        [
          "Bulan",
          "Tanggal Bayar Bunga",
          "Bunga (Bruto)",
          "Pajak (20%)",
          "Bunga Net",
          "Akumulasi Dana",
        ],
      ],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235], halign: "center" },
      columnStyles: {
        0: { halign: "center" },
        2: { textColor: [220, 38, 38] },
        3: { textColor: [16, 185, 129] }, // Hijau untuk bunga net
        4: { fontStyle: "bold" },
      },
    });

    // 5. Catatan Kaki
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text(
      "Catatan: Pajak 20% dikenakan jika total penempatan di atas Rp 7.500.000.",
      14,
      finalY,
    );
    doc.text(
      "Simulasi ini merupakan ilustrasi. Perhitungan sebenarnya mengikuti perhitungan di sistem Bank Restu Dewata.",
      14,
      finalY + 5,
    );

    doc.save(`Simulasi_Deposito_${Date.now()}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-black text-brand-900 tracking-tight">
          Deposito
        </h2>
        <p className="text-gray-500 mt-2">Investasi dengan bunga kompetitif.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <InputSectionDeposito
          formData={formData}
          setFormData={setFormData}
          onHitung={hitungSimulasi}
        />
        <SummaryCardDeposito
          formData={formData}
          hasil={hasil}
          formatIDR={formatIDR}
        />
      </div>

      {hasil.length > 0 && (
        <ResultTableDeposito
          hasil={hasil}
          formatIDR={formatIDR}
          onExport={exportToPDF}
        />
      )}
    </div>
  );
}
