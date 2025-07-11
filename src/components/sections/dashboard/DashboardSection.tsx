import React, { useState, useEffect } from 'react';
import { Product } from '../../../types/Product';
import { useProductContext } from '../register/ProductContext';
import { useTaskContext } from '../tasks/TaskContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaSortAmountDownAlt } from 'react-icons/fa';
import { LuWeight } from 'react-icons/lu';
import { IoPricetagOutline } from 'react-icons/io5';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { MdAttachMoney } from 'react-icons/md';
import { HiOutlineDocumentCurrencyDollar } from 'react-icons/hi2';
import { HiOutlineCurrencyDollar } from 'react-icons/hi2';

const DashboardSection = () => {
  const { products } = useProductContext();
  const { tasks } = useTaskContext();
  const totalItens = products.reduce((acc, produto) => acc + produto.quantity, 0);

  // Estados para filtros e navegação de tarefas
  const [taskFilter, setTaskFilter] = useState<'todas' | 'concluídas' | 'em_andamento' | 'pendentes'>('todas');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  // Função para filtrar tarefas
  const filteredTasks = tasks.filter(task => {
    switch (taskFilter) {
      case 'concluídas':
        return task.status === 'concluída';
      case 'em_andamento':
        return task.status === 'em_andamento';
      case 'pendentes':
        return task.status === 'pendente';
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
      setCurrentTaskIndex((prev) => (prev - 1 + filteredTasks.length) % filteredTasks.length);
    }
  };

  // Resetar índice quando mudar filtro
  useEffect(() => {
    setCurrentTaskIndex(0);
  }, [taskFilter]);

  const diasSemana = [
    'Segunda-feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado',
    'Domingo',
  ];

  // Exemplo: cada produto tem um campo 'day' (0 a 6) indicando o dia da semana em que foi registrado
  // e um campo 'value' indicando o valor do produto
  // Caso não tenha, adapte conforme sua estrutura
  const gastosPorDia = diasSemana.map((dia, idx) => {
    const soma = products
      .filter(p => new Date(p.date).getDay() === ((idx + 1) % 7)) // getDay: 0=Domingo, 1=Segunda...
      .reduce((acc, p) => acc + (p.unitPrice * p.quantity), 0);
    return { dia, valor: soma };
  });

  // Novo array: quantidade de itens por dia da semana
  const itensPorDia = diasSemana.map((dia, idx) => {
    const soma = products
      .filter(p => new Date(p.date).getDay() === ((idx + 1) % 7))
      .reduce((acc, p) => acc + p.quantity, 0);
    return { dia, quantidade: soma };
  });

  // Função para formatar valores em Real Brasileiro
  const formatarReal = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Função para formatar apenas número inteiro com separador de milhar
  const formatarNumero = (valor: number) => valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

  // Dia da semana atual (0=Domingo, 1=Segunda...)
  const diaAtual = new Date().getDay();

  // Componente para customizar o tick do eixo X
  const CustomTick = (props: any) => {
    const { x, y, payload, index } = props;
    const diaAtual = new Date().getDay();
    const isHoje = ((index + 1) % 7) === diaAtual;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fontWeight={isHoje ? 'bold' : 'normal'} fontSize={12} fill="#666">
          {payload.value}
        </text>
      </g>
    );
  };

  // Tooltip customizado para mostrar apenas o valor
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, padding: '6px 12px', fontWeight: 500, fontSize: 14 }}>
          {formatarReal(payload[0].value)}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Linha de cards principais */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 180, flex: 1, boxShadow: '0 2px 8px #e0e0e0' }}>Revenue this month</div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 180, flex: 1, boxShadow: '0 2px 8px #e0e0e0' }}>Spend this month</div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 180, flex: 1, boxShadow: '0 2px 8px #e0e0e0' }}>Reports Submitted</div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 180, flex: 1, boxShadow: '0 2px 8px #e0e0e0' }}>New Tasks</div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 180, flex: 1, boxShadow: '0 2px 8px #e0e0e0' }}>Completed Tasks</div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 180, flex: 1, boxShadow: '0 2px 8px #e0e0e0' }}>Ongoing Projects</div>
      </div>
      {/* Linha de gráficos e progresso */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, paddingRight: 10, flex: 2, minHeight: 260, boxShadow: '0 2px 8px #e0e0e0', position: 'relative' }}>
          <span className="text-gray-400" style={{ position: 'absolute', top: 24, left: 24, fontSize: 16, fontWeight: 500 }}>Valor Total dos Produtos</span>
          <div style={{ width: '100%', height: 200, paddingLeft: 0, marginLeft: -12, paddingTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gastosPorDia} margin={{ top: 32, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="dia"
                  tick={<CustomTick />}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={formatarNumero} 
                  ticks={[1000, 5000, 10000, 15000, 20000]}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#333" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#333', stroke: '#333', strokeWidth: 2 }} 
                  activeDot={{ r: 8, fill: '#333', stroke: '#333', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* NOVO GRÁFICO: Quantidade de Itens por Produto por Semana */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, paddingRight: 10, flex: 2, minHeight: 260, boxShadow: '0 2px 8px #e0e0e0', position: 'relative' }}>
          <span className="text-gray-400" style={{ position: 'absolute', top: 24, left: 24, fontSize: 16, fontWeight: 500 }}>Quantidade Total de Itens</span>
          <div style={{ width: '100%', height: 200, paddingLeft: 0, marginLeft: -12, paddingTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={itensPorDia} margin={{ top: 32, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="dia"
                  tick={<CustomTick />}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={valor => formatarNumero(valor)}
                  domain={[1000, 10000]}
                  ticks={[1000, 4000, 7000, 10000]}
                  allowDecimals={false}
                />
                <Tooltip 
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, padding: '6px 12px', fontWeight: 500, fontSize: 14 }}>
                          {formatarNumero(payload[0].value)} itens
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="quantidade" 
                  stroke="#333" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#333', stroke: '#333', strokeWidth: 2 }} 
                  activeDot={{ r: 8, fill: '#333', stroke: '#333', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 2, minHeight: 260, boxShadow: '0 2px 8px #e0e0e0' }}>Project Completion</div> */}
      </div>
      {/* Linha de membros, tarefas, outreach e storage */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Coluna empilhada: Produtos Registrados e Itens Registrados */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 200, gap: 12 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 1, boxShadow: '0 2px 8px #e0e0e0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-gray-400" style={{ position: 'absolute', top: 24, left: 24, fontSize: 16, fontWeight: 500 }}>Produtos Registrados</span>
            <span style={{ fontWeight: 'bold', fontSize: 40, marginTop: 28 }}>{products.length}</span>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 1, boxShadow: '0 2px 8px #e0e0e0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-gray-400" style={{ position: 'absolute', top: 24, left: 24, fontSize: 16, fontWeight: 500 }}>Itens Registrados</span>
            <span style={{ fontWeight: 'bold', fontSize: 40, marginTop: 28 }}>{totalItens}</span>
          </div>
        </div>
        {/* Último Registro */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 2, minHeight: 200, boxShadow: '0 2px 8px #e0e0e0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-gray-400" style={{ position: 'absolute', top: 24, left: 24, fontSize: 16, fontWeight: 500 }}>Último Registro</span>
          {products.length > 0 ? (
            (() => {
              const last = products[products.length - 1];
              const valorTotal = last.unitPrice * last.quantity;
              return (
                <>
                  {/* Linha do meio: quantidade, valor unitário, valor total, data */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '40px 0 8px 0', width: '100%' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                      <LuWeight size={20} color="#9ca3af" style={{ marginBottom: 2, strokeWidth: 2.5 }} />
                      <span style={{ color: '#363636', fontWeight: 500, fontSize: 17, marginTop: 2 }}>{last.quantity}</span>
                      <span style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Quantidade</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                      <MdOutlineLocalOffer size={22} color="#9ca3af" style={{ marginBottom: 2 }} />
                      <span style={{ color: '#363636', fontWeight: 500, fontSize: 17, marginTop: 2 }}>{formatarReal(last.unitPrice)}</span>
                      <span style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Valor Unitário</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                      <HiOutlineCurrencyDollar size={22} color="#9ca3af" style={{ marginBottom: 2 }} />
                      <span style={{ color: '#363636', fontWeight: 500, fontSize: 17, marginTop: 2 }}>{formatarReal(valorTotal)}</span>
                      <span style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Valor Total</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ marginBottom: 2 }}><rect x="3" y="4" width="18" height="18" rx="4" stroke="#9ca3af" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/></svg>
                      <span style={{ color: '#363636', fontWeight: 500, fontSize: 17, marginTop: 2 }}>{new Date(last.date).toLocaleDateString('pt-BR')}</span>
                      <span style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Data</span>
                    </div>
                  </div>
                  {/* Box cinza com título e descrição na parte debaixo */}
                  <div style={{ background: '#f8f9fa', borderRadius: 8, marginTop: 24, padding: '18px 32px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxShadow: '0 1px 4px #e0e0e0' }}>
                    <span style={{ fontWeight: 600, fontSize: 18, color: '#333', marginBottom: 6 }}>{last.name}</span>
                    <span style={{ color: '#666', fontSize: 14, lineHeight: 1.5 }}>{last.description || <span style={{ color: '#bbb' }}>Sem descrição.</span>}</span>
                  </div>
                </>
              );
            })()
          ) : (
            <span style={{ color: '#999', fontSize: 15, marginTop: 32 }}>Nenhum produto registrado.</span>
          )}
        </div>
        {/* Server Storage com mesmo tamanho do Último Registro */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 2, minHeight: 200, boxShadow: '0 2px 8px #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Server Storage
        </div>
      </div>
      {/* Tarefas e Nova Box */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 1, minHeight: 200, boxShadow: '0 2px 8px #e0e0e0', position: 'relative' }}>
          <span className="text-gray-400" style={{ position: 'absolute', top: 24, left: 24, fontSize: 16, fontWeight: 500 }}>Tarefas</span>
          
          {/* Filtros */}
          <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: '8px' }}>
            {(['todas', 'pendentes', 'em_andamento', 'concluídas'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTaskFilter(filter)}
                style={{
                  padding: '4px 8px',
                  fontSize: 12,
                  borderRadius: 12,
                  border: 'none',
                  background: taskFilter === filter ? '#333' : '#f0f0f0',
                  color: taskFilter === filter ? '#fff' : '#666',
                  cursor: 'pointer',
                  fontWeight: taskFilter === filter ? 'bold' : 'normal'
                }}
              >
                {filter === 'em_andamento' ? 'Em Andamento' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Conteúdo das tarefas */}
          <div style={{ marginTop: 60, height: 'calc(100% - 60px)', display: 'flex', flexDirection: 'column' }}>
            {filteredTasks.length > 0 ? (
              <>
                {/* Tarefa atual */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8f9fa', borderRadius: 8, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 'bold',
                      background: 
                        filteredTasks[currentTaskIndex].status === 'concluída' ? '#4CAF50' :
                        filteredTasks[currentTaskIndex].status === 'em_andamento' ? '#FF9800' : '#F44336',
                      color: '#fff'
                    }}>
                      {filteredTasks[currentTaskIndex].status === 'concluída' ? 'Concluída' :
                       filteredTasks[currentTaskIndex].status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 'bold',
                      background: 
                        filteredTasks[currentTaskIndex].priority === 'alta' ? '#F44336' :
                        filteredTasks[currentTaskIndex].priority === 'média' ? '#FF9800' : '#4CAF50',
                      color: '#fff'
                    }}>
                      {filteredTasks[currentTaskIndex].priority.charAt(0).toUpperCase() + filteredTasks[currentTaskIndex].priority.slice(1)}
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: 18, 
                    fontWeight: 'bold', 
                    margin: 0,
                    color: '#333'
                  }}>
                    {filteredTasks[currentTaskIndex].title}
                  </h3>
                  
                  <p style={{ 
                    fontSize: 14, 
                    color: '#666', 
                    margin: 0,
                    lineHeight: 1.5,
                    flex: 1
                  }}>
                    {filteredTasks[currentTaskIndex].description}
                  </p>
                  
                  <div style={{ fontSize: 12, color: '#999' }}>
                    Criada em: {new Date(filteredTasks[currentTaskIndex].createdAt).toLocaleDateString('pt-BR')}
                    {filteredTasks[currentTaskIndex].dueDate && (
                      <span style={{ marginLeft: 16 }}>
                        Prazo: {new Date(filteredTasks[currentTaskIndex].dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
                {/* Navegação abaixo da tarefa */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 10 }}>
                  <button
                    onClick={prevTask}
                    disabled={filteredTasks.length <= 1}
                    style={{
                      padding: 0,
                      border: 'none',
                      background: '#F3F4F6',
                      color: '#616161',
                      borderRadius: '50%',
                      cursor: filteredTasks.length <= 1 ? 'not-allowed' : 'pointer',
                      fontSize: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      transition: 'background 0.2s, color 0.2s',
                      outline: 'none',
                      opacity: filteredTasks.length <= 1 ? 0.5 : 1
                    }}
                    aria-label="Anterior"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 19L9.5 12L15.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <span style={{ fontSize: 12, color: '#616161', fontWeight: 500 }}>
                    {currentTaskIndex + 1} de {filteredTasks.length}
                  </span>
                  <button
                    onClick={nextTask}
                    disabled={filteredTasks.length <= 1}
                    style={{
                      padding: 0,
                      border: 'none',
                      background: '#F3F4F6',
                      color: '#616161',
                      borderRadius: '50%',
                      cursor: filteredTasks.length <= 1 ? 'not-allowed' : 'pointer',
                      fontSize: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      transition: 'background 0.2s, color 0.2s',
                      outline: 'none',
                      opacity: filteredTasks.length <= 1 ? 0.5 : 1
                    }}
                    aria-label="Próxima"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.5 5L14.5 12L8.5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#999',
                fontSize: 14
              }}>
                <span>Nenhuma tarefa encontrada</span>
                <span style={{ fontSize: 12, marginTop: 4 }}>
                  {taskFilter === 'todas' ? 'Adicione tarefas para começar' : `Nenhuma tarefa ${taskFilter}`}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Nova Box - Todas as Tarefas */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 2, minHeight: 200, boxShadow: '0 2px 8px #e0e0e0', position: 'relative' }}>
          <span className="text-gray-400" style={{ position: 'absolute', top: 24, left: 24, fontSize: 16, fontWeight: 500 }}>Todas as Tarefas</span>
          <div style={{ marginTop: 60, maxHeight: 4 * 72 + 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tasks
              .slice()
              .sort((a, b) => {
                const prioridade = { alta: 3, média: 2, baixa: 1 };
                return prioridade[b.priority] - prioridade[a.priority];
              })
              .map((task) => (
                <div key={task.id} style={{ background: '#f8f9fa', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 'bold',
                      background: 
                        task.status === 'concluída' ? '#4CAF50' :
                        task.status === 'em_andamento' ? '#FF9800' : '#F44336',
                      color: '#fff'
                    }}>
                      {task.status === 'concluída' ? 'Concluída' :
                       task.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 'bold',
                      background: 
                        task.priority === 'alta' ? '#F44336' :
                        task.priority === 'média' ? '#FF9800' : '#4CAF50',
                      color: '#fff'
                    }}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: 15, color: '#333' }}>{task.title}</div>
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.4 }}>{task.description}</div>
                </div>
              ))}
            {tasks.length === 0 && (
              <div style={{ color: '#999', fontSize: 14, textAlign: 'center', padding: 24 }}>Nenhuma tarefa cadastrada.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection; 