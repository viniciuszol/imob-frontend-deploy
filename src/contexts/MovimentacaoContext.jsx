import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getMovimentacoes, createMovimentacao, updateMovimentacao, deleteMovimentacao } from "../api/movimentacoes.js";

const MovimentacaoContext = createContext();

export const MovimentacaoProvider = ({ children }) => {
  const { token } = useAuth();
  const [movimentacoes, setMovimentacoes] = useState([]);

  const carregarMovimentacoes = async () => {
    if (!token) return;
    try {
      const data = await getMovimentacoes();
      setMovimentacoes(data);
    } catch (err) {
      console.error("Erro ao carregar movimentações:", err);
    }
  };

  const adicionarMovimentacao = async (mov) => {
    try {
      await createMovimentacao(mov);
      await carregarMovimentacoes();
    } catch (err) {
      console.error("Erro ao adicionar movimentação:", err);
    }
  };

  const editarMovimentacao = async (id, mov) => {
    try {
      await updateMovimentacao(id, mov);
      await carregarMovimentacoes();
    } catch (err) {
      console.error("Erro ao editar movimentação:", err);
    }
  };

  const removerMovimentacao = async (id) => {
    try {
      await deleteMovimentacao(id);
      await carregarMovimentacoes();
    } catch (err) {
      console.error("Erro ao remover movimentação:", err);
    }
  };

  useEffect(() => { carregarMovimentacoes(); }, [token]);

  return (
    <MovimentacaoContext.Provider value={{
      movimentacoes,
      carregarMovimentacoes,
      adicionarMovimentacao,
      editarMovimentacao,
      removerMovimentacao
    }}>
      {children}
    </MovimentacaoContext.Provider>
  );
};

export const useMovimentacao = () => useContext(MovimentacaoContext);
