// src/pages/Ativos.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User2, Home, Plus, X, Trash, Edit, Eye, LineChart, Building2, SlashIcon } from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { useAtivo } from "../contexts/AtivoContext";
import AtivoForm from "../components/AtivoForm";
import AtivoFicha from "../components/AtivoFicha";
import Navbar from "../components/Navbar";

export default function Ativos() {
  const { user, logout } = useAuth();
  const { ativos, empresas, removerAtivo, carregarAtivos, adicionarAtivo, editarAtivo } = useAtivo();
  const navigate = useNavigate();

  const [viewAtivo, setViewAtivo] = useState(null);
  const [editAtivo, setEditAtivo] = useState(null);

  useEffect(() => {
    carregarAtivos();
  }, []);

  const formatBRL = (value) =>
    typeof value === "number"
      ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : value;

  console.log("Ativos recebidos do backend:", ativos);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center">
        <main className="px-8 py-10 w-full max-w-7xl">
          <h2 className="text-3xl mb-6 font-semibold flex items-center gap-3">
            <Home size={28} className="text-blue-400" /> Seus Ativos
          </h2>
          <div className="overflow-x-auto bg-gray-900/50 p-4 rounded-2xl shadow-lg border border-gray-800 mb-10">
            <table className="min-w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 px-2">Nome</th>
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
                {ativos.filter(a => Boolean(a.ativo)).map(a => (
                  <tr key={a.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                    <td className="py-2 px-2">{a.nome}</td>
                    <td className="py-2 px-2">{a.status}</td>
                    <td className="py-2 px-2">{a.tipo}</td>
                    <td className="py-2 px-2 text-right">{formatBRL(a.valor_compra)}</td>
                    <td className="py-2 px-2 text-right">{formatBRL(a.gastos)}</td>
                    <td className="py-2 px-2 text-right">{formatBRL(a.receita)}</td>
                    <td className="py-2 px-2 text-right">{formatBRL(a.total)}</td>
                    <td className="py-2 px-2 flex justify-center gap-1">
                      <button onClick={() => setViewAtivo(a)} className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-700">
                        <Eye size={16} />
                      </button>
                      <button onClick={async () => await removerAtivo(a.id)} className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-700">
                        <SlashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mb-10">
            <button onClick={() => setEditAtivo({
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
            })} className="flex items-center gap-2 bg-green-600/70 px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg text-white font-semibold">
              <Plus size={20} /> Novo Ativo
            </button>
          </div>
        </main>
        {viewAtivo && (
          <Modal title={`Ficha do Ativo: ${viewAtivo.nome}`} onClose={() => setViewAtivo(null)}>
            <AtivoFicha ativo={viewAtivo} readOnly={true} onEdit={(a) => { setEditAtivo(a); setViewAtivo(null); }} />
          </Modal>
        )}
        {editAtivo && (
          <Modal title={editAtivo.id ? `Editar Ativo: ${editAtivo.nome}` : "Novo Ativo"} onClose={() => setEditAtivo(null)}>
            <AtivoFicha ativo={editAtivo} readOnly={false} onSubmit={async (data) => {
              try {
                if (data.id) await editarAtivo(data.id, data);
                else await adicionarAtivo(data);
                await carregarAtivos();
                setEditAtivo(null);
              } catch (err) {
                console.error("Erro ao salvar ativo:", err);
                alert("Erro ao salvar ativo. Confira os dados.");
              }
            }} empresas={empresas} />
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
          <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-white" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
