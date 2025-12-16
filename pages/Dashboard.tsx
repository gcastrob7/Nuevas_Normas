import React, { useState } from 'react';
import { MOCK_NORMS, CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';
import { ArrowRight, Bell, Calendar, TrendingUp, Radio, Mail, Smartphone, CheckCircle2, X, FileText, Send, Loader2, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Norm, Category } from '../types';

const Dashboard: React.FC = () => {
  // Show 4 norms to cover all sectors (Aduanera, Cambiaria, Tributaria, Comercio Exterior)
  const recentNorms = MOCK_NORMS.slice(0, 4);
  const newNorms = MOCK_NORMS.filter(n => n.isNew);

  // Modal & Form State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '', comments: '', terms: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Ticker State - Default false so user has to click to "start" it
  const [isTickerActive, setIsTickerActive] = useState(false);

  const stats = [
    { label: 'Normas Hoy', value: 5, icon: <Bell size={20} />, color: 'text-blue-600 bg-blue-100' },
    { label: 'Vigentes este mes', value: 24, icon: <Calendar size={20} />, color: 'text-green-600 bg-green-100' },
    { label: 'Impacto Alto', value: 3, icon: <TrendingUp size={20} />, color: 'text-orange-600 bg-orange-100' },
  ];

  const handleWhatsAppSubscribe = () => {
    const message = encodeURIComponent("Hola, deseo activar las alertas inmediatas de NuevasNormas en mi celular.");
    window.open(`https://wa.me/573002000000?text=${message}`, '_blank');
  };
  
  const handleTelegramSubscribe = () => {
    window.open(`https://t.me/nuevasnormas`, '_blank');
  };

  const handleOpenEmailModal = () => {
    setIsEmailModalOpen(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.email || !emailForm.terms) return;

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
        setIsSubmitting(false);
        setIsEmailModalOpen(false);
        setShowSuccessToast(true);
        setEmailForm({ email: '', comments: '', terms: false }); // Reset form
        
        // Hide toast after 3 seconds
        setTimeout(() => setShowSuccessToast(false), 3000);
    }, 1500);
  };

  const currentDate = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in duration-300">
            <div className="p-1 bg-green-500 rounded-full">
                <CheckCircle2 size={16} className="text-white" />
            </div>
            <div>
                <h4 className="font-bold text-sm">¡Solicitud Enviada!</h4>
                <p className="text-xs text-slate-300">El boletín ha sido programado para el correo registrado.</p>
            </div>
        </div>
      )}

      {/* Email Subscription Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Mail className="text-nc-teal" size={20} /> Suscripción al Boletín
                    </h3>
                    <button 
                        onClick={() => setIsEmailModalOpen(false)} 
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleEmailSubmit} className="p-6 overflow-y-auto">
                    <p className="text-sm text-slate-600 mb-6">
                        Por favor confirma el correo electrónico donde deseas recibir el resumen normativo diario.
                    </p>

                    {/* Pre-loaded Attachment Simulation */}
                    <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm border border-slate-100 shrink-0">
                            <FileText size={24} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 truncate">Resumen_Normativo_{currentDate.replace(/ /g, '_')}.pdf</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Adjunto precargado • 1.2 MB
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Correo Electrónico de Destino <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                id="email"
                                required
                                value={emailForm.email}
                                onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                                placeholder="ejemplo@empresa.com"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nc-teal focus:bg-white transition-all text-sm text-slate-900"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="comments" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Comentarios o Temas de Interés (Opcional)
                            </label>
                            <textarea 
                                id="comments"
                                rows={3}
                                value={emailForm.comments}
                                onChange={(e) => setEmailForm({...emailForm, comments: e.target.value})}
                                placeholder="Ej: Me interesa enfocarme en normas aduaneras para sector textil..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nc-teal focus:bg-white transition-all text-sm resize-none text-slate-900"
                            />
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                required 
                                checked={emailForm.terms}
                                onChange={(e) => setEmailForm({...emailForm, terms: e.target.checked})}
                                className="mt-1 w-4 h-4 text-nc-teal border-slate-300 rounded focus:ring-nc-teal cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-xs text-slate-500 cursor-pointer">
                                He leído y acepto la <a href="#" className="text-nc-teal hover:underline font-medium">política de tratamiento de datos</a> y autorizo el envío del boletín a mi correo. <span className="text-red-500">*</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsEmailModalOpen(false)}
                            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting || !emailForm.terms}
                            className="flex-[2] px-4 py-3 bg-nc-teal hover:bg-teal-700 text-white rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Enviando...
                                </>
                            ) : (
                                <>
                                    <Send size={18} /> Enviar Solicitud
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* 1. News Ticker (Cinta de Noticias) */}
      <div className="bg-nc-navy text-white rounded-lg overflow-hidden flex items-center shadow-md border border-slate-700 h-10">
        <button 
          onClick={() => setIsTickerActive(!isTickerActive)}
          className={`px-4 h-full flex items-center font-bold text-xs uppercase tracking-wider z-10 shrink-0 shadow-lg transition-all duration-300 cursor-pointer border-r border-white/10 ${
            isTickerActive 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
          title={isTickerActive ? "Pausar novedades" : "Iniciar cinta de novedades"}
        >
          <Radio size={14} className={`mr-2 ${isTickerActive ? 'animate-pulse' : ''}`} /> 
          {isTickerActive ? 'En Vivo' : 'Activar Novedades'}
        </button>
        <div className="flex-1 overflow-hidden relative h-full flex items-center bg-slate-800/50">
          <div 
            className={`absolute left-0 flex items-center gap-8 pl-4 whitespace-nowrap will-change-transform ${isTickerActive ? 'animate-ticker' : ''}`}
            onAnimationEnd={() => setIsTickerActive(false)}
          >
             {newNorms.map((norm, idx) => (
               <span key={idx} className="text-sm font-medium flex items-center gap-2 shrink-0">
                 <span className={`w-2 h-2 rounded-full ${norm.category === 'Aduanera' ? 'bg-blue-400' : 'bg-green-400'}`}></span>
                 <span className="text-slate-300">[{norm.category}]</span> 
                 <span className="text-white">{norm.type} {norm.number}:</span>
                 <span className="text-slate-200">{norm.title.substring(0, 60)}...</span>
               </span>
             ))}
             {/* Duplicate for seamless loop illusion or length coverage */}
             {newNorms.map((norm, idx) => (
               <span key={`dup-${idx}`} className="text-sm font-medium flex items-center gap-2 shrink-0">
                 <span className={`w-2 h-2 rounded-full ${norm.category === 'Aduanera' ? 'bg-blue-400' : 'bg-green-400'}`}></span>
                 <span className="text-slate-300">[{norm.category}]</span> 
                 <span className="text-white">{norm.type} {norm.number}:</span>
                 <span className="text-slate-200">{norm.title.substring(0, 60)}...</span>
               </span>
             ))}
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-nc-navy to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
             <div>
                <h1 className="text-3xl font-bold mb-2">Monitor Regulatorio</h1>
                <p className="text-slate-300 max-w-2xl">
                    Sistema de vigilancia activa de cambios en regulación Aduanera, Tributaria y Cambiaria.
                </p>
             </div>
             <div className="hidden md:flex flex-col items-end text-xs text-slate-400 bg-black/20 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${isTickerActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></span>
                    <span className={`font-semibold ${isTickerActive ? 'text-green-400' : 'text-slate-400'}`}>
                        {isTickerActive ? 'MONITOREO ACTIVO' : 'SISTEMA EN ESPERA'}
                    </span>
                </div>
                <div>Última actualización: Hace instantes</div>
                <div className="mt-1 opacity-75">Fuentes: DIAN • MinCIT • BanRep • Presidencia</div>
             </div>
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Updates */}
        <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-nc-teal rounded-full"></div>
                Últimas Actualizaciones
            </h2>
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
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Nuevo
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

        {/* Right Column: Alerts Subscription */}
        <div className="space-y-6">
            <div className="bg-nc-navy rounded-xl p-6 text-white shadow-lg border border-slate-700">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Bell className="text-yellow-400" size={20} /> Alertas Tempranas
                </h3>
                <p className="text-slate-300 text-sm mb-6">
                    No esperes a entrar a la plataforma. Recibe el resumen de cambios normativos en tu dispositivo.
                </p>
                
                <div className="space-y-3">
                    <button 
                        onClick={handleWhatsAppSubscribe}
                        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors p-3 rounded-lg flex items-center gap-3 text-sm font-medium cursor-pointer active:scale-95"
                    >
                        <div className="p-2 bg-[#25D366] rounded-full text-white">
                            <Smartphone size={16} />
                        </div>
                        <div className="text-left">
                           <span className="block font-semibold">Activar Alertas WhatsApp</span>
                           <span className="text-xs text-slate-400">Notificación inmediata</span>
                        </div>
                    </button>
                    
                    <button 
                        onClick={handleOpenEmailModal}
                        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors p-3 rounded-lg flex items-center gap-3 text-sm font-medium cursor-pointer active:scale-95"
                    >
                        <div className="p-2 bg-blue-500 rounded-full text-white">
                            <Mail size={16} />
                        </div>
                         <div className="text-left">
                           <span className="block font-semibold">Boletín Diario Email</span>
                           <span className="text-xs text-slate-400">Resumen a las 6:00 AM</span>
                        </div>
                    </button>

                    <button 
                        onClick={handleTelegramSubscribe}
                        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors p-3 rounded-lg flex items-center gap-3 text-sm font-medium cursor-pointer active:scale-95"
                    >
                        <div className="p-2 bg-sky-500 rounded-full text-white">
                            <Send size={16} className="-ml-0.5 mt-0.5" />
                        </div>
                         <div className="text-left">
                           <span className="block font-semibold">Canal de Telegram</span>
                           <span className="text-xs text-slate-400">Comunidad oficial</span>
                        </div>
                    </button>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 text-nc-teal shrink-0" />
                    <span>Monitoreamos 24/7 los portales oficiales para notificarte en menos de 15 minutos tras la publicación.</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;