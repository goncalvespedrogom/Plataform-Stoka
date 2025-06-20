import { FaHome, FaChartBar, FaDatabase, FaQuestionCircle, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";
import DashboardSection from './sections/dashboard/index';
import RegisterSection from './sections/register/index';
import { useState } from 'react';
import LogoSidebar from '../assets/LogoSidebar.png';

export default function Sidebar() {
  const [selectedSection, setSelectedSection] = useState('dashboard');

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
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
    <div className="dashboard-container" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#111' }}>
      <aside className="sidebar" style={{ width: '260px', background: '#181818', height: '100vh', position: 'relative', zIndex: 2, padding: '32px 20px', borderTopRightRadius: 24, borderBottomRightRadius: 24 }}>
        <div className="flex items-center justify-center mb-10" style={{ paddingLeft: 4 }}>
          <img src={LogoSidebar.src} alt="Logo" style={{ maxWidth: '25%', height: 'auto' }} />
        </div>
        <nav className="flex flex-col gap-2">
          <a 
            href="#" 
            onClick={() => handleSectionClick('dashboard')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#3333334f] transition ${
              selectedSection === 'dashboard' ? 'bg-[#33333385] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaHome size={20} />
            Dashboard
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('analytics')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#3333334f] transition ${
              selectedSection === 'analytics' ? 'bg-[#33333385] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaChartBar size={20} />
            Análise
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('databases')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#3333334f] transition ${
              selectedSection === 'databases' ? 'bg-[#33333385] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaDatabase size={20} />
            Registros
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('help')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#3333334f] transition ${
              selectedSection === 'help' ? 'bg-[#33333385] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaQuestionCircle size={20} />
            Ajuda
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('settings')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#3333334f] transition ${
              selectedSection === 'settings' ? 'bg-[#33333385] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaCog size={20} />
            Configurações
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('profile')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#3333334f] transition ${
              selectedSection === 'profile' ? 'bg-[#33333385] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaUser size={20} />
            Perfil
          </a>
          <a 
            href="#" 
            onClick={() => handleSectionClick('logout')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#3333334f] transition mt-4 ${
              selectedSection === 'logout' ? 'bg-[#33333385] font-medium' : 'bg-transparent font-normal'
            }`}
          >
            <FaSignOutAlt size={20} />
            Sair
          </a>
        </nav>
      </aside>
      <main className="dashboard-main" style={{ flex: 1, background: '#111', padding: '32px', overflowY: 'auto', height: '100vh' }}>
        {renderSection()}
      </main>
    </div>
  );
} 