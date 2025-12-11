import api from "./api";

export async function getEmpresas() {
  const response = await api.get("/empresas");
  return response.data;
}

export async function getEmpresaById(id) {
  const response = await api.get(`/empresas/${id}`);
  return response.data;
}

export async function createEmpresa(data) {
  const response = await api.post("/empresas", data);
  return response.data;
}

export async function updateEmpresa(id, data) {
  const response = await api.put(`/empresas/${id}`, data);
  return response.data;
}

export async function deleteEmpresa(id) {
  const response = await api.delete(`/empresas/${id}`);
  return response.data;
}

/* --- FUNÇÃO CORRIGIDA --- */
export async function importarEmpresa(token) {
  const response = await api.post("/empresas/importar", { token });
  return response.data;
}

export async function refreshEmpresa(id) {
  const response = await api.post(`/empresas/${id}/refresh`);
  return response.data;
}
