import { createContext, useContext, useState, useEffect } from "react";
import {
  getEmpresas,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
  getEmpresaById,
  importarEmpresa as importarEmpresaApi,
} from "../api/empresa.js"; // <<<<< CORRIGIDO (sem S)
import { useAuth } from "./AuthContext";

const EmpresaContext = createContext();

export const EmpresaProvider = ({ children }) => {
  const { token } = useAuth();

  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

  const carregarEmpresas = async () => {
    try {
      const data = await getEmpresas();
      setEmpresas(data);
    } catch (err) {
      console.error("Erro ao carregar empresas:", err);
    }
  };

  useEffect(() => {
    if (token) carregarEmpresas();
  }, [token]);

  const criar = async (empresa) => {
    const nova = await createEmpresa(empresa);
    setEmpresas((prev) => [...prev, nova]);
  };

  const editar = async (id, empresa) => {
    const atualizada = await updateEmpresa(id, empresa);
    setEmpresas((prev) => prev.map((e) => (e.id === id ? atualizada : e)));
    if (empresaSelecionada?.id === id) setEmpresaSelecionada(atualizada);
  };

  const remover = async (id) => {
    await deleteEmpresa(id);
    setEmpresas((prev) => prev.filter((e) => e.id !== id));
    if (empresaSelecionada?.id === id) setEmpresaSelecionada(null);
  };

  const selecionar = async (id) => {
    const data = await getEmpresaById(id);
    setEmpresaSelecionada(data);
  };

  // ---- IMPORTAÇÃO CORRIGIDA ----
  const importarViaNibo = async (tokenNibo) => {
    const data = await importarEmpresaApi(tokenNibo);

    const empresa = data.empresa ?? data;

    setEmpresas((prev) => {
      const exists = prev.find((e) => e.id === empresa.id);
      if (exists) return prev.map((p) => (p.id === empresa.id ? empresa : p));
      return [...prev, empresa];
    });

    return data;
  };

  return (
    <EmpresaContext.Provider
      value={{
        empresas,
        empresaSelecionada,
        criar,
        editar,
        remover,
        selecionar,
        importarViaNibo,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = () => useContext(EmpresaContext);
