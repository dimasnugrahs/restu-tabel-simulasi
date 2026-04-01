export default function ResultTableDeposito({ hasil, formatIDR, onExport }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-gray-800 text-sm md:text-base">
            Rincian Perhitungan Bunga Bulanan Deposito
          </h4>
        </div>
        <button
          onClick={onExport}
          className="px-4 py-2 bg-brand-50 text-brand-700 text-xs font-bold rounded-xl hover:bg-brand-100 transition-all"
        >
          Cetak PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <th className="px-6 py-4 font-bold">Bulan</th>
              <th className="px-6 py-4 font-bold text-brand-600">
                Tanggal Bayar Bunga
              </th>
              <th className="px-6 py-4 font-bold">Bunga (Bruto)</th>
              <th className="px-6 py-4 font-bold text-red-500">Pajak (20%)</th>
              <th className="px-6 py-4 font-bold">Bunga Net</th>
              <th className="px-6 py-4 font-bold text-right">Akumulasi Dana</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-600">
            {hasil.map((row) => (
              <tr
                key={row.bulan}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium">{row.bulan}</td>
                <td className="px-6 py-4 font-bold text-gray-800">
                  {row.tanggal}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {formatIDR(row.bungaBruto)}
                </td>
                <td className="px-6 py-4">
                  {row.pajak > 0 ? (
                    <span className="text-red-400">
                      -{formatIDR(row.pajak)}
                    </span>
                  ) : (
                    <span className="text-gray-300 italic text-[10px]">
                      Bebas Pajak
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-semibold text-emerald-600">
                  +{formatIDR(row.bungaNet)}
                </td>
                <td className="px-6 py-4 text-right font-bold text-brand-900">
                  {formatIDR(row.saldoAkhir)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-blue-50/50 border-t border-blue-50">
        <p className="text-[10px] text-blue-700 italic">
          *Catatan: Simulasi ini merupakan ilustrasi. Perhitungan sebenarnya
          mengikuti sistem Bank Restu Dewata.
        </p>
      </div>
    </div>
  );
}
