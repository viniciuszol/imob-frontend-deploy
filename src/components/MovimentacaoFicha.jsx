import React, { useState, useEffect } from "react";
import { Edit, Check } from "lucide-react";

export default function MovimentacaoFicha({ movimentacao, readOnly, onEdit, onSubmit }) {
  const [formData, setFormData] = useState({ ...movimentacao });

  useEffect(() => {
    setFormData({ ...movimentacao });
  }, [movimentacao]);

  const handleChange = (key, value) => setFormData({ ...formData, [key]: value });

  const rowStyle = "flex justify-between py-1";

  const getTipo = (valor) => {
    if (valor == null) return "entrada";
    return valor >= 0 ? "entrada" : "saida";
  };

  const formatBRL = (value) =>
    typeof value === "number"
      ? `${getTipo(value) === "saida" ? "-" : "+"} R$ ${Math.abs(value).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`
      : value;

  const formatDateInput = (date) => (date ? date.slice(0, 10) : "");

  return (
    <div className="flex flex-col gap-2 max-w-4xl mx-auto p-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      {["descricao", "valor", "data_movimentacao"].map((key) => (
        <div key={key} className={rowStyle}>
          <span className="font-semibold">
            {key === "data_movimentacao"
              ? "Data"
              : key.charAt(0).toUpperCase() + key.slice(1)}
            :
          </span>

          {readOnly ? (
            key === "valor" ? (
              <span>{formatBRL(formData[key])}</span>
            ) : key === "data_movimentacao" ? (
              <span>
                {formData[key]
                  ? new Date(formData[key]).toLocaleDateString("pt-BR")
                  : ""}
              </span>
            ) : (
              <span>{formData[key]}</span>
            )
          ) : key === "valor" ? (
            <input
              type="number"
              className="bg-gray-700 text-white px-2 py-1 rounded-md w-full ml-2"
              value={formData[key] ?? 0}
              onChange={(e) => handleChange(key, parseFloat(e.target.value))}
            />
          ) : key === "data_movimentacao" ? (
            <input
              type="date"
              className="bg-gray-700 text-white px-2 py-1 rounded-md w-full ml-2"
              value={formatDateInput(formData[key])}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="bg-gray-700 text-white px-2 py-1 rounded-md w-full ml-2"
              value={formData[key] ?? ""}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          )}
        </div>
      ))}

      <div className="flex justify-end mt-4 gap-2">
        {readOnly && onEdit && (
          <button
            onClick={() => onEdit(movimentacao)}
            className="bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center gap-2"
          >
            <Edit size={16} /> Editar
          </button>
        )}

        {!readOnly && (
          <button
            onClick={() => onSubmit && onSubmit(formData)}
            className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Check size={16} /> Salvar
          </button>
        )}
      </div>
    </div>
  );
}
