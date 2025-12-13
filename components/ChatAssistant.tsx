import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Sparkles } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Hola! Soy tu asistente legal de NuevasNormas. ¿Tienes dudas sobre regulación aduanera, cambiaria o tributaria hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    // Update state immediately to show user message
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Create history including the current user message for better context
      const historyStrings = [
        ...messages.map(m => `${m.role === 'user' ? 'Usuario' : 'Bot'}: ${m.text}`),
        `Usuario: ${userMsg.text}`
      ].slice(-10); // Keep last 10 interactions
      
      const responseText = await sendMessageToGemini(userMsg.text, historyStrings);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Lo siento, hubo un error de conexión.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center gap-2 group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium">
          Asistente IA
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col border border-slate-200 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-800 text-white p-4 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-600 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Asistente NuevasNormas</h3>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              En línea
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleChat} className="text-slate-300 hover:text-white transition-colors">
            <Minimize2 size={18} />
          </button>
          <button onClick={toggleChat} className="text-slate-300 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              } ${msg.isError ? 'border-red-500 bg-red-50' : ''}`}
            >
              {msg.role === 'model' ? (
                 <div className="markdown-content prose prose-sm max-w-none prose-slate">
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                 </div>
              ) : (
                msg.text
              )}
              <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-slate-300' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-200 bg-white rounded-b-xl">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pregunta sobre una norma..."
            className="w-full pl-4 pr-12 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-teal-600 hover:bg-teal-50 rounded-md transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-[10px] text-center text-slate-400 mt-2">
          La IA puede cometer errores. Verifica con la fuente oficial.
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;