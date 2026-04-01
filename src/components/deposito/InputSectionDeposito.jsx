export default function InputSectionDeposito({
  formData,
  setFormData,
  onHitung,
}) {
  // Fungsi format ribuan dengan proteksi agar tidak muncul '0' saat dihapus
  const formatRibuan = (num) => {
    if (num === "" || num === 0 || num === undefined || num === null) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Fungsi parse angka agar state bisa menyimpan string kosong
  const parseAngka = (str) => {
    if (str === "") return "";
    const cleanValue = str.replace(/\D/g, "");
    return cleanValue === "" ? "" : Number(cleanValue);
  };

  const inputs = [
    {
      label: "Nominal Deposito (Rp)",
      key: "nominalDeposito",
      isCurrency: true,
    },
    { label: "Bunga per Tahun (%)", key: "bungaTahunan", isCurrency: false },
    { label: "Jangka Waktu (Bulan)", key: "tenorBulan", isCurrency: false },
  ];

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-bold text-sm text-gray-700">
            Tanggal Penempatan
          </label>
          <input
            type="date"
            className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-600 outline-none transition-all"
            value={formData.tanggalMulai || ""}
            onChange={(e) =>
              setFormData({ ...formData, tanggalMulai: e.target.value })
            }
          />
        </div>
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
                // Menggunakan type="text" di semua field untuk konsistensi handling string kosong
                type="text"
                inputMode="numeric"
                placeholder="0"
                className={`w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-600 transition-all outline-none ${
                  item.isCurrency ? "pl-11" : ""
                }`}
                value={
                  item.isCurrency
                    ? formatRibuan(formData[item.key])
                    : (formData[item.key] ?? "")
                }
                onChange={(e) => {
                  const val = e.target.value;

                  // Jika input dihapus bersih, set ke string kosong
                  if (val === "") {
                    setFormData({ ...formData, [item.key]: "" });
                    return;
                  }

                  if (item.isCurrency) {
                    setFormData({ ...formData, [item.key]: parseAngka(val) });
                  } else {
                    // Hanya izinkan angka dan titik untuk bunga desimal
                    const numericVal = val.replace(/[^0-9.]/g, "");
                    setFormData({ ...formData, [item.key]: numericVal });
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
        Hitung Simulasi Deposito
      </button>
    </div>
  );
}
