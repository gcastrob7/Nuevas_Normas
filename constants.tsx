import { Category, Norm } from './types';
import React from 'react';
import { Scale, RefreshCw, FileText, Globe } from 'lucide-react';

export const MOCK_NORMS: Norm[] = [
  {
    id: '1',
    title: 'Modernización Digital del Régimen de Aduanas 2025',
    type: 'Decreto',
    number: '0125',
    date: '2025-02-15',
    category: Category.ADUANERA,
    issuingAuthority: 'MinCIT',
    summary: 'Establece la obligatoriedad de la declaración aduanera 100% digital y elimina la presentación física de documentos para importaciones menores a 50.000 USD. Introduce carriles exclusivos para OEA con IA.',
    fullText: `MINISTERIO DE COMERCIO, INDUSTRIA Y TURISMO

DECRETO NÚMERO 0125 DE 2025
(15 de febrero)

Por el cual se modifica parcialmente el Decreto 1165 de 2019 y se dictan disposiciones para la completa desmaterialización de las operaciones aduaneras y el uso de inteligencia artificial en el control simultáneo.

EL PRESIDENTE DE LA REPÚBLICA DE COLOMBIA,

En ejercicio de sus facultades constitucionales y legales, en especial las conferidas por el numeral 25 del artículo 189 de la Constitución Política, con sujeción a las pautas generales previstas en el artículo 2 de la Ley 7 de 1991, y

CONSIDERANDO:

Que el Gobierno Nacional tiene como objetivo fundamental facilitar las operaciones de comercio exterior, reduciendo tiempos y costos logísticos para promover la competitividad del país.
Que la transformación digital es un eje transversal del Plan Nacional de Desarrollo 2022-2026.
Que es necesario ajustar la legislación aduanera a los estándares internacionales de la Organización Mundial de Aduanas (OMA) en materia de aduanas inteligentes.

DECRETA:

CAPÍTULO I
DISPOSICIONES GENERALES

ARTÍCULO 1. Objeto. El presente decreto tiene por objeto establecer el marco jurídico para la implementación obligatoria de la declaración aduanera electrónica y la eliminación de soportes físicos en las operaciones de importación, exportación y tránsito aduanero.

ARTÍCULO 2. Definiciones. Para efectos del presente decreto, adiciónense las siguientes definiciones al artículo 3 del Decreto 1165 de 2019:
1. Expediente Digital Aduanero: Conjunto de datos y documentos electrónicos que conforman el histórico de una operación de comercio exterior, almacenados con tecnología Blockchain.
2. Carril IA: Mecanismo de selectividad basado en algoritmos de aprendizaje automático para usuarios de bajo riesgo.

CAPÍTULO II
DE LA DECLARACIÓN 100% DIGITAL

ARTÍCULO 3. Obligatoriedad. A partir del 1 de marzo de 2025, todas las declaraciones de importación y exportación deberán presentarse exclusivamente a través de los Servicios Informáticos Electrónicos (SIE) de la DIAN, utilizando firma digital certificada. No se admitirá la presentación de formularios litográficos en ninguna administración aduanera del país.

ARTÍCULO 4. Eliminación de documentos físicos para importaciones menores. Para las importaciones cuyo valor FOB sea inferior a cincuenta mil dólares de los Estados Unidos de América (USD 50.000), no será exigible la impresión física de la Declaración Andina del Valor ni de los documentos soporte, los cuales deberán reposar exclusivamente en el repositorio digital del importador o de la Agencia de Aduanas, disponibles para consulta remota por parte de la autoridad aduanera.

PARÁGRAFO. La autoridad aduanera podrá solicitar la digitalización de documentos originales físicos únicamente cuando existan indicios razonables de fraude o inconsistencias en la información transmitida electrónicamente.

CAPÍTULO III
BENEFICIOS PARA OPERADORES ECONÓMICOS AUTORIZADOS (OEA)

ARTÍCULO 5. Carriles Exclusivos con IA. Los Operadores Económicos Autorizados (OEA) tendrán acceso a carriles de desaduanamiento automático gestionados por Inteligencia Artificial, garantizando tiempos de levante no superiores a 15 minutos desde la llegada de la mercancía, salvo en casos de alerta de seguridad nacional.

ARTÍCULO 6. Inspección No Intrusiva. Las inspecciones físicas para OEA se sustituyen por inspecciones no intrusivas mediante escáneres de rayos X de alta penetración, validados por algoritmos de reconocimiento de imágenes, reduciendo la intervención manual a menos del 1% de las cargas.

ARTÍCULO 7. Vigencia y Derogatorias. El presente decreto rige a partir de la fecha de su publicación en el Diario Oficial y deroga las disposiciones que le sean contrarias.

PUBLÍQUESE Y CÚMPLASE.
Dado en Bogotá, D.C., a los 15 días del mes de febrero de 2025.`,
    isNew: true,
  },
  {
    id: '2',
    title: 'Reglamentación de Criptoactivos en Operaciones de Cambio',
    type: 'Circular',
    number: 'DCIN-84',
    date: '2025-02-12',
    category: Category.CAMBIARIA,
    issuingAuthority: 'Banco de la República',
    summary: 'Nueva reglamentación que permite canalizar divisas a través de proveedores de servicios de activos virtuales (PSAV) autorizados para operaciones de comercio exterior de servicios.',
    fullText: `BANCO DE LA REPÚBLICA
SECRETARÍA DE LA JUNTA DIRECTIVA

CIRCULAR REGLAMENTARIA EXTERNA DCIN-84
(Febrero 12 de 2025)

Asunto: Modificación a los Procedimientos Aplicables a las Operaciones de Cambio. Canalización a través de Proveedores de Servicios de Activos Virtuales (PSAV).

La Junta Directiva del Banco de la República, en ejercicio de sus facultades constitucionales y legales, en especial las conferidas por la Ley 9 de 1991,

RESUELVE:

1. Modificar el Capítulo IV de la Circular Reglamentaria Externa DCIN-83, el cual quedará así:

"CAPÍTULO IV
OPERACIONES DE CAMBIO CON ACTIVOS VIRTUALES

10. Autorización General.
Los residentes en el país y los no residentes que realicen operaciones de cambio obligatoriamente canalizables correspondientes a exportación e importación de servicios, podrán utilizar criptoactivos (stablecoins) reconocidos para la liquidación de dichas operaciones, siempre y cuando se canalicen a través de un Proveedor de Servicios de Activos Virtuales (PSAV) debidamente registrado ante la Superintendencia Financiera de Colombia.

11. Declaración de Cambio Simplificada para Criptoactivos.
Para efectos de la canalización, el PSAV actuará como Intermediario del Mercado Cambiario (IMC). Al momento de la monetización o el reintegro, se generará automáticamente una Declaración de Cambio Simplificada con el numeral cambiario '901 - Operaciones con Activos Virtuales'.

12. Requisitos de Debida Diligencia.
Los PSAV deberán aplicar medidas reforzadas de conocimiento del cliente (KYC) y monitoreo transaccional para prevenir el lavado de activos. Las operaciones que superen los USD 10.000 equivalentes en criptoactivos deberán ser reportadas de inmediato a la UIAF y al Banco de la República.

13. Prohibiciones.
Queda expresamente prohibido el uso de criptoactivos para la canalización de inversiones internacionales (IED) o endeudamiento externo hasta nueva reglamentación.

Vigencia.
La presente circular rige a partir de su publicación."`,
    isNew: true,
  },
  {
    id: '3',
    title: 'Calendario Tributario y Valor UVT Año Gravable 2025',
    type: 'Resolución',
    number: '000018',
    date: '2025-01-28',
    category: Category.TRIBUTARIA,
    issuingAuthority: 'DIAN',
    summary: 'Fija el valor de la Unidad de Valor Tributario (UVT) en $49.730 COP para 2025 y establece los plazos para la presentación de información exógena y declaraciones de renta.',
    fullText: `DIRECCIÓN DE IMPUESTOS Y ADUANAS NACIONALES - DIAN

RESOLUCIÓN NÚMERO 000018 DE 2025
(Enero 28)

Por la cual se fija el valor de la Unidad de Valor Tributario (UVT) aplicable para el año 2025 y se dictan otras disposiciones.

EL DIRECTOR GENERAL DE LA UNIDAD ADMINISTRATIVA ESPECIAL DIRECCIÓN DE IMPUESTOS Y ADUANAS NACIONALES,

En uso de sus facultades legales, en especial las dispuestas en el artículo 868 del Estatuto Tributario, y

CONSIDERANDO:

Que el artículo 868 del Estatuto Tributario establece la Unidad de Valor Tributario (UVT) como la medida de valor que permite ajustar los valores contenidos en las disposiciones relativas a los impuestos y obligaciones administrados por la DIAN.
Que el reajuste se efectuará anualmente con la variación del índice de precios al consumidor para ingresos medios, certificado por el DANE.

RESUELVE:

ARTÍCULO 1. Valor de la UVT. Fíjese en cuarenta y nueve mil setecientos treinta pesos ($49.730) el valor de la Unidad de Valor Tributario (UVT) que regirá a partir del 1 de enero de 2025.

ARTÍCULO 2. Aplicación. Para efectos de convertir en valores absolutos las cifras y valores expresados en UVT aplicables a las disposiciones relativas a los impuestos y obligaciones administrados por la DIAN, se multiplicará el número de las UVT por el valor fijado en el presente artículo, aproximando el resultado de acuerdo con el procedimiento establecido en el Estatuto Tributario.

ARTÍCULO 3. Cuantías mínimas. Para efectos de retención en la fuente a título de renta por concepto de servicios y compras, los valores bases en pesos para el año 2025 serán:
a) Servicios (4 UVT): $199.000 (cifra redondeada).
b) Compras (27 UVT): $1.343.000 (cifra redondeada).

ARTÍCULO 4. Sanciones mínimas. El valor de la sanción mínima establecida en el artículo 639 del Estatuto Tributario quedará en diez (10) UVT, equivalentes a cuatrocientos noventa y siete mil trescientos pesos ($497.300).

ARTÍCULO 5. Vigencia. La presente Resolución rige a partir de la fecha de su publicación.

PUBLÍQUESE Y CÚMPLASE.
Dada en Bogotá D.C., a los 28 días del mes de enero de 2025.`,
    isNew: false,
  },
  {
    id: '4',
    title: 'Certificado de Carbono para Importaciones Industriales',
    type: 'Resolución',
    number: '2150',
    date: '2025-02-05',
    category: Category.COMERCIO_EXTERIOR,
    issuingAuthority: 'MinCIT / MinAmbiente',
    summary: 'Implementa el Mecanismo de Ajuste en Frontera por Carbono (CBAM) para la importación de acero, cemento y aluminio, exigiendo certificados de emisiones desde origen.',
    fullText: `MINISTERIO DE COMERCIO, INDUSTRIA Y TURISMO
MINISTERIO DE AMBIENTE Y DESARROLLO SOSTENIBLE

RESOLUCIÓN CONJUNTA 2150 DE 2025
(Febrero 05)

Por la cual se reglamenta el Mecanismo de Ajuste en Frontera por Carbono (CBAM) para importaciones industriales en Colombia.

LOS MINISTROS DE COMERCIO Y AMBIENTE,

RESUELVEN:

ARTÍCULO 1. Objeto y ámbito de aplicación.
Establecer los requisitos técnicos y documentales para la importación de mercancías clasificadas en las partidas arancelarias correspondientes a cemento, acero, hierro y aluminio, con el fin de mitigar la fuga de carbono y cumplir con los compromisos del Acuerdo de París.

ARTÍCULO 2. Certificado de Emisiones en Origen.
A partir del 1 de junio de 2025, todo importador de los bienes señalados en el artículo anterior deberá presentar, como documento soporte de la declaración de importación, un Certificado de Emisiones de Carbono expedido por un organismo verificador acreditado en el país de origen.

ARTÍCULO 3. Exenciones.
Estarán exentas de esta medida las importaciones provenientes de países con los que Colombia tenga acuerdos de reconocimiento mutuo de estándares ambientales o sistemas de comercio de emisiones equivalentes.

ARTÍCULO 4. Plataforma VUCE.
El trámite de validación de certificados se realizará exclusivamente a través del módulo "Importaciones Sostenibles" de la Ventanilla Única de Comercio Exterior (VUCE).

ARTÍCULO 5. Vigencia.
La presente resolución rige a partir de su publicación en el Diario Oficial.`,
    isNew: true,
  },
  {
    id: '5',
    title: 'Clasificación Arancelaria de Servicios de Inteligencia Artificial',
    type: 'Concepto',
    number: '100202208-023',
    date: '2025-02-14',
    category: Category.ADUANERA,
    issuingAuthority: 'DIAN',
    summary: 'Aclara el tratamiento arancelario y valoración en aduana de software que integra módulos de IA generativa importados mediante soporte físico vs. descarga electrónica.',
    fullText: `DIRECCIÓN DE IMPUESTOS Y ADUANAS NACIONALES - DIAN
SUBDIRECCIÓN DE NORMATIVA Y DOCTRINA

CONCEPTO 100202208-023
(Febrero 14 de 2025)

Tema: Impuesto sobre las ventas / Arancel
Descriptores: Importación de Software con IA Generativa - Valoración Aduanera

PROBLEMA JURÍDICO:
¿Forma parte del valor en aduana el costo del licenciamiento de software que integra módulos de Inteligencia Artificial (IA) generativa cuando se importa incorporado en un medio portador físico, diferenciándolo de la descarga electrónica?

TESIS JURÍDICA:
El valor del software de IA generativa importado en un medio físico debe discriminarse del valor del medio portador para efectos de la base gravable del IVA y los derechos de aduana, conforme a la Decisión 6.1 del Comité de Valoración de la OMC. Si la importación es puramente electrónica (descarga), no se considera una importación de bienes corporales muebles sujeta a trámite aduanero, sino una importación de servicios.

INTERPRETACIÓN:

1. Importación en Medio Físico.
Cuando el software de IA se introduce al Territorio Aduanero Nacional (TAN) en discos, USB o servidores físicos, se configura una importación de bienes. Sin embargo, para determinar el valor en aduana, se tomará únicamente el costo del medio portador si el valor del software (propiedad intelectual) está distinguido en la factura comercial.

2. Importación Electrónica (Cloud/SaaS).
La adquisición de licencias de uso de modelos de IA (ej. GPT, Claude) mediante acceso a la nube o descarga directa no constituye una importación aduanera. Esta operación corresponde a un servicio digital transfronterizo sujeto a IVA, salvo las exclusiones previstas en el Estatuto Tributario para servicios de computación en la nube.

3. Conclusión.
Se insta a los usuarios aduaneros a declarar correctamente la modalidad de ingreso del software para evitar sanciones por indebida clasificación o valoración.

Cordialmente,

Subdirector de Normativa y Doctrina.`,
    isNew: true,
  }
];

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.ADUANERA]: 'bg-blue-100 text-blue-800 border-blue-500',
  [Category.CAMBIARIA]: 'bg-green-100 text-green-800 border-green-500',
  [Category.TRIBUTARIA]: 'bg-purple-100 text-purple-800 border-purple-500',
  [Category.COMERCIO_EXTERIOR]: 'bg-orange-100 text-orange-800 border-orange-500',
};

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.ADUANERA]: <Scale size={18} />,
  [Category.CAMBIARIA]: <RefreshCw size={18} />,
  [Category.TRIBUTARIA]: <FileText size={18} />,
  [Category.COMERCIO_EXTERIOR]: <Globe size={18} />,
};