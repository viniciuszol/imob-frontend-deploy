// src/components/AtivoForm.jsx
import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";

const STATUS = ["alugado", "vazio"];
const TIPO = ["comercial", "direitos", "hotelaria", "loteamento", "residencial", "terreno"];
const FINALIDADE = ["condohotel","direitos","locação","locação/incorporacao","locação/projeto","locação/venda","uso","venda"];
const GRAU_DESMOBILIZACAO = ["baixo", "médio", "médio/alto", "alto"];
const POTENCIAL = ["baixo", "médio", "médio/alto", "alto"];

/* =======================
   MÁSCARAS
======================= */

const maskMoney = (value) => {
  if (value === null || value === undefined) return "";
  const numeric = value.toString().replace(/\D/g, "");
  const number = Number(numeric) / 100;

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
};

const maskPercent = (value) => {
  if (value === null || value === undefined) return "";
  return value.toString().replace(/\D/g, "");
};

export default function AtivoForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState({
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
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="flex flex-col gap-4 max-h-[80vh] overflow-auto" onSubmit={handleSubmit}>

      <Input
        label="Nome"
        value={form.nome}
        onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))}
      />

      <label>Status</label>
      <select
        value={form.status}
        onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
        className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
      >
        {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>Tipo</label>
      <select
        value={form.tipo}
        onChange={(e) => setForm(prev => ({ ...prev, tipo: e.target.value }))}
        className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
      >
        {TIPO.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>Finalidade</label>
      <select
        value={form.finalidade}
        onChange={(e) => setForm(prev => ({ ...prev, finalidade: e.target.value }))}
        className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
      >
        {FINALIDADE.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>Potencial</label>
      <select
        value={form.potencial}
        onChange={(e) => setForm(prev => ({ ...prev, potencial: e.target.value }))}
        className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
      >
        {POTENCIAL.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <label>Grau de Desmobilização</label>
      <select
        value={form.grau_desmobilizacao}
        onChange={(e) => setForm(prev => ({ ...prev, grau_desmobilizacao: e.target.value }))}
        className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
      >
        {GRAU_DESMOBILIZACAO.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* =======================
          CAMPOS COM MÁSCARA
      ======================= */}

      <Input
        label="Percentual Participação (%)"
        value={maskPercent(form.percentual_participacao)}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          setForm(prev => ({ ...prev, percentual_participacao: Number(raw) }));
        }}
      />

      <Input
        label="Valor Compra"
        value={maskMoney(form.valor_compra)}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          setForm(prev => ({ ...prev, valor_compra: Number(raw) / 100 }));
        }}
      />

      <Input
        label="Gastos"
        value={maskMoney(form.gastos)}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          setForm(prev => ({ ...prev, gastos: Number(raw) / 100 }));
        }}
      />

      <Input
        label="Receita"
        value={maskMoney(form.receita)}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          setForm(prev => ({ ...prev, receita: Number(raw) / 100 }));
        }}
      />

      <Input
        label="Saldo Devedor"
        value={maskMoney(form.saldo_devedor)}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          setForm(prev => ({ ...prev, saldo_devedor: Number(raw) / 100 }));
        }}
      />

      <Input
        label="Preço Venda"
        value={maskMoney(form.preco_venda)}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          setForm(prev => ({ ...prev, preco_venda: Number(raw) / 100 }));
        }}
      />

      <Input
        label="Participação Venda (%)"
        value={maskPercent(form.participacao_venda)}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          setForm(prev => ({ ...prev, participacao_venda: Number(raw) }));
        }}
      />

      <Button disabled={loading}>
        {loading ? "Salvando..." : "Confirmar"}
      </Button>
    </form>
  );
}
