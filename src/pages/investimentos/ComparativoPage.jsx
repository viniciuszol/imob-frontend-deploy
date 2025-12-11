// src/pages/investimentos/ComparativoPage.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import SubNavInvestimentos from "../../components/SubNavInvestimentos";
import { BarChart2 } from "lucide-react";
import { Line } from "react-chartjs-2";
import investimentosAPI from "../../api/investimentos";
import { useInvestimentos } from "../../contexts/InvestimentosContext";

// 🔹 Formatar datas para MM/YYYY
function formatMesAno(dataStr) {
  const d = new Date(dataStr);
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${mes}/${ano}`;
}

// 🔹 Formatar moeda (corrige valores Decimals do backend)
function formatBRL(v) {
  const n = Number(v ?? 0);
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ComparativoPage() {
  const { ativos, carregarAtivos } = useInvestimentos();
  const [ativoId, setAtivoId] = useState(null);
  const [dados, setDados] = useState([]);

  useEffect(() => {
    carregarAtivos();
  }, []);

  const carregar = async (id) => {
    const res = await investimentosAPI.comparativo(id);
    setDados(res.data);
  };

  // 👉 PEGAR O ATIVO SELECIONADO
  const ativo = ativos.find((a) => a.id == ativoId);

  // ❗ total do ativo pode vir como string, Decimal, null etc — normalizamos
const totalAtivo = dados.length > 0 ? Number(dados[0].total_ativo || 0) : 0;


  // 👉 PEGAR CDI ACUMULADO FINAL (valor monetário, não %)
  const cdiAcumFinal = Number(
    dados.length > 0 ? dados.at(-1).rent_cdi_acum ?? 0 : 0
  );

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center">
        <main className="px-8 py-10 w-full max-w-7xl">

          {/* TÍTULO */}
          <h2 className="text-3xl mb-6 font-semibold flex items-center gap-3">
            <BarChart2 size={28} className="text-blue-400" />
            Comparativo Ativo × CDI
          </h2>

          <SubNavInvestimentos />

          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 shadow-lg max-w-4xl mx-auto w-full">

            {/* SELECT DO ATIVO */}
            <select
              className="bg-gray-800 p-3 rounded-xl border border-gray-700 mb-6 w-full hover:border-blue-500 transition"
              onChange={(e) => {
                setAtivoId(e.target.value);
                carregar(e.target.value);
              }}
              value={ativoId || ""}
            >
              <option value="">Selecione um Ativo</option>
              {ativos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>

            {dados.length > 0 && (
              <>
                <Line
                  data={{
                    labels: dados.map((d) => formatMesAno(d.data)),
                    datasets: [
                      {
                        label: "CDI por Mês (R$)",
                        data: dados.map((d) => Number(d.rent_cdi ?? 0)),
                        borderColor: "rgba(59,130,246,1)",
                        backgroundColor: "rgba(59,130,246,0.25)",
                        borderWidth: 3,
                        tension: 0.2,
                        pointBorderColor: "#ffffff",
                        pointRadius: 4,
                      },
                      {
                        label: "Ativo por Mês (R$)",
                        data: dados.map((d) => Number(d.rent_real_acum ?? 0)),
                        borderColor: "rgba(34,197,94,1)",
                        backgroundColor: "rgba(34,197,94,0.25)",
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
                      legend: { labels: { color: "#fff" } },
                    },
                    scales: {
                      x: {
                        ticks: { color: "#ccc" },
                        grid: { color: "rgba(255,255,255,0.06)" },
                      },
                      y: {
                        ticks: {
                          color: "#ccc",
                          callback: (v) => formatBRL(v),
                        },
                        grid: { color: "rgba(255,255,255,0.06)" },
                      },
                    },
                  }}
                />

                {/* 🔥 CARDS DE RESUMO ABAIXO DO GRÁFICO */}
                <div className="grid grid-cols-2 gap-4 mt-8">

                  {/* CDI Acumulado */}
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 shadow">
                    <p className="text-gray-400 text-sm">CDI Acumulado</p>
                    <p className="text-xl font-bold text-blue-400">
                      {formatBRL(cdiAcumFinal)}
                    </p>
                  </div>

                  {/* Total do Ativo */}
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 shadow">
                    <p className="text-gray-400 text-sm">Total do Ativo</p>
                    <p className="text-xl font-bold text-green-400">
                      {formatBRL(totalAtivo)}
                    </p>
                  </div>

                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
