import api from "./api";

export const niboAPI = {
  listarEmpresas: async (token) => {
    const res = await api.get("/nibo/empresas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },
};
