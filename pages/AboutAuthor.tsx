import React from 'react';
import { Linkedin, Mail, MapPin, Award, BookOpen, Briefcase, GraduationCap, Building2, User } from 'lucide-react';

const AboutAuthor: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
        <div className="h-32 bg-gradient-to-r from-nc-navy to-nc-teal"></div>
        <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Avatar Column - Pulled up */}
                <div className="-mt-12 md:-mt-16 flex-shrink-0">
                    <div className="w-32 h-32 rounded-xl bg-white p-1 shadow-lg mx-auto md:mx-0">
                        {/* 
                           Profile Image Configuration:
                           - src: Updated to the direct Cloudfront URL provided by the user.
                           - object-cover: Ensures the image fills the box without distortion
                           - object-top: Aligns image to focus on the face
                        */}
                        <img 
                            src="https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/05ea0b86-ff1b-54ee-a8b0-e8d675eab38c/e1552eaa-b7d1-56e6-a296-59dbf0e1db7d.jpg" 
                            alt="Germán Castro Bernal" 
                            className="w-full h-full object-cover object-top rounded-lg bg-slate-100"
                            onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.src = 'https://ui-avatars.com/api/?name=German+Castro&background=f1f5f9&color=0f172a&size=256&font-size=0.33';
                            }}
                        />
                    </div>
                </div>

                {/* Info Column */}
                <div className="flex-1 pt-2 text-center md:text-left flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-nc-navy tracking-tight">Germán Castro Bernal</h1>
                        <p className="text-nc-teal font-medium text-lg">PhD (c) en Proyectos • PMP© • CSCA®</p>
                        <p className="text-slate-500 text-sm mt-1">Experto en Comercio Internacional, Logística y Dirección de Proyectos</p>
                    </div>

                    <div className="hidden md:flex gap-3 mt-4 md:mt-0">
                        <a href="mailto:german.castro.b@professional.universidadviu.com" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                            <Mail size={16} /> Contactar
                        </a>
                        <a href="https://www.linkedin.com/in/german-castro-bernal-phd-6b890754" target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#0077b5] hover:bg-[#006396] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                            <Linkedin size={16} /> LinkedIn
                        </a>
                    </div>
                    
                    {/* Mobile Actions */}
                    <div className="flex md:hidden gap-3 mt-4 w-full justify-center">
                        <a href="mailto:german.castro.b@professional.universidadviu.com" className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                            <Mail size={20} />
                        </a>
                        <a href="https://www.linkedin.com/in/german-castro-bernal-phd-6b890754" target="_blank" rel="noreferrer" className="p-2 bg-[#0077b5] text-white rounded-lg">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Ubicación</p>
                        <p className="text-sm font-medium">Medellín / Ibagué, Colombia</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                        <Award size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Certificaciones</p>
                        <p className="text-sm font-medium">PMP© - Project Management Institute</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Experiencia</p>
                        <p className="text-sm font-medium">+20 años Sector Privado / +16 Docencia</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Education & Skills */}
        <div className="space-y-6">
             {/* Education */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-nc-navy flex items-center gap-2 mb-4 tracking-tight">
                    <GraduationCap className="text-nc-teal" size={22} /> Formación Académica
                </h3>
                <div className="space-y-4 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-nc-teal rounded-full border-2 border-white shadow-sm"></div>
                        <h4 className="font-bold text-slate-800 text-sm">PhD (c) en Ingeniería de Proyectos</h4>
                        <p className="text-xs text-slate-500">Universidad Internacional Iberoamericana - México</p>
                    </div>
                    <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-slate-300 rounded-full border-2 border-white"></div>
                        <h4 className="font-bold text-slate-800 text-sm">MSc. en Administración</h4>
                        <p className="text-xs text-slate-500">Universidad Viña del Mar - Chile</p>
                        <p className="text-[10px] text-slate-400">Especialidad en Dirección de Proyectos</p>
                    </div>
                     <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-slate-300 rounded-full border-2 border-white"></div>
                        <h4 className="font-bold text-slate-800 text-sm">Especialista en Gerencia Logística</h4>
                        <p className="text-xs text-slate-500">Escuela de Logística de las FF.MM.</p>
                        <p className="text-[10px] text-slate-400 font-medium text-amber-600">Mención de Honor</p>
                    </div>
                    <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-slate-300 rounded-full border-2 border-white"></div>
                        <h4 className="font-bold text-slate-800 text-sm">Profesional en Comercio Internacional</h4>
                        <p className="text-xs text-slate-500">Universidad Antonio Nariño</p>
                        <p className="text-[10px] text-slate-400 font-medium text-amber-600">Mención de Honor</p>
                    </div>
                </div>
            </div>

            {/* Certifications */}
             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-nc-navy flex items-center gap-2 mb-4 tracking-tight">
                    <Award className="text-nc-teal" size={22} /> Certificaciones Clave
                </h3>
                <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">Project Management Professional (PMP)©</span>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">Certified Supply Chain Analyst (CSCA)®</span>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">Auditor Interno ISO 9001:2008</span>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">Auditor Interno ISO/IEC 27001:2013</span>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">BASC Colombia</span>
                </div>
            </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Professional Profile */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-nc-navy mb-4 border-b border-slate-100 pb-2 tracking-tight">Perfil Profesional</h3>
                <div className="prose prose-slate text-sm text-slate-600 text-justify leading-relaxed max-w-none">
                    <p>
                        Profesional en Comercio Internacional y Logística, con amplia trayectoria académica y empresarial. Certified Supply Chain Analyst CSCA® por ISCEA-USA y Project Management Professional-PMP© por el PMI. Cuenta con múltiples especializaciones en Gerencia Logística, Administración de Empresas y Formulación de Proyectos.
                    </p>
                    <p className="mt-4">
                        Posee <strong>20 años de experiencia en el sector privado</strong> en áreas de logística de exportaciones, importaciones, aprovisionamiento y distribución física internacional. Ha desempeñado roles como Consultor, Asesor y Catedrático en diversas universidades y empresas multinacionales como CEMEX y en el sector público (Fuerza Aérea Colombiana, SENA).
                    </p>
                    <p className="mt-4">
                        Director de Trabajos de Fin de Máster en áreas de Logística, Supply Chain Management, Economía Circular y Desarrollo Sustentable. Autor de libros y artículos sobre comercio electrónico, logística comercial y teorías administrativas.
                    </p>
                </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-nc-navy mb-6 border-b border-slate-100 pb-2 flex items-center gap-2 tracking-tight">
                    <Building2 className="text-nc-teal" size={24} /> Experiencia Destacada
                </h3>
                
                <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-400 border border-slate-100">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">Docente / Director TFM</h4>
                            <p className="text-sm text-nc-teal font-medium">Universidad Internacional de Valencia (España) / Universidad Santo Tomás</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Dirección de trabajos de fin de máster en Logística y Supply Chain. Docencia en estrategias de negociación, marketing digital y contratación internacional.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-400 border border-slate-100">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">Sector Privado & Multinacionales</h4>
                            <p className="text-sm text-nc-teal font-medium">CEMEX / Serviarroz Ltda.</p>
                            <p className="text-xs text-slate-500 mt-1">
                                10 años en multinacionales (CEMEX) y 5 años en Serviarroz desempeñando cargos en gestión de abastecimientos, producción, distribución y logística de comercio exterior.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-400 border border-slate-100">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">Sector Público & Formación</h4>
                            <p className="text-sm text-nc-teal font-medium">SENA / Fuerza Aérea Colombiana</p>
                            <p className="text-xs text-slate-500 mt-1">
                                19 años como funcionario público (FAC). Instructor SENA en Logística Internacional, Comercio Exterior y Marketing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Publications */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-nc-navy mb-4 border-b border-slate-100 pb-2 flex items-center gap-2 tracking-tight">
                    <BookOpen className="text-nc-teal" size={24} /> Publicaciones e Investigaciones
                </h3>
                <ul className="space-y-3 text-sm text-slate-600">
                    <li className="pl-4 border-l-2 border-nc-teal">
                        <span className="font-bold text-slate-800">Libro:</span> "Administración Logística" (ISBN 978-620-3-03509-4) - 2021
                    </li>
                    <li className="pl-4 border-l-2 border-slate-200 hover:border-nc-teal transition-colors">
                        <span className="font-bold text-slate-800">Libro:</span> "Incoterms 2020. Guía práctica para las operaciones de Comercio Internacional" - 2020
                    </li>
                    <li className="pl-4 border-l-2 border-slate-200 hover:border-nc-teal transition-colors">
                        <span className="font-bold text-slate-800">Libro:</span> "Envases, Empaques y Embalajes" - 2020
                    </li>
                    <li className="pl-4 border-l-2 border-slate-200 hover:border-nc-teal transition-colors">
                        <span className="font-bold text-slate-800">Libro:</span> "Teoría de Costos. Fundamentos Básicos" - 2020
                    </li>
                    <li className="pl-4 border-l-2 border-slate-200 hover:border-nc-teal transition-colors">
                        <span className="font-bold text-slate-800">Artículo:</span> "Revisión sistemática de las relaciones en cooperación militar..." - Revista OASIS, Universidad Externado.
                    </li>
                </ul>
            </div>

        </div>
      </div>
      
      {/* Footer info */}
      <div className="text-center text-slate-400 text-xs py-4">
        Información verificada a Septiembre de 2025 • Curriculum Vitae Digital
      </div>
    </div>
  );
};

export default AboutAuthor;