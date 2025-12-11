import { useState } from "react";

export default function ImportarEmpresaForm({ onImport }) {
  const [token, setToken] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onImport(token);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <input
        className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
        placeholder="Token da API Nibo"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <button className="bg-blue-600 rounded-lg py-2 hover:bg-blue-700 transition">
        Importar
      </button>
    </form>
  );
}
