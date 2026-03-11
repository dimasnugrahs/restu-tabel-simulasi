const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-4">
      <div className="container mx-auto px-20 text-center">
        <p className="text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} SIMURES - Alat Simulasi Tabel
          Keuangan Restu Dewata.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
