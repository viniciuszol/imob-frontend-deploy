import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import EmpresaForm from "../components/EmpresaForm";
import { getEmpresaById, updateEmpresa, deleteEmpresa } from "../api/empresa";
import { ArrowLeft, Edit, Trash, RotateCcw } from "lucide-react";

export default function EmpresaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    loadEmpresa();
  }, []);

  const loadEmpresa = async () => {
    setRefreshing(true);
    const data = await getEmpresaById(id);
    setEmpresa(data);
    setLoading(false);
    setTimeout(() => setRefreshing(false), 600); // animação suave
  };

  const handleUpdate = async (dados) => {
    await updateEmpresa(id, dados);
    setEditOpen(false);
    loadEmpresa();
  };

  const handleDelete = async () => {
    await deleteEmpresa(id);
    navigate("/empresas");
  };

  if (loading)
    return <p className="text-center mt-20 text-white">Carregando...</p>;

  return (
    <div className="p-6 text-white">
      <button
        onClick={() => navigate("/empresas")}
        className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white"
      >
        <ArrowLeft /> Voltar
      </button>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{empresa.nome}</h1>

        {/* 🔄 BOTÃO REFRESH */}
        <button
          onClick={loadEmpresa}
          className="p-2 rounded-lg bg-gray-700/60 hover:bg-gray-600 transition flex items-center"
        >
          <RotateCcw
            size={20}
            className={`text-blue-400 transition ${
              refreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      <p className="text-gray-400 text-lg">CNPJ: {empresa.cnpj}</p>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-2 bg-blue-600/70 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Edit size={18} /> Editar
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-600/70 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <Trash size={18} /> Deletar
        </button>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar Empresa">
        <EmpresaForm initialData={empresa} onSubmit={handleUpdate} />
      </Modal>
    </div>
  );
}
