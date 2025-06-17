import React from 'react';

const DashboardSection = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Título */}
      <div style={{ color: '#fff', fontSize: 32, fontWeight: 600 }}>Main Dashboard</div>
      {/* Linha de cards principais */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, minWidth: 180, flex: 1 }}>Revenue this month</div>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, minWidth: 180, flex: 1 }}>Spend this month</div>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, minWidth: 180, flex: 1 }}>Reports Submitted</div>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, minWidth: 180, flex: 1 }}>New Tasks</div>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, minWidth: 180, flex: 1 }}>Completed Tasks</div>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, minWidth: 180, flex: 1 }}>Ongoing Projects</div>
      </div>
      {/* Linha de gráficos e progresso */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, flex: 2, minHeight: 260 }}>Gráfico de Gastos</div>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, flex: 2, minHeight: 260 }}>Project Completion</div>
      </div>
      {/* Linha de membros, tarefas, outreach e storage */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, flex: 1, minHeight: 200 }}>Team members</div>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, flex: 2, minHeight: 200 }}>Tasks</div>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, flex: 1, minHeight: 200 }}>Outreach Success</div>
        <div style={{ background: '#181818', borderRadius: 16, padding: 24, flex: 1, minHeight: 200 }}>Server Storage</div>
      </div>
      {/* Weekly Reports */}
      <div style={{ background: '#181818', borderRadius: 16, padding: 24, minHeight: 180 }}>
        Weekly Reports
      </div>
    </div>
  );
};

export default DashboardSection; 