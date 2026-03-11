import { Link } from "react-router-dom";
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const menus = [
    {
      title: "Tabungan Berjangka",
      desc: "Hitung pertumbuhan tabungan dengan setoran rutin.",
      path: "/tabungan",
      color: "bg-blue-500",
      icon: <BanknotesIcon className="w-7 h-7 text-white" />,
    },
    {
      title: "Deposito",
      desc: "Simulasikan keuntungan bunga deposito Anda.",
      path: "/deposito",
      color: "bg-emerald-500",
      icon: <BuildingLibraryIcon className="w-7 h-7 text-white" />,
    },
    {
      title: "Kredit / Pinjaman",
      desc: "Hitung angsuran bulanan dan bunga efektif.",
      path: "/kredit",
      color: "bg-indigo-500",
      icon: <CreditCardIcon className="w-7 h-7 text-white" />,
    },
  ];

  return (
    <div className="py-10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
          Kelola Masa Depan <span className="text-brand-600">Finansialmu.</span>
        </h1>
        <p className="text-slate-500 text-lg">
          Hitung simulasi perbankan secara akurat, cepat, dan 100% privasi
          terjaga tanpa penyimpanan data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {menus.map((m) => (
          <Link
            to={m.path}
            key={m.path}
            className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-brand-600 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300"
          >
            <div
              className={`absolute -right-4 -top-4 w-24 h-24 ${m.color} opacity-[0.03] rounded-full group-hover:scale-[7] transition-transform duration-700`}
            />

            {/* Icon Box */}
            <div
              className={`w-16 h-16 ${m.color} rounded-2xl mb-8 flex items-center justify-center shadow-lg shadow-inherit transform group-hover:rotate-6 transition-transform duration-300`}
            >
              {m.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
              {m.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
