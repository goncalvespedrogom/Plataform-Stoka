import { FaHome, FaChartBar, FaDatabase, FaQuestionCircle, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";
import DashboardSection from './sections/dashboard';

export default function Sidebar() {
  return (
    <div className="dashboard-container" style={{ display: 'flex', height: '100vh' }}>
      <aside className="sidebar" style={{ width: '260px', background: '#181818' }}>
        <div className="text-gray-100 text-lg font-light mb-10 pl-2">CMSolutions</div>
        <nav className="flex flex-col gap-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 text-gray-100 font-medium">
            <FaHome size={20} />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition">
            <FaChartBar size={20} />
            Analytics
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition">
            <FaDatabase size={20} />
            Databases
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition">
            <FaQuestionCircle size={20} />
            Help
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition">
            <FaCog size={20} />
            Settings
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition">
            <FaUser size={20} />
            Profile
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition mt-4">
            <FaSignOutAlt size={20} />
            Log Out
          </a>
        </nav>
      </aside>
      <main className="dashboard-main" style={{ flex: 1, background: '#111', padding: '32px', overflowY: 'auto' }}>
        <DashboardSection />
      </main>
    </div>
  );
} 