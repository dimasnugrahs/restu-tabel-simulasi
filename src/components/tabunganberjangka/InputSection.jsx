export default function InputSection({ formData, setFormData, onHitung }) {
  const formatRibuan = (num) => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseAngka = (str) => {
    return Number(str.replace(/\D/g, ""));
  };

  const inputs = [
    {
      label: "Setoran Rutin / Bulan (Rp)",
      key: "setoranBulanan",
      isCurrency: true,
    },
    { label: "Bunga per Tahun (%)", key: "bungaTahunan", isCurrency: false },
    { label: "Jangka Waktu (Bulan)", key: "tenorBulan", isCurrency: false },
  ];

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inputs.map((item) => (
          <div key={item.key} className="space-y-2">
            <label className="font-bold text-sm text-gray-700">
              {item.label}
            </label>
            <div className="relative">
              {item.isCurrency && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  Rp
                </span>
              )}
              <input
                type={item.isCurrency ? "text" : "number"}
                className={`w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-600 transition-all outline-none ${
                  item.isCurrency ? "pl-11" : ""
                }`}
                value={
                  item.isCurrency
                    ? formatRibuan(formData[item.key])
                    : formData[item.key]
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (item.isCurrency) {
                    setFormData({ ...formData, [item.key]: parseAngka(val) });
                  } else {
                    setFormData({ ...formData, [item.key]: Number(val) });
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onHitung}
        className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-900 transition-all shadow-lg active:scale-95"
      >
        Hitung Simulasi Sekarang
      </button>
    </div>
  );
}
