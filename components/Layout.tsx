
import React from 'react';
import { useApp } from '../store/AppContext';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  ShieldAlert, 
  History, 
  Users, 
  UserCircle, 
  LogOut, 
  Zap,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active, onClick }) => (
  <a 
    href={href}
    onClick={onClick}
    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </a>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  if (!currentUser) return <>{children}</>;

  const currentHash = window.location.hash || '#/dashboard';
  // Standardize for comparison
  const normalizedHash = currentHash.replace(/^#\/?/, '');
  
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="text-blue-500 fill-blue-500" />
          <span className="font-bold text-xl tracking-tight">SENTINEL</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 transform lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="hidden lg:flex items-center space-x-2 mb-10">
            <Zap className="text-blue-500 fill-blue-500" />
            <span className="font-bold text-xl tracking-tight">SENTINEL</span>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" href="#/dashboard" active={normalizedHash === 'dashboard'} onClick={closeSidebar} />
            <SidebarItem icon={AlertTriangle} label="Incident Feed" href="#/incidents" active={normalizedHash === 'incidents'} onClick={closeSidebar} />
            <SidebarItem icon={ShieldAlert} label="Raise Incident" href="#/incidents/new" active={normalizedHash === 'incidents/new'} onClick={closeSidebar} />
            
            {currentUser.role === UserRole.ADMIN && (
              <>
                <div className="pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</div>
                <SidebarItem icon={History} label="Audit Logs" href="#/audit-logs" active={normalizedHash === 'audit-logs'} onClick={closeSidebar} />
                <SidebarItem icon={Users} label="User Directory" href="#/users" active={normalizedHash === 'users'} onClick={closeSidebar} />
              </>
            )}

            <div className="pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Account</div>
            <SidebarItem icon={UserCircle} label="Profile" href="#/profile" active={normalizedHash === 'profile'} onClick={closeSidebar} />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800">
            <a 
              href="#/profile" 
              onClick={closeSidebar}
              className="flex items-center space-x-3 mb-6 p-2 rounded-lg hover:bg-slate-800 transition-colors group"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full border border-slate-700 group-hover:border-blue-500 transition-colors" />
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate group-hover:text-blue-400 transition-colors">{currentUser.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
              </div>
            </a>
            <button 
              onClick={() => {
                logout();
                closeSidebar();
              }}
              className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-400 transition-all border border-slate-700 hover:border-red-900/50"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};
