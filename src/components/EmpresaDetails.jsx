import { Edit, Trash, RotateCcw } from "lucide-react";

function EmpresaDetails({ empresa, onEdit, onDelete, onRefresh, refreshing }) {
  return (
    <div className="text-gray-300 flex flex-col gap-3">

      <p><strong>Nome:</strong> {empresa.nome}</p>
      <p><strong>CNPJ:</strong> {empresa.cnpj}</p>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onEdit}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Edit size={18} /> Editar
        </button>

        <button
          onClick={onRefresh}
          className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <RotateCcw
            size={18}
            className={`text-white ${refreshing ? "animate-spin" : ""}`}
          />
          Atualizar
        </button>

        <button
          onClick={onDelete}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          <Trash size={18} /> Deletar
        </button>

      </div>
    </div>
  );
}

export default EmpresaDetails;
