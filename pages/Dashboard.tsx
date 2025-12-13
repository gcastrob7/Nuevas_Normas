import React from 'react';
import { MOCK_NORMS, CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';
import { ArrowRight, Bell, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Norm, Category } from '../types';

const Dashboard: React.FC = () => {
  const recentNorms = MOCK_NORMS.slice(0, 3);

  const stats = [
    { label: 'Normas Hoy', value: 5, icon: <Bell size={20} />, color: 'text-blue-600 bg-blue-100' },
    { label: 'Vigentes este mes', value: 24, icon: <Calendar size={20} />, color: 'text-green-600 bg-green-100' },
    { label: 'Impacto Alto', value: 3, icon: <TrendingUp size={20} />, color: 'text-orange-600 bg-orange-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-nc-navy to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Buenos días, Profesional</h1>
          <p className="text-slate-300 max-w-2xl">
            Hay <span className="font-semibold text-nc-teal">5 nuevas regulaciones</span> publicadas hoy que impactan tus operaciones de comercio exterior.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
            </div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Updates */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Últimas Actualizaciones</h2>
          <Link to="/library" className="text-nc-teal text-sm font-medium hover:underline flex items-center gap-1">
            Ver biblioteca completa <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recentNorms.map((norm) => (
            <Link 
              key={norm.id} 
              to={`/norm/${norm.id}`}
              className="group bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:border-nc-teal hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-4"
            >
              {/* Category Indicator */}
              <div className={`w-1.5 self-stretch rounded-full ${norm.category === Category.ADUANERA ? 'bg-blue-500' : norm.category === Category.CAMBIARIA ? 'bg-green-500' : norm.category === Category.TRIBUTARIA ? 'bg-purple-500' : 'bg-orange-500'}`}></div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${CATEGORY_COLORS[norm.category]}`}>
                    {norm.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar size={12} /> {norm.date}
                  </span>
                  {norm.isNew && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Nuevo
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-nc-teal transition-colors mb-1">
                  {norm.type} {norm.number} - {norm.issuingAuthority}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-2">
                  {norm.title}
                </p>
              </div>

              <div className="md:self-center">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-nc-teal transition-colors">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;