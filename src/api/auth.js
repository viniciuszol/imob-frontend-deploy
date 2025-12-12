const BASE_URL = import.meta.env.VITE_API_URL;

export async function loginRequest(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Erro durante login");
  }

  return res.json();
}

export async function registerRequest(nome, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, password }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Erro ao registrar");
  }

  return res.json();
}
