import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/shared/Shared';
import { ArrowLeft, Send, ShieldCheck, CheckCheck } from 'lucide-react';

export function ChatPage() {
  const { convId, otherId } = useParams();
  const { messages, sendMessage, customers, providers, currentUser } = useApp();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const otherUser = customers.find(c => c.id === otherId) || providers.find(p => p.id === otherId);
  const chatMessages = messages[convId || ''] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !convId || !currentUser || !otherId) return;

    sendMessage(convId, currentUser.id, otherId, text.trim());
    setText('');
  };

  if (!currentUser || !otherUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[#2c2621]">
        <h3 className="font-extrabold text-stone-900 text-sm">Conversation state or credentials missing.</h3>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
          ← Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-[#2c2621] h-[calc(105vh-160px)] flex flex-col justify-between animate-fade-in">
      
      {/* Header Info */}
      <div className="bg-white border border-stone-250/60 rounded-3xl p-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-stone-105 rounded-xl text-stone-400 hover:text-stone-800 transition-all focus:outline-none"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          
          <Avatar name={otherUser.name} size={40} />
          
          <div>
            <h4 className="font-extrabold text-stone-900 text-xs sm:text-sm leading-tight">
              {otherUser.name}
            </h4>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                {otherUser.role} • Specialized
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-150 text-[10.5px] font-bold">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>HomeEase Protected Chat</span>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto my-5 p-5 bg-stone-50 border border-stone-200 rounded-3xl flex flex-col gap-4">
        {chatMessages.length === 0 ? (
          <div className="m-auto text-center max-w-xs text-stone-400 text-xs space-y-1">
            <div className="text-3xl">💬</div>
            <p className="font-bold text-stone-800 text-sm">No historical messages here</p>
            <p className="font-semibold leading-relaxed">
              Introduce your service requirements and settle rates directly with {otherUser.name}!
            </p>
          </div>
        ) : (
          chatMessages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div 
                key={msg.id} 
                className={`max-w-[75%] rounded-2xl p-3.5 shadow-xs flex flex-col text-xs leading-relaxed font-semibold ${
                  isMe 
                    ? 'self-end bg-indigo-600 text-white rounded-br-none' 
                    : 'self-start bg-white border border-stone-200 text-stone-900 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-mono font-bold ${isMe ? 'text-indigo-200' : 'text-stone-405'}`}>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-indigo-305 shrink-0" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input controls form */}
      <form onSubmit={handleSend} className="bg-white border border-stone-200 rounded-3xl p-1.5 flex items-center gap-2 shadow-sm shrink-0">
        <input 
          type="text" 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder={`Type message to ${otherUser.name.split(' ')[0]}...`}
          className="flex-1 bg-transparent px-4 py-2.5 text-xs font-semibold focus:outline-none text-stone-900"
          required
        />
        <button 
          type="submit"
          disabled={!text.trim()}
          className="h-10 w-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md focus:outline-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
