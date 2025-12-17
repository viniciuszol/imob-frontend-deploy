import { useState, useEffect } from "react";
import {
  Home,
  Plus,
  X,
  Eye,
  Pause,
  Play,
  ChevronDown,
  Search,
  ArrowUp,
  ArrowDown
} from "lucide-react";

import { useAtivo } from "../contexts/AtivoContext";
import AtivoFicha from "../components/AtivoFicha";
import Navbar from "../components/Navbar";

export default function Ativos() {
  const {
    ativos,
    empresas,
    removerAtivo,
    carregarAtivos,
    adicionarAtivo,
    editarAtivo
  } = useAtivo();

  const [viewAtivo, setViewAtivo] = useState(null);
  const [editAtivo, setEditAtivo] = useState(null);

  // filtros
  const [filtroAtivo, setFiltroAtivo] = useState("ativos"); // ativos | todos | inativos
  const [search, setSearch] = useState("");

  // ordenação estilo Spotify
  const [ordemNome, setOrdemNome] = useState(null); // null | asc | desc

  useEffect(() => {
    carregarAtivos();
  }, []);

  const toggleOrdenacaoNome = () => {
    setOrdemNome((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  const formatBRL = (value) =>
    typeof value === "number"
      ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : value;

  const ativosFiltrados = [...ativos]
    .filter(a => {
      if (filtroAtivo === "ativos") return a.ativo === true;
      if (filtroAtivo === "inativos") return a.ativo === false;
      return true;
    })
    .filter(a =>
      a.nome.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!ordemNome) return 0;

      const nomeA = a.nome.toLowerCase();
      const nomeB = b.nome.toLowerCase();

      if (ordemNome === "asc") return nomeA.localeCompare(nomeB);
      if (ordemNome === "desc") return nomeB.localeCompare(nomeA);

      return 0;
    });

  // estilo base dos botões de ação
  const actionBtn =
    "w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 transition hover:bg-gray-800";

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center">
        <main className="px-8 py-10 w-full max-w-7xl">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold flex items-center gap-3">
              <Home size={28} className="text-blue-400" /> Seus Ativos
            </h2>

            {/* FILTROS */}
            <div className="flex gap-3 items-center">
              <div className="relative">
                <select
                  value={filtroAtivo}
                  onChange={(e) => setFiltroAtivo(e.target.value)}
                  className="appearance-none bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ativos">Somente ativos</option>
                  <option value="todos">Ativos e inativos</option>
                  <option value="inativos">Somente inativos</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Pesquisar ativo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* TABELA */}
          <div className="overflow-x-auto bg-gray-900/50 p-4 rounded-2xl shadow-lg border border-gray-800 mb-10">
            <table className="min-w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th
                    onClick={toggleOrdenacaoNome}
                    className="py-2 px-2 cursor-pointer select-none hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      Nome
                      {ordemNome === "asc" && (
                        <ArrowUp size={14} className="text-gray-400" />
                      )}
                      {ordemNome === "desc" && (
                        <ArrowDown size={14} className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Tipo</th>
                  <th className="py-2 px-2 text-right">Valor Compra</th>
                  <th className="py-2 px-2 text-right">Gastos</th>
                  <th className="py-2 px-2 text-right">Receita</th>
                  <th className="py-2 px-2 text-right">Total</th>
                  <th className="py-2 px-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ativosFiltrados.map(a => (
                  <tr
                    key={a.id}
                    className={`border-b border-gray-800 transition hover:bg-gray-800/30 ${!a.ativo ? "opacity-50" : ""
                      }`}
                  >
                    <td className="py-2 px-2">{a.nome}</td>
                    <td className="py-2 px-2">{a.status}</td>
                    <td className="py-2 px-2">{a.tipo}</td>
                    <td className="py-2 px-2 text-right">{formatBRL(a.valor_compra)}</td>
                    <td className="py-2 px-2 text-right">{formatBRL(a.gastos)}</td>
                    <td className="py-2 px-2 text-right">{formatBRL(a.receita)}</td>
                    <td className="py-2 px-2 text-right">{formatBRL(a.total)}</td>

                    <td className="py-2 px-2 align-middle">
                      <div className="flex justify-center items-center gap-1 h-full">

                        {/* visualizar */}
                        <button
                          onClick={() => setViewAtivo(a)}
                          title="Visualizar"
                          className={`${actionBtn} hover:text-blue-400`}
                        >
                          <Eye size={16} />
                        </button>

                        {/* inativar */}
                        {a.ativo && (
                          <button
                            onClick={async () => await removerAtivo(a.id)}
                            title="Inativar ativo"
                            className={`${actionBtn} hover:text-yellow-400`}
                          >
                            <Pause size={16} />
                          </button>
                        )}

                        {/* reativar */}
                        {!a.ativo && (
                          <button
                            onClick={async () => {
                              await editarAtivo(a.id, { ativo: true });
                              await carregarAtivos();
                            }}
                            title="Reativar ativo"
                            className={`${actionBtn} hover:text-green-400`}
                          >
                            <Play size={16} />
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* NOVO ATIVO */}
          <div className="flex justify-center mb-10">
            <button
              onClick={() => setEditAtivo({
                nome: "",
                status: "vazio",
                tipo: "residencial",
                finalidade: "locacao_venda",
                potencial: "medio",
                grau_desmobilizacao: "baixo",
                percentual_participacao: 100,
                valor_compra: 0,
                gastos: 0,
                receita: 0,
                total: 0,
                saldo_devedor: 0,
                preco_venda: 0,
                participacao_venda: 0,
                ativo: true,
                empresa_id: empresas?.[0]?.id ?? null,
              })}
              className="flex items-center gap-2 bg-green-600/70 px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg text-white font-semibold"
            >
              <Plus size={20} /> Novo Ativo
            </button>
          </div>
        </main>

        {/* MODAIS */}
        {viewAtivo && (
          <Modal title={`Ficha do Ativo: ${viewAtivo.nome}`} onClose={() => setViewAtivo(null)}>
            <AtivoFicha
              ativo={viewAtivo}
              readOnly
              onEdit={(ativo) => {
                setViewAtivo(null);
                setEditAtivo(ativo);
              }}
            />
          </Modal>
        )}

        {editAtivo && (
          <Modal
            title={editAtivo.id ? `Editar Ativo: ${editAtivo.nome}` : "Novo Ativo"}
            onClose={() => setEditAtivo(null)}
          >
            <AtivoFicha
              ativo={editAtivo}
              readOnly={false}
              onSubmit={async (data) => {
                if (data.id) await editarAtivo(data.id, data);
                else await adicionarAtivo(data);
                await carregarAtivos();
                setEditAtivo(null);
              }}
              empresas={empresas}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-700 overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400 hover:text-white" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
