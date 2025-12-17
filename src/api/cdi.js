// src/api/cdi.js
import api from "./api";

export const getCDIs = async (token) => {
  const res = await api.get("/cdi", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createCDI = async (data, token) => {
  const res = await api.post("/cdi", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createCDIBulk = async (lista, token) => {
  const res = await api.post("/cdi/bulk", lista, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateCDI = async (id, data, token) => {
  const res = await api.put(`/cdi/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteCDI = async (id, token) => {
  const res = await api.delete(`/cdi/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
