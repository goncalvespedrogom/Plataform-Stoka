import React, { useState, useEffect } from "react";
import { Product } from "../../../types/Product";
import { useProductContext } from "../register/ProductContext";
import { useTaskContext } from "../tasks/TaskContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { LuWeight } from "react-icons/lu";
import { IoPricetagOutline } from "react-icons/io5";
import { MdOutlineLocalOffer } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { HiOutlineDocumentCurrencyDollar } from "react-icons/hi2";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { useSalesContext } from "../sales/SalesContext";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/useAuth";
import {
  useStockSnapshotAuto,
  getAllSnapshotsByUser,
} from "../../../hooks/useStockSnapshot";
import { StockSnapshot } from "../../../types/StockSnapshot";

const DashboardSection = () => {
  // TODOS os hooks devem ser declarados aqui no topo!
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { products } = useProductContext();
  const { tasks } = useTaskContext();
  const { sales } = useSalesContext();
  const [taskFilter, setTaskFilter] = useState<
    "todas" | "concluídas" | "em_andamento" | "pendentes"
  >("todas");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<{
    type: "produto" | "tarefa";
    data: any;
  } | null>(null);
  const [searchVenda, setSearchVenda] = useState("");
  const [searchVendaResult, setSearchVendaResult] = useState(
    null as null | (typeof sales)[0]
  );
  // --- Paginação das categorias ---
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);
  // Cálculo de categoriasData precisa vir antes do useEffect
  const categoriaQuantidade: Record<string, number> = {};
  products.forEach((prod) => {
    if (!categoriaQuantidade[prod.category])
      categoriaQuantidade[prod.category] = 0;
    categoriaQuantidade[prod.category] += prod.quantity;
  });
  const totalItensCategorias = Object.values(categoriaQuantidade).reduce(
    (a, b) => a + b,
    0
  );
  // Lista fixa de todas as categorias possíveis (igual ao modal de registro)
  const todasCategorias = [
    "Eletrônicos",
    "Vestuário",
    "Alimentos",
    "Casa e Jardim",
    "Esportes",
    "Livros",
    "Saúde",
    "Automotivo",
    "Brinquedos",
    "Ferramentas",
    "Papelaria",
    "Pet Shop",
  ];
  // Cálculo de categoriasData para garantir todas as categorias
  let categoriasData = todasCategorias.map((categoria) => {
    const quantidade = categoriaQuantidade[categoria] || 0;
    return {
      name: categoria,
      value: quantidade,
      percent:
        totalItensCategorias > 0
          ? Math.round((quantidade / totalItensCategorias) * 100)
          : 0,
    };
  });
  // Ordenar por percent (decrescente) e depois por nome (alfabético)
  categoriasData = categoriasData.sort((a, b) => {
    if (b.percent !== a.percent) return b.percent - a.percent;
    return a.name.localeCompare(b.name, "pt-BR");
  });
  React.useEffect(() => {
    setCurrentCategoryPage(0);
  }, [categoriasData.length]);
  // Cores para as categorias (padrão, pode expandir)
  const donutColors = [
    "#06b6d4",
    "#fbbf24",
    "#22c55e",
    "#a78bfa",
    "#f472b6",
    "#f87171",
    "#facc15",
    "#818cf8",
  ];
  // --- Variáveis de paginação das categorias ---
  const [categoriasPorPagina, setCategoriasPorPagina] = useState(3);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 370) {
        setCategoriasPorPagina(1);
      } else if (window.innerWidth < 480) {
        setCategoriasPorPagina(2);
      } else {
        setCategoriasPorPagina(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const totalPaginasCategorias = Math.ceil(
    categoriasData.length / categoriasPorPagina
  );
  const categoriasPaginaAtual = categoriasData.slice(
    currentCategoryPage * categoriasPorPagina,
    (currentCategoryPage + 1) * categoriasPorPagina
  );
  const nextCategoryPage = () => {
    if (totalPaginasCategorias > 0) {
      setCurrentCategoryPage((prev) => (prev + 1) % totalPaginasCategorias);
    }
  };
  const prevCategoryPage = () => {
    if (totalPaginasCategorias > 0) {
      setCurrentCategoryPage(
        (prev) => (prev - 1 + totalPaginasCategorias) % totalPaginasCategorias
      );
    }
  };

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResult(null);
      return;
    }
    const productMatch = products.find((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const taskMatch = tasks.find((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (productMatch) {
      setSearchResult({ type: "produto", data: productMatch });
    } else if (taskMatch) {
      setSearchResult({ type: "tarefa", data: taskMatch });
    } else {
      setSearchResult(null);
    }
  }, [searchTerm, products, tasks]);

  React.useEffect(() => {
    if (searchVenda.trim() === "") {
      setSearchVendaResult(null);
      return;
    }
    const vendaMatch = sales.find((sale) =>
      sale.productName.toLowerCase().includes(searchVenda.toLowerCase())
    );
    setSearchVendaResult(vendaMatch || null);
  }, [searchVenda, sales]);

  React.useEffect(() => {
    setCurrentTaskIndex(0);
  }, [taskFilter]);

  // --- VENDAS ---
  // Saldo total
  const saldoTotal = sales.reduce(
    (acc, sale) => acc + sale.profit - sale.loss,
    0
  );
  // Saldo semanal (últimos 7 dias)
  const agora = new Date();
  const seteDiasAtras = new Date(agora);
  seteDiasAtras.setDate(agora.getDate() - 7);
  const saldoSemanal = sales
    .filter((sale) => new Date(sale.saleDate) >= seteDiasAtras)
    .reduce((acc, sale) => acc + sale.profit - sale.loss, 0);
  // Última venda
  const ultimaVenda =
    sales.length > 0
      ? sales.reduce((a, b) =>
          new Date(a.saleDate) > new Date(b.saleDate) ? a : b
        )
      : null;

  // Estado para controlar se o tooltip está ativo (donut de saldo)
  const [saldoTooltipActive, setSaldoTooltipActive] = useState(false);

  useStockSnapshotAuto();

  const [snapshots, setSnapshots] = useState<StockSnapshot[]>([]);

  useEffect(() => {
    if (!user) return;
    getAllSnapshotsByUser(user.uid).then(setSnapshots);
  }, [user]);

  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 1540);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isVerySmall, setIsVerySmall] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsVerySmall(window.innerWidth < 410);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [showTaskFilters, setShowTaskFilters] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      setShowTaskFilters(window.innerWidth >= 505);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading || !user || !isClient) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  const totalItens = products.reduce(
    (acc, produto) => acc + produto.quantity,
    0
  );

  // Função para filtrar tarefas
  const filteredTasks = tasks.filter((task) => {
    switch (taskFilter) {
      case "concluídas":
        return task.status === "concluída";
      case "em_andamento":
        return task.status === "em_andamento";
      case "pendentes":
        return task.status === "pendente";
      default:
        return true; // todas
    }
  });

  // Função para navegar para próxima tarefa
  const nextTask = () => {
    if (filteredTasks.length > 0) {
      setCurrentTaskIndex((prev) => (prev + 1) % filteredTasks.length);
    }
  };

  // Função para navegar para tarefa anterior
  const prevTask = () => {
    if (filteredTasks.length > 0) {
      setCurrentTaskIndex(
        (prev) => (prev - 1 + filteredTasks.length) % filteredTasks.length
      );
    }
  };

  const diasSemana = [
    "Segunda-feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
    "Domingo",
  ];

  // Exemplo: cada produto tem um campo 'day' (0 a 6) indicando o dia da semana em que foi registrado
  // e um campo 'value' indicando o valor do produto
  // Caso não tenha, adapte conforme sua estrutura
  const gastosPorDia = diasSemana.map((dia, idx) => {
    const soma = products
      .filter((p) => new Date(p.date).getDay() === (idx + 1) % 7) // getDay: 0=Domingo, 1=Segunda...
      .reduce((acc, p) => acc + p.unitPrice * p.quantity, 0);
    return { dia, valor: soma };
  });

  // Novo array: quantidade de itens por dia da semana
  const itensPorDia = diasSemana.map((dia, idx) => {
    const soma = products
      .filter((p) => new Date(p.date).getDay() === (idx + 1) % 7)
      .reduce((acc, p) => acc + p.quantity, 0);
    return { dia, quantidade: soma };
  });

  // Função para formatar valores em Real Brasileiro
  const formatarReal = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Função para formatar apenas número inteiro com separador de milhar
  const formatarNumero = (valor: number) =>
    valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 });

  // Dia da semana atual (0=Domingo, 1=Segunda...)
  const diaAtual = new Date().getDay();

  // Componente para customizar o tick do eixo X
  const CustomTick = (props: any) => {
    const { x, y, payload, index } = props;
    const diaAtual = new Date().getDay();
    const isHoje = (index + 1) % 7 === diaAtual;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fontWeight={isHoje ? "bold" : "normal"}
          fontSize={12}
          fill="#666"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Tooltip customizado para mostrar apenas o valor
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "6px 12px",
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          {formatarReal(payload[0].value)}
        </div>
      );
    }
    return null;
  };

  // Tooltip customizado para o donut de saldo
  const CustomSaldoTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "6px 14px",
            fontWeight: 600,
            fontSize: 12,
            color: "#333",
            boxShadow: "1px 2px 5px #bbb",
            minWidth: 90,
          }}
        >
          <span style={{ color: payload[0].color, fontWeight: 700 }}>
            {payload[0].name}:
          </span>{" "}
          {formatarReal(payload[0].value)}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* NOVA PRIMEIRA LINHA: Boxes de Categorias, Saldo de Vendas e Quantidade Semanal do Estoque */}
      <div className="dashboard-boxes-row" style={{ display: "flex", gap: 24, marginTop: 0, width: "100%" }}>
        {/* Box de Categorias */}
        <div
          className="dashboard-box-categorias"
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            paddingTop: 56, // aumenta o espaço entre o título e o conteúdo
            flex: 1,
            minWidth: 360,
            maxWidth: 420,
            boxShadow: "0 2px 8px #e0e0e0",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            position: "relative", // ADICIONADO para alinhar o título
          }}
        >
          <span
            className="text-gray-400 dashboard-categorias-title"
            style={{
              position: "absolute",
              top: 23,
              left: 24,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Itens do Estoque por Categoria
          </span>
          {categoriasData.length === 0 ? (
            <span style={{ color: "#bbb", fontSize: 14, marginTop: 16 }}>
              Nenhum produto cadastrado.
            </span>
          ) : (
            <>
              <div
                className="dashboard-categorias-circles"
                style={{
                  display: "flex",
                  gap: 18,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  minHeight: 120,
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {categoriasPaginaAtual.map((cat, idx) => (
                  <div
                    key={cat.name}
                    style={{
                      position: "relative",
                      width: 96,
                      height: 116,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: 2,
                      minWidth: 96,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: 86,
                        height: 86,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PieChart width={86} height={86}>
                        <Pie
                          data={[
                            cat,
                            {
                              ...cat,
                              value: totalItensCategorias - cat.value,
                              fill: "#f3f4f6",
                            },
                          ]}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                          innerRadius={30}
                          outerRadius={40}
                          stroke="none"
                        >
                          <Cell
                            key="cat"
                            fill={
                              donutColors[
                                (currentCategoryPage * categoriasPorPagina +
                                  idx) %
                                  donutColors.length
                              ]
                            }
                          />
                          <Cell key="rest" fill="#f3f4f6" />
                        </Pie>
                      </PieChart>
                      <span
                        style={{
                          position: "absolute",
                          left: 2,
                          top: 2,
                          width: "88px",
                          height: "88px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#888",
                          pointerEvents: "none",
                        }}
                      >
                        {cat.percent}%
                      </span>
                    </div>
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: 12,
                        color: "#888",
                        marginTop: 8,
                      }}
                    >
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
              {/* Navegação de páginas */}
              {totalPaginasCategorias > 1 && (
                <div
                  className="dashboard-categorias-pagination"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 22,
                    marginBottom: -18,
                    gap: 10,
                    width: "100%",
                  }}
                >
                  <button
                    onClick={prevCategoryPage}
                    disabled={totalPaginasCategorias <= 1}
                    style={{
                      padding: 0,
                      border: "none",
                      background: "#F3F4F6",
                      color: "#616161",
                      borderRadius: "50%",
                      cursor:
                        totalPaginasCategorias <= 1 ? "not-allowed" : "pointer",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      transition: "background 0.2s, color 0.2s",
                      outline: "none",
                      opacity: totalPaginasCategorias <= 1 ? 0.5 : 1,
                    }}
                    aria-label="Anterior"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.5 19L9.5 12L15.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <span
                    style={{ fontSize: 11, color: "#616161", fontWeight: 500 }}
                  >
                    {currentCategoryPage + 1} de {totalPaginasCategorias}
                  </span>
                  <button
                    onClick={nextCategoryPage}
                    disabled={totalPaginasCategorias <= 1}
                    style={{
                      padding: 0,
                      border: "none",
                      background: "#F3F4F6",
                      color: "#616161",
                      borderRadius: "50%",
                      cursor:
                        totalPaginasCategorias <= 1 ? "not-allowed" : "pointer",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      transition: "background 0.2s, color 0.2s",
                      outline: "none",
                      opacity: totalPaginasCategorias <= 1 ? 0.5 : 1,
                    }}
                    aria-label="Próxima"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.5 5L14.5 12L8.5 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {/* Box 2 - Saldo de Vendas */}
        <div
          className="dashboard-box-saldo-vendas"
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 1,
            minWidth: 260,
            maxWidth: 340,
            boxShadow: "0 2px 8px #e0e0e0",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            minHeight: 180,
          }}
        >
          <span
            className="text-gray-400"
            style={{
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 22,
              textAlign: "left",
              width: "100%",
            }}
          >
            Saldo de Vendas
          </span>
          {/* Gráfico circular de saldo bruto x líquido */}
          {sales.length === 0 ? (
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 68, minHeight: 120 }}>
              <span style={{ color: "#bbb", fontSize: 13 }}>
                Nenhuma venda registrada.
              </span>
            </div>
          ) : (
            <>
              {(() => {
                // Cálculo dos saldos
                const saldoBruto = sales.reduce(
                  (acc, sale) => acc + sale.salePrice * sale.quantity,
                  0
                );
                const saldoLiquido = sales.reduce(
                  (acc, sale) => acc + sale.profit - sale.loss,
                  0
                );
                const saldoPerda = saldoBruto - saldoLiquido;
                const saldoData = [
                  {
                    name: "Saldo Líquido",
                    value: saldoLiquido > 0 ? saldoLiquido : 0,
                  },
                  { name: "Perdas", value: saldoPerda > 0 ? saldoPerda : 0 },
                ];
                const donutColorsSaldo = ["#a78bfa", "#fbbf24"];
                return (
                  <div
                    className="dashboard-saldo-grafico-legenda"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      minHeight: 120,
                      background: "#fff",
                      borderRadius: 16,
                      padding: 18,
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      className="dashboard-saldo-grafico-donut"
                      style={{
                        position: "relative",
                        width: 140,
                        height: 140,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 16,
                      }}
                    >
                      <PieChart
                        width={140}
                        height={140}
                        style={{ display: "block", margin: "0 auto" }}
                      >
                        <Pie
                          data={saldoData}
                          dataKey="value"
                          nameKey="name"
                          startAngle={90}
                          endAngle={-270}
                          innerRadius={52}
                          outerRadius={64}
                          stroke="none"
                          onMouseEnter={() => setSaldoTooltipActive(true)}
                          onMouseLeave={() => setSaldoTooltipActive(false)}
                          cornerRadius={10} // borda arredondada
                          paddingAngle={4} // espaço entre as fatias
                        >
                          {saldoData.map((entry, idx) => (
                            <Cell
                              key={entry.name}
                              fill={
                                donutColorsSaldo[idx % donutColorsSaldo.length]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={<CustomSaldoTooltip />}
                          wrapperStyle={{ outline: "none" }}
                        />
                      </PieChart>
                      {!saldoTooltipActive && (
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 2,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                            fontSize: 13,
                            color: "#888",
                            pointerEvents: "none",
                            textAlign: "center",
                            flexDirection: "column",
                          }}
                        >
                          {formatarReal(saldoBruto)}
                        </span>
                      )}
                    </div>
                    <div
                      className="dashboard-saldo-legendas"
                    >
                      {/* Saldo Bruto */}
                      <div
                        className="dashboard-saldo-legenda-item"
                      >
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            background: "#999",
                            display: "inline-block",
                            border: "2px solid #999",
                          }}
                        ></span>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            lineHeight: 1,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              color: "#777",
                              fontWeight: 600,
                            }}
                          >
                            {formatarReal(saldoBruto)}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#888",
                              fontWeight: 500,
                              marginTop: 1,
                            }}
                          >
                            {isVerySmall ? 'Bruto' : 'Saldo Bruto'}
                          </span>
                        </div>
                      </div>
                      <div
                        className="dashboard-saldo-legenda-item"
                      >
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            background: "#a78bfa",
                            display: "inline-block",
                            border: "2px solid #a78bfa",
                          }}
                        ></span>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            lineHeight: 1,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              color: "#777",
                              fontWeight: 600,
                            }}
                          >
                            {formatarReal(saldoLiquido)}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#888",
                              fontWeight: 500,
                              marginTop: 1,
                            }}
                          >
                            {isVerySmall ? 'Líquido' : 'Saldo Líquido'}
                          </span>
                        </div>
                      </div>
                      <div
                        className="dashboard-saldo-legenda-item"
                      >
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            background: "#fbbf24",
                            display: "inline-block",
                            border: "2px solid #fbbf24",
                          }}
                        ></span>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            lineHeight: 1,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              color: "#777",
                              fontWeight: 600,
                            }}
                          >
                            {formatarReal(saldoPerda)}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#888",
                              fontWeight: 500,
                              marginTop: 1,
                            }}
                          >
                            Custos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
        {!isNarrow && (
          // Box 3 - Quantidade Semanal do Estoque
          <div
            className="dashboard-box-quantidade-semanal"
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              flex: 2,
              minHeight: 200,
              boxShadow: "0 2px 8px #e0e0e0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              position: "relative",
            }}
          >
            <span
              className="text-gray-400"
              style={{
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 32,
                textAlign: "left",
                width: "100%",
              }}
            >
              Quantidade Semanal do Estoque
            </span>
            {/* Gráfico de barras semanal do estoque */}
            {(() => {
              // Dias da semana (segunda a domingo)
              const diasSemana = [
                "Segunda",
                "Terça",
                "Quarta",
                "Quinta",
                "Sexta",
                "Sábado",
                "Domingo",
              ];
              // Data de hoje
              const hoje = new Date();
              const diaSemanaHoje = hoje.getDay() === 0 ? 6 : hoje.getDay() - 1; // 0=Domingo, 1=Segunda...
              // Para cada dia da semana, encontrar o snapshot mais recente daquele dia
              const snapshotByWeekday: {
                [idx: number]: { date: string; totalQuantity: number };
              } = {};
              for (let idx = 0; idx < 7; idx++) {
                // Para o dia atual, snapshot de hoje (ou estoque atual)
                if (idx === diaSemanaHoje) continue;
                // Procurar o snapshot mais recente daquele dia da semana, cuja data seja anterior a hoje
                const snap = snapshots.find((s) => {
                  const d = new Date(s.date);
                  const weekDay = d.getDay() === 0 ? 6 : d.getDay() - 1;
                  // Data do snapshot deve ser < hoje
                  return (
                    weekDay === idx &&
                    d < new Date(hoje.toISOString().slice(0, 10))
                  );
                });
                if (snap) {
                  snapshotByWeekday[idx] = {
                    date: snap.date,
                    totalQuantity: snap.maxQuantity ?? snap.totalQuantity,
                  };
                }
              }
              // Estoque atual
              const totalEstoqueAtual = products.reduce(
                (acc, p) => acc + p.quantity,
                0
              );
              // Montar dados do gráfico para os 7 dias
              const maxEstoquePorDia = diasSemana.map((dia, idx) => {
                // Para o dia atual, mostrar o pico do snapshot de hoje (se houver), senão estoque atual
                if (idx === diaSemanaHoje) {
                  const snapHoje = snapshots.find(
                    (s) => s.date === hoje.toISOString().slice(0, 10)
                  );
                  return {
                    dia,
                    quantidade: snapHoje
                      ? snapHoje.maxQuantity ?? snapHoje.totalQuantity
                      : totalEstoqueAtual,
                    isHoje: true,
                  };
                }
                // Para os outros dias, mostrar o pico do snapshot mais recente daquele dia da semana
                return {
                  dia,
                  quantidade: snapshotByWeekday[idx]?.totalQuantity || 0,
                  isHoje: false,
                };
              });
              // Cores
              const corBarra = "#60a5fa"; // azul claro
              const corBarraHoje = "#06b6d4"; // azul escuro
              const yTicks = [0, 100, 500, 1000, 1500];
              return (
                <div style={{ width: "100%", height: 180, marginTop: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={maxEstoquePorDia}
                      margin={{ top: 8, right: 24, left: 0, bottom: 16 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="dia"
                        tick={{ fontSize: 12, fill: "#666", fontWeight: 500, className: "dashboard-estoque-xaxis-tick" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        ticks={yTicks}
                        domain={[0, 1500]}
                        tick={{ fontSize: 12, fill: "#888" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "#e0e7ef", opacity: 0.3 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div
                                style={{
                                  background: "#fff",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: 8,
                                  padding: "6px 14px",
                                  fontWeight: 600,
                                  fontSize: 12,
                                  color: "#333",
                                  boxShadow: "1px 2px 5px #bbb",
                                  minWidth: 90,
                                }}
                              >
                                {payload[0].payload.dia}:{" "}
                                <b>{payload[0].value}</b> itens
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="quantidade"
                        radius={[6, 6, 0, 0]}
                        minPointSize={2}
                      >
                        {maxEstoquePorDia.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={entry.isHoje ? corBarraHoje : corBarra}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}
          </div>
        )}
      </div>
      {isNarrow && (
        <div className="dashboard-boxes-row-estoque">
          <div
            className="dashboard-box-quantidade-semanal"
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              flex: 2,
              minHeight: 200,
              boxShadow: "0 2px 8px #e0e0e0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              position: "relative",
            }}
          >
            <span
              className="text-gray-400"
              style={{
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 32,
                textAlign: "left",
                width: "100%",
              }}
            >
              Quantidade Semanal do Estoque
            </span>
            {/* Gráfico de barras semanal do estoque */}
            {(() => {
              // Dias da semana (segunda a domingo)
              const diasSemana = [
                "Segunda",
                "Terça",
                "Quarta",
                "Quinta",
                "Sexta",
                "Sábado",
                "Domingo",
              ];
              // Data de hoje
              const hoje = new Date();
              const diaSemanaHoje = hoje.getDay() === 0 ? 6 : hoje.getDay() - 1; // 0=Domingo, 1=Segunda...
              // Para cada dia da semana, encontrar o snapshot mais recente daquele dia
              const snapshotByWeekday: {
                [idx: number]: { date: string; totalQuantity: number };
              } = {};
              for (let idx = 0; idx < 7; idx++) {
                // Para o dia atual, snapshot de hoje (ou estoque atual)
                if (idx === diaSemanaHoje) continue;
                // Procurar o snapshot mais recente daquele dia da semana, cuja data seja anterior a hoje
                const snap = snapshots.find((s) => {
                  const d = new Date(s.date);
                  const weekDay = d.getDay() === 0 ? 6 : d.getDay() - 1;
                  // Data do snapshot deve ser < hoje
                  return (
                    weekDay === idx &&
                    d < new Date(hoje.toISOString().slice(0, 10))
                  );
                });
                if (snap) {
                  snapshotByWeekday[idx] = {
                    date: snap.date,
                    totalQuantity: snap.maxQuantity ?? snap.totalQuantity,
                  };
                }
              }
              // Estoque atual
              const totalEstoqueAtual = products.reduce(
                (acc, p) => acc + p.quantity,
                0
              );
              // Montar dados do gráfico para os 7 dias
              const maxEstoquePorDia = diasSemana.map((dia, idx) => {
                // Para o dia atual, mostrar o pico do snapshot de hoje (se houver), senão estoque atual
                if (idx === diaSemanaHoje) {
                  const snapHoje = snapshots.find(
                    (s) => s.date === hoje.toISOString().slice(0, 10)
                  );
                  return {
                    dia,
                    quantidade: snapHoje
                      ? snapHoje.maxQuantity ?? snapHoje.totalQuantity
                      : totalEstoqueAtual,
                    isHoje: true,
                  };
                }
                // Para os outros dias, mostrar o pico do snapshot mais recente daquele dia da semana
                return {
                  dia,
                  quantidade: snapshotByWeekday[idx]?.totalQuantity || 0,
                  isHoje: false,
                };
              });
              // Cores
              const corBarra = "#60a5fa"; // azul claro
              const corBarraHoje = "#06b6d4"; // azul escuro
              const yTicks = [0, 100, 500, 1000, 1500];
              return (
                <div style={{ width: "100%", height: 180, marginTop: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={maxEstoquePorDia}
                      margin={{ top: 8, right: 24, left: 0, bottom: 16 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="dia"
                        tick={{ fontSize: 12, fill: "#666", fontWeight: 500, className: "dashboard-estoque-xaxis-tick" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        ticks={yTicks}
                        domain={[0, 1500]}
                        tick={{ fontSize: 12, fill: "#888" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "#e0e7ef", opacity: 0.3 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div
                                style={{
                                  background: "#fff",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: 8,
                                  padding: "6px 14px",
                                  fontWeight: 600,
                                  fontSize: 12,
                                  color: "#333",
                                  boxShadow: "1px 2px 5px #bbb",
                                  minWidth: 90,
                                }}
                              >
                                {payload[0].payload.dia}:{" "}
                                <b>{payload[0].value}</b> itens
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="quantidade"
                        radius={[6, 6, 0, 0]}
                        minPointSize={2}
                      >
                        {maxEstoquePorDia.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={entry.isHoje ? corBarraHoje : corBarra}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}
          </div>
        </div>
      )}
      {/* Linha de membros, tarefas, outreach e storage */}
      <div className="dashboard-row-produtos" style={{ display: "flex", gap: "24px" }}>
        {/* Coluna empilhada: Produtos Registrados e Itens Registrados */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 200,
            gap: 12,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              flex: 1,
              boxShadow: "0 2px 8px #e0e0e0",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="text-gray-400"
              style={{
                position: "absolute",
                top: 24,
                left: 24,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Produtos Registrados
            </span>
            <span style={{ fontWeight: "bold", fontSize: 38, marginTop: 28 }}>
              {isClient ? products.length : ""}
            </span>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              flex: 1,
              boxShadow: "0 2px 8px #e0e0e0",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="text-gray-400"
              style={{
                position: "absolute",
                top: 24,
                left: 24,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Itens Registrados
            </span>
            <span style={{ fontWeight: "bold", fontSize: 38, marginTop: 28 }}>
              {isClient ? totalItens : ""}
            </span>
          </div>
        </div>
        {/* Último Registro */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 2,
            minHeight: 200,
            boxShadow: "0 2px 8px #e0e0e0",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="text-gray-400"
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Último Registro
          </span>
          {isClient ? (
            products.length > 0 ? (
              (() => {
                const last = products[products.length - 1];
                const valorTotal = last.unitPrice * last.quantity;
                return (
                  <>
                    {/* Linha do meio: quantidade, valor unitário, valor total, data */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        margin: "40px 0 8px 0",
                        width: "100%",
                        paddingRight: 24,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <LuWeight
                          size={20}
                          color="#9ca3af"
                          style={{ marginBottom: 2, strokeWidth: 2.5 }}
                        />
                        <span
                          style={{
                            color: "#363636",
                            fontWeight: 500,
                            fontSize: 15,
                            marginTop: 2,
                          }}
                        >
                          {last.quantity}
                        </span>
                        <span
                          style={{ color: "#888", fontSize: 12, marginTop: 2 }}
                        >
                          Quantidade
                        </span>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <MdOutlineLocalOffer
                          size={22}
                          color="#9ca3af"
                          style={{ marginBottom: 2 }}
                        />
                        <span
                          style={{
                            color: "#363636",
                            fontWeight: 500,
                            fontSize: 15,
                            marginTop: 2,
                          }}
                        >
                          {formatarReal(last.unitPrice)}
                        </span>
                        <span
                          style={{ color: "#888", fontSize: 12, marginTop: 2 }}
                        >
                          Valor Unitário
                        </span>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <HiOutlineCurrencyDollar
                          size={22}
                          color="#9ca3af"
                          style={{ marginBottom: 2 }}
                        />
                        <span
                          style={{
                            color: "#363636",
                            fontWeight: 500,
                            fontSize: 15,
                            marginTop: 2,
                          }}
                        >
                          {formatarReal(valorTotal)}
                        </span>
                        <span
                          style={{ color: "#888", fontSize: 12, marginTop: 2 }}
                        >
                          Valor Total
                        </span>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          fill="none"
                          viewBox="0 0 24 24"
                          style={{ marginBottom: 2 }}
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="4"
                            stroke="#9ca3af"
                            strokeWidth="2"
                          />
                          <path
                            d="M16 2v4M8 2v4M3 10h18"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span
                          style={{
                            color: "#363636",
                            fontWeight: 500,
                            fontSize: 15,
                            marginTop: 2,
                          }}
                        >
                          {new Date(last.date).toLocaleDateString("pt-BR")}
                        </span>
                        <span
                          style={{ color: "#888", fontSize: 12, marginTop: 2 }}
                        >
                          Data
                        </span>
                      </div>
                    </div>
                    {/* Box cinza com título e descrição na parte debaixo */}
                    <div
                      style={{
                        background: "#f8f9fa",
                        borderRadius: 8,
                        marginTop: 24,
                        padding: "18px 32px",
                        width: "100%",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        boxShadow: "0 1px 4px #e0e0e0",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 17,
                          color: "#333",
                          marginBottom: 6,
                        }}
                      >
                        {last.name}
                      </span>
                      <span
                        style={{ color: "#666", fontSize: 13, lineHeight: 1.5 }}
                      >
                        {last.description || (
                          <span style={{ color: "#bbb" }}>Sem descrição.</span>
                        )}
                      </span>
                    </div>
                  </>
                );
              })()
            ) : (
              <span style={{ color: "#bbb", fontSize: 13, marginTop: 32 }}>
                Nenhum produto registrado.
              </span>
            )
          ) : null}
        </div>
        {/* Server Storage com mesmo tamanho do Último Registro */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 2,
            minHeight: 200,
            boxShadow: "0 2px 8px #e0e0e0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            position: "relative",
          }}
        >
          {/* Input de busca */}
          <div style={{ position: "relative", width: "100%" }}>
            <IoSearch
              style={{
                position: "absolute",
                left: 12,
                top: 17,
                color: "#9ca3af",
                pointerEvents: "none",
              }}
              size={20}
            />
            <input
              type="text"
              placeholder="Digite o nome do produto ou tarefa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                marginTop: 8,
                width: "92%",
                maxWidth: "none",
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #e0e0e0",
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 12,
                background: "#f3f4f6", // cinza claro
                color: "#333",
                transition: "box-shadow 0.2s, border 0.2s",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                paddingLeft: 38, // espaço para o ícone
              }}
            />
          </div>
          {/* Resultado da busca */}
          {searchTerm.trim() === "" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                flex: 1,
              }}
            >
              <span style={{ color: "#bbb", fontSize: 13 }}>
                Digite para buscar um produto ou tarefa.
              </span>
            </div>
          ) : searchResult ? (
            searchResult.type === "produto" ? (
              // Produto encontrado
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: 8,
                  marginTop: 10,
                  padding: "18px 32px",
                  width: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  boxShadow: "0 1px 4px #e0e0e0",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: "#333",
                    marginBottom: 6,
                  }}
                >
                  {searchResult.data.name}
                </span>
                <span style={{ color: "#666", fontSize: 13, lineHeight: 1.5 }}>
                  {searchResult.data.description || (
                    <span style={{ color: "#bbb" }}>Sem descrição.</span>
                  )}
                </span>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    margin: "24px 0 0 0",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 0,
                    }}
                  >
                    <LuWeight
                      size={20}
                      color="#9ca3af"
                      style={{ marginBottom: 2, strokeWidth: 2.5 }}
                    />
                    <span
                      style={{
                        color: "#363636",
                        fontWeight: 500,
                        fontSize: 15,
                        marginTop: 2,
                      }}
                    >
                      {searchResult.data.quantity}
                    </span>
                    <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                      Quantidade
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 0,
                    }}
                  >
                    <MdOutlineLocalOffer
                      size={22}
                      color="#9ca3af"
                      style={{ marginBottom: 2 }}
                    />
                    <span
                      style={{
                        color: "#363636",
                        fontWeight: 500,
                        fontSize: 15,
                        marginTop: 2,
                      }}
                    >
                      {formatarReal(searchResult.data.unitPrice)}
                    </span>
                    <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                      Valor Unitário
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 0,
                    }}
                  >
                    <HiOutlineCurrencyDollar
                      size={22}
                      color="#9ca3af"
                      style={{ marginBottom: 2 }}
                    />
                    <span
                      style={{
                        color: "#363636",
                        fontWeight: 500,
                        fontSize: 15,
                        marginTop: 2,
                      }}
                    >
                      {formatarReal(
                        searchResult.data.unitPrice * searchResult.data.quantity
                      )}
                    </span>
                    <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                      Valor Total
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 0,
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      fill="none"
                      viewBox="0 0 24 24"
                      style={{ marginBottom: 2 }}
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="4"
                        stroke="#9ca3af"
                        strokeWidth="2"
                      />
                      <path
                        d="M16 2v4M8 2v4M3 10h18"
                        stroke="#9ca3af"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      style={{
                        color: "#363636",
                        fontWeight: 500,
                        fontSize: 15,
                        marginTop: 2,
                      }}
                    >
                      {new Date(searchResult.data.date).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                    <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                      Data
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Tarefa encontrada
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: 8,
                  marginTop: 10,
                  padding: "18px 32px",
                  width: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  boxShadow: "0 1px 4px #e0e0e0",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: "#333",
                    marginBottom: 6,
                  }}
                >
                  {searchResult.data.title}
                </span>
                <span style={{ color: "#666", fontSize: 13, lineHeight: 1.5 }}>
                  {searchResult.data.description || (
                    <span style={{ color: "#bbb" }}>Sem descrição.</span>
                  )}
                </span>
                <div style={{ display: "flex", gap: 24, marginTop: 18 }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: "bold",
                      background:
                        searchResult.data.status === "concluída"
                          ? "#4CAF50"
                          : searchResult.data.status === "em_andamento"
                          ? "#FF9800"
                          : "#F44336",
                      color: "#fff",
                    }}
                  >
                    {searchResult.data.status === "concluída"
                      ? "Concluída"
                      : searchResult.data.status === "em_andamento"
                      ? "Em Andamento"
                      : "Pendente"}
                  </span>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: "bold",
                      background:
                        searchResult.data.priority === "alta"
                          ? "#F44336"
                          : searchResult.data.priority === "média"
                          ? "#FF9800"
                          : "#4CAF50",
                      color: "#fff",
                    }}
                  >
                    {searchResult.data.priority.charAt(0).toUpperCase() +
                      searchResult.data.priority.slice(1)}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 12 }}>
                  Criada em:{" "}
                  {new Date(searchResult.data.createdAt).toLocaleDateString(
                    "pt-BR"
                  )}
                  {searchResult.data.dueDate && (
                    <span style={{ marginLeft: 16 }}>
                      Prazo:{" "}
                      {new Date(searchResult.data.dueDate).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  )}
                </div>
              </div>
            )
          ) : (
            <span style={{ color: "#bbb", fontSize: 13, marginTop: 76 }}>
              Nenhum produto ou tarefa encontrado.
            </span>
          )}
        </div>
      </div>
      {/* Tarefas e Nova Box */}
      <div className="dashboard-row-tarefas" style={{ display: "flex", gap: "24px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 1,
            minHeight: 200,
            boxShadow: "0 2px 8px #e0e0e0",
            position: "relative",
          }}
        >
          <span
            className="text-gray-400"
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Tarefas
          </span>

          {/* Filtros */}
          {showTaskFilters && (
            <div className="dashboard-tarefas-filtros" style={{ position: "absolute", top: 22, right: 24, display: "flex", gap: "8px" }}>
              {(
                ["todas", "pendentes", "em_andamento", "concluídas"] as const
              ).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTaskFilter(filter)}
                  style={{
                    padding: "4px 8px",
                    fontSize: 12,
                    borderRadius: 12,
                    border: "none",
                    background: taskFilter === filter ? "#333" : "#f0f0f0",
                    color: taskFilter === filter ? "#fff" : "#666",
                    cursor: "pointer",
                    fontWeight: taskFilter === filter ? "bold" : "normal",
                  }}
                >
                  {filter === "em_andamento"
                    ? "Em Andamento"
                    : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Conteúdo das tarefas */}
          <div
            style={{
              marginTop: 60,
              height: "calc(100% - 60px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {filteredTasks.length > 0 ? (
              <>
                {/* Tarefa atual */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: "bold",
                        background:
                          filteredTasks[currentTaskIndex].status === "concluída"
                            ? "#4CAF50"
                            : filteredTasks[currentTaskIndex].status ===
                              "em_andamento"
                            ? "#FF9800"
                            : "#F44336",
                        color: "#fff",
                      }}
                    >
                      {filteredTasks[currentTaskIndex].status === "concluída"
                        ? "Concluída"
                        : filteredTasks[currentTaskIndex].status ===
                          "em_andamento"
                        ? "Em Andamento"
                        : "Pendente"}
                    </span>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: "bold",
                        background:
                          filteredTasks[currentTaskIndex].priority === "alta"
                            ? "#F44336"
                            : filteredTasks[currentTaskIndex].priority ===
                              "média"
                            ? "#FF9800"
                            : "#4CAF50",
                        color: "#fff",
                      }}
                    >
                      {filteredTasks[currentTaskIndex].priority
                        .charAt(0)
                        .toUpperCase() +
                        filteredTasks[currentTaskIndex].priority.slice(1)}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: "bold",
                      margin: 0,
                      color: "#333",
                    }}
                  >
                    {filteredTasks[currentTaskIndex].title}
                  </h3>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#666",
                      margin: 0,
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {filteredTasks[currentTaskIndex].description}
                  </p>

                  <div style={{ fontSize: 12, color: "#999" }}>
                    Criada em:{" "}
                    {new Date(
                      filteredTasks[currentTaskIndex].createdAt
                    ).toLocaleDateString("pt-BR")}
                    {filteredTasks[currentTaskIndex].dueDate && (
                      <span style={{ marginLeft: 16 }}>
                        Prazo:{" "}
                        {new Date(
                          filteredTasks[currentTaskIndex].dueDate
                        ).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                </div>
                {/* Navegação abaixo da tarefa */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 24,
                    gap: 10,
                  }}
                >
                  <button
                    onClick={prevTask}
                    disabled={filteredTasks.length <= 1}
                    style={{
                      padding: 0,
                      border: "none",
                      background: "#F3F4F6",
                      color: "#616161",
                      borderRadius: "50%",
                      cursor:
                        filteredTasks.length <= 1 ? "not-allowed" : "pointer",
                      fontSize: 15,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      transition: "background 0.2s, color 0.2s",
                      outline: "none",
                      opacity: filteredTasks.length <= 1 ? 0.5 : 1,
                    }}
                    aria-label="Anterior"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.5 19L9.5 12L15.5 5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <span
                    style={{ fontSize: 11, color: "#616161", fontWeight: 500 }}
                  >
                    {currentTaskIndex + 1} de {filteredTasks.length}
                  </span>
                  <button
                    onClick={nextTask}
                    disabled={filteredTasks.length <= 1}
                    style={{
                      padding: 0,
                      border: "none",
                      background: "#F3F4F6",
                      color: "#616161",
                      borderRadius: "50%",
                      cursor:
                        filteredTasks.length <= 1 ? "not-allowed" : "pointer",
                      fontSize: 15,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      transition: "background 0.2s, color 0.2s",
                      outline: "none",
                      opacity: filteredTasks.length <= 1 ? 0.5 : 1,
                    }}
                    aria-label="Próxima"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.5 5L14.5 12L8.5 19"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#bbb",
                  fontSize: 13,
                  marginTop: -10,
                }}
              >
                <span>Nenhuma tarefa encontrada</span>
                <span style={{ fontSize: 11, marginTop: 4 }}>
                  {taskFilter === "todas"
                    ? "Adicione tarefas para começar"
                    : `Nenhuma tarefa ${taskFilter}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Nova Box - Todas as Tarefas */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 2,
            minHeight: 200,
            boxShadow: "0 2px 8px #e0e0e0",
            position: "relative",
          }}
        >
          <span
            className="text-gray-400"
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Todas as Tarefas
          </span>
          <div
            style={{
              marginTop: 60,
              maxHeight: 4 * 72 + 16,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {tasks
              .slice()
              .sort((a, b) => {
                const prioridade = { alta: 3, média: 2, baixa: 1 };
                return prioridade[b.priority] - prioridade[a.priority];
              })
              .map((task) => (
                <div
                  key={task.id}
                  style={{
                    background: "#f8f9fa",
                    borderRadius: 8,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: "bold",
                        background:
                          task.status === "concluída"
                            ? "#4CAF50"
                            : task.status === "em_andamento"
                            ? "#FF9800"
                            : "#F44336",
                        color: "#fff",
                      }}
                    >
                      {task.status === "concluída"
                        ? "Concluída"
                        : task.status === "em_andamento"
                        ? "Em Andamento"
                        : "Pendente"}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: "bold",
                        background:
                          task.priority === "alta"
                            ? "#F44336"
                            : task.priority === "média"
                            ? "#FF9800"
                            : "#4CAF50",
                        color: "#fff",
                      }}
                    >
                      {task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)}
                    </span>
                  </div>
                  <div
                    style={{ fontWeight: "bold", fontSize: 15, color: "#333" }}
                  >
                    {task.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.4 }}>
                    {task.description}
                  </div>
                </div>
              ))}
            {tasks.length === 0 && (
              <div
                style={{
                  color: "#bbb",
                  fontSize: 13,
                  textAlign: "center",
                  padding: 24,
                }}
              >
                Nenhuma tarefa cadastrada.
              </div>
            )}
          </div>
        </div>
      </div>
      {/* NOVA LINHA: Boxes de Vendas */}
      <div className="dashboard-row-vendas" style={{ display: "flex", gap: "24px", marginTop: 0 }}>
        {/* Coluna empilhada: Saldo total e Saldo semanal */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 200,
            gap: 12,
          }}
        >
          {/* Saldo total */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              flex: 1,
              boxShadow: "0 2px 8px #e0e0e0",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="text-gray-400"
              style={{
                position: "absolute",
                top: 24,
                left: 24,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Saldo Líquido das Vendas
            </span>
            <span
              style={{
                fontWeight: "bold",
                fontSize: 30,
                marginTop: 28,
                color:
                  saldoTotal > 0
                    ? "#22c55e"
                    : saldoTotal < 0
                    ? "#ef4444"
                    : "#888",
              }}
            >
              {formatarReal(saldoTotal)}
            </span>
          </div>
          {/* Saldo semanal */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              flex: 1,
              boxShadow: "0 2px 8px #e0e0e0",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="text-gray-400"
              style={{
                position: "absolute",
                top: 24,
                left: 24,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Saldo Líquido Semanal
            </span>
            <span
              style={{
                fontWeight: "bold",
                fontSize: 30,
                marginTop: 28,
                color:
                  saldoSemanal > 0
                    ? "#22c55e"
                    : saldoSemanal < 0
                    ? "#ef4444"
                    : "#888",
              }}
            >
              {formatarReal(saldoSemanal)}
            </span>
          </div>
        </div>
        {/* Box Última venda */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 2,
            minHeight: 200,
            boxShadow: "0 2px 8px #e0e0e0",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="text-gray-400"
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Última Venda
          </span>
          {ultimaVenda ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  margin: "40px 0 8px 0",
                  width: "100%",
                  paddingRight: 24,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  <LuWeight
                    size={20}
                    color="#9ca3af"
                    style={{ marginBottom: 2, strokeWidth: 2.5 }}
                  />
                  <span
                    style={{
                      color: "#363636",
                      fontWeight: 500,
                      fontSize: 15,
                      marginTop: 2,
                    }}
                  >
                    {ultimaVenda.quantity}
                  </span>
                  <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                    Quantidade
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  <MdOutlineLocalOffer
                    size={22}
                    color="#9ca3af"
                    style={{ marginBottom: 2 }}
                  />
                  <span
                    style={{
                      color: "#363636",
                      fontWeight: 500,
                      fontSize: 15,
                      marginTop: 2,
                    }}
                  >
                    {formatarReal(ultimaVenda.salePrice)}
                  </span>
                  <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                    Valor Unitário
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  <HiOutlineCurrencyDollar
                    size={22}
                    color="#9ca3af"
                    style={{ marginBottom: 2 }}
                  />
                  <span
                    style={{
                      color: "#363636",
                      fontWeight: 500,
                      fontSize: 15,
                      marginTop: 2,
                    }}
                  >
                    {formatarReal(ultimaVenda.salePrice * ultimaVenda.quantity)}
                  </span>
                  <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                    Valor Total
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    style={{ marginBottom: 2 }}
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="4"
                      stroke="#9ca3af"
                      strokeWidth="2"
                    />
                    <path
                      d="M16 2v4M8 2v4M3 10h18"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span
                    style={{
                      color: "#363636",
                      fontWeight: 500,
                      fontSize: 15,
                      marginTop: 2,
                    }}
                  >
                    {new Date(ultimaVenda.saleDate).toLocaleDateString("pt-BR")}
                  </span>
                  <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                    Data
                  </span>
                </div>
              </div>
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: 8,
                  marginTop: 24,
                  padding: "18px 32px",
                  width: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  boxShadow: "0 1px 4px #e0e0e0",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: "#333",
                    marginBottom: 6,
                  }}
                >
                  {ultimaVenda.productName}
                </span>
                <span
                  style={{
                    color: "#666",
                    fontSize: 13,
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  Saldo da venda:{" "}
                  <span
                    style={{
                      color:
                        ultimaVenda.profit - ultimaVenda.loss > 0
                          ? "#22c55e"
                          : ultimaVenda.profit - ultimaVenda.loss < 0
                          ? "#ef4444"
                          : "#888",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {formatarReal(ultimaVenda.profit - ultimaVenda.loss)}
                  </span>
                </span>
              </div>
            </>
          ) : (
            <span style={{ color: "#bbb", fontSize: 13, marginTop: 32 }}>
              Nenhuma venda registrada.
            </span>
          )}
        </div>
        {/* Box de busca de venda */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 2,
            minHeight: 200,
            boxShadow: "0 2px 8px #e0e0e0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", width: "100%" }}>
            <IoSearch
              style={{
                position: "absolute",
                left: 12,
                top: 17,
                color: "#9ca3af",
                pointerEvents: "none",
              }}
              size={20}
            />
            <input
              type="text"
              placeholder="Digite o nome do produto vendido..."
              value={searchVenda}
              onChange={(e) => setSearchVenda(e.target.value)}
              style={{
                marginTop: 8,
                width: "92%",
                maxWidth: "none",
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #e0e0e0",
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 12,
                background: "#f3f4f6",
                color: "#333",
                transition: "box-shadow 0.2s, border 0.2s",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                paddingLeft: 38, // espaço para o ícone
              }}
            />
          </div>
          {searchVenda.trim() === "" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                flex: 1,
              }}
            >
              <span style={{ color: "#bbb", fontSize: 13 }}>
                Digite para buscar uma venda.
              </span>
            </div>
          ) : searchVendaResult ? (
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: 8,
                marginTop: 10,
                padding: "18px 32px",
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                boxShadow: "0 1px 4px #e0e0e0",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#333",
                  marginBottom: 6,
                }}
              >
                {searchVendaResult.productName}
              </span>
              <span
                style={{
                  color: "#666",
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Saldo:{" "}
                <span
                  style={{
                    color:
                      searchVendaResult.profit - searchVendaResult.loss > 0
                        ? "#22c55e"
                        : searchVendaResult.profit - searchVendaResult.loss < 0
                        ? "#ef4444"
                        : "#888",
                    fontWeight: 600,
                  }}
                >
                  {formatarReal(
                    searchVendaResult.profit - searchVendaResult.loss
                  )}
                </span>
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  margin: "24px 0 0 0",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  <LuWeight
                    size={20}
                    color="#9ca3af"
                    style={{ marginBottom: 2, strokeWidth: 2.5 }}
                  />
                  <span
                    style={{
                      color: "#363636",
                      fontWeight: 500,
                      fontSize: 15,
                      marginTop: 2,
                    }}
                  >
                    {searchVendaResult.quantity}
                  </span>
                  <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                    Quantidade
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  <MdOutlineLocalOffer
                    size={22}
                    color="#9ca3af"
                    style={{ marginBottom: 2 }}
                  />
                  <span
                    style={{
                      color: "#363636",
                      fontWeight: 500,
                      fontSize: 15,
                      marginTop: 2,
                    }}
                  >
                    {formatarReal(searchVendaResult.salePrice)}
                  </span>
                  <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                    Valor Unitário
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  <HiOutlineCurrencyDollar
                    size={22}
                    color="#9ca3af"
                    style={{ marginBottom: 2 }}
                  />
                  <span
                    style={{
                      color: "#363636",
                      fontWeight: 500,
                      fontSize: 15,
                      marginTop: 2,
                    }}
                  >
                    {formatarReal(
                      searchVendaResult.salePrice * searchVendaResult.quantity
                    )}
                  </span>
                  <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                    Valor Total
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    style={{ marginBottom: 2 }}
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="4"
                      stroke="#9ca3af"
                      strokeWidth="2"
                    />
                    <path
                      d="M16 2v4M8 2v4M3 10h18"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span
                    style={{
                      color: "#363636",
                      fontWeight: 500,
                      fontSize: 15,
                      marginTop: 2,
                    }}
                  >
                    {new Date(searchVendaResult.saleDate).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                  <span style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                    Data
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <span style={{ color: "#bbb", fontSize: 13, marginTop: 74 }}>
              Nenhuma venda encontrada.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
