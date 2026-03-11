import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Tabungan", path: "/tabungan" },
    { name: "Deposito", path: "/deposito" },
    { name: "Kredit", path: "/kredit" },
  ];

  return (
    <nav className="bg-white border-b text-brand-500 border-slate-200 sticky top-0 z-50 px-6 md:px-20">
      <div className="container mx-auto px-0 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-medium text-brand-600 hover:text-brand-900 tracking-tighter"
        >
          SIMU<span className="text-brand-900">RES</span>
        </Link>

        {/* Menu Items */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors ${
                location.pathname === link.path
                  ? "text-brand-600"
                  : "text-gray-700 hover:text-brand-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <a
          href="https://bprrestudewata.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-500 text-white px-5 py-2 rounded text-sm font-bold hover:bg-brand-900 transition-all inline-block"
        >
          Hubungi Kami
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
