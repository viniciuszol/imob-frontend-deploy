import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";

export default function EmpresaForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState(initialData || { nome: "", cnpj: "" });

  useEffect(() => {
    setForm(initialData || { nome: "", cnpj: "" });
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        label="Nome da Empresa"
        name="nome"
        value={form.nome}
        onChange={handleChange}
      />

      <Input
        label="CNPJ"
        name="cnpj"
        value={form.cnpj}
        onChange={handleChange}
      />

      <Button disabled={loading}>
        {loading ? "Salvando..." : "Confirmar"}
      </Button>
    </form>
  );
}
