import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_NORMS, CATEGORY_COLORS } from '../constants';
import { ArrowLeft, Download, Share2, Printer, Save, CheckCircle, X, Copy, Mail, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { jsPDF } from "jspdf";

const NormDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const norm = MOCK_NORMS.find((n) => n.id === id);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper function to generate the PDF document object
  // This ensures consistency between "Save" and "Print"
  const generatePdfDoc = (): jsPDF | null => {
    if (!norm) return null;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add professional metadata to the PDF file
    doc.setProperties({
        title: `${norm.type} ${norm.number} - ${norm.title}`,
        subject: norm.summary,
        author: norm.issuingAuthority,
        keywords: `${norm.category}, ${norm.type}, Colombia`,
        creator: 'NormaComex Platform'
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - (margin * 2);
    
    // --- Document Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${norm.type} ${norm.number}`, margin, margin);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Autoridad: ${norm.issuingAuthority}`, margin, margin + 7);
    doc.text(`Fecha: ${norm.date}`, margin, margin + 12);
    doc.text(`Categoría: ${norm.category}`, margin, margin + 17);
    
    // Separator
    doc.setDrawColor(200);
    doc.line(margin, margin + 22, pageWidth - margin, margin + 22);
    
    // --- Title ---
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const titleLines = doc.splitTextToSize(norm.title, contentWidth);
    doc.text(titleLines, margin, margin + 30);
    
    let yPos = margin + 30 + (titleLines.length * 5) + 5;

    // --- Content ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const textContent = norm.fullText || "Contenido no disponible.";
    const splitText = doc.splitTextToSize(textContent, contentWidth);
    
    // Pagination Loop
    for(let i = 0; i < splitText.length; i++) {
        if (yPos > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
        }
        doc.text(splitText[i], margin, yPos);
        yPos += 5; 
    }

    return doc;
  };

  const handleSaveToComputer = () => {
    if (!norm) return;
    try {
        const doc = generatePdfDoc();
        if (doc) {
            // Explicitly use Blob generation for maximum compatibility
            const blob = doc.output('blob');
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // Advanced Sanitization for filename
            // 1. Get title or default
            let cleanTitle = norm.title || "Documento";
            // 2. Normalize to NFD to separate accents (e.g., é -> e + ´) and remove them
            cleanTitle = cleanTitle.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            // 3. Remove all non-alphanumeric characters except spaces
            cleanTitle = cleanTitle.replace(/[^a-zA-Z0-9\s]/g, "");
            // 4. Truncate length
            cleanTitle = cleanTitle.substring(0, 50).trim();
            // 5. Replace spaces with underscores
            cleanTitle = cleanTitle.replace(/\s+/g, "_");

            const cleanType = norm.type.replace(/[^a-zA-Z0-9]/g, "");
            const cleanNumber = norm.number.replace(/[^a-zA-Z0-9]/g, "");
                
            const filename = `Norma_${cleanType}_${cleanNumber}_${cleanTitle}.pdf`;

            link.href = url;
            link.setAttribute('download', filename);
            
            // Append to body is required for Firefox and some mobile browsers
            document.body.appendChild(link);
            
            link.click();
            
            // Clean up resources
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            showToast("Archivo guardado exitosamente");
        }
    } catch (e) {
        console.error("PDF Generation Error:", e);
        showToast("Error al generar el archivo");
    }
  };

  const handlePrint = () => {
    if (!norm) return;
    try {
        const doc = generatePdfDoc();
        if (doc) {
            // Adds JS to the PDF to trigger print dialog automatically when opened
            doc.autoPrint(); 
            
            // Create a Blob URL for the PDF
            const blob = doc.output('blob');
            const url = URL.createObjectURL(blob);
            
            // Open the PDF in a new window/tab
            // This allows the browser's native PDF viewer to handle the printing "as a file"
            window.open(url, '_blank');
            
            // Cleanup URL object after a delay to ensure it loaded
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        }
    } catch (e) {
        console.error("Print Error:", e);
        // Fallback to standard window print if PDF generation fails
        window.print();
    }
  };

  const toggleShareModal = () => {
    setIsShareModalOpen(!isShareModalOpen);
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
                        <a href={socialLinks.email} className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-600 text-white hover:opacity-90 transition-opacity font-medium text-sm">
                            <Mail size={18} /> Correo
                        </a>
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
              className="p-2 text-slate-400 hover:text-nc-teal hover:bg-teal-50 rounded-lg transition-colors border border-transparent hover:border-teal-100" 
              title="Guardar archivo en computador"
            >
              <Save size={20} />
            </button>
             <button 
               onClick={handlePrint}
               className="p-2 text-slate-400 hover:text-nc-navy hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200" 
               title="Imprimir"
             >
              <Printer size={20} />
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
              className="flex items-center gap-2 bg-nc-navy text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-blue-900/20 text-sm font-medium active:transform active:scale-95 print:hidden"
            >
              <Download size={16} /> Descargar PDF Completo
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