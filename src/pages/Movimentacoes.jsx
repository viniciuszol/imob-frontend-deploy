import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User2, Home, Plus, X, Trash, Edit, Eye, LineChart, Building2 } from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { useMovimentacao } from "../contexts/MovimentacaoContext";
import MovimentacaoFicha from "../components/MovimentacaoFicha";

import Navbar from "../components/Navbar";

export default function Movimentacoes() {
    const { user, logout } = useAuth();
    const {
        movimentacoes,
        removerMovimentacao,
        carregarMovimentacoes,
        adicionarMovimentacao,
        editarMovimentacao
    } = useMovimentacao();
    const navigate = useNavigate();

    const [viewMov, setViewMov] = useState(null);
    const [editMov, setEditMov] = useState(null);

    useEffect(() => { carregarMovimentacoes(); }, []);

    const inferirTipo = (valor) => {
        if (valor == null) return "entrada";
        return valor >= 0 ? "entrada" : "saida";
    };

    const formatBRL = (value, tipo) =>
        typeof value === "number"
            ? `${tipo === "saida" ? "-" : "+"} R$ ${Math.abs(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
            : value;

    const formatDateBR = (date) => date ? new Date(date).toLocaleDateString("pt-BR") : "";

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center">
                <main className="px-8 py-10 w-full max-w-7xl">
                    <h2 className="text-3xl mb-6 font-semibold flex items-center gap-3">
                        <Home size={28} className="text-blue-400" /> Suas Movimentações
                    </h2>

                    {/* TABELA */}
                    <div className="overflow-x-auto bg-gray-900/50 p-4 rounded-2xl shadow-lg border border-gray-800 mb-10">
                        <table className="min-w-full text-left text-gray-300">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="py-2 px-2">Descrição</th>
                                    <th className="py-2 px-2">Tipo</th>
                                    <th className="py-2 px-2 text-right">Valor</th>
                                    <th className="py-2 px-2 text-right">Data</th>
                                    <th className="py-2 px-2 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movimentacoes.map(m => (
                                    <tr key={m.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                                        <td className="py-2 px-2">{m.descricao}</td>
                                        <td className="py-2 px-2 font-semibold">
                                            {inferirTipo(m.valor) === "entrada" ? (
                                                <span className="text-green-400">Entrada</span>
                                            ) : (
                                                <span className="text-red-400">Saída</span>
                                            )}
                                        </td>

                                        <td className="py-2 px-2 text-right">
                                            {formatBRL(m.valor, inferirTipo(m.valor))}
                                        </td>

                                        <td className="py-2 px-2 text-right">{formatDateBR(m.data_movimentacao)}</td>
                                        <td className="py-2 px-2 flex justify-center gap-1">
                                            <button onClick={() => setViewMov(m)} className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-700">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={async () => await removerMovimentacao(m.id)} className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-700">
                                                <Trash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* NOVA MOVIMENTAÇÃO */}
                    <div className="flex justify-center mb-10">
                        <button onClick={() => setEditMov({})} className="flex items-center gap-2 bg-green-600/70 px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg text-white font-semibold">
                            <Plus size={20} /> Nova Movimentação
                        </button>
                    </div>
                </main>

                {/* FICHA */}
                {viewMov && (
                    <Modal title={`Movimentação: ${viewMov.descricao}`} onClose={() => setViewMov(null)}>
                        <MovimentacaoFicha
                            movimentacao={viewMov}
                            readOnly={true}
                            onEdit={(m) => { setEditMov(m); setViewMov(null); }}
                        />
                    </Modal>
                )}

                {/* FORMULÁRIO */}
                {editMov && (
                    <Modal
                        title={editMov.id ? `Editar Movimentação: ${editMov.descricao}` : "Nova Movimentação"}
                        onClose={() => setEditMov(null)}
                    >
                        <MovimentacaoFicha
                            movimentacao={editMov}
                            readOnly={false}
                            onSubmit={async (data) => {
                                if (data.id) {
                                    await editarMovimentacao(data.id, data);
                                } else {
                                    await adicionarMovimentacao(data);
                                }

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

// Modal Wrapper
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
