// src/components/AtivoForm.jsx
import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";

const STATUS = ["alugado", "vazio"];
const TIPO = ["comercial", "direitos", "hotelaria", "loteamento", "residencial", "terreno"];
const FINALIDADE = ["condohotel","direitos","locação","locação/incorporacao","locação/projeto","locação/venda","uso","venda"];
const GRAU_DESMOBILIZACAO = ["baixo", "médio", "médio/alto", "alto"];
const POTENCIAL = ["baixo", "médio", "médio/alto", "alto"];

export default function AtivoForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState(initialData || {
    nome: "",
    status: STATUS[0],
    tipo: TIPO[0],
    finalidade: FINALIDADE[0],
    potencial: POTENCIAL[0],
    grau_desmobilizacao: GRAU_DESMOBILIZACAO[0],
    percentual_participacao: 100,
    valor_compra: 0,
    gastos: 0,
    receita: 0,
    saldo_devedor: 0,
    preco_venda: 0,
    participacao_venda: 0,
    empresa_id: 1
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: ["percentual_participacao","valor_compra","gastos","receita","total","saldo_devedor","preco_venda","participacao_venda","empresa_id"].includes(name)
        ? parseFloat(value)
        : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form className="flex flex-col gap-4 max-h-[80vh] overflow-auto" onSubmit={handleSubmit}>
      <Input label="Nome" name="nome" value={form.nome} onChange={handleChange} />

      <label>Status</label>
      <select name="status" value={form.status} onChange={handleChange} className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
        {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>Tipo</label>
      <select name="tipo" value={form.tipo} onChange={handleChange} className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
        {TIPO.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>Finalidade</label>
      <select name="finalidade" value={form.finalidade} onChange={handleChange} className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
        {FINALIDADE.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>Potencial</label>
      <select name="potencial" value={form.potencial} onChange={handleChange} className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
        {POTENCIAL.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>Grau de Desmobilização</label>
      <select name="grau_desmobilizacao" value={form.grau_desmobilizacao} onChange={handleChange} className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
        {GRAU_DESMOBILIZACAO.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {["percentual_participacao","valor_compra","gastos","receita","saldo_devedor","preco_venda","participacao_venda","empresa_id"].map(campo => (
        <Input
          key={campo}
          label={campo.replace(/_/g," ")}
          name={campo}
          type="number"
          value={form[campo]}
          onChange={handleChange}
        />
      ))}

      <Button disabled={loading}>
        {loading ? "Salvando..." : "Confirmar"}
      </Button>
    </form>
  );
}
