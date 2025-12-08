import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, FileSpreadsheet } from 'lucide-react';
import { askGemini } from '../services/geminiService';
import { ChatMessage, LoadingState } from '../types';
import { triggerHaptic, focusClasses } from '../utils/ui';
import { hasMarkdownTable, convertMarkdownTableToCSV, downloadCSV } from '../utils/csvExport';

const AskGemini: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    triggerHaptic();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    // Keep reference to history BEFORE adding the new message for the API call
    const currentHistory = [...messages];

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Pass the history and the new message
      const responseText = await askGemini(userMessage.text, currentHistory);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    triggerHaptic();
    setMessages([]);
  };

  const handleDownloadTable = (text: string, id: string) => {
    triggerHaptic();
    const csv = convertMarkdownTableToCSV(text);
    if (csv) {
      downloadCSV(csv, `gemini-table-${id}.csv`);
    }
  };

  return (
    <section aria-labelledby="chat-heading" className="flex flex-col h-[600px] bg-panel rounded-2xl border border-border shadow-sm overflow-hidden animate-fade-in transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-app/50">
        <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 id="chat-heading" className="font-bold text-body">Ask Gemini</h2>
        </div>
        {messages.length > 0 && (
            <button 
                onClick={clearChat}
                className={`p-2 text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${focusClasses}`}
                title="Clear conversation"
                aria-label="Clear conversation"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-app/20" role="log" aria-live="polite">
        {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 px-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-body mb-2">How can I help you today?</h3>
                <p className="text-sm text-muted max-w-xs">Ask me anything about software development, best practices, or industry trends.</p>
            </div>
        ) : (
            messages.map((msg) => {
              const showTableDownload = msg.role === 'model' && hasMarkdownTable(msg.text);
              
              return (
                <div
                    key={msg.id}
                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-panel border border-border text-primary'}`}>
                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        
                        <div 
                            className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                                msg.role === 'user' 
                                    ? 'bg-primary text-white rounded-tr-sm' 
                                    : 'bg-panel border border-border text-body rounded-tl-sm'
                            }`}
                        >
                            {msg.text}
                            
                            {showTableDownload && (
                              <button
                                onClick={() => handleDownloadTable(msg.text, msg.id)}
                                className="mt-4 flex items-center gap-2 text-xs font-semibold bg-app/50 hover:bg-app text-body border border-border/50 px-3 py-2 rounded-lg transition-all duration-200 w-full justify-center sm:w-auto"
                                title="Download table as CSV"
                              >
                                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                                Export to Excel
                              </button>
                            )}
                        </div>
                    </div>
                </div>
              );
            })
        )}
        {loading && (
             <div className="flex justify-start w-full">
                 <div className="flex gap-3 max-w-[75%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-panel border border-border text-primary flex items-center justify-center mt-1">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-panel border border-border p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-12">
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-panel border-t border-border">
        <form onSubmit={handleSubmit} className="relative">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className={`w-full bg-input border border-border text-body rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm disabled:opacity-50 placeholder:text-muted/60 ${focusClasses}`}
            />
            <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white transition-all ${
                    !input.trim() || loading 
                    ? 'bg-muted text-gray-200 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary-hover active:scale-95 shadow-md shadow-primary/20'
                } ${focusClasses}`}
                aria-label="Send message"
            >
                <Send className="w-4 h-4" />
            </button>
        </form>
      </div>
    </section>
  );
};

export default AskGemini;
