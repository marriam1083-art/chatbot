import React, { useState } from 'react';
import { sendChatMessage } from './ApiService';

export default function App() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [contextChunks, setContextChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const samplePrompts = [
    "What backend framework and vector database are used?",
    "Explain photosynthesis and its overall equation.",
    "How does CORS work in FastAPI?",
    "Solve the equation: 2x + 10 = 24"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || question;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const data = await sendChatMessage(query);
      const botMsg = { 
        sender: 'bot', 
        text: data.answer || "No response received.", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages((prev) => [...prev, botMsg]);
      
      if (data.context_chunks && data.context_chunks.length > 0) {
        setContextChunks(data.context_chunks);
        setDrawerOpen(true);
      } else {
        setContextChunks([]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Connection Error: Please ensure Uvicorn backend server is running.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#080B12] text-[#F8FAFC] font-sans overflow-hidden">
      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-full bg-[#080B12]">
        
        {/* TOP HEADER */}
        <header className="px-8 py-4 border-b border-[#38BDF8]/20 bg-[#151A24] flex justify-between items-center z-10 shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#38BDF8] to-[#A78BFA] flex items-center justify-center font-bold text-[#080B12] shadow-lg shadow-[#38BDF8]/20 text-xl">
              ⚡
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-[#38BDF8] via-[#A78BFA] to-[#F8FAFC] bg-clip-text text-transparent">
                CodeLore AI
              </h1>
              <p className="text-xs text-[#94A3B8] font-medium">Architectural & Knowledge Studio</p>
            </div>
          </div>

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-[#38BDF8] text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <span>📚 Sources</span>
            {contextChunks.length > 0 && (
              <span className="bg-[#38BDF8] text-[#080B12] text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
                {contextChunks.length}
              </span>
            )}
          </button>
        </header>

        {/* MESSAGES CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#151A24]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto px-4">
              <div className="w-20 h-20 rounded-3xl bg-[#151A24] border-2 border-[#38BDF8]/40 flex items-center justify-center text-4xl mb-6 text-[#38BDF8] shadow-xl shadow-[#38BDF8]/10">
                ✨
              </div>
              <h2 className="text-3xl font-extrabold text-[#F8FAFC] mb-3">Welcome to CodeLore</h2>
              <p className="text-sm text-[#94A3B8] mb-10 leading-relaxed">
                Your elite assistant for project architecture, general knowledge, math, and technical documentation.
              </p>

              {/* QUICK PROMPTS */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {samplePrompts.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(promptText)}
                    className="p-4 rounded-xl bg-[#151A24] hover:bg-[#151A24]/80 border border-[#38BDF8]/20 hover:border-[#38BDF8] text-xs text-[#CBD5E1] hover:text-[#38BDF8] transition-all shadow flex items-start space-x-3 group"
                  >
                    <span className="text-[#38BDF8] group-hover:scale-110 transition-transform">💡</span>
                    <span className="font-medium">{promptText}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-3xl px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-lg border ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#38BDF8] to-[#A78BFA] text-[#080B12] rounded-br-none font-semibold shadow-[#38BDF8]/10 border-transparent'
                      : 'bg-[#151A24] border-[#38BDF8]/20 text-[#F8FAFC] rounded-bl-none shadow-black/50'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[10px] text-[#64748B] mt-1.5 px-2 font-mono">{msg.time}</span>
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center space-x-3 text-[#38BDF8] text-sm font-medium bg-[#151A24] w-max px-5 py-3 rounded-full border border-[#38BDF8]/30 shadow-lg animate-pulse">
              <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-ping"></div>
              <span>CodeLore is processing...</span>
            </div>
          )}
        </div>

        {/* INPUT BOX */}
        <div className="p-5 bg-[#151A24] border-t border-[#38BDF8]/20 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-4 max-w-5xl mx-auto"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask questions about architecture, math, or science..."
              className="flex-1 bg-[#080B12] border border-[#38BDF8]/30 focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 rounded-full px-6 py-3.5 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-gradient-to-r from-[#38BDF8] to-[#A78BFA] hover:from-[#38BDF8]/90 hover:to-[#A78BFA]/90 disabled:opacity-40 text-[#080B12] font-extrabold px-8 py-3.5 rounded-full text-sm shadow-md shadow-[#38BDF8]/20 transition-all duration-300 active:scale-95 flex items-center space-x-2"
            >
              <span>Send</span>
              <span>🚀</span>
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE DRAWER FOR SOURCES */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-[#151A24] border-l border-[#38BDF8]/20 backdrop-blur-xl transition-transform duration-300 z-50 flex flex-col shadow-2xl ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-[#38BDF8]/20 flex justify-between items-center bg-[#080B12]">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">📂</span>
            <h3 className="font-bold text-sm text-[#38BDF8]">Retrieved Sources</h3>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-[#94A3B8] hover:text-[#38BDF8] text-lg font-bold p-1.5 rounded-lg hover:bg-[#151A24] transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-[#080B12]">
          {contextChunks.length === 0 ? (
            <div className="text-center text-xs text-[#64748B] py-12 px-5 font-mono">
              // General Knowledge Query<br/>// No Vector Sources Retrieved
            </div>
          ) : (
            contextChunks.map((chunk, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#080B12] border border-[#38BDF8]/20 text-xs space-y-2.5 hover:border-[#38BDF8]/50 transition shadow-sm"
              >
                <div className="flex justify-between items-center text-[#38BDF8] font-mono text-[11px] pb-2.5 border-b border-[#38BDF8]/10">
                  <span className="truncate max-w-[200px] font-semibold">{chunk.source || 'Doc'}</span>
                  {chunk.score && (
                    <span className="bg-[#38BDF8]/10 text-[#38BDF8] px-2.5 py-1 rounded text-[10px] font-bold border border-[#38BDF8]/20">
                      {(chunk.score * 100).toFixed(1)}% match
                    </span>
                  )}
                </div>
                <p className="text-[#94A3B8] leading-relaxed font-mono whitespace-pre-wrap text-[11px]">
                  {chunk.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}