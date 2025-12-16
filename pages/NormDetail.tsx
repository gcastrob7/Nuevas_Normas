import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_NORMS, CATEGORY_COLORS } from '../constants';
import { ArrowLeft, Download, Share2, Printer, Save, CheckCircle, X, Copy, Mail, Linkedin, Twitter, MessageCircle, Loader2, FileText, Send } from 'lucide-react';
import { jsPDF } from "jspdf";

const NormDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const norm = MOCK_NORMS.find((n) => n.id === id);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEmailShareModalOpen, setIsEmailShareModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '', message: '' });
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper function to generate the PDF document object
  const generatePdfDoc = (): jsPDF | null => {
    if (!norm) return null;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Metadata
    doc.setProperties({
        title: `${norm.type} ${norm.number} - ${norm.title}`,
        subject: norm.summary,
        author: 'NuevasNormas - Monitor Regulatorio',
        keywords: `${norm.category}, ${norm.type}, Colombia`,
        creator: 'Plataforma NuevasNormas'
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - (margin * 2);
    
    // --- Document Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59); // nc-navy
    doc.text(`${norm.type} ${norm.number}`, margin, margin);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Autoridad: ${norm.issuingAuthority}`, margin, margin + 8);
    doc.text(`Fecha de expedición: ${norm.date}`, margin, margin + 13);
    doc.text(`Categoría: ${norm.category}`, margin, margin + 18);
    
    // Separator line
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 24, pageWidth - margin, margin + 24);
    
    // --- Title / Object ---
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    
    const titleLines = doc.splitTextToSize(norm.title, contentWidth);
    doc.text(titleLines, margin, margin + 32);
    
    // Calculate Y position after title
    let yPos = margin + 32 + (titleLines.length * 5) + 10;

    // --- Content Body ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50);
    
    const textContent = norm.fullText || "Contenido no disponible.";
    // Split text into lines that fit the width
    const splitText = doc.splitTextToSize(textContent, contentWidth);
    
    // Pagination & Content Loop
    for(let i = 0; i < splitText.length; i++) {
        // Check if we need a new page
        if (yPos > pageHeight - margin - 10) { // -10 for footer space
            // Add Footer before new page
            const pageCount = doc.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Generado por NuevasNormas - Pág. ${pageCount}`, margin, pageHeight - 10);
            
            doc.addPage();
            yPos = margin;
            
            // Reset font styles for body
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(50);
        }
        
        doc.text(splitText[i], margin, yPos);
        yPos += 5; // Line height
    }

    // Footer on last page
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Generado por NuevasNormas - Pág. ${pageCount}`, margin, pageHeight - 10);

    return doc;
  };

  const handleSaveToComputer = async () => {
    if (!norm) return;
    setIsGenerating(true);

    // Small timeout to allow UI to update (show spinner)
    setTimeout(() => {
        try {
            const doc = generatePdfDoc();
            if (doc) {
                // Advanced Sanitization for filename
                let cleanTitle = norm.title || "Documento";
                cleanTitle = cleanTitle.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents
                cleanTitle = cleanTitle.replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special chars
                cleanTitle = cleanTitle.substring(0, 40).trim().replace(/\s+/g, "_"); // Truncate and snake_case

                const cleanType = norm.type.replace(/[^a-zA-Z0-9]/g, "");
                const cleanNumber = norm.number.replace(/[^a-zA-Z0-9]/g, "");
                    
                const filename = `${cleanType}_${cleanNumber}_${cleanTitle}.pdf`;

                doc.save(filename);
                showToast("Archivo descargado exitosamente");
            }
        } catch (e) {
            console.error("PDF Generation Error:", e);
            showToast("Error al generar el archivo");
        } finally {
            setIsGenerating(false);
        }
    }, 100);
  };

  const handlePrint = () => {
    if (!norm) return;
    setIsPrinting(true);

    // Give UI a moment to show spinner
    setTimeout(() => {
      try {
        const doc = generatePdfDoc();
        if (doc) {
           doc.autoPrint();
           const blob = doc.output('blob');
           const url = URL.createObjectURL(blob);
           
           // Create hidden iframe for printing
           const iframe = document.createElement('iframe');
           // Make it invisible but part of layout to ensure loading
           iframe.style.position = 'fixed';
           iframe.style.width = '1px';
           iframe.style.height = '1px';
           iframe.style.left = '-1000px';
           iframe.style.top = '-1000px';
           iframe.src = url;
           
           document.body.appendChild(iframe);
           
           // Print when loaded
           iframe.onload = () => {
             // Small delay for rendering
             setTimeout(() => {
                 try {
                     iframe.contentWindow?.print();
                 } catch (e) {
                     // Fallback if iframe print is blocked
                     window.open(url, '_blank');
                 }
                 
                 // Cleanup
                 setIsPrinting(false);
                 setTimeout(() => {
                     document.body.removeChild(iframe);
                     URL.revokeObjectURL(url);
                 }, 60000); // 1 minute cleanup delay to allow print dialog to work
             }, 500);
           };
        } else {
             setIsPrinting(false);
        }
      } catch (e) {
          console.error(e);
          showToast("Error al iniciar impresión");
          setIsPrinting(false);
      }
    }, 100);
  };

  const toggleShareModal = () => {
    setIsShareModalOpen(!isShareModalOpen);
  };

  const handleOpenEmailShare = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsShareModalOpen(false);
    setIsEmailShareModalOpen(true);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.email) return;

    setIsSendingEmail(true);

    // Simulate sending delay
    setTimeout(() => {
        setIsSendingEmail(false);
        setIsEmailShareModalOpen(false);
        setEmailForm({ email: '', message: '' }); // Reset form
        showToast("Norma enviada exitosamente por correo");
    }, 2000);
  };

  const copyToClipboard = async () => {
    const shareUrl = window.location.href;
    try {
        await navigator.clipboard.writeText(shareUrl);
        showToast("Enlace copiado al portapapeles");
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast("Enlace copiado");
    }
  };

  // Social Share Generators
  const getSocialLinks = () => {
    if (!norm) return {};
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Revisa esta norma: ${norm.type} ${norm.number} - ${norm.title}`);
    
    return {
        whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        // We use a custom handler for email now, but keep this generator for reference if needed
        email: `mailto:?subject=${encodeURIComponent(`Norma: ${norm.type} ${norm.number}`)}&body=${text}%0A%0A${url}`
    };
  };

  if (!norm) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Norma no encontrada</h2>
        <button onClick={() => navigate('/library')} className="text-nc-teal hover:underline">
          Volver a la biblioteca
        </button>
      </div>
    );
  }

  const socialLinks = getSocialLinks();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 print:hidden">
          <CheckCircle size={18} className="text-green-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 print:hidden" onClick={toggleShareModal}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Compartir Norma</h3>
                    <button onClick={toggleShareModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-500 mb-4">Compartir <span className="font-semibold text-slate-700">{norm.type} {norm.number}</span> a través de:</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#25D366] text-white hover:opacity-90 transition-opacity font-medium text-sm">
                            <MessageCircle size={18} /> WhatsApp
                        </a>
                        <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#0077b5] text-white hover:opacity-90 transition-opacity font-medium text-sm">
                            <Linkedin size={18} /> LinkedIn
                        </a>
                        <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-lg bg-black text-white hover:opacity-90 transition-opacity font-medium text-sm">
                            <Twitter size={18} /> X / Twitter
                        </a>
                        <button 
                            onClick={handleOpenEmailShare}
                            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-600 text-white hover:opacity-90 transition-opacity font-medium text-sm"
                        >
                            <Mail size={18} /> Correo
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Share2 size={16} className="text-slate-400" />
                        </div>
                        <input 
                            type="text" 
                            readOnly 
                            value={window.location.href} 
                            className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none"
                        />
                        <button 
                            onClick={copyToClipboard}
                            className="absolute right-1 top-1 bottom-1 px-3 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-nc-teal transition-colors flex items-center gap-1 shadow-sm"
                        >
                            <Copy size={12} /> Copiar
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Email Send Modal */}
      {isEmailShareModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 print:hidden" onClick={() => setIsEmailShareModalOpen(false)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Mail className="text-nc-teal" size={20} /> Enviar Norma por Correo
                    </h3>
                    <button onClick={() => setIsEmailShareModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSendEmail} className="p-6">
                    <p className="text-sm text-slate-600 mb-6">
                        Envía una copia digital de <span className="font-semibold text-slate-800">{norm.type} {norm.number}</span> directamente a un colega o cliente.
                    </p>

                    {/* Attachment Simulation */}
                    <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm border border-slate-100 shrink-0">
                            <FileText size={24} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 truncate">{norm.type}_{norm.number}.pdf</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Archivo adjunto listo
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="share-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Para (Correo Electrónico) <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                id="share-email"
                                required
                                value={emailForm.email}
                                onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                                placeholder="destinatario@ejemplo.com"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nc-teal focus:bg-white transition-all text-sm text-slate-900"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="share-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Mensaje (Opcional)
                            </label>
                            <textarea 
                                id="share-message"
                                rows={3}
                                value={emailForm.message}
                                onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                                placeholder="Te comparto esta norma que puede ser de tu interés..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nc-teal focus:bg-white transition-all text-sm resize-none text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsEmailShareModalOpen(false)}
                            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            disabled={isSendingEmail || !emailForm.email}
                            className="flex-[2] px-4 py-3 bg-nc-teal hover:bg-teal-700 text-white rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSendingEmail ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Enviando...
                                </>
                            ) : (
                                <>
                                    <Send size={18} /> Enviar Documento
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1 text-slate-500 hover:text-nc-navy transition-colors text-sm font-medium print:hidden"
      >
        <ArrowLeft size={16} /> Volver
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full ${
            norm.category === 'Aduanera' ? 'bg-blue-500' :
            norm.category === 'Cambiaria' ? 'bg-green-500' :
            norm.category === 'Tributaria' ? 'bg-purple-500' : 'bg-orange-500'
        }`}></div>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${CATEGORY_COLORS[norm.category]}`}>
                {norm.category}
              </span>
              <span className="text-slate-400 text-sm">{norm.date}</span>
            </div>
            <h1 className="text-3xl font-bold text-nc-navy mb-2 leading-tight">
              {norm.type} {norm.number}
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Autoridad Emisora: {norm.issuingAuthority}
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
            <button 
              onClick={handleSaveToComputer}
              disabled={isGenerating || isPrinting}
              className="p-2 text-slate-400 hover:text-nc-teal hover:bg-teal-50 rounded-lg transition-colors border border-transparent hover:border-teal-100 disabled:opacity-50" 
              title="Descargar archivo en computador"
            >
              {isGenerating ? <Loader2 size={20} className="animate-spin text-nc-teal" /> : <Save size={20} />}
            </button>
             <button 
               onClick={handlePrint}
               disabled={isGenerating || isPrinting}
               className="p-2 text-slate-400 hover:text-nc-navy hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 disabled:opacity-50" 
               title="Imprimir Documento Oficial"
             >
              {isPrinting ? <Loader2 size={20} className="animate-spin text-nc-navy" /> : <Printer size={20} />}
            </button>
             <button 
               onClick={toggleShareModal}
               className={`p-2 rounded-lg transition-colors border border-transparent ${isShareModalOpen ? 'text-nc-teal bg-teal-50 border-teal-100' : 'text-slate-400 hover:text-nc-navy hover:bg-slate-100 hover:border-slate-200'}`}
               title="Compartir"
             >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Título / Objeto</h3>
          <p className="text-slate-800 font-medium leading-relaxed">
            {norm.title}
          </p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-nc-navy mb-4 flex items-center gap-2">
          Resumen Ejecutivo
          <div className="h-px bg-slate-200 flex-1 ml-4"></div>
        </h2>
        <div className="prose prose-slate max-w-none text-slate-600">
          <p className="bg-yellow-50 p-4 border-l-4 border-yellow-400 rounded-r-lg text-yellow-900 mb-6">
            <strong>Impacto Operativo:</strong> Este cambio normativo requiere actualización inmediata en los procedimientos de declaración.
          </p>
          <p>{norm.summary}</p>
        </div>
      </div>

      {/* Full Text Preview */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-nc-navy">Texto de la Norma</h2>
            <button 
              onClick={handleSaveToComputer}
              disabled={isGenerating || isPrinting}
              className="flex items-center gap-2 bg-nc-navy text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-blue-900/20 text-sm font-medium active:transform active:scale-95 print:hidden disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
              {isGenerating ? 'Generando...' : 'Descargar PDF Completo'}
            </button>
         </div>
         
         <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 font-serif text-slate-700 leading-relaxed whitespace-pre-wrap">
            {norm.fullText}
         </div>
      </div>
    </div>
  );
};

export default NormDetail;