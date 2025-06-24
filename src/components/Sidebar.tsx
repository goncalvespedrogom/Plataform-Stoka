import { FaHome, FaChartBar, FaDatabase, FaQuestionCircle, FaCog, FaUser, FaSignOutAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DashboardSection from './sections/dashboard/index';
import RegisterSection from './sections/register/index';
import { useState } from 'react';
import LogoSidebar from '../assets/LogoSidebar.png';

export default function Sidebar() {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'databases':
        return <RegisterSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#f5f6fa' }}>
      <aside
        className="sidebar"
        style={{
          width: isSidebarOpen ? '260px' : '70px',
          background: '#fff',
          height: '100vh',
          position: 'relative',
          zIndex: 2,
          padding: isSidebarOpen ? '32px 20px' : '32px 10px',
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          boxShadow: '2px 0 8px #e0e0e0',
          transition: 'width 0.2s',
        }}
      >
        <div
          className="mb-10"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: isSidebarOpen ? 'row' : 'column',
            alignItems: isSidebarOpen ? 'center' : 'center',
            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            gap: isSidebarOpen ? 12 : 8,
            minHeight: 40,
            width: '100%',
            paddingLeft: isSidebarOpen ? 4 : 0,
            paddingTop: isSidebarOpen ? 0 : 8,
          }}
        >
          {isSidebarOpen ? (
            <>
              <img
                src={LogoSidebar.src}
                alt="Logo"
                style={{
                  maxWidth: '35%',
                  height: 'auto',
                  transition: 'max-width 0.2s',
                }}
              />
              <button
                onClick={toggleSidebar}
                style={{
                  position: 'absolute',
                  right: -34,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#231f20',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 2px 8px #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  padding: 0,
                }}
                aria-label="Fechar menu"
              >
                <FaChevronLeft size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleSidebar}
                style={{
                  position: 'absolute',
                  right: -14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#231f20',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 2px 8px #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  padding: 0,
                }}
                aria-label="Abrir menu"
              >
                <FaChevronRight size={14} />
              </button>
              <img
                src={LogoSidebar.src}
                alt="Logo"
                style={{
                  maxWidth: '40px',
                  height: 'auto',
                  transition: 'max-width 0.2s',
                  marginTop: 36,
                }}
              />
            </>
          )}
        </div>
        <nav className="flex flex-col gap-2" style={{ marginTop: 32, alignItems: isSidebarOpen ? 'flex-start' : 'center' }}>
          <a 
            href="#" 
            onClick={() => handleSectionClick('dashboard')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition ${
              selectedSection === 'dashboard' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaHome size={20} />
            {isSidebarOpen && 'Dashboard'}
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('analytics')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition ${
              selectedSection === 'analytics' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaChartBar size={20} />
            {isSidebarOpen && 'Análise'}
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('databases')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition ${
              selectedSection === 'databases' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaDatabase size={20} />
            {isSidebarOpen && 'Registros'}
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('help')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition ${
              selectedSection === 'help' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaQuestionCircle size={20} />
            {isSidebarOpen && 'Ajuda'}
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('settings')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition ${
              selectedSection === 'settings' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaCog size={20} />
            {isSidebarOpen && 'Configurações'}
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('profile')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition ${
              selectedSection === 'profile' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaUser size={20} />
            {isSidebarOpen && 'Perfil'}
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('logout')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition mt-4 ${
              selectedSection === 'logout' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaSignOutAlt size={20} />
            {isSidebarOpen && 'Sair'}
          </a>
        </nav>
      </aside>
      <main className="dashboard-main" style={{ flex: 1, background: '#f5f6fa', padding: '32px', overflowY: 'auto', height: '100vh' }}>
        {renderSection()}
      </main>
    </div>
  );
} 