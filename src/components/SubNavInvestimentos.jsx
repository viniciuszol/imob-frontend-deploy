import { NavLink } from "react-router-dom";
import { LineChart, BarChart2, TrendingUp, PieChart } from "lucide-react";

export default function SubNavInvestimentos() {
  const base =
    "px-4 py-2 rounded-xl border transition flex items-center gap-2";

  const active =
    "border-blue-500 bg-blue-600/30 text-blue-300";

  const inactive =
    "border-gray-700 bg-gray-800 hover:bg-gray-700";

  return (
    <div className="flex gap-4 mb-10">
      <NavLink
        to="/investimentos"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <PieChart size={18} /> Visão Geral
      </NavLink>

      <NavLink
        to="/investimentos/comparativo"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <BarChart2 size={18} /> Comparativo
      </NavLink>

      <NavLink
        to="/investimentos/ativos"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <LineChart size={18} /> Por Ativo
      </NavLink>
    </div>
  );
}
