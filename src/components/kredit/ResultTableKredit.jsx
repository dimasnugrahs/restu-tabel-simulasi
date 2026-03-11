export default function ResultTableKredit({ hasil, formatIDR, onExport }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-gray-800">
            Jadwal Angsuran Efektif (Anuitas)
          </h4>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            Bunga dihitung dari sisa pokok pinjaman
          </p>
        </div>
        <button
          onClick={onExport}
          className="px-4 py-2 bg-brand-50 text-brand-700 text-xs font-bold rounded-xl hover:bg-brand-100"
        >
          Cetak PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-50">
              <th className="px-6 py-4 font-bold">Bln</th>
              <th className="px-6 py-4 font-bold">Angsuran Pokok</th>
              <th className="px-6 py-4 font-bold text-red-500">
                Angsuran Bunga
              </th>
              <th className="px-6 py-4 font-bold">Total Cicilan</th>
              <th className="px-6 py-4 font-bold text-right">Sisa Pinjaman</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-600">
            {hasil.map((row) => (
              <tr
                key={row.bulan}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-400">
                  {row.bulan}
                </td>
                <td className="px-6 py-4">{formatIDR(row.pokok)}</td>
                <td className="px-6 py-4 text-red-400 italic">
                  {formatIDR(row.bunga)}
                </td>
                <td className="px-6 py-4 font-bold text-brand-900">
                  {formatIDR(row.cicilan)}
                </td>
                <td className="px-6 py-4 text-right text-green-600">
                  {formatIDR(row.sisaPinjaman)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
