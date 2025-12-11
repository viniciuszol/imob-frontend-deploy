// src/pages/investimentos/AtivosPage.jsx
import Navbar from "../../components/Navbar";
import SubNavInvestimentos from "../../components/SubNavInvestimentos";
import { LineChart } from "lucide-react";
import { useInvestimentos } from "../../contexts/InvestimentosContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function InvestimentosAtivosPage() {
  const { ativos, carregarAtivos } = useInvestimentos();
  const navigate = useNavigate();

  useEffect(() => {
    carregarAtivos();
  }, []);

  const formatBRL = (v) =>
    typeof v === "number"
      ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : v;

  // 🔹 Somatório apenas de valor_compra
  const totalInvestido = ativos.reduce(
    (acc, a) => acc + (Number(a.valor_compra) || 0),
    0
  );

  // 🔹 Somatório do total (movimentações)
  const totalMovimentos = ativos.reduce(
    (acc, a) => acc + (Number(a.total) || 0),
    0
  );

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center">
        <main className="px-8 py-10 w-full max-w-7xl">

          {/* TÍTULO */}
          <h2 className="text-3xl mb-6 font-semibold flex items-center gap-3">
            <LineChart size={28} className="text-green-400" />
            Investimento por Ativo
          </h2>

          <SubNavInvestimentos />

          {/* ===== BLOCO DUPLO DE RESUMO ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 mb-10 w-full">

            {/* CARD 1 — Total Investido */}
            <div className="bg-gray-900/50 p-6 rounded-2xl shadow-lg border border-gray-800">
              <p className="text-xl font-semibold text-blue-300">
                Total Investido (Aquisições)
              </p>
              <p className="text-3xl mt-2 font-bold">
                {formatBRL(totalInvestido)}
              </p>
            </div>

            {/* CARD 2 — Total das Movimentações */}
            <div className="bg-gray-900/50 p-6 rounded-2xl shadow-lg border border-gray-800">
              <p className="text-xl font-semibold text-green-300">
                Total das Movimentações
              </p>
              <p className="text-3xl mt-2 font-bold">
                {formatBRL(totalMovimentos)}
              </p>
            </div>

          </div>

          {/* LISTA DE ATIVOS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ativos.map((a) => (
              <div
                key={a.id}
                className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-blue-500 transition group"
              >
                <p className="text-lg font-bold group-hover:text-blue-400 transition">
                  {a.nome}
                </p>

                <p className="mt-2 text-gray-400">
                  Compra: {formatBRL(a.valor_compra)}
                </p>

                <p className="mt-1 text-gray-400">
                  Total Atual: {formatBRL(a.total)}
                </p>

                <button
                  onClick={() =>
                    navigate(`/investimentos/comparativo?ativo=${a.id}`)
                  }
                  className="mt-5 w-full bg-blue-600/70 rounded-lg py-2 hover:bg-blue-700 transition shadow"
                >
                  Ver Comparativo
                </button>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
