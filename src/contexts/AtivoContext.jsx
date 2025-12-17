import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getAtivos, createAtivo, updateAtivo } from "../api/ativo";
import { getEmpresas } from "../api/empresa";

const AtivoContext = createContext();

export const AtivoProvider = ({ children }) => {
  const { token } = useAuth();
  const [ativos, setAtivos] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  const carregarAtivos = async () => {
    if (!token) return;
    try {
      const data = await getAtivos(token);
      setAtivos(data); // total já vem do backend
    } catch (err) {
      console.error("Erro ao carregar ativos:", err);
    }
  };

  const carregarEmpresas = async () => {
    if (!token) return;
    try {
      const data = await getEmpresas(token);
      setEmpresas(data);
    } catch (err) {
      console.error("Erro ao carregar empresas:", err);
    }
  };

  const adicionarAtivo = async (ativo) => {
    try {
      const novoAtivo = { ...ativo }; // não recalcula total
      await createAtivo(novoAtivo, token);
      await carregarAtivos();
    } catch (err) {
      console.error("Erro ao adicionar ativo:", err);
      throw err;
    }
  };

  const editarAtivo = async (id, ativo) => {
    try {
      const atualizado = { ...ativo }; // não recalcula total
      await updateAtivo(id, atualizado, token);
      await carregarAtivos();
    } catch (err) {
      console.error("Erro ao editar ativo:", err);
      throw err;
    }
  };

  const removerAtivo = async (id) => {
    try {
      await updateAtivo(id, { ativo: false }, token);
      await carregarAtivos();
    } catch (err) {
      console.error("Erro ao inativar ativo:", err);
    }
  };

  const reativarAtivo = async (id) => {
    await updateAtivo(id, { ativo: true }, token);
    await carregarAtivos();
  };

  useEffect(() => { carregarAtivos(); }, [token]);
  useEffect(() => { carregarEmpresas(); }, [token]);

  return (
    <AtivoContext.Provider value={{
      ativos,
      empresas,
      carregarAtivos,
      carregarEmpresas,
      adicionarAtivo,
      editarAtivo,
      removerAtivo
    }}>
      {children}
    </AtivoContext.Provider>
  );
};

export const useAtivo = () => useContext(AtivoContext);
