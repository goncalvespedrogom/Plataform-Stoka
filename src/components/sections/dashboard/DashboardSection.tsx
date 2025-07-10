import React from 'react';
import { Product } from '../../../types/Product';
import { useProductContext } from '../register/ProductContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardSection = () => {
  const { products } = useProductContext();
  const totalItens = products.reduce((acc, produto) => acc + produto.quantity, 0);

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
                  formatter={(value: number) => formatarReal(value)}
                  labelStyle={{ fontWeight: 'bold' }}
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
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 2, minHeight: 260, boxShadow: '0 2px 8px #e0e0e0' }}>Project Completion</div>
      </div>
      {/* Linha de membros, tarefas, outreach e storage */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 1, minHeight: 200, boxShadow: '0 2px 8px #e0e0e0', position: 'relative' }}>
          <span className="text-gray-400" style={{ position: 'absolute', top: 24, left: 24, fontSize: 16, fontWeight: 500 }}>Produtos Registrados</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <span style={{ fontWeight: 'bold', fontSize: 40 }}>{products.length}</span>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 1, minHeight: 200, boxShadow: '0 2px 8px #e0e0e0', position: 'relative' }}>
          <span className="text-gray-400" style={{ position: 'absolute', top: 24, left: 24, fontSize: 16, fontWeight: 500 }}>Qntd. de Itens por Produto</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <span style={{ fontWeight: 'bold', fontSize: 40 }}>{totalItens}</span>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 2, minHeight: 200, boxShadow: '0 2px 8px #e0e0e0' }}>Tarefas</div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 1, minHeight: 200, boxShadow: '0 2px 8px #e0e0e0' }}>Server Storage</div>
      </div>
      {/* Weekly Reports */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, minHeight: 180, boxShadow: '0 2px 8px #e0e0e0' }}>
        Weekly Reports
      </div>
    </div>
  );
};

export default DashboardSection; 