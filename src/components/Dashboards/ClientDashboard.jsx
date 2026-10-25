import { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Clock,
  MessageSquare,
  Pause,
  Play,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RankIcon from '../RankIcon';
import OrderChatModal from './OrderChatModal';

export default function ClientDashboard({ onNavigateToBoosting }) {
  const { user, token } = useAuth();
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatOrder, setSelectedChatOrder] = useState(null);
  const [showCredentials, setShowCredentials] = useState({});

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setActiveOrders(data.active || []);
        setCompletedOrders(data.completed || []);
      }
    } catch (err) {
      console.error('Error fetching client orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 6000);
    return () => clearInterval(interval);
  }, [token]);

  const togglePause = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/toggle-pause`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Error toggling pause:', err);
    }
  };

  const toggleCreds = (orderId) => {
    setShowCredentials((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  return (
    <div className="w-full space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Header Profil Client */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-rose-500/25 bg-[#120d15]/90 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-900 via-rose-950 to-[#120d15] border border-rose-500/40 flex items-center justify-center text-2xl font-black text-rose-300 shadow-lg shadow-rose-950/60">
            {user?.name?.[0]?.toUpperCase() || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h2 className="text-2xl font-black text-white">{user?.name}</h2>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 font-bold">
                Client Vérifié
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-3">
              <span>{user?.email}</span>
              {user?.discordTag && (
                <span className="text-rose-400 font-mono">Discord : {user.discordTag}</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToBoosting}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-950/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Zap size={15} className="fill-white" />
            <span>Nouveau Boost</span>
          </button>
        </div>
      </div>

      {/* 2. SECTION: Mes Commandes en cours */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-rose-900/20 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="text-xl font-black text-white tracking-tight">
              Mes Commandes en cours
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-300">
              {activeOrders.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Chargement de vos commandes...</div>
        ) : activeOrders.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center border border-rose-500/20 bg-[#120d15]/60 flex flex-col items-center justify-center space-y-4">
            <Clock className="w-12 h-12 text-rose-500/30" />
            <h4 className="text-lg font-bold text-white">Aucune commande en cours</h4>
            <p className="text-xs text-slate-400 max-w-md">
              Vous n'avez pas de commande active actuellement. Lancez votre ascension dès maintenant avec nos boosters Challenger.
            </p>
            <button
              onClick={onNavigateToBoosting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider"
            >
              Calculer mon premier Boost
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {activeOrders.map((order) => {
              const isPaused = order.status === 'PAUSED';
              const isClaimed = !!order.booster;

              return (
                <div
                  key={order.id}
                  className="glass-card rounded-2xl p-6 sm:p-7 border border-rose-500/30 bg-[#120d15]/95 shadow-2xl relative overflow-hidden space-y-6"
                >
                  {/* Top Bar: Code, Status & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-rose-900/20">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-mono font-black text-white px-3 py-1 rounded-lg bg-rose-950/80 border border-rose-500/40 shadow-sm">
                        {order.orderCode}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {order.server} • {order.queue}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Live Booster Status */}
                      {isClaimed ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Booster assigné : {order.booster?.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
                          <Clock size={12} className="animate-spin" />
                          <span>En attente de prise en charge</span>
                        </div>
                      )}

                      {/* Pause / Resume Button */}
                      <button
                        onClick={() => togglePause(order.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer ${
                          isPaused
                            ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                            : 'bg-rose-950/70 border-rose-500/40 text-rose-300 hover:bg-rose-900/50'
                        }`}
                      >
                        {isPaused ? <Play size={13} /> : <Pause size={13} />}
                        <span>{isPaused ? 'Reprendre' : 'Mettre en pause'}</span>
                      </button>

                      {/* Open Chat Button */}
                      <button
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'instant' });
                          setSelectedChatOrder(order);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-rose-950/50 cursor-pointer"
                      >
                        <MessageSquare size={13} />
                        <span>Chat en direct</span>
                        {order._count?.messages > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[10px] font-black">
                            {order._count.messages}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Middle Area: Progression Visuelle des Rangs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-4 rounded-xl bg-[#0e0912]/80 border border-rose-500/15">
                    {/* Depart */}
                    <div className="flex items-center gap-3">
                      <RankIcon tier={order.currentTier} size={54} />
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 uppercase block">Rang initial</span>
                        <span className="text-base font-black text-white">
                          {order.currentTier} {order.currentDivision}
                        </span>
                        <span className="text-xs text-slate-500 font-mono block">{order.currentLp} LP</span>
                      </div>
                    </div>

                    {/* Progression en Direct */}
                    <div className="flex flex-col items-center justify-center border-y md:border-y-0 md:border-x border-rose-900/20 py-3 md:py-0 px-4 text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Flame className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold text-rose-300 font-mono">EN DIRECT SUR VOTRE COMPTE</span>
                      </div>
                      <div className="flex items-center gap-2 text-lg font-black text-white">
                        <span className="text-emerald-400">
                          {order.liveTier} {order.liveDivision || ''}
                        </span>
                        <span className="text-xs font-mono text-slate-400">({order.liveLp} LP)</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          +{order.winsCount}V
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-500/30">
                          -{order.lossesCount}D
                        </span>
                      </div>
                    </div>

                    {/* Cible */}
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-right">
                        <span className="text-[11px] font-mono text-slate-400 uppercase block">Objectif Final</span>
                        <span className="text-base font-black text-white">
                          {order.targetTier} {order.targetDivision}
                        </span>
                        <span className="text-xs text-rose-400 font-mono font-bold block">Garanti 100%</span>
                      </div>
                      <RankIcon tier={order.targetTier} size={54} />
                    </div>
                  </div>

                  {/* Preferences & Credentials accordion */}
                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-300 pt-2 border-t border-rose-900/20">
                    <div className="flex flex-wrap items-center gap-3">
                      <span>Flash sur : <strong className="text-white">{order.flashKey}</strong></span>
                      <span>•</span>
                      <span>Rôles : <strong className="text-white">{order.favoriteRoles || 'Tous'}</strong></span>
                      <span>•</span>
                      <span>Champions : <strong className="text-white">{order.favoriteChampions || 'Optimaux'}</strong></span>
                      <span>•</span>
                      <span>Mode hors-ligne : <strong className="text-emerald-400">Actif</strong></span>
                    </div>

                    <button
                      onClick={() => toggleCreds(order.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer underline"
                    >
                      <Lock size={12} />
                      <span>{showCredentials[order.id] ? 'Masquer identifiants' : 'Identifiants Riot enregistrés'}</span>
                    </button>
                  </div>

                  {/* Credentials display */}
                  {showCredentials[order.id] && (
                    <div className="p-3 rounded-xl bg-black/60 border border-rose-500/20 text-xs font-mono text-slate-300 flex items-center justify-between animate-fade-in">
                      <div>
                        <span className="text-slate-500">Identifiant LoL : </span>
                        <strong className="text-white">
                          {order.accountLogin
                            ? order.accountLogin.length > 4
                              ? `${order.accountLogin.slice(0, 3)}••••••`
                              : '••••••••'
                            : 'Non renseigné'}
                        </strong>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                        Chiffrement RSA-2048 Actif
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. SECTION: Mes Commandes terminées (en dessous) */}
      <section className="space-y-4 pt-6">
        <div className="flex items-center justify-between border-b border-rose-900/20 pb-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-black text-white tracking-tight">
              Mes Commandes terminées
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/30 text-slate-300">
              {completedOrders.length}
            </span>
          </div>
        </div>

        {completedOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            Aucune commande terminée pour l'instant.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedOrders.map((order) => (
              <div
                key={order.id}
                className="glass-card rounded-xl p-5 border border-rose-500/20 bg-[#120d15]/80 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white px-2.5 py-0.5 rounded bg-rose-950/60 border border-rose-500/30">
                      {order.orderCode}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Succès Garanti
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {order.completedAt ? new Date(order.completedAt).toLocaleDateString() : 'Terminé'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-y border-rose-900/20">
                  <div className="flex items-center gap-2">
                    <RankIcon tier={order.currentTier} size={36} />
                    <span className="text-xs text-slate-300 font-bold">
                      {order.currentTier} {order.currentDivision}
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-rose-500" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400 font-bold">
                      {order.targetTier} {order.targetDivision}
                    </span>
                    <RankIcon tier={order.targetTier} size={36} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Montant réglé : <strong className="text-white">{order.totalPrice.toFixed(2)} €</strong></span>
                  <span className="text-emerald-400 font-bold">Winrate : 100%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Chat Modal when triggered */}
      {selectedChatOrder && (
        <OrderChatModal
          isOpen={!!selectedChatOrder}
          onClose={() => setSelectedChatOrder(null)}
          order={selectedChatOrder}
        />
      )}
    </div>
  );
}
