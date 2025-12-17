import React, { useState, useEffect } from "react";
import { Edit, Check } from "lucide-react";

export default function AtivoFicha({
  ativo,
  readOnly,
  onEdit,
  onSubmit,
  empresas = []
}) {
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

  useEffect(() => {
    if (ativo) {
      setFormData(prev => ({
        ...prev,
        ...ativo,
        total: ativo.total
      }));
    }
  }, [ativo]);

  const enums = {
    status: ["vazio", "alugado"],
    tipo: ["comercial", "direitos", "hotelaria", "loteamento", "residencial", "terreno"],
    finalidade: [
      "condohotel",
      "direitos",
      "locacao",
      "locacao_incorporacao",
      "locacao_projeto",
      "locacao_venda",
      "uso",
      "venda"
    ],
    potencial: ["baixo", "medio", "medio_alto", "alto"],
    grau_desmobilizacao: ["facil", "moderado", "dificil"]
  };

  const enumMap = {
    vazio: "Vazio",
    alugado: "Alugado",
    comercial: "Comercial",
    direitos: "Direitos",
    hotelaria: "Hotelaria",
    loteamento: "Loteamento",
    residencial: "Residencial",
    terreno: "Terreno",
    condohotel: "Condohotel",
    locacao: "Locação",
    locacao_incorporacao: "Locação / Incorporação",
    locacao_projeto: "Locação / Projeto",
    locacao_venda: "Locação / Venda",
    uso: "Uso",
    venda: "Venda",
    baixo: "Baixo",
    medio: "Médio",
    medio_alto: "Médio / Alto",
    alto: "Alto",
    facil: "Fácil",
    moderado: "Moderado",
    dificil: "Difícil"
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  /* ===== FORMATADORES ===== */

  const formatPercent = (v) =>
    typeof v === "number" ? `${v}%` : v;

  const formatBRL = (v) =>
    typeof v === "number"
      ? `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : v;

  const renderValue = (key) => {
    if (["percentual_participacao", "participacao_venda"].includes(key)) {
      return formatPercent(formData[key]);
    }

    if (
      ["valor_compra", "gastos", "receita", "total", "saldo_devedor", "preco_venda"]
        .includes(key)
    ) {
      return formatBRL(formData[key]);
    }

    if (enumMap[formData[key]]) {
      return enumMap[formData[key]];
    }

    return formData[key];
  };

  const renderField = (key) => {
    const label = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    if (!readOnly && enums[key]) {
      return (
        <div key={key} className="flex justify-between gap-2">
          <span className="font-semibold">{label}</span>
          <select
            value={formData[key] ?? ""}
            onChange={e => handleChange(key, e.target.value)}
            className="bg-gray-700 px-2 py-1 rounded-md w-full"
          >
            {enums[key].map(opt => (
              <option key={opt} value={opt}>
                {enumMap[opt]}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (!readOnly && key === "nome") {
      return (
        <div key={key} className="flex justify-between gap-2">
          <span className="font-semibold">{label}</span>
          <input
            type="text"
            value={formData[key] ?? ""}
            onChange={e => handleChange(key, e.target.value)}
            className="bg-gray-700 px-2 py-1 rounded-md w-full"
          />
        </div>
      );
    }

    if (
      !readOnly &&
      [
        "valor_compra",
        "gastos",
        "receita",
        "saldo_devedor",
        "preco_venda",
        "participacao_venda",
        "percentual_participacao"
      ].includes(key)
    ) {
      return (
        <div key={key} className="flex justify-between gap-2">
          <span className="font-semibold">{label}</span>
          <input
            type="number"
            value={formData[key] ?? ""}
            onChange={e =>
              handleChange(key, e.target.value === "" ? "" : Number(e.target.value))
            }
            className="bg-gray-700 px-2 py-1 rounded-md w-full"
          />
        </div>
      );
    }

    return (
      <div key={key} className="flex justify-between">
        <span className="font-semibold">{label}</span>
        <span className="text-gray-300">{renderValue(key)}</span>
      </div>
    );
  };

  const groups = [
    ["nome", "status", "tipo", "finalidade", "potencial", "grau_desmobilizacao"],
    ["valor_compra", "gastos", "receita", "total"],
    ["saldo_devedor", "preco_venda"],
    ["percentual_participacao", "participacao_venda"]
  ];

  const empresaAtual = empresas?.find(
    (e) => e.id === formData.empresa_id
  );

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto p-4 bg-gray-800 rounded-xl border border-gray-700">

      {groups.map((g, i) => (
        <div key={i} className="grid grid-cols-2 gap-4">
          {g.map(renderField)}
        </div>
      ))}

      {/* RODAPÉ */}
      <div className="flex justify-between items-center mt-4">

        {/* EMPRESA À ESQUERDA */}
        {readOnly && empresaAtual ? (
          <span className="text-sm text-gray-400">
            Empresa:{" "}
            <strong className="text-gray-200">
              {empresaAtual.nome}
            </strong>
          </span>
        ) : (
          <span />
        )}

        {/* BOTÃO À DIREITA */}
        <div className="flex gap-2">
          {readOnly && onEdit && (
            <button
              onClick={() => onEdit(ativo)}
              className="flex items-center gap-2 text-grey-400 hover:text-yellow-400 transition"
            >
              <Edit size={16} />
            </button>
          )}

          {!readOnly && (
            <button
              onClick={() => onSubmit && onSubmit(formData)}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition"
            >
              <Check size={16} />
              Salvar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
