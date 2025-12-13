import React, { useState, useEffect } from 'react';
import { MOCK_NORMS, CATEGORY_COLORS } from '../constants';
import { Category, Norm } from '../types';
import { Search, Filter, Download, FileText, ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Library: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Initialize search from navigation state if present
  useEffect(() => {
    if (location.state && (location.state as any).initialSearch) {
      setSearchTerm((location.state as any).initialSearch);
    }
  }, [location.state]);

  const filteredNorms = MOCK_NORMS.filter(norm => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      norm.title.toLowerCase().includes(searchLower) || 
      norm.number.toLowerCase().includes(searchLower) ||
      norm.summary.toLowerCase().includes(searchLower) ||
      norm.type.toLowerCase().includes(searchLower) ||
      norm.issuingAuthority.toLowerCase().includes(searchLower) ||
      norm.fullText.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategory === 'All' || norm.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="flex items-center gap-1 hover:text-nc-teal transition-colors">
          <Home size={16} />
          <span>Inicio</span>
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-slate-800">Biblioteca</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nc-navy">Biblioteca Normativa</h1>
          <p className="text-slate-500 text-sm">Explora el repositorio completo de regulaciones vigentes.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por palabra clave, número, tipo, autoridad..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nc-teal focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter size={20} className="text-slate-400 mr-2 flex-shrink-0" />
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'All' ? 'bg-nc-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas
          </button>
          {Object.values(Category).map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-nc-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Norma</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Resumen</th>
                <th className="px-6 py-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNorms.length > 0 ? (
                filteredNorms.map((norm) => (
                  <tr key={norm.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{norm.type} {norm.number}</p>
                          <p className="text-xs text-slate-500">{norm.issuingAuthority}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${CATEGORY_COLORS[norm.category]}`}>
                        {norm.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {norm.date}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-slate-500" title={norm.summary}>{norm.summary}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                         <Link 
                          to={`/norm/${norm.id}`}
                          className="p-2 text-slate-400 hover:text-nc-teal hover:bg-teal-50 rounded-full transition-colors"
                          title="Ver detalle"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron normas con los criterios de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Library;