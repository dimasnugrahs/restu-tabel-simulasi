import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import TabunganBerjangka from "./pages/TabunganBerjangka";
import Deposito from "./pages/Deposito";
import Kredit from "./pages/Kredit";
import ScrollToTop from "./components/layout/ScrollToTop";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="grow container mx-auto px-6 md:px-20 py-10">
          <ScrollToTop>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tabungan" element={<TabunganBerjangka />} />
              <Route path="/deposito" element={<Deposito />} />
              <Route path="/kredit" element={<Kredit />} />
            </Routes>
          </ScrollToTop>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
