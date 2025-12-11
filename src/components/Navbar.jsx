// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { User2, Home, Building2, LineChart, TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-gray-900/60 backdrop-blur-lg border-b border-gray-800 px-8 py-4 flex items-center sticky top-0 z-50 shadow-lg">
      {/* ESQUERDA: Usuário */}
      <div className="flex items-center gap-3">
        <User2 size={26} className="text-blue-400" />
        <span className="text-lg font-semibold">{user?.nome}</span>
      </div>

      {/* CENTRO: Navegação */}
      <nav className="flex-1 flex justify-center items-center gap-6 text-gray-300">
        <button
          onClick={() => navigate("/empresas")}
          className="hover:text-white transition flex items-center gap-1"
        >
          <Building2 size={18} /> Empresas
        </button>

        <button
          onClick={() => navigate("/ativos")}
          className="hover:text-white transition flex items-center gap-1"
        >
          <Home size={18} /> Ativos
        </button>

        <button
          onClick={() => navigate("/movimentacoes")}
          className="hover:text-white transition flex items-center gap-1"
        >
          <LineChart size={18} /> Movimentações
        </button>

        {/* NOVA ABA: INVESTIMENTOS */}
        <button
          onClick={() => navigate("/investimentos")}
          className="hover:text-white transition flex items-center gap-1"
        >
          <TrendingUp size={18} /> Investimentos
        </button>
      </nav>

      {/* DIREITA: Logout */}
      <div>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-2 bg-red-600/70 px-4 py-2 rounded-lg hover:bg-red-700 transition shadow"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </header>
  );
}
