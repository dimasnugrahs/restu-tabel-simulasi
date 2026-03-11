import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import InputSection from "../components/tabunganberjangka/InputSection";
import SummaryCard from "../components/tabunganberjangka/SummaryCard";
import ResultTable from "../components/tabunganberjangka/ResultTable";

export default function TabunganBerjangka() {
  const [formData, setFormData] = useState({
    setoranBulanan: 100000,
    bungaTahunan: 4,
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
    let saldo = 0;
    const bungaPerBulan = formData.bungaTahunan / 100 / 12;

    for (let i = 1; i <= formData.tenorBulan; i++) {
      saldo += formData.setoranBulanan;

      const bungaBruto = saldo * bungaPerBulan;

      const nominalPajak = saldo > 7500000 ? bungaBruto * 0.2 : 0;
      const bungaNetto = bungaBruto - nominalPajak;

      saldo += bungaNetto;

      dataSimulasi.push({
        bulan: i,
        setoran: formData.setoranBulanan,
        bungaBruto: bungaBruto,
        pajak: nominalPajak,
        bungaNet: bungaNetto,
        saldoAkhir: saldo,
      });
    }
    setHasil(dataSimulasi);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const namaApp = "SIMURES - RESTU DEWATA";

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
    doc.text("Laporan Simulasi Tabungan Berjangka", 14, 28);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan Parameter:", 14, 42);

    doc.setFont("helvetica", "normal");
    doc.text(`Setoran Awal: ${formatIDR(0)}`, 14, 48);
    doc.text(
      `Setoran Rutin: ${formatIDR(formData.setoranBulanan)} / bulan`,
      14,
      54,
    );
    doc.text(
      `Bunga Tahunan: ${formData.bungaTahunan}% (Pajak 20% jika saldo > 7.5jt)`,
      14,
      60,
    );
    doc.text(`Tenor: ${formData.tenorBulan} Bulan`, 14, 66);

    const totalBungaNet = hasil.reduce((acc, curr) => acc + curr.bungaNet, 0);
    const saldoAkhir = hasil[hasil.length - 1].saldoAkhir;

    doc.setFont("helvetica", "bold");
    doc.text(`Total Bunga (Net): ${formatIDR(totalBungaNet)}`, 120, 48);
    doc.text(`Estimasi Saldo Akhir: ${formatIDR(saldoAkhir)}`, 120, 54);

    const tableRows = hasil.map((row) => [
      row.bulan,
      formatIDR(row.setoran),
      formatIDR(row.bungaBruto),
      row.pajak > 0 ? formatIDR(row.pajak) : "Bebas Pajak",
      formatIDR(row.saldoAkhir),
    ]);

    autoTable(doc, {
      startY: 75,
      head: [
        ["Bulan", "Setoran", "Bunga (Bruto)", "Pajak (20%)", "Saldo Akhir"],
      ],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235], halign: "center" },
      columnStyles: {
        0: { halign: "center" },
        3: { textColor: [220, 38, 38] },
        4: { fontStyle: "bold" },
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text(
      "Catatan: Pajak dikenakan jika saldo di atas Rp 7.500.000.",
      14,
      finalY,
    );
    doc.text(
      "Simulasi ini merupakan ilustrasi, perhitungan sebenarnya mengikuti perhitungan di sistem Bank Restu Dewata",
      14,
      finalY + 5,
    );

    doc.save(`Simulasi_Tabungan_${Date.now()}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-black text-brand-900 tracking-tight">
          Tabungan Barata
        </h2>
        <p className="text-gray-500 mt-2">
          Simulasikan pertumbuhan aset Anda dengan setoran rutin bulanan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <InputSection
          formData={formData}
          setFormData={setFormData}
          onHitung={hitungSimulasi}
        />
        <SummaryCard formData={formData} hasil={hasil} formatIDR={formatIDR} />
      </div>

      {hasil.length > 0 && (
        <ResultTable
          hasil={hasil}
          formatIDR={formatIDR}
          onExport={exportToPDF}
        />
      )}
    </div>
  );
}
