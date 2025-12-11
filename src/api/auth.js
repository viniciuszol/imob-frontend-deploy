export async function loginRequest(email, password) {
  const res = await fetch("http://localhost:8000/auth/login", {
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
  const res = await fetch("http://localhost:8000/auth/register", {
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
