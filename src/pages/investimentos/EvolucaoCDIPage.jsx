// src/pages/investimentos/EvolucaoCDIPage.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import SubNavInvestimentos from "../../components/SubNavInvestimentos";
import { TrendingUp } from "lucide-react";
import { Line } from "react-chartjs-2";
import investimentosAPI from "../../api/investimentos";

function formatMesAno(dataStr) {
  const d = new Date(dataStr);
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${mes}/${ano}`;
}

export default function EvolucaoCDIPage() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    investimentosAPI.evolucaoCDI().then((r) => setDados(r.data));
  }, []);

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center">
        <main className="px-8 py-10 w-full max-w-7xl">

          {/* TÍTULO */}
          <h2 className="text-3xl mb-6 font-semibold flex items-center gap-3">
            <TrendingUp size={28} className="text-green-400" />
            Evolução do CDI
          </h2>

          <SubNavInvestimentos />

          {/* CONTAINER */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-lg w-full max-w-4xl mx-auto">

            <Line
              data={{
                labels: dados.map((d) => formatMesAno(d.data)),
                datasets: [
                  {
                    label: "CDI mensal",
                    data: dados.map((d) => d.cdi),
                    borderColor: "rgba(59,130,246,1)",
                    backgroundColor: "rgba(59,130,246,0.25)",
                    borderWidth: 3,
                    tension: 0.2,
                    pointBorderColor: "#ffffff",
                    pointRadius: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: { color: "#fff" },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "#ccc",
                      maxRotation: 0,
                      minRotation: 0,
                    },
                    grid: { color: "rgba(255,255,255,0.06)" },
                    offset: true, // 🔥 deixa alinhado reto igual o outro gráfico
                  },
                  y: {
                    ticks: { color: "#ccc" },
                    grid: { color: "rgba(255,255,255,0.06)" },
                  },
                },
              }}
            />

          </div>
        </main>
      </div>
    </div>
  );
}
