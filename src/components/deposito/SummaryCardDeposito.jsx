export default function SummaryCardDeposito({ formData, hasil, formatIDR }) {
  const isCalculated = hasil.length > 0;

  const modalAwal = formData.nominalDeposito;

  const saldoAkhir = isCalculated ? hasil[hasil.length - 1].saldoAkhir : 0;

  const totalKeuntunganNetto = isCalculated ? saldoAkhir - modalAwal : 0;

  const totalPajak = isCalculated
    ? hasil.reduce((acc, curr) => acc + curr.pajak, 0)
    : 0;

  return (
    <div className="bg-brand-900 text-white p-8 rounded-3xl shadow-xl space-y-6 flex flex-col justify-center">
      <div>
        <p className="text-brand-200 text-xs uppercase tracking-widest font-bold">
          Estimasi Saldo Jatuh Tempo
        </p>
        <h3 className="text-3xl font-black mt-1">
          {isCalculated ? formatIDR(saldoAkhir) : formatIDR(0)}
        </h3>
      </div>

      <div className="pt-6 border-t border-brand-800 space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-300">Nominal Penempatan</span>
          <span className="font-bold">{formatIDR(modalAwal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-brand-300">Keuntungan Bersih (Net)</span>
          <span className="font-bold text-emerald-400">
            {totalKeuntunganNetto > 0
              ? `+${formatIDR(totalKeuntunganNetto)}`
              : formatIDR(0)}
          </span>
        </div>

        <div className="flex justify-between border-t border-brand-800/50 pt-4">
          <span className="text-brand-300">Estimasi Total Pajak</span>
          <span className="font-bold text-red-300">
            {totalPajak > 0 ? `-${formatIDR(totalPajak)}` : formatIDR(0)}
          </span>
        </div>
      </div>

      {!isCalculated && (
        <div className="bg-brand-800/50 p-3 rounded-xl border border-brand-700">
          <p className="text-[10px] text-brand-300 text-center italic">
            Klik tombol hitung untuk melihat proyeksi hasil deposito Anda.
          </p>
        </div>
      )}
    </div>
  );
}
