import api from "./api"; // instância axios com baseURL

export const getAtivos = async (token) => {
  const res = await api.get("/ativos", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createAtivo = async (ativo, token) => {
  const res = await api.post("/ativos/", ativo, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateAtivo = async (id, ativo, token) => {
  const res = await api.put(`/ativos/${id}`, ativo, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteAtivo = async (id, token) => {
  const res = await api.delete(`/ativos/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
