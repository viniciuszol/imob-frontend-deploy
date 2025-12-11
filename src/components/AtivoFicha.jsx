import React, { useState, useEffect } from "react";
import { Edit, Check } from "lucide-react";

export default function AtivoFicha({ ativo, readOnly, onEdit, onSubmit, empresas = [] }) {
  const [formData, setFormData] = useState({
    nome: "",
    status: "vazio",
    tipo: "residencial",
    finalidade: "locacao_venda",
    potencial: "medio",
    grau_desmobilizacao: "baixo",
    percentual_participacao: 100,
    valor_compra: 0,
    gastos: 0,
    receita: 0,
    saldo_devedor: 0,
    preco_venda: 0,
    participacao_venda: 0,
    ativo: true,
    empresa_id: empresas?.[0]?.id ?? null,
    ...ativo
  });

  // Atualiza formData quando ativo muda
  useEffect(() => {
    if (ativo) {
      setFormData(prev => ({
        ...prev,
        ...ativo,
        total: ativo.total // <- garante que total sempre existe
      }));
    }
  }, [ativo]);

  const enums = {
    status: ["vazio", "alugado"],
    tipo: ["comercial", "direitos", "hotelaria", "loteamento", "residencial", "terreno"],
    finalidade: ["condohotel", "direitos", "locacao", "locacao_incorporacao", "locacao_projeto", "locacao_venda", "uso", "venda"],
    potencial: ["baixo", "medio", "medio_alto", "alto"],
    grau_desmobilizacao: ["facil", "moderado", "dificil"]
  };

  const enumMap = {
    vazio: "Vazio", alugado: "Alugado", comercial: "Comercial", direitos: "Direitos",
    hotelaria: "Hotelaria", loteamento: "Loteamento", residencial: "Residencial", terreno: "Terreno",
    condohotel: "Condohotel", locacao: "Locação", locacao_incorporacao: "Locação / Incorporação",
    locacao_projeto: "Locação / Projeto", locacao_venda: "Locação / Venda",
    uso: "Uso", venda: "Venda", baixo: "Baixo", medio: "Médio", medio_alto: "Médio / Alto",
    alto: "Alto", facil: "Fácil", moderado: "Moderado", dificil: "Difícil"
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderField = (key) => {
    const label = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    if (!readOnly && enums[key]) {
      return (
        <div key={key} className="flex justify-between py-1">
          <span className="font-semibold">{label}:</span>
          <select
            value={formData[key] ?? ""}
            onChange={e => handleChange(key, e.target.value)}
            className="bg-gray-700 text-white px-2 py-1 rounded-md w-full ml-2"
          >
            {enums[key].map(opt => <option key={opt} value={opt}>{enumMap[opt]}</option>)}
          </select>
        </div>
      );
    }
    
    if (!readOnly && ["valor_compra", "gastos", "receita", "saldo_devedor", "preco_venda", "participacao_venda", "percentual_participacao"].includes(key)) {
      return (
        <div key={key} className="flex justify-between py-1">
          <span className="font-semibold">{label}:</span>
          <input
            type="number"
            value={formData[key] ?? ""}
            onChange={e => {
              const v = e.target.value;
              handleChange(key, v === "" ? "" : parseFloat(v));
            }}
            onFocus={e => e.target.select()}
            className="bg-gray-700 text-white px-2 py-1 rounded-md w-full ml-2"
          />
        </div>
      );
    }

    if (!readOnly && key === "nome") {
      return (
        <div key={key} className="flex justify-between py-1">
          <span className="font-semibold">{label}:</span>
          <input
            type="text"
            value={formData[key] ?? ""}
            onChange={e => handleChange(key, e.target.value)}
            onFocus={e => e.target.select()}
            className="bg-gray-700 text-white px-2 py-1 rounded-md w-full ml-2"
          />
        </div>
      );
    }

    // ReadOnly
    return (
      <div key={key} className="flex justify-between py-1">
        <span className="font-semibold">{label}:</span>
        <span>{formData[key]}</span>
      </div>
    );
  };

  const groups = [
    ["nome", "status", "tipo", "finalidade", "potencial", "grau_desmobilizacao"],
    ["valor_compra", "gastos", "receita", "total"],
    ["saldo_devedor", "preco_venda"],
    ["percentual_participacao", "participacao_venda"]
  ];

  return (
    <div className="flex flex-col gap-2 max-w-4xl mx-auto p-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      {groups.map((g, i) => (
        <div key={i} className="grid grid-cols-2 gap-4">{g.map(renderField)}</div>
      ))}

      {!readOnly && (
        <div className="flex justify-between items-center mt-4">
          <span className="font-semibold">Empresa:</span>
          <select
            value={formData.empresa_id ?? ""}
            onChange={e => handleChange("empresa_id", parseInt(e.target.value))}
            className="bg-gray-700 text-white px-2 py-1 rounded-md w-1/2"
          >
            {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nome}</option>)}
          </select>
        </div>
      )}

      <div className="flex justify-end mt-4 gap-2">
        {readOnly && onEdit && (
          <button onClick={() => onEdit(ativo)} className="bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center gap-2">
            <Edit size={16} /> Editar
          </button>
        )}
        {!readOnly && (
          <button onClick={() => onSubmit && onSubmit(formData)} className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Check size={16} /> Salvar
          </button>
        )}
      </div>
    </div>
  );
}
