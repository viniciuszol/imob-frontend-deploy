// Empresas.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LogOut,
  Building2,
  User2,
  Home,
  LineChart,
  Plus,
  X,
  Edit,
  Trash,
} from "lucide-react";
import EmpresaDetails from "../components/EmpresaDetails";

import { useAuth } from "../contexts/AuthContext";
import { useEmpresa } from "../contexts/EmpresaContext";

import ImportarEmpresaForm from "../components/ImportarEmpresaForm";
import EmpresaForm from "../components/EmpresaForm";
import Navbar from "../components/Navbar";
import { refreshEmpresa } from "../api/empresa";

export default function Empresas() {
  const { user, logout } = useAuth();
  const { empresas, criar, editar, remover, importarViaNibo } = useEmpresa();

  const navigate = useNavigate();

  // Estados dos Modais
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(null); // ID da empresa
  const [detailsOpen, setDetailsOpen] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <div >

      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">

        {/* MAIN */}
        <main className="px-4 py-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl mb-6 font-semibold flex items-center gap-3">
              <Building2 size={28} className="text-blue-400" />
              Suas Empresas
            </h2>

            {/* LISTA DE EMPRESAS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {empresas.map((e) => (
                <div
                  key={e.id}
                  className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-blue-500 transition group"
                >
                  <p className="text-lg font-bold group-hover:text-blue-400 transition">
                    {e.nome}
                  </p>

                  <p className="mt-2 text-gray-400 text-sm">
                    <span className="text-gray-500">CNPJ:</span> {e.cnpj}
                  </p>

                  <button
                    onClick={() => setDetailsOpen(e)}
                    className="mt-5 w-full bg-blue-600/70 rounded-lg py-2 hover:bg-blue-700 transition shadow"
                  >
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>

            {/* BOTÕES */}
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 bg-green-600/70 px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg text-white font-semibold"
              >
                <Plus size={20} /> Nova Empresa
              </button>

              <button
                onClick={() => setImportOpen(true)}
                className="flex items-center gap-2 bg-blue-600/70 px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg text-white font-semibold"
              >
                Importar da Nibo
              </button>
            </div>
          </div>
        </main>

        {/** === MODAL: ADICIONAR === */}
        {addOpen && (
          <Modal title="Adicionar Empresa" onClose={() => setAddOpen(false)}>
            <EmpresaForm
              onSubmit={async (dados) => {
                await criar(dados);
                setAddOpen(false);
              }}
            />
          </Modal>
        )}

        {/** === MODAL: DETALHES === */}
        {detailsOpen && (
          <Modal
            title={`Empresa: ${detailsOpen.nome}`}
            onClose={() => setDetailsOpen(null)}
          >
            <EmpresaDetails
              empresa={detailsOpen}
              onEdit={() => {
                setEditOpen(detailsOpen);
                setDetailsOpen(null);
              }}
              onDelete={async () => {
                await remover(detailsOpen.id);
                setDetailsOpen(null);
              }}
              onRefresh={async () => {
                setRefreshing(true);
                const nova = await refreshEmpresa(detailsOpen.id);
                setDetailsOpen(nova);
                setTimeout(() => setRefreshing(false), 600);
              }}
              refreshing={refreshing}
            />

          </Modal>
        )}

        {/** === MODAL: EDITAR === */}
        {editOpen && (
          <Modal title="Editar Empresa" onClose={() => setEditOpen(null)}>
            <EmpresaForm
              initialData={editOpen}
              onSubmit={async (dados) => {
                await editar(editOpen.id, dados);
                setEditOpen(null);
              }}
            />
          </Modal>
        )}

        {/** === MODAL: IMPORTAR NIBO === */}
        {importOpen && (
          <Modal
            title="Importar Empresa via Token Nibo"
            onClose={() => setImportOpen(false)}
          >
            <ImportarEmpresaForm
              onImport={async (token) => {
                try {
                  await importarViaNibo(token);
                  setImportOpen(false);
                } catch (err) {
                  console.error(err);
                  alert("Erro ao importar.");
                }
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}

/* ------------------ */
/* COMPONENTES INTERNOS */
/* ------------------ */

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-lg border border-gray-700">
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
