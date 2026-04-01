export default function SummaryCard({ formData, hasil, formatIDR }) {
  const isCalculated = hasil.length > 0;
  const tglJatuhTempo = isCalculated ? hasil[hasil.length - 1].tanggal : "-";

  const totalSetoran = isCalculated
    ? formData.setoranBulanan * formData.tenorBulan
    : 0;

  const totalBunga = isCalculated
    ? hasil.reduce((acc, curr) => acc + curr.bungaNet, 0)
    : 0;

  const saldoAkhir = isCalculated ? hasil[hasil.length - 1].saldoAkhir : 0;

  return (
    <div className="bg-brand-900 text-white p-8 rounded-3xl shadow-xl space-y-6 flex flex-col justify-center">
      <div>
        <p className="text-brand-200 text-xs uppercase tracking-widest font-bold">
          Estimasi Saldo Akhir
        </p>
        <h3 className="text-3xl font-black mt-1">{formatIDR(saldoAkhir)}</h3>
      </div>

      <div className="pt-6 border-t border-brand-800 space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-300">Total Akumulasi Setoran</span>
          <span className="font-bold">{formatIDR(totalSetoran)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-brand-300">Total Keuntungan (Net)</span>
          <span className="font-bold text-emerald-400">
            {totalBunga > 0 ? `+${formatIDR(totalBunga)}` : formatIDR(0)}
          </span>
        </div>
      </div>

      <div className="pt-6 border-t border-brand-800 space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-300">Jatuh Tempo Cair</span>
          <span className="font-bold text-brand-100">{tglJatuhTempo}</span>
        </div>
      </div>

      {!isCalculated && (
        <div className="bg-brand-800/50 p-3 rounded-xl border border-brand-700">
          <p className="text-[10px] text-brand-400 italic">
            *Silakan klik tombol hitung untuk melihat estimasi tabungan
            berjangka Anda.
          </p>
        </div>
      )}
    </div>
  );
}
