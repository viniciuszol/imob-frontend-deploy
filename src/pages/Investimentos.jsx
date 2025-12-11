// src/pages/Investimentos.jsx
import { useState, useEffect } from "react";
import { LineChart, BarChart2, TrendingUp, Home, PieChart } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Investimentos() {
  const [ativos, setAtivos] = useState([]);
  const [investimentos, setInvestimentos] = useState([]);
  const [ativoSelecionado, setAtivoSelecionado] = useState(null);
  const [view, setView] = useState("geral"); // geral | comparativo | cdi | ativos

  useEffect(() => {
    carregarAtivos();
  }, []);

  const carregarAtivos = async () => {
    try {
      const r1 = await api.get("/ativos");
      setAtivos(r1.data);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarInvestimentoAtivo = async (id) => {
    try {
      const r = await api.get(`/investimento/ativo/${id}`);
      setInvestimentos(r.data);
    } catch (err) {
      console.error(err);
    }
  };

  // formata moeda
  const formatBRL = (v) =>
    typeof v === "number"
      ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : v;

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center">
        <main className="px-8 py-10 w-full max-w-7xl">

          {/* TÍTULO */}
          <h2 className="text-3xl mb-6 font-semibold flex items-center gap-3">
            <LineChart size={28} className="text-blue-400" /> Investimentos
          </h2>

          {/* BOTÕES DE VISUALIZAÇÃO */}
          <div className="flex gap-4 mb-10">
            <button
              onClick={() => setView("geral")}
              className={`px-4 py-2 rounded-xl border ${
                view === "geral"
                  ? "border-blue-500 bg-blue-600/30"
                  : "border-gray-700 bg-gray-800"
              } hover:bg-gray-700 transition`}
            >
              Visão Geral
            </button>

            <button
              onClick={() => setView("comparativo")}
              className={`px-4 py-2 rounded-xl border ${
                view === "comparativo"
                  ? "border-blue-500 bg-blue-600/30"
                  : "border-gray-700 bg-gray-800"
              } hover:bg-gray-700 transition`}
            >
              Comparativo Ativo x CDI
            </button>

            <button
              onClick={() => setView("cdi")}
              className={`px-4 py-2 rounded-xl border ${
                view === "cdi"
                  ? "border-blue-500 bg-blue-600/30"
                  : "border-gray-700 bg-gray-800"
              } hover:bg-gray-700 transition`}
            >
              Evolução CDI
            </button>

            <button
              onClick={() => setView("ativos")}
              className={`px-4 py-2 rounded-xl border ${
                view === "ativos"
                  ? "border-blue-500 bg-blue-600/30"
                  : "border-gray-700 bg-gray-800"
              } hover:bg-gray-700 transition`}
            >
              Investimento por Ativo
            </button>
          </div>

          {/* ===== VIEW: VISÃO GERAL ===== */}
          {view === "geral" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardResumo
                icon={<Home className="text-blue-400" size={26} />}
                label="Total em Ativos"
                value={formatBRL(
                  ativos.reduce((acc, a) => acc + (a.total || 0), 0)
                )}
              />

              <CardResumo
                icon={<TrendingUp className="text-green-400" size={26} />}
                label="CDI Acumulado (Todos Ativos)"
                value={formatBRL(
                  investimentos.reduce(
                    (acc, i) => acc + Number(i.rendimento_cdi_acumulado || 0),
                    0
                  )
                )}
              />

              <CardResumo
                icon={<PieChart className="text-yellow-400" size={26} />}
                label="Comparativo Total"
                value="Selecione Comparativo"
              />
            </div>
          )}

          {/* ===== VIEW: COMPARATIVO ===== */}
          {view === "comparativo" && (
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart2 className="text-blue-400" /> Comparativo entre Ativo e CDI
              </h3>

              {/* Selecionar ativo */}
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 mb-4 w-full"
                onChange={(e) => {
                  setAtivoSelecionado(e.target.value);
                  carregarInvestimentoAtivo(e.target.value);
                }}
              >
                <option value="">Selecione um ativo...</option>
                {ativos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </select>

              {ativoSelecionado && investimentos.length > 0 && (
                <TabelaInvestimento investimentos={investimentos} />
              )}
            </div>
          )}

          {/* ===== VIEW: INVESTIMENTO POR ATIVO ===== */}
          {view === "ativos" && (
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <LineChart className="text-green-400" /> Investimento por Ativo
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ativos.map((a) => (
                  <div
                    key={a.id}
                    className="bg-gray-800/40 p-4 rounded-xl border border-gray-700 shadow hover:border-blue-500 transition"
                  >
                    <p className="text-lg font-bold text-blue-300">{a.nome}</p>
                    <p className="text-gray-400 mt-2">
                      Compra: {formatBRL(a.valor_compra)}
                    </p>
                    <button
                      onClick={() => {
                        setAtivoSelecionado(a.id);
                        carregarInvestimentoAtivo(a.id);
                        setView("comparativo");
                      }}
                      className="mt-4 bg-blue-600/70 w-full py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Ver Comparativo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== VIEW: EVOLUÇÃO DO CDI ===== */}
          {view === "cdi" && (
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="text-green-400" /> Evolução do CDI Mensal
              </h3>

              <p className="text-gray-400">
                (Gráfico ainda será implementado — mas a estrutura já está pronta)
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* --------------------- COMPONENTES INTERNOS --------------------- */

function CardResumo({ icon, label, value }) {
  return (
    <div className="bg-gray-900/50 p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-blue-500 transition flex flex-col gap-2">
      <div>{icon}</div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function TabelaInvestimento({ investimentos }) {
  return (
    <div className="overflow-x-auto bg-gray-900/40 p-4 rounded-xl shadow border border-gray-800 mt-4">
      <table className="min-w-full text-gray-300">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2 px-2">Data</th>
            <th className="py-2 px-2">Valor Compra</th>
            <th className="py-2 px-2">Rendimento Mês</th>
            <th className="py-2 px-2">CDI Mês</th>
            <th className="py-2 px-2">Acumulado</th>
          </tr>
        </thead>
        <tbody>
          {investimentos.map((i) => (
            <tr key={i.id} className="border-b border-gray-800">
              <td className="py-2 px-2">{i.data}</td>
              <td className="py-2 px-2">{Number(i.valor_compra_ativo).toLocaleString("pt-BR")}</td>
              <td className="py-2 px-2">{i.rendimento_cdi_mes}</td>
              <td className="py-2 px-2">{i.cdi_mes}</td>
              <td className="py-2 px-2">{i.rendimento_cdi_acumulado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
