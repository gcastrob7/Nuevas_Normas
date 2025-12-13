import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Eres "NormaBot", un asistente virtual experto en regulación colombiana especializado en cuatro áreas: 
1. Regulación Aduanera (Estatuto Aduanero, Decretos, Conceptos DIAN).
2. Regulación Cambiaria (Normas del Banco de la República, DCIN-83).
3. Regulación Tributaria (Estatuto Tributario, Reformas recientes).
4. Comercio Exterior (Acuerdos comerciales, MinCIT, VUCE).

Tu objetivo es ayudar a abogados, contadores y gerentes de comercio exterior.
- Responde de manera profesional, precisa y concisa.
- Cita siempre la norma si es posible (ej. "Según el Decreto 1165 de 2016...").
- Si no sabes la respuesta o es un tema fuera de estas áreas, indícalo amablemente.
- Estructura tus respuestas usando Markdown para mejor legibilidad.
`;

export const sendMessageToGemini = async (message: string, history: string[] = []): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct prompt with history context limited to last few messages for efficiency
    // In a real app, use the ChatSession API, but for this stateless example we append context simply
    const prompt = `Historial de chat:\n${history.join('\n')}\n\nUsuario: ${message}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || "Lo siento, no pude generar una respuesta en este momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocurrió un error al consultar el asistente. Por favor intenta más tarde.";
  }
};