import React from 'react';
import { Product } from '../../../types/Product';
import { useProductContext } from '../register/ProductContext';

const DashboardSection = () => {
  const { products } = useProductContext();
  const totalItens = products.reduce((acc, produto) => acc + produto.quantity, 0);
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
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, flex: 2, minHeight: 260, boxShadow: '0 2px 8px #e0e0e0' }}>Gráfico de Gastos</div>
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