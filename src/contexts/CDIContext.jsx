// src/contexts/CDIContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  getCDIs,
  createCDI,
  createCDIBulk,
  updateCDI,
  deleteCDI
} from "../api/cdi";

const CDIContext = createContext();

export const CDIProvider = ({ children }) => {
  const { token } = useAuth();
  const [cdis, setCdis] = useState([]);

  const carregarCDIs = async () => {
    if (!token) return;
    const data = await getCDIs(token);
    setCdis(data);
  };

  const adicionarCDI = async (data) => {
    await createCDI(data, token);
    await carregarCDIs();
  };

  const adicionarCDIBulk = async (lista) => {
    await createCDIBulk(lista, token);
    await carregarCDIs();
  };

  const editarCDI = async (id, data) => {
    await updateCDI(id, data, token);
    await carregarCDIs();
  };

  const removerCDI = async (id) => {
    await deleteCDI(id, token);
    await carregarCDIs();
  };

  useEffect(() => {
    carregarCDIs();
  }, [token]);

  return (
    <CDIContext.Provider value={{
      cdis,
      carregarCDIs,
      adicionarCDI,
      adicionarCDIBulk,
      editarCDI,
      removerCDI
    }}>
      {children}
    </CDIContext.Provider>
  );
};

export const useCDI = () => useContext(CDIContext);
