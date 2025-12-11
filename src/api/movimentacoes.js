import api from "./api";

export async function getMovimentacoes() {
  const response = await api.get("/movimentacoes");
  return response.data;
}

export async function createMovimentacao(data) {
  const response = await api.post("/movimentacoes", data);
  return response.data;
}

export async function updateMovimentacao(id, data) {
  const response = await api.put(`/movimentacoes/${id}`, data);
  return response.data;
}

export async function deleteMovimentacao(id) {
  const response = await api.delete(`/movimentacoes/${id}`);
  return response.data;
}