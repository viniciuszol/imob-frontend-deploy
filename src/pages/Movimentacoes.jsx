import { useState, useEffect } from "react";
import {
  Home,
  Plus,
  Eye,
  Trash,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Calendar
} from "lucide-react";

import { useMovimentacao } from "../contexts/MovimentacaoContext";
import MovimentacaoFicha from "../components/MovimentacaoFicha";
import Navbar from "../components/Navbar";

export default function Movimentacoes() {
  const {
    movimentacoes,
    removerMovimentacao,
    carregarMovimentacoes,
    adicionarMovimentacao,
    editarMovimentacao
  } = useMovimentacao();

  const [viewMov, setViewMov] = useState(null);
  const [editMov, setEditMov] = useState(null);

  // filtros
  const [ativoFiltro, setAtivoFiltro] = useState("todos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // ordenação
  const [ordemDescricao, setOrdemDescricao] = useState(null);
  const [ordemValor, setOrdemValor] = useState(null);
  const [ordemData, setOrdemData] = useState(null); // asc | desc | null

  useEffect(() => {
    carregarMovimentacoes();
  }, []);

  const inferirTipo = (valor) => (valor >= 0 ? "entrada" : "saida");

  const formatBRL = (value) => {
    const numero = Number(value);
    if (isNaN(numero)) return value;

    return `R$ ${Math.abs(numero).toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    })}`;
  };

  const formatDateBR = (date) =>
    date ? new Date(date).toLocaleDateString("pt-BR") : "";

  const ativosUnicos = Array.from(
    new Set(movimentacoes.map(m => m.ativo?.nome).filter(Boolean))
  );

  /* =======================
     TOGGLES
  ======================= */

  const toggleDescricao = () => {
    setOrdemValor(null);
    setOrdemData(null);
    setOrdemDescricao(prev =>
      prev === null ? "asc" : prev === "asc" ? "desc" : null
    );
  };

  const toggleValor = () => {
    setOrdemDescricao(null);
    setOrdemData(null);
    setOrdemValor(prev =>
      prev === null ? "asc" : prev === "asc" ? "desc" : null
    );
  };

  const toggleData = () => {
    setOrdemDescricao(null);
    setOrdemValor(null);
    setOrdemData(prev =>
      prev === null ? "asc" : prev === "asc" ? "desc" : null
    );
  };

  /* =======================
     FILTRO + ORDENAÇÃO
  ======================= */

  const movimentacoesFiltradas = [...movimentacoes]
    .filter(m => {
      if (ativoFiltro !== "todos" && m.ativo?.nome !== ativoFiltro) return false;

      const dataMov = new Date(m.data_movimentacao);

      if (dataInicio) {
        const inicio = new Date(`${dataInicio}T00:00:00`);
        if (dataMov < inicio) return false;
      }

      if (dataFim) {
        const fim = new Date(`${dataFim}T23:59:59.999`);
        if (dataMov > fim) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (ordemData) {
        return ordemData === "asc"
          ? new Date(a.data_movimentacao) - new Date(b.data_movimentacao)
          : new Date(b.data_movimentacao) - new Date(a.data_movimentacao);
      }

      if (ordemDescricao) {
        return ordemDescricao === "asc"
          ? a.descricao.localeCompare(b.descricao)
          : b.descricao.localeCompare(a.descricao);
      }

      if (ordemValor) {
        return ordemValor === "asc"
          ? a.valor - b.valor
          : b.valor - a.valor;
      }

      return 0;
    });

  const actionBtn =
    "w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 transition hover:bg-gray-800";

  function Modal({ children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-700 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center">
        <main className="px-8 py-10 w-full max-w-7xl">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold flex items-center gap-3">
              <Home size={28} className="text-blue-400" /> Suas Movimentações
            </h2>

            {/* FILTROS */}
            <div className="flex gap-3 items-center">

              {/* ATIVO */}
              <div className="relative">
                <select
                  value={ativoFiltro}
                  onChange={(e) => setAtivoFiltro(e.target.value)}
                  className="appearance-none bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 pr-10 text-sm"
                >
                  <option value="todos">Todos os ativos</option>
                  {ativosUnicos.map(nome => (
                    <option key={nome} value={nome}>{nome}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* DATA INÍCIO */}
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className={`bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm ${!dataInicio ? "text-transparent" : "text-white"}`}
                />
                {!dataInicio && <span className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Início</span>}
              </div>

              {/* DATA FIM */}
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className={`bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm ${!dataFim ? "text-transparent" : "text-white"}`}
                />
                {!dataFim && <span className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Fim</span>}
              </div>

            </div>
          </div>

          {/* TABELA */}
          <div className="overflow-x-auto bg-gray-900/50 p-4 rounded-2xl shadow-lg border border-gray-800 mb-10">
            <table className="min-w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th onClick={toggleDescricao} className="py-2 px-2 cursor-pointer">
                    <div className="flex items-center gap-1">
                      Descrição
                      {ordemDescricao === "asc" && <ArrowUp size={14} />}
                      {ordemDescricao === "desc" && <ArrowDown size={14} />}
                    </div>
                  </th>

                  <th className="py-2 px-2">Tipo</th>

                  <th onClick={toggleValor} className="py-2 px-4 text-right cursor-pointer min-w-[180px]">
                    <div className="flex justify-end items-center gap-1">
                      Valor
                      {ordemValor === "asc" && <ArrowUp size={14} />}
                      {ordemValor === "desc" && <ArrowDown size={14} />}
                    </div>
                  </th>

                  <th onClick={toggleData} className="py-2 px-2 text-right cursor-pointer">
                    <div className="flex justify-end items-center gap-1">
                      Data
                      {ordemData === "asc" && <ArrowUp size={14} />}
                      {ordemData === "desc" && <ArrowDown size={14} />}
                    </div>
                  </th>

                  <th className="py-2 px-2 text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {movimentacoesFiltradas.map(m => (
                  <tr key={m.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-2 px-2">{m.descricao}</td>
                    <td className="py-2 px-2 font-semibold">
                      {inferirTipo(m.valor) === "entrada"
                        ? <span className="text-green-400">Entrada</span>
                        : <span className="text-red-400">Saída</span>}
                    </td>
                    <td className="py-2 px-4 text-right">{formatBRL(m.valor)}</td>
                    <td className="py-2 px-2 text-right">{formatDateBR(m.data_movimentacao)}</td>
                    <td className="py-2 px-2">
                      <div className="flex justify-center gap-1">
                        <button onClick={() => setViewMov(m)} className={`${actionBtn} hover:text-blue-400`}>
                          <Eye size={16} />
                        </button>
                        <button onClick={() => removerMovimentacao(m.id)} className={`${actionBtn} hover:text-red-400`}>
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* NOVA */}
          <div className="flex justify-center mb-10">
            <button
              onClick={() => setEditMov({})}
              className="flex items-center gap-2 bg-green-600/70 px-6 py-3 rounded-xl hover:bg-green-700 font-semibold"
            >
              <Plus size={20} /> Nova Movimentação
            </button>
          </div>
        </main>
                  {/* MODAL VISUALIZAÇÃO */}
          {viewMov && (
            <Modal onClose={() => setViewMov(null)}>
              <MovimentacaoFicha
                movimentacao={viewMov}
                readOnly
                onEdit={(m) => {
                  setViewMov(null);
                  setEditMov(m);
                }}
              />
            </Modal>
          )}

          {/* MODAL CRIAR / EDITAR */}
          {editMov && (
            <Modal onClose={() => setEditMov(null)}>
              <MovimentacaoFicha
                movimentacao={editMov}
                readOnly={false}
                onSubmit={async (data) => {
                  if (data.id) await editarMovimentacao(data.id, data);
                  else await adicionarMovimentacao(data);

                  await carregarMovimentacoes();
                  setEditMov(null);
                }}
              />
            </Modal>
          )}

      </div>
    </div>
  );
}
