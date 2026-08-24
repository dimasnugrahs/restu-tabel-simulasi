import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import InputSectionKredit from "../components/kredit/InputSectionKredit";
import SummaryCardKredit from "../components/kredit/SummaryCardKredit";
import ResultTableKredit from "../components/kredit/ResultTableKredit";

const getTodayDate = () => new Date().toISOString().split("T")[0];

export default function Kredit() {
  const [formData, setFormData] = useState({
    jenisKredit: "menurun", // "menurun" | "anuitas" | "tetap" | "ljt"
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
      jenisKredit,
      plafon: rawPlafon,
      tenorBulan: rawTenor,
      bungaTahunan: rawBunga,
      tanggalPengajuan,
    } = formData;

    const plafon = Number(rawPlafon) || 0;
    const tenor = Number(rawTenor) || 0;
    const bungaTahunan = Number(rawBunga) || 0;

    if (!plafon || !tenor || tenor <= 0) return;

    const bungaBulanan = bungaTahunan / 100 / 12;
    let sisaPinjaman = plafon;
    const baseDate = new Date(tanggalPengajuan);

    // ==========================================
    // 1. KREDIT MENURUN (Efektif Pokok Tetap)
    // ==========================================
    if (jenisKredit === "menurun") {
      const angsuranPokokTetap = plafon / tenor;

      for (let i = 1; i <= tenor; i++) {
        const bungaBulanIni = sisaPinjaman * bungaBulanan;
        const totalAngsuran = angsuranPokokTetap + bungaBulanIni;
        sisaPinjaman -= angsuranPokokTetap;

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
    }

    // ==========================================
    // 2. KREDIT ANUITAS (Angsuran Flat/Tetap)
    // ==========================================
    else if (jenisKredit === "anuitas") {
      let angsuranAnuitas = 0;
      if (bungaBulanan > 0) {
        angsuranAnuitas =
          (plafon * (bungaBulanan * Math.pow(1 + bungaBulanan, tenor))) /
          (Math.pow(1 + bungaBulanan, tenor) - 1);
      } else {
        angsuranAnuitas = plafon / tenor;
      }

      for (let i = 1; i <= tenor; i++) {
        const bungaBulanIni = sisaPinjaman * bungaBulanan;
        let pokokBulanIni = angsuranAnuitas - bungaBulanIni;

        // Penyesuaian bulan terakhir agar sisaPinjaman persis 0
        if (i === tenor) {
          pokokBulanIni = sisaPinjaman;
          angsuranAnuitas = pokokBulanIni + bungaBulanIni;
        }

        sisaPinjaman -= pokokBulanIni;

        const tglTagihan = new Date(baseDate);
        tglTagihan.setMonth(baseDate.getMonth() + i);

        dataSimulasi.push({
          bulan: i,
          tanggal: tglTagihan.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          cicilan: angsuranAnuitas,
          pokok: pokokBulanIni,
          bunga: bungaBulanIni,
          sisaPinjaman: Math.abs(sisaPinjaman) < 0.01 ? 0 : sisaPinjaman,
        });
      }
    }

    // ==========================================
    // 3. KREDIT TETAP (Flat Rate)
    // ==========================================
    else if (jenisKredit === "tetap") {
      const pokokTetap = plafon / tenor;
      const bungaTetap = plafon * bungaBulanan;
      const cicilanTetap = pokokTetap + bungaTetap;

      for (let i = 1; i <= tenor; i++) {
        sisaPinjaman -= pokokTetap;

        const tglTagihan = new Date(baseDate);
        tglTagihan.setMonth(baseDate.getMonth() + i);

        dataSimulasi.push({
          bulan: i,
          tanggal: tglTagihan.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          cicilan: cicilanTetap,
          pokok: pokokTetap,
          bunga: bungaTetap,
          sisaPinjaman: Math.abs(sisaPinjaman) < 0.01 ? 0 : sisaPinjaman,
        });
      }
    }

    // ==========================================
    // 4. KREDIT LJT (Lunas Jatuh Tempo)
    // ==========================================
    else if (jenisKredit === "ljt") {
      const bungaBulanIni = plafon * bungaBulanan;

      for (let i = 1; i <= tenor; i++) {
        const isLastMonth = i === tenor;
        const pokokBulanIni = isLastMonth ? plafon : 0;
        const totalAngsuran = pokokBulanIni + bungaBulanIni;

        sisaPinjaman = isLastMonth ? 0 : plafon;

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
          pokok: pokokBulanIni,
          bunga: bungaBulanIni,
          sisaPinjaman: sisaPinjaman,
        });
      }
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

    const labelMap = {
      menurun: "Kredit Menurun (Bunga Efektif)",
      anuitas: "Kredit Anuitas",
      tetap: "Kredit Tetap (Flat Rate)",
      ljt: "Kredit LJT (Lunas Jatuh Tempo)",
    };

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
    doc.text(`Laporan Simulasi ${labelMap[formData.jenisKredit]}`, 14, 28);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan Parameter:", 14, 42);

    doc.setFont("helvetica", "normal");
    doc.text(`Tanggal Pengajuan: ${tglPengajuanIndo}`, 14, 48);
    doc.text(`Jumlah Pinjaman: ${formatIDR(Number(formData.plafon))}`, 14, 54);
    doc.text(`Lama Pinjaman: ${formData.tenorBulan} Bulan`, 14, 60);
    doc.text(`Bunga Per Tahun: ${formData.bungaTahunan}%`, 14, 66);
    doc.text(`Sistem Bunga: ${labelMap[formData.jenisKredit]}`, 14, 72);

    const totalBunga = hasil.reduce((acc, curr) => acc + curr.bunga, 0);
    const totalPengembalian = (Number(formData.plafon) || 0) + totalBunga;

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
      startY: 78,
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
      `Catatan: Perhitungan menggunakan metode ${labelMap[formData.jenisKredit]}.`,
      14,
      finalY,
    );
    doc.text(
      "Simulasi ini merupakan ilustrasi. Perhitungan sebenarnya mengikuti sistem Bank Restu Dewata.",
      14,
      finalY + 5,
    );

    doc.save(`Simulasi_Kredit_${formData.jenisKredit}_${Date.now()}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-black text-brand-900 tracking-tight">
          Kalkulator Kredit
        </h2>
        <p className="text-gray-500 mt-2">
          Simulasi cicilan bulanan dengan sistem Menurun, Anuitas, Tetap, maupun
          LJT.
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
