export default function SummaryCardKredit({ formData, hasil, formatIDR }) {
  const isCalculated = hasil.length > 0;
  const tglJatuhTempo = isCalculated ? hasil[hasil.length - 1].tanggal : "-";

  const cicilanPertama = isCalculated ? hasil[0].cicilan : 0;
  const cicilanTerakhir = isCalculated ? hasil[hasil.length - 1].cicilan : 0;

  const totalBunga = isCalculated
    ? hasil.reduce((acc, curr) => acc + curr.bunga, 0)
    : 0;
  const totalPengembalian = formData.plafon + totalBunga;

  return (
    <div className="bg-brand-900 text-white p-8 rounded-3xl shadow-xl space-y-6 flex flex-col justify-center">
      <div className="space-y-1">
        <p className="text-brand-200 text-xs uppercase tracking-widest font-bold">
          Rentang Cicilan Bulanan
        </p>
        <h3 className="text-xl font-black">
          {isCalculated ? `${formatIDR(cicilanPertama)}` : formatIDR(0)}
        </h3>
        <p className="text-brand-400 text-xs">
          menurun hingga {formatIDR(cicilanTerakhir)}
        </p>
      </div>

      <div className="pt-6 border-t border-brand-800 space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-300">Total Bunga (Efektif)</span>
          <span className="font-bold text-red-300">
            {formatIDR(totalBunga)}
          </span>
        </div>
        <div className="flex justify-between border-t border-brand-800/50 pt-4 font-bold">
          <span className="text-brand-300">Total Bayar</span>
          <span>{formatIDR(totalPengembalian)}</span>
        </div>
      </div>
      {!isCalculated && (
        <div className="bg-brand-800/50 p-3 rounded-xl border border-brand-700">
          <p className="text-[10px] text-brand-300 text-center italic">
            Klik tombol hitung untuk melihat proyeksi kredit Anda.
          </p>
        </div>
      )}

      <div className="pt-6 border-t border-brand-800 space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-300">Jatuh Tempo Akhir</span>
          <span className="font-bold text-brand-100">{tglJatuhTempo}</span>
        </div>
      </div>
    </div>
  );
}
