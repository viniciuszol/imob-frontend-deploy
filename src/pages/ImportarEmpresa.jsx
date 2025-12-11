import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { Download, Building2 } from "lucide-react";
import { useEmpresa } from "../contexts/EmpresaContext";

export default function ImportarEmpresa({ isModal }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [empresas, setEmpresas] = useState([]);

  const navigate = useNavigate();
  const { adicionarEmpresa } = useEmpresa();

  const close = () => navigate(-1);

  const buscarEmpresas = async () => {
    try {
      setLoading(true);
      const data = await niboAPI.listarEmpresas(token);
      setEmpresas(data);
    } catch {
      alert("Erro ao buscar empresas da Nibo");
    } finally {
      setLoading(false);
    }
  };

  const importar = async (empresa) => {
    await adicionarEmpresa({
      nome: empresa.name,
      cnpj: empresa.cnpj
    });
    alert("Empresa importada!");
    close();
  };

  const content = (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Building2 size={28} className="text-blue-400" />
        <h1 className="text-xl font-semibold">Importar Empresa (Token Nibo)</h1>
      </div>

      <input
        className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
        placeholder="Cole aqui o token da Nibo"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <button
        onClick={buscarEmpresas}
        className="w-full mt-4 bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Carregando..." : "Buscar Empresas"}
      </button>

      {/* Lista */}
      <div className="mt-6 grid gap-4">
        {empresas.map((e) => (
          <div
            key={e.id}
            className="bg-gray-900 p-4 rounded-xl border border-gray-700 hover:border-blue-400 transition"
          >
            <p className="text-lg font-bold">{e.name}</p>
            <p className="text-sm text-gray-400">CNPJ: {e.cnpj}</p>

            <button
              onClick={() => importar(e)}
              className="w-full mt-3 bg-green-600 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <Download size={18} /> Importar
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // ⬇⬇ SE FOR MODAL, ABRE DENTRO DO MODAL
  if (isModal) {
    return (
      <Modal open={true} onClose={close} title="Importar Empresa">
        {content}
      </Modal>
    );
  }

  // ⬇⬇ fallback (caso acesse a URL diretamente)
  return (
    <div className="p-6 text-white">
      {content}
    </div>
  );
}
