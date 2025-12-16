import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Phone, Mic, MicOff, ShieldCheck, Activity, Volume2, Languages, AlertCircle, RefreshCw } from 'lucide-react';

const Help: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<'es' | 'en'>('es');
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  
  // Logic Refs
  const isAudioStreamingAllowed = useRef<boolean>(false);

  // Initialize Gemini Client
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const disconnect = () => {
    if (sessionRef.current) {
        sessionRef.current = null;
    }

    // Stop Microphone Tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Stop Audio Processing Nodes
    if (processorRef.current && inputContextRef.current) {
      processorRef.current.disconnect();
      sourceRef.current?.disconnect();
      processorRef.current = null;
      sourceRef.current = null;
      if (inputContextRef.current.state !== 'closed') {
        inputContextRef.current.close();
      }
      inputContextRef.current = null;
    }

    // Stop Output Audio
    if (audioContextRef.current) {
      sourcesRef.current.forEach(source => source.stop());
      sourcesRef.current.clear();
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }

    setIsCallActive(false);
    setStatus('idle');
    nextStartTimeRef.current = 0;
    isAudioStreamingAllowed.current = false;
  };

  const startCall = async () => {
    // 1. Cleanup any previous state
    disconnect();
    
    setStatus('connecting');
    setErrorMessage(null);

    try {
      // 2. Initialize Audio Contexts (Must happen on user gesture)
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      // Force resume to unlock audio on browsers
      await outputCtx.resume();
      await inputCtx.resume();

      audioContextRef.current = outputCtx;
      inputContextRef.current = inputCtx;
      
      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);

      // 3. Get Microphone Stream with Echo Cancellation
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        } 
      });
      streamRef.current = stream;

      // 4. Define Connection Logic
      const connectToGemini = async () => {
        const config = {
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            systemInstruction: `
              You are "NormaBot", an expert AI assistant specialized in Colombian regulations (Customs, Tax, and Exchange).
              
              CRITICAL LANGUAGE INSTRUCTION:
              The user has explicitly selected ${preferredLanguage === 'es' ? 'SPANISH' : 'ENGLISH'}.
              You MUST speak and respond ONLY in ${preferredLanguage === 'es' ? 'SPANISH' : 'ENGLISH'}.
              
              PROTOCOL:
              1. Introduce yourself IMMEDIATELY in ${preferredLanguage === 'es' ? 'SPANISH' : 'ENGLISH'}.
              2. Do not wait for the user to speak first.
              3. Keep answers concise and professional.
            `,
          },
        };

        const sessionPromise = ai.live.connect({
          ...config,
          callbacks: {
            onopen: () => {
              console.log('Connection Established');
              setStatus('connected');
              setIsCallActive(true);
            },
            onmessage: async (message: LiveServerMessage) => {
              // Handle Audio Output
              const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (base64Audio) {
                 const ctx = audioContextRef.current;
                 if (!ctx) return;

                 if (nextStartTimeRef.current < ctx.currentTime) {
                    nextStartTimeRef.current = ctx.currentTime;
                 }

                 try {
                    const audioBuffer = await decodeAudioData(decode(base64Audio), ctx);
                    const source = ctx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputNode);
                    source.addEventListener('ended', () => sourcesRef.current.delete(source));
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    sourcesRef.current.add(source);
                 } catch (e) {
                    console.error("Audio decode error", e);
                 }
              }

              // Handle Interruption
              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(src => src.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onclose: () => {
              console.log('Session Closed');
              disconnect();
            },
            onerror: (err) => {
              console.error('Session Error:', err);
              // Only set error if we were already connected or connecting
              if (status !== 'idle') {
                  setErrorMessage('La conexión con el asistente se perdió. Por favor intente de nuevo.');
                  disconnect();
                  setStatus('error');
              }
            }
          }
        });

        return sessionPromise;
      };

      // 5. Execute Connection
      const session = await connectToGemini();
      sessionRef.current = session;

      // 6. IMMEDIATE TRIGGER: Send text to force model to speak
      // Improved triggers to ensure response in selected language
      const triggerText = preferredLanguage === 'es' 
        ? "Hola. Por favor preséntate ahora mismo." 
        : "Hello. Please introduce yourself right now in English.";
        
      await session.sendRealtimeInput({
        content: [{
            role: 'user',
            parts: [{ text: triggerText }]
        }]
      });

      // 7. SETUP MICROPHONE PIPELINE (Delayed)
      // We wait 1 second before connecting the mic to the model.
      // This "Physical Isolation" ensures ambient noise doesn't interrupt the bot's greeting.
      
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      
      sourceRef.current = source;
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!isAudioStreamingAllowed.current || isMuted) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = convertFloat32ToInt16(inputData);
        const base64Data = encode(pcmData);

        sessionRef.current.sendRealtimeInput({
            media: {
                mimeType: 'audio/pcm;rate=16000',
                data: base64Data
            }
        });
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);

      // Enable streaming after 1.5s delay
      setTimeout(() => {
        if (sessionRef.current) {
            isAudioStreamingAllowed.current = true;
            console.log("Microphone streaming enabled");
        }
      }, 1500);

    } catch (error: any) {
      console.error("Initialization Failed:", error);
      let msg = "No se pudo iniciar la llamada.";
      if (error.message?.includes("unavailable")) {
          msg = "El servicio está temporalmente saturado. Por favor intente en unos segundos.";
      } else if (error.name === 'NotAllowedError') {
          msg = "Se requiere permiso de micrófono para continuar.";
      }
      setErrorMessage(msg);
      setStatus('error');
      disconnect();
    }
  };

  // --- Audio Helpers ---

  function convertFloat32ToInt16(float32Array: Float32Array): Uint8Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return new Uint8Array(int16Array.buffer);
  }

  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  }

  useEffect(() => {
    return () => disconnect();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-nc-navy flex items-center gap-2">
          <Phone className="text-nc-teal" /> Centro de Ayuda
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Asistencia técnica y legal especializada en tiempo real.
        </p>
      </div>

      {/* Main Call Card */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nc-navy via-nc-teal to-nc-navy"></div>
        
        <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          
          {/* Status Icon */}
          <div className="mb-6 relative">
            {status === 'connected' ? (
              <div className="relative">
                <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-ping"></span>
                <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white shadow-xl relative z-10 transition-all duration-500">
                  <Activity size={40} className="animate-pulse" />
                </div>
              </div>
            ) : status === 'connecting' ? (
              <div className="w-24 h-24 border-4 border-slate-100 border-t-nc-teal rounded-full animate-spin"></div>
            ) : status === 'error' ? (
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-400 shadow-inner">
                 <AlertCircle size={40} />
              </div>
            ) : (
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shadow-inner">
                <Phone size={40} />
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {status === 'connected' ? (isAudioStreamingAllowed.current ? 'Escuchando...' : 'NormaBot Hablando...') : 
             status === 'connecting' ? 'Conectando servicio...' : 
             status === 'error' ? 'Conexión Interrumpida' :
             'Línea de Asistencia Normativa'}
          </h2>
          
          <p className="text-slate-500 max-w-md mb-8">
            {status === 'connected' 
              ? `Conversación activa en ${preferredLanguage === 'es' ? 'Español' : 'Inglés'}.` 
              : status === 'error' 
                ? 'Hubo un problema con el servicio de voz. Intente nuevamente.'
                : 'Seleccione su idioma de preferencia y conecte con nuestro asistente de IA especializado.'}
          </p>

          {/* Language Selector */}
          {!isCallActive && status !== 'connecting' && (
             <div className="flex justify-center gap-3 mb-8">
                <button 
                  onClick={() => setPreferredLanguage('es')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                    preferredLanguage === 'es' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-200' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">🇨🇴</span> Español
                </button>
                <button 
                  onClick={() => setPreferredLanguage('en')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                    preferredLanguage === 'en' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-200' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">🇺🇸</span> English
                </button>
             </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            {!isCallActive ? (
              <button 
                onClick={startCall}
                disabled={status === 'connecting'}
                className="flex items-center gap-3 bg-nc-navy text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'connecting' ? <RefreshCw className="animate-spin" size={24} /> : <Phone size={24} />}
                {status === 'error' ? 'Reintentar' : 'Iniciar Llamada'}
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-full transition-all border ${isMuted ? 'bg-red-100 text-red-600 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}
                  title={isMuted ? "Activar micrófono" : "Silenciar"}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                
                <button 
                  onClick={disconnect}
                  className="flex items-center gap-2 bg-red-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 active:scale-95"
                >
                  <Phone size={24} className="rotate-[135deg]" />
                  Finalizar
                </button>
              </>
            )}
          </div>

          {errorMessage && (
            <div className="mt-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Features Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Languages size={18} className="text-nc-teal" />
            <span>Soporte Bilingüe Activo</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <ShieldCheck size={18} className="text-nc-teal" />
            <span>Información Verificada y Neutral</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Volume2 size={18} className="text-nc-teal" />
            <span>Calidad de Voz HD</span>
          </div>
        </div>
      </div>

      {/* FAQ / Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-nc-navy mb-3">¿Qué puedo preguntar?</h3>
            <ul className="space-y-2 text-slate-600 text-sm list-disc pl-5">
                <li>Detalles sobre el Decreto 0125 de 2025.</li>
                <li>Tasas de cambio vigentes para hoy.</li>
                <li>Nuevas obligaciones tributarias para exportadores.</li>
                <li>Estado de funcionamiento del sistema VUCE.</li>
            </ul>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-nc-navy mb-3">Horario de Atención</h3>
            <p className="text-slate-600 text-sm mb-4">
                Nuestro asistente automatizado está disponible 24/7. Para atención con un asesor humano, nuestros horarios son:
            </p>
            <div className="flex justify-between text-sm">
                <span className="text-slate-500">Lunes a Viernes</span>
                <span className="font-medium text-slate-800">8:00 AM - 6:00 PM</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Help;