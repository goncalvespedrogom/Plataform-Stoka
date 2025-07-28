import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaHome, FaChartBar, FaDatabase, FaQuestionCircle, FaCog, FaUser, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaBookmark } from "react-icons/fa";
import DashboardSection from './sections/dashboard/index';
import RegisterSection from './sections/register/index';
import TasksSection from './sections/tasks/index';
import LogoSidebar from '../assets/LogoSidebar.png';
import { ProductProvider } from './sections/register/ProductContext';
import { TaskProvider } from './sections/tasks/TaskContext';
import { GrTasks } from "react-icons/gr";
import SalesSection from './sections/sales/index';
import { SalesProvider } from './sections/sales/SalesContext';
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/router";
import SettingsSection from './sections/settings';

export default function Sidebar() {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Função para verificar largura da tela
    const handleResize = () => {
      if (window.innerWidth < 885) {
        setIsSidebarOpen(false);
        setIsMobile(true);
      } else {
        setIsSidebarOpen(true);
        setIsMobile(false);
      }
    };
    handleResize(); // Chama ao montar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSectionClick = (section: string) => {
    if (section === 'logout') {
      setShowLogoutModal(true);
      return;
    }
    setSelectedSection(section);
  };

  const handleConfirmLogout = async () => {
    await signOut(auth);
    setShowLogoutModal(false);
    router.push('/login');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case 'dashboard':
        return (
          <SalesProvider>
            <DashboardSection />
          </SalesProvider>
        );
      case 'analytics':
        return <TasksSection />;
      case 'databases':
        return <RegisterSection />;
      case 'sales':
        return <SalesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return (
          <SalesProvider>
            <DashboardSection />
          </SalesProvider>
        );
    }
  };

  return (
    <ProductProvider>
      <TaskProvider>
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
                {/* Esconde o botão em telas pequenas */}
                {!isMobile && (
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
                    <FaChevronLeft size={12} />
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Esconde o botão em telas pequenas */}
                {!isMobile && (
                  <button
                    onClick={toggleSidebar}
                    style={{
                      position: 'absolute',
                      right: -23,
                      top: '50%',
                      transform: 'translateY(-80%)',
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
                    <FaChevronRight size={12} />
                  </button>
                )}
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition w-full text-[14px] ${
                selectedSection === 'dashboard' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
              }`}
            >
              <FaHome size={19} />
              {isSidebarOpen && 'Dashboard'}
            </a>
            <a 
              href="#" 
              onClick={() => handleSectionClick('analytics')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition w-full text-[14px] ${
                selectedSection === 'analytics' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
              }`}
            >
              <FaBookmark size={19} />
              {isSidebarOpen && 'Tarefas'}
            </a>
            <a 
              href="#" 
              onClick={() => handleSectionClick('databases')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition w-full text-[14px] ${
                selectedSection === 'databases' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
              }`}
            >
              <FaClipboardList size={19} />
              {isSidebarOpen && 'Produtos'}
            </a>
            <a 
              href="#" 
              onClick={() => handleSectionClick('sales')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition w-full text-[14px] ${
                selectedSection === 'sales' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
              }`}
            >
              <FaQuestionCircle size={19} />
              {isSidebarOpen && 'Vendas'}
            </a>
            <a 
              href="#" 
              onClick={() => handleSectionClick('settings')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition w-full text-[14px] ${
                selectedSection === 'settings' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
              }`}
            >
              <FaUser size={19} />
              {isSidebarOpen && 'Perfil'}
            </a>
            <a 
              href="#" 
              onClick={() => handleSectionClick('logout')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#231f20] hover:bg-[#f0f0f0] transition mt-4 ml-[.1rem] w-full text-[14px] ${
                selectedSection === 'logout' ? 'bg-[#f0f0f0] font-medium' : 'bg-transparent font-normal'
              }`}
            >
              <FaSignOutAlt size={19} />
              {isSidebarOpen && 'Sair'}
            </a>
          </nav>
        </aside>
        <main className="dashboard-main" style={{ flex: 1, background: '#f5f6fa', padding: '32px', overflowY: 'auto', height: '100vh' }}>
          {renderSection()}
        </main>
        {showLogoutModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col ">
                <h2 className="text-xl font-bold mb-2 text-gray-800">Logout</h2>
                <p className="mb-12 text-gray-600 text-sm">Tem certeza que deseja sair da sua conta?</p>
                <div className="flex gap-4 w-full justify-center">
                  <button
                    onClick={handleCancelLogout}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:opacity-80 transition font-medium text-sm"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </TaskProvider>
  </ProductProvider>
);
} 