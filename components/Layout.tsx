import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Book, HelpCircle, Settings, Menu, X, Search, Bell } from 'lucide-react';
import ChatAssistant from './ChatAssistant';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [headerSearch, setHeaderSearch] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && headerSearch.trim()) {
      navigate('/library', { state: { initialSearch: headerSearch } });
      setHeaderSearch(''); // Optional: clear after search or keep it
    }
  };

  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home size={20} /> },
    { path: '/library', label: 'Biblioteca', icon: <Book size={20} /> },
    { path: '/help', label: 'Ayuda', icon: <HelpCircle size={20} /> },
    { path: '/settings', label: 'Configuración', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-nc-light">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-nc-navy text-white fixed h-full z-20">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-nc-teal rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight">NuevasNormas</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-nc-teal text-white shadow-lg shadow-teal-900/20 font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">
              GC
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Germán Castro</p>
              <p className="text-xs text-slate-400 truncate">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-nc-light">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-10 flex items-center justify-between px-6 shadow-sm/50">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600">
              <Menu size={24} />
            </button>
            <span className="font-bold text-nc-navy">NuevasNormas</span>
          </div>

          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1]}
            </h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Búsqueda rápida..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-nc-teal outline-none text-slate-700"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-64 bg-nc-navy h-full p-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold text-white">NuevasNormas</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400">
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg ${
                        isActive ? 'bg-nc-teal text-white' : 'text-slate-400'
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Chat Widget */}
      <ChatAssistant />
    </div>
  );
};

export default Layout;