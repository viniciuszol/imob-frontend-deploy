import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

export default function CDIForm({ cdi, onSubmit, onClose }) {
  const [form, setForm] = useState({
    data: "",
    percentual: "",
    cdi_am: "",
    cdi_percentual_am: ""
  });

  useEffect(() => {
    if (cdi) {
      setForm({
        data: cdi.data?.slice(0, 7),
        percentual: cdi.percentual * 100,
        cdi_am: cdi.cdi_am * 100,
        cdi_percentual_am: cdi.cdi_percentual_am * 100
      });
    }
  }, [cdi]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit({
      data: `${form.data}-01`,
      percentual: Number(form.percentual) / 100,
      cdi_am: Number(form.cdi_am) / 100,
      cdi_percentual_am: Number(form.cdi_percentual_am) / 100
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 w-full max-w-md">
      <h3 className="text-xl font-semibold mb-4">
        {cdi ? "Editar CDI" : "Novo CDI"}
      </h3>

      <div className="flex flex-col gap-3">
        <input
          type="month"
          value={form.data}
          onChange={e => handleChange("data", e.target.value)}
          className="bg-gray-700 px-3 py-2 rounded-lg"
        />

        <input
          type="number"
          step="0.01"
          placeholder="% CDI (ex: 13.65)"
          value={form.percentual}
          onChange={e => handleChange("percentual", e.target.value)}
          className="bg-gray-700 px-3 py-2 rounded-lg"
        />

        <input
          type="number"
          step="0.01"
          placeholder="CDI a.m (%)"
          value={form.cdi_am}
          onChange={e => handleChange("cdi_am", e.target.value)}
          className="bg-gray-700 px-3 py-2 rounded-lg"
        />

        <input
          type="number"
          step="0.01"
          placeholder="CDI % a.m (%)"
          value={form.cdi_percentual_am}
          onChange={e => handleChange("cdi_percentual_am", e.target.value)}
          className="bg-gray-700 px-3 py-2 rounded-lg"
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Check size={16} /> Salvar
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
        >
          <X size={16} />
        </button>

      </div>
    </div>
  );
}
