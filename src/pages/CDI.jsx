import { useState, useEffect } from "react";
import {
  Percent,
  Plus,
  Trash,
  Edit,
  ArrowUp,
  ArrowDown
} from "lucide-react";

import Navbar from "../components/Navbar";
import CDIForm from "../components/CDIForm";
import { useCDI } from "../contexts/CDIContext";

export default function CDI() {
  const { cdis, carregarCDIs, adicionarCDI, editarCDI, removerCDI } = useCDI();

  const [openForm, setOpenForm] = useState(false);
  const [editCdi, setEditCdi] = useState(null);

  // ordenação
  const [ordemData, setOrdemData] = useState(null); // null | asc | desc
  const [ordemPorcentagem, setOrdemPorcentagem] = useState(null);
  const [ordemCdiAm, setOrdemCdiAm] = useState(null);

  useEffect(() => {
    carregarCDIs();
  }, []);

  /* =======================
     FORMATADORES
  ======================= */

  // 🔹 porcentagem principal (com % e sem casas)
  // BD: 0.105 → Tela: 11%
  const formatPorcentagem = (value) => {
    const numero = Number(value);
    if (isNaN(numero)) return "";
    return `${numero}%`;
  };

  // 🔹 CDI a.m e CDI % a.m (visual apenas)
  // BD: 0.0083 → Tela: 0.83
  const formatCdiValor = (value) => {
    const numero = Number(value);
    if (isNaN(numero)) return "";
    return (numero * 100).toFixed(2);
  };

  // 🔹 evita bug de timezone (2009)
  const formatMesAno = (date) => {
    if (!date) return "";
    const [ano, mes] = date.split("-");
    return `${mes}/${ano}`;
  };

  /* =======================
     TOGGLES DE ORDENAÇÃO
  ======================= */

  const toggleData = () => {
    setOrdemPorcentagem(null);
    setOrdemCdiAm(null);
    setOrdemData(prev => (prev === null ? "asc" : prev === "asc" ? "desc" : null));
  };

  const togglePorcentagem = () => {
    setOrdemData(null);
    setOrdemCdiAm(null);
    setOrdemPorcentagem(prev => (prev === null ? "asc" : prev === "asc" ? "desc" : null));
  };

  const toggleCdiAm = () => {
    setOrdemData(null);
    setOrdemPorcentagem(null);
    setOrdemCdiAm(prev => (prev === null ? "asc" : prev === "asc" ? "desc" : null));
  };

  /* =======================
     LISTA ORDENADA
  ======================= */

  const cdisOrdenados = [...cdis].sort((a, b) => {
    if (ordemData) {
      return ordemData === "asc"
        ? a.data.localeCompare(b.data)
        : b.data.localeCompare(a.data);
    }

    if (ordemPorcentagem) {
      return ordemPorcentagem === "asc"
        ? a.porcentagem - b.porcentagem
        : b.porcentagem - a.porcentagem;
    }

    if (ordemCdiAm) {
      return ordemCdiAm === "asc"
        ? a.cdi_am - b.cdi_am
        : b.cdi_am - a.cdi_am;
    }

    return 0;
  });

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
        <main className="px-8 py-10 w-full max-w-7xl">

          <h2 className="text-3xl font-semibold flex items-center gap-3 mb-6">
            <Percent size={28} className="text-blue-400" /> CDI
          </h2>

          {/* TABELA */}
          <div className="overflow-x-auto bg-gray-900/50 p-4 rounded-2xl border border-gray-800 mb-10">
            <table className="min-w-full table-fixed text-left text-gray-300">

              {/* LARGURAS FIXAS */}
              <colgroup>
                <col className="w-[120px]" /> {/* Data */}
                <col className="w-[120px]" /> {/* % CDI */}
                <col className="w-[120px]" /> {/* CDI a.m */}
                <col className="w-[140px]" /> {/* CDI % a.m */}
                <col className="w-[120px]" /> {/* Ações */}
              </colgroup>

              <thead>
                <tr className="border-b border-gray-700">
                  {/* DATA */}
                  <th onClick={toggleData} className="py-2 px-2 cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      Data
                      {ordemData === "asc" && <ArrowUp size={14} />}
                      {ordemData === "desc" && <ArrowDown size={14} />}
                    </div>
                  </th>

                  {/* % CDI */}
                  <th onClick={togglePorcentagem} className="py-2 px-2 cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      % CDI
                      {ordemPorcentagem === "asc" && <ArrowUp size={14} />}
                      {ordemPorcentagem === "desc" && <ArrowDown size={14} />}
                    </div>
                  </th>

                  {/* CDI a.m */}
                  <th onClick={toggleCdiAm} className="py-2 px-2 cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      CDI a.m
                      {ordemCdiAm === "asc" && <ArrowUp size={14} />}
                      {ordemCdiAm === "desc" && <ArrowDown size={14} />}
                    </div>
                  </th>

                  <th className="py-2 px-2">CDI % a.m</th>
                  <th className="py-2 px-2 text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {cdisOrdenados.map(cdi => (
                  <tr key={cdi.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                    <td className="py-2 px-2">{formatMesAno(cdi.data)}</td>
                    <td className="py-2 px-2">{formatPorcentagem(cdi.porcentagem)}</td>
                    <td className="py-2 px-2">{formatCdiValor(cdi.cdi_am)}</td>
                    <td className="py-2 px-2">{formatCdiValor(cdi.cdi_percentual_am)}</td>

                    <td className="py-2 px-2">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => { setEditCdi(cdi); setOpenForm(true); }}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:bg-gray-800 rounded-lg transition"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => removerCDI(cdi.id)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BOTÃO */}
          <div className="flex justify-center mb-10">
            <button
              onClick={() => { setEditCdi(null); setOpenForm(true); }}
              className="flex items-center gap-2 bg-green-600/70 px-6 py-3 rounded-xl hover:bg-green-700 font-semibold transition"
            >
              <Plus size={20} /> Adicionar CDI
            </button>
          </div>
        </main>

        {/* MODAL */}
        {openForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <CDIForm
              cdi={editCdi}
              onClose={() => setOpenForm(false)}
              onSubmit={async (data) => {
                if (editCdi) await editarCDI(editCdi.id, data);
                else await adicionarCDI(data);
                await carregarCDIs();
                setOpenForm(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
