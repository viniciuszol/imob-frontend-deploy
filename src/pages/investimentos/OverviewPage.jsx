// src/pages/investimentos/OverviewPage.jsx
import Navbar from "../../components/Navbar";
import SubNavInvestimentos from "../../components/SubNavInvestimentos";
import { PieChart } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { useInvestimentos } from "../../contexts/InvestimentosContext";
import { useEffect, useState } from "react";

function formatEnum(text) {
    if (!text) return "";
    return text
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#a855f7",
    "#f97316",
    "#eab308",
    "#ec4899",
    "#14b8a6",
    "#8b5cf6",
    "#f43f5e",
    "#06b6d4",
    "#ca7436ff",
];

export default function OverviewPage() {
    const { overview, enums, carregarEnums, carregarOverview } = useInvestimentos();

    // ✅ estado único de filtros
    const [filters, setFilters] = useState({});

    useEffect(() => {
        carregarEnums();
        carregarOverview({});
    }, []);

    // 🔁 sempre que filtros mudarem, recarrega overview
    useEffect(() => {
        carregarOverview(filters);
    }, [filters]);

    if (!overview) return null;

    const ativosPositivos = overview.ativos.filter(
        (a) => Number(a.total) >= 0
    );

    const total = ativosPositivos.reduce((acc, a) => acc + a.total, 0);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || undefined, // remove filtro se vazio
        }));
    };

    const limparFiltros = () => {
        setFilters({});
    };

    return (
        <div>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center">
                <main className="px-8 py-10 w-full max-w-7xl">

                    <h2 className="text-3xl mb-6 font-semibold flex items-center gap-3">
                        <PieChart size={28} className="text-blue-400" />
                        Visão Geral
                    </h2>

                    <SubNavInvestimentos />

                    {/* FILTROS */}
                    {enums && (
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                            {Object.entries(enums).map(([key, list]) => (
                                <select
                                    key={key}
                                    value={filters[key] ?? ""}
                                    className="bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-2 text-sm hover:border-blue-500 transition"
                                    onChange={(e) =>
                                        handleFilterChange(key, e.target.value)
                                    }
                                >
                                    <option value="">
                                        Todos ({formatEnum(key)})
                                    </option>
                                    {list.map((item) => (
                                        <option key={item} value={item}>
                                            {formatEnum(item)}
                                        </option>
                                    ))}
                                </select>
                            ))}
                        </div>
                    )}

                    {/* BOTÃO LIMPAR */}
                    <div className="flex justify-end mb-10">
                        <button
                            onClick={limparFiltros}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-sm"
                        >
                            Limpar filtros
                        </button>
                    </div>

                    {/* GRÁFICO */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-lg w-full">

                        <div className="flex gap-3 mb-6">
                            {["Total", "Preço Venda", "Saldo Devedor"].map((b) => (
                                <button
                                    key={b}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-sm"
                                >
                                    {b}
                                </button>
                            ))}
                            <p>ainda sera implementado</p>
                        </div>

                        <div className="flex flex-row gap-6 max-h-[600px]">

                            <div className="w-1/2 flex items-center justify-center">
                                <Pie
                                    data={{
                                        labels: ativosPositivos.map((a) => a.nome),
                                        datasets: [
                                            {
                                                data: ativosPositivos.map((a) => a.total),
                                                backgroundColor: COLORS.slice(
                                                    0,
                                                    ativosPositivos.length
                                                ),
                                                borderColor: "#0000",
                                            },
                                        ],
                                    }}
                                    width={350}
                                    height={350}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        const value = context.parsed;
                                                        const percent = (
                                                            (value / total) *
                                                            100
                                                        ).toFixed(1);
                                                        return `${context.label}: ${percent}% (${value.toLocaleString(
                                                            "pt-BR",
                                                            {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            }
                                                        )})`;
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>

                            <div className="w-1/2 flex flex-col gap-3 overflow-y-auto pr-2">
                                <h3 className="text-lg font-semibold mb-1">
                                    Legenda
                                </h3>

                                {ativosPositivos.map((a, idx) => (
                                    <div
                                        key={a.id}
                                        className="flex justify-between items-center bg-gray-800 p-3 rounded-lg border border-gray-700"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor: COLORS[idx],
                                                }}
                                            ></span>
                                            <span>{a.nome}</span>
                                        </div>

                                        <span className="text-green-400 font-bold">
                                            {a.total.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
