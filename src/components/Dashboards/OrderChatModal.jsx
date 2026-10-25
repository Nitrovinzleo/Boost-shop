import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Shield, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function OrderChatModal({ isOpen, onClose, order }) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const fetchMessages = async (isInitial = false) => {
    if (!order?.id || !token) return;
    try {
      const res = await fetch(`/api/chat/${order.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const incoming = data.messages || [];

        setMessages((prev) => {
          // If no new messages, return same state reference to avoid re-renders & unwanted scroll
          if (
            prev.length === incoming.length &&
            prev[prev.length - 1]?.id === incoming[incoming.length - 1]?.id
          ) {
            return prev;
          }

          // Only scroll if initial opening or if user is already at the bottom
          const container = chatContainerRef.current;
          const isNearBottom = container
            ? container.scrollHeight - container.scrollTop - container.clientHeight < 120
            : true;

          if (isInitial || isNearBottom) {
            setTimeout(() => scrollToBottom(isInitial ? 'instant' : 'smooth'), 60);
          }

          return incoming;
        });
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    if (isOpen && order?.id) {
      fetchMessages(true);
      const interval = setInterval(() => fetchMessages(false), 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen, order?.id, token]);

  // Lock background body scroll when modal is open, unlock on unmount/close
  useEffect(() => {
    if (!isOpen) return;

    // Rescroll page to top BEFORE locking scroll as requested by user
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading || !order?.id) return;

    const content = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch(`/api/chat/${order.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setTimeout(() => scrollToBottom('smooth'), 50);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overscroll-none select-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-2xl h-[580px] max-h-[85vh] -translate-y-4 sm:-translate-y-7 rounded-2xl flex flex-col border border-rose-500/30 shadow-2xl overflow-hidden bg-[#100b14]/95"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-500/20 bg-[#160f1b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center">
              <Shield className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  Discussion Commande <span className="font-mono text-rose-400">{order.orderCode}</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Chiffré & Privé
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {order.currentTier} {order.currentDivision} ➔ {order.targetTier} {order.targetDivision} ({order.server})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-rose-950/40 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="px-4 py-2 bg-rose-950/30 border-b border-rose-500/10 text-[11px] text-slate-300 flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          <span>
            Ne partagez jamais vos mots de passe personnels dans le chat. Le booster a déjà accès aux identifiants chiffrés.
          </span>
        </div>

        {/* Messages List Area */}
        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 text-rose-500/40" />
              <p className="text-sm">Aucun message pour le moment.</p>
              <p className="text-xs max-w-xs">Envoyez un message pour communiquer directement avec votre intervenant.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              const isBooster = msg.senderRole === 'BOOSTER';
              const isAdmin = msg.senderRole === 'ADMIN';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 font-mono">
                    <span className={`font-semibold ${isAdmin ? 'text-amber-300 font-bold' : 'text-slate-300'}`}>
                      {isMe ? (isAdmin ? 'Vous (Admin)' : 'Vous') : msg.sender?.name || (isAdmin ? 'Support Admin' : 'Intervenant')}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                        isAdmin
                          ? 'bg-amber-400 text-slate-950 border border-amber-300 shadow-sm'
                          : isBooster
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isAdmin ? '🛡️ ADMIN' : msg.senderRole}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isAdmin
                        ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-semibold shadow-lg shadow-amber-950/40 border border-yellow-200/80 ' +
                          (isMe ? 'rounded-tr-xs' : 'rounded-tl-xs')
                        : isMe
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-tr-xs shadow-md shadow-rose-950/50'
                        : 'bg-[#1b1422] border border-rose-500/20 text-slate-200 rounded-tl-xs shadow-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-rose-500/20 bg-[#160f1b] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Écrivez un message..."
            className="flex-1 bg-[#0d0912] border border-rose-500/25 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-rose-950/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>Envoyer</span>
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
