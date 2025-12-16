import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_NORMS, CATEGORY_COLORS } from '../constants';
import { Bell, Calendar, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';

const Notifications: React.FC = () => {
  // Filter for new norms to simulate notifications
  const notifications = MOCK_NORMS.filter(norm => norm.isNew);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-nc-navy flex items-center gap-2">
                <Bell className="text-nc-teal" /> Notificaciones
            </h1>
            <p className="text-slate-500 text-sm mt-1">
                Mantente al día con los últimos cambios regulatorios y alertas del sistema.
            </p>
        </div>
        <div className="text-sm text-slate-400">
            {notifications.length} nuevas alertas
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {notifications.length > 0 ? (
            <div className="divide-y divide-slate-100">
                {notifications.map((norm) => (
                    <div key={norm.id} className="p-6 hover:bg-slate-50 transition-colors group relative">
                        <div className="flex gap-4 items-start">
                            {/* Icon Indicator */}
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                    <FileText size={20} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${CATEGORY_COLORS[norm.category]}`}>
                                        {norm.category}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Calendar size={12} /> {norm.date}
                                    </span>
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                </div>
                                
                                <h3 className="text-base font-bold text-slate-800 mb-1">
                                    Nueva publicación: {norm.type} {norm.number}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                                    {norm.title}. <span className="text-slate-400">Expedida por {norm.issuingAuthority}.</span>
                                </p>
                                
                                <div className="flex items-center gap-4">
                                    <Link 
                                        to={`/norm/${norm.id}`} 
                                        className="text-sm font-medium text-nc-teal hover:text-teal-700 flex items-center gap-1 transition-colors"
                                    >
                                        Leer norma completa <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>

                            {/* Action (Visual only) */}
                            <button className="text-slate-300 hover:text-nc-teal transition-colors" title="Marcar como leída">
                                <CheckCircle2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Bell size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-800">Estás al día</h3>
                <p className="text-slate-500 text-sm">No hay nuevas notificaciones pendientes por leer.</p>
            </div>
        )}
      </div>
      
      {/* Older Notifications Section (Static Placeholder for demo) */}
      {notifications.length > 0 && (
          <div className="text-center pt-4">
            <button className="text-sm text-slate-500 hover:text-nc-navy font-medium transition-colors">
                Ver historial completo de notificaciones
            </button>
          </div>
      )}
    </div>
  );
};

export default Notifications;