import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Book, HelpCircle, FileUser, Menu, X, Search, Bell, FileText, ChevronRight } from 'lucide-react';
import ChatAssistant from './ChatAssistant';
import { MOCK_NORMS, CATEGORY_COLORS } from '../constants';
import { Norm } from '../types';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [headerSearch, setHeaderSearch] = React.useState('');
  const [suggestions, setSuggestions] = useState<Norm[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Check if there are any new norms to show the red dot indicator
  const hasNotifications = MOCK_NORMS.some(n => n.isNew);

  // Close suggestions on route change
  useEffect(() => {
    setShowSuggestions(false);
  }, [location.pathname]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setHeaderSearch(query);

    if (query.trim().length > 1) {
      const lowerQuery = query.toLowerCase();
      const matches = MOCK_NORMS.filter(norm => 
        norm.title.toLowerCase().includes(lowerQuery) ||
        norm.number.toLowerCase().includes(lowerQuery) ||
        norm.type.toLowerCase().includes(lowerQuery)
      ).slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && headerSearch.trim()) {
      setShowSuggestions(false);
      navigate('/library', { state: { initialSearch: headerSearch } });
    }
  };

  const handleSuggestionClick = (normId: string) => {
    navigate(`/norm/${normId}`);
    setShowSuggestions(false);
    setHeaderSearch('');
  };

  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home size={20} /> },
    { path: '/library', label: 'Biblioteca', icon: <Book size={20} /> },
    { path: '/help', label: 'Ayuda', icon: <HelpCircle size={20} /> },
    { path: '/about', label: 'Acerca del autor', icon: <FileUser size={20} /> },
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
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold overflow-hidden border border-slate-500 shrink-0">
               <img 
                  src="https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/05ea0b86-ff1b-54ee-a8b0-e8d675eab38c/e1552eaa-b7d1-56e6-a296-59dbf0e1db7d.jpg" 
                  alt="GC"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                     e.currentTarget.style.display = 'none';
                     e.currentTarget.parentElement!.innerText = 'GC';
                  }}
               />
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
              {location.pathname === '/' ? 'Dashboard' : 
               location.pathname.includes('notifications') ? 'Notificaciones' :
               location.pathname.includes('about') ? 'Acerca del autor' :
               location.pathname.split('/')[1]}
            </h2>
          </div>

          <div className="flex items-center gap-4">
             {/* Global Search with Suggestions */}
             <div className="relative hidden sm:block w-72 lg:w-96" ref={searchContainerRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Buscar norma, decreto, palabra clave..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-nc-teal focus:ring-2 focus:ring-nc-teal/20 outline-none text-slate-700 transition-all shadow-sm"
                  value={headerSearch}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (headerSearch.trim().length > 1) setShowSuggestions(true);
                  }}
                  onKeyDown={handleSearchSubmit}
                />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  {suggestions.length > 0 ? (
                    <>
                      <div className="py-2">
                        <h4 className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sugerencias</h4>
                        {suggestions.map((norm) => (
                          <div 
                            key={norm.id}
                            onClick={() => handleSuggestionClick(norm.id)}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-start gap-3 group"
                          >
                            <div className="mt-1 text-slate-400 group-hover:text-nc-teal transition-colors">
                              <FileText size={16} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bold text-sm text-slate-800 group-hover:text-nc-teal transition-colors">
                                  {norm.type} {norm.number}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[norm.category]} bg-opacity-50`}>
                                  {norm.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 truncate">{norm.title}</p>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                      <div 
                        onClick={() => {
                          navigate('/library', { state: { initialSearch: headerSearch } });
                          setShowSuggestions(false);
                        }}
                        className="bg-slate-50 p-3 text-center text-xs font-medium text-nc-teal hover:bg-slate-100 cursor-pointer border-t border-slate-100 transition-colors"
                      >
                        Ver todos los resultados para "{headerSearch}"
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      <Search size={20} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No se encontraron normas relacionadas.</p>
                      <p className="text-xs mt-1 text-slate-400">Intenta con otro término.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate('/notifications')}
              className={`relative p-2 rounded-full transition-colors ${
                location.pathname === '/notifications' 
                  ? 'bg-slate-100 text-nc-teal' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Ver notificaciones"
            >
              <Bell size={20} />
              {hasNotifications && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
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