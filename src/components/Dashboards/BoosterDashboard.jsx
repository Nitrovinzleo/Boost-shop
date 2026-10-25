import { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Wallet,
  Shield,
  Clock,
  Play,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Minus,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RankIcon from '../RankIcon';
import OrderChatModal from './OrderChatModal';

export default function BoosterDashboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('mission'); // 'mission', 'market', 'wallet'
  const [activeOrders, setActiveOrders] = useState([]);
  const [marketOrders, setMarketOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChatOrder, setSelectedChatOrder] = useState(null);
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [showLogin, setShowLogin] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [copiedField, setCopiedField] = useState(null); // 'login' or 'password'
  const [payoutForm, setPayoutForm] = useState({ amount: '', method: 'PAYPAL', destination: '' });
  const [payoutMsg, setPayoutMsg] = useState(null);

  const handleCopy = async (text, field) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatTruncated = (val) => {
    if (!val) return 'Non renseigné';
    if (val.length <= 4) return '••••••••';
    return `${val.slice(0, 3)}••••••`;
  };

  const fetchBoosterData = async () => {
    if (!token) return;
    try {
      const [activeRes, marketRes, walletRes] = await Promise.all([
        fetch('/api/booster/active', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/booster/pool', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/booster/wallet', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (activeRes.ok) {
        const d = await activeRes.json();
        setActiveOrders(d.orders || []);
      }
      if (marketRes.ok) {
        const d = await marketRes.json();
        setMarketOrders(d.orders || []);
      }
      if (walletRes.ok) {
        const d = await walletRes.json();
        setWallet(d.wallet);
      }
    } catch (err) {
      console.error('Error fetching booster data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoosterData();
    const interval = setInterval(fetchBoosterData, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const handleClaimOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/booster/claim/${orderId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        fetchBoosterData();
        setActiveTab('mission');
      } else {
        alert(data.error || 'Erreur lors de la prise de commande');
      }
    } catch (err) {
      console.error('Claim error:', err);
    }
  };

  const handleUpdateProgress = async (orderId, updates) => {
    try {
      const res = await fetch(`/api/booster/progress/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchBoosterData();
      }
    } catch (err) {
      console.error('Progress error:', err);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    if (!window.confirm('Confirmez-vous que le rang cible a été atteint et que la commande est terminée ?')) {
      return;
    }
    try {
      const res = await fetch(`/api/booster/complete/${orderId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchBoosterData();
      }
    } catch (err) {
      console.error('Complete error:', err);
    }
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/booster/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payoutForm),
      });
      const data = await res.json();
      if (res.ok) {
        setPayoutMsg({ type: 'success', text: data.message });
        setPayoutForm({ amount: '', method: 'PAYPAL', destination: '' });
        fetchBoosterData();
      } else {
        setPayoutMsg({ type: 'error', text: data.error });
      }
    } catch (err) {
      setPayoutMsg({ type: 'error', text: 'Erreur réseau' });
    }
  };

  const toggleOnline = async () => {
    try {
      await fetch('/api/booster/toggle-online', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBoosterData();
    } catch (err) {
      console.error('Online toggle error:', err);
    }
  };

  const activeMission =
    (selectedMissionId && activeOrders.find((o) => o.id === selectedMissionId)) ||
    activeOrders[0] ||
    null;

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Header Profil Booster & Stats */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-rose-500/25 bg-[#120d15]/90 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 via-rose-700 to-rose-950 border border-amber-500/40 flex items-center justify-center text-white shadow-lg shadow-rose-950/60">
            <Trophy className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h2 className="text-2xl font-black text-white">{user?.name}</h2>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold">
                Booster Certifié Top 0.1%
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-3">
              <span>Rôle : <strong className="text-slate-200">{user?.boosterMainRole || 'Jungle'}</strong></span>
              <span>•</span>
              <span>Peak : <strong className="text-amber-400">{user?.boosterPeakRank || 'Challenger'}</strong></span>
              <span>•</span>
              <span className="text-slate-400 font-mono">Discord : {user?.discordTag}</span>
            </p>
          </div>
        </div>

        {/* Financial KPI pills & Availability Switch */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="px-4 py-2.5 rounded-xl bg-[#0e0912] border border-rose-500/20 text-right">
            <span className="text-[11px] font-mono text-slate-400 block">Solde Disponible</span>
            <span className="text-xl font-black text-gradient-fiery font-mono">
              {(wallet?.boosterBalance || user?.boosterBalance || 0).toFixed(2)} €
            </span>
          </div>

          <button
            onClick={toggleOnline}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              user?.boosterIsOnline
                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                : 'bg-[#1b1422] border-slate-700 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${user?.boosterIsOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{user?.boosterIsOnline ? 'En Service (Prêt)' : 'En Pause'}</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-rose-900/30 pb-2">
        <button
          onClick={() => setActiveTab('mission')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'mission'
              ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-rose-950/30'
          }`}
        >
          <Flame size={14} />
          <span>Ma Mission Active ({activeOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('market')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'market'
              ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-rose-950/30'
          }`}
        >
          <Sparkles size={14} />
          <span>Marketplace Commandes ({marketOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'wallet'
              ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-rose-950/30'
          }`}
        >
          <Wallet size={14} />
          <span>Portefeuille & Retraits</span>
        </button>
      </div>

      {/* 3. TAB 1: MA MISSION ACTIVE */}
      {activeTab === 'mission' && (
        <div className="space-y-6">
          {/* Multiple Active Orders Switcher */}
          {activeOrders.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs font-mono text-slate-400">Vos missions actives ({activeOrders.length}) :</span>
              {activeOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedMissionId(order.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    activeMission?.id === order.id
                      ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white border-rose-400 shadow-md'
                      : 'bg-[#140c18] border-rose-900/30 text-slate-400 hover:text-white'
                  }`}
                >
                  {order.orderCode} • {order.targetTier} {order.targetDivision}
                </button>
              ))}
            </div>
          )}

          {!activeMission ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-rose-500/20 bg-[#120d15]/60 flex flex-col items-center justify-center space-y-4">
              <Clock className="w-12 h-12 text-rose-500/30" />
              <h4 className="text-lg font-bold text-white">Aucune mission en cours</h4>
              <p className="text-xs text-slate-400 max-w-md">
                Vous n'avez pas de commande active pour l'instant. Consultez la marketplace pour prendre en charge une commande disponible.
              </p>
              <button
                onClick={() => setActiveTab('market')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Voir les Commandes Disponibles ({marketOrders.length})
              </button>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-rose-500/30 bg-[#120d15]/95 shadow-2xl space-y-6">
              {/* Mission Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-rose-900/20">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-black text-white px-3.5 py-1 rounded-lg bg-rose-950/90 border border-rose-500/40">
                    {activeMission.orderCode}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Mission en cours • Client : {activeMission.client?.name}</span>
                      {activeMission.client?.discordTag && (
                        <span className="text-xs text-rose-400 font-mono font-normal">
                          ({activeMission.client.discordTag})
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                      <span>Serveur : <strong className="text-slate-200">{activeMission.server}</strong></span>
                      <span>•</span>
                      <span>File : <strong className="text-slate-200">{activeMission.queue}</strong></span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                        Rang Souhaité : {activeMission.targetTier} {activeMission.targetDivision}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold">
                    Gains Nets : {activeMission.boosterPayout.toFixed(2)} €
                  </span>

                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'instant' });
                      setSelectedChatOrder(activeMission);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Chat Client</span>
                  </button>

                  <button
                    onClick={() => handleCompleteOrder(activeMission.id)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>Terminer la Commande</span>
                  </button>
                </div>
              </div>

              {/* Rangs & Objectif de la Commande */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-5 rounded-2xl bg-[#09060b] border border-rose-500/25 shadow-inner">
                {/* 1. Rang Initial */}
                <div className="flex items-center gap-3.5">
                  <RankIcon tier={activeMission.currentTier} size={52} />
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Rang Initial (Départ)</span>
                    <span className="text-base font-black text-white">
                      {activeMission.currentTier} {activeMission.currentDivision}
                    </span>
                    <span className="text-xs text-slate-500 font-mono block">{activeMission.currentLp || 0} LP au départ</span>
                  </div>
                </div>

                {/* 2. Progression Actuelle en Direct */}
                <div className="flex flex-col items-center justify-center border-y md:border-y-0 md:border-x border-rose-900/30 py-3 md:py-0 px-4 text-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-rose-300 font-mono uppercase tracking-wider">
                      Progression en Direct
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-black text-white">
                    <span className="text-emerald-400">
                      {activeMission.liveTier} {!['Master', 'Grandmaster', 'Challenger'].includes(activeMission.liveTier) ? activeMission.liveDivision || '' : ''}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-semibold">({activeMission.liveLp} LP)</span>
                  </div>
                  <div className="flex items-center gap-2.5 mt-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                      +{activeMission.winsCount} Victoires
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 font-bold">
                      -{activeMission.lossesCount} Défaites
                    </span>
                  </div>
                </div>

                {/* 3. Rang Souhaité (Objectif Client) */}
                <div className="flex items-center justify-between md:justify-end gap-3.5 p-3 rounded-xl bg-gradient-to-r from-amber-950/30 via-rose-950/40 to-rose-900/20 border border-amber-500/40 shadow-lg shadow-amber-950/20">
                  <div className="text-left md:text-right">
                    <div className="flex items-center md:justify-end gap-1.5">
                      <Trophy size={14} className="text-amber-400 animate-bounce" />
                      <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider font-bold">
                        Rang Souhaité (Objectif)
                      </span>
                    </div>
                    <span className="text-lg font-black text-gradient-fiery block">
                      {activeMission.targetTier} {activeMission.targetDivision}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold block">
                      Rémunération : +{activeMission.boosterPayout.toFixed(2)} €
                    </span>
                  </div>
                  <RankIcon tier={activeMission.targetTier} size={54} />
                </div>
              </div>

              {/* LoL Account Credentials Box (Stream-Safe & Copy-Paste ready) */}
              <div className="p-4 rounded-xl bg-[#09060b] border border-rose-500/25 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-inner">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <Lock size={15} className="text-rose-500" />
                  <span>Identifiants LoL Invocateur (Confidentiel & Sécurisé) :</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {/* 1. Login Item */}
                  <div className="flex items-center gap-2 bg-[#140c18] border border-rose-500/20 px-3 py-1.5 rounded-xl">
                    <span className="text-slate-400 text-[11px]">Login :</span>
                    <strong className="text-white font-mono tracking-wider">
                      {showLogin[activeMission.id]
                        ? activeMission.accountLogin || 'Non renseigné'
                        : formatTruncated(activeMission.accountLogin)}
                    </strong>
                    <div className="flex items-center gap-1 ml-1 border-l border-rose-900/30 pl-2">
                      <button
                        type="button"
                        onClick={() =>
                          setShowLogin((p) => ({ ...p, [activeMission.id]: !p[activeMission.id] }))
                        }
                        className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={showLogin[activeMission.id] ? 'Masquer' : 'Afficher'}
                      >
                        {showLogin[activeMission.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeMission.accountLogin, 'login')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          copiedField === 'login'
                            ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                            : 'bg-rose-950/70 border border-rose-500/30 text-rose-300 hover:bg-rose-900/80 hover:text-white'
                        }`}
                        title="Copier le login invocateur"
                      >
                        {copiedField === 'login' ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 2. Password Item */}
                  <div className="flex items-center gap-2 bg-[#140c18] border border-rose-500/20 px-3 py-1.5 rounded-xl">
                    <span className="text-slate-400 text-[11px]">Mot de passe :</span>
                    <strong className="text-white font-mono tracking-widest">
                      {showPassword[activeMission.id]
                        ? activeMission.accountPassword || '••••••••'
                        : '••••••••••••'}
                    </strong>
                    <div className="flex items-center gap-1 ml-1 border-l border-rose-900/30 pl-2">
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((p) => ({ ...p, [activeMission.id]: !p[activeMission.id] }))
                        }
                        className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={showPassword[activeMission.id] ? 'Masquer' : 'Afficher'}
                      >
                        {showPassword[activeMission.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeMission.accountPassword, 'password')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          copiedField === 'password'
                            ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                            : 'bg-rose-950/70 border border-rose-500/30 text-rose-300 hover:bg-rose-900/80 hover:text-white'
                        }`}
                        title="Copier le mot de passe"
                      >
                        {copiedField === 'password' ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/25">
                  VPN {activeMission.server} Exigé
                </span>
              </div>

              {/* Direct Match Progression Controller */}
              <div className="p-5 rounded-2xl bg-[#0e0912] border border-rose-500/20 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-rose-900/20">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <TrendingUp size={16} className="text-rose-500" />
                    <span>Console de Progression du Match en Direct</span>
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200">
                    <span className="text-slate-400">Objectif à atteindre :</span>
                    <strong className="text-amber-300 font-bold">{activeMission.targetTier} {activeMission.targetDivision}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Wins / Losses buttons */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#140c18] border border-rose-500/15">
                    <div className="flex-1">
                      <span className="text-xs text-slate-400 block mb-1 font-mono">Victoires ({activeMission.winsCount})</span>
                      <button
                        onClick={() => handleUpdateProgress(activeMission.id, { winsCount: activeMission.winsCount + 1 })}
                        className="w-full py-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>+1 Victoire</span>
                      </button>
                    </div>

                    <div className="flex-1">
                      <span className="text-xs text-slate-400 block mb-1 font-mono">Défaites ({activeMission.lossesCount})</span>
                      <button
                        onClick={() => handleUpdateProgress(activeMission.id, { lossesCount: activeMission.lossesCount + 1 })}
                        className="w-full py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 font-bold text-xs uppercase flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>+1 Défaite</span>
                      </button>
                    </div>
                  </div>

                  {/* Division update selector */}
                  <div className="p-4 rounded-xl bg-[#140c18] border border-rose-500/15 space-y-2">
                    <span className="text-xs text-slate-400 block font-mono">Palier & Division Actuels</span>
                    <div className="flex gap-2">
                      <select
                        value={activeMission.liveTier}
                        onChange={(e) => handleUpdateProgress(activeMission.id, { liveTier: e.target.value })}
                        className="flex-1 bg-[#0d0912] border border-rose-500/30 rounded-lg px-2 py-1.5 text-xs text-white"
                      >
                        {['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger'].map(
                          (tier) => (
                            <option key={tier} value={tier}>
                              {tier}
                            </option>
                          )
                        )}
                      </select>

                      {!['Master', 'Grandmaster', 'Challenger'].includes(activeMission.liveTier) && (
                        <select
                          value={activeMission.liveDivision || 'IV'}
                          onChange={(e) => handleUpdateProgress(activeMission.id, { liveDivision: e.target.value })}
                          className="w-20 bg-[#0d0912] border border-rose-500/30 rounded-lg px-2 py-1.5 text-xs text-white"
                        >
                          {['IV', 'III', 'II', 'I'].map((div) => (
                            <option key={div} value={div}>
                              {div}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  {/* LP Updater */}
                  <div className="p-4 rounded-xl bg-[#140c18] border border-rose-500/15 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">Points de Ligue (LP) :</span>
                      <strong className="text-white text-sm">{activeMission.liveLp} LP</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={['Master', 'Grandmaster', 'Challenger'].includes(activeMission.liveTier) ? '1200' : '100'}
                      step="5"
                      value={activeMission.liveLp}
                      onChange={(e) => handleUpdateProgress(activeMission.id, { liveLp: e.target.value })}
                      className="w-full accent-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Order Specific Preferences */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-300">
                <div className="p-3 rounded-lg bg-[#0e0912] border border-rose-900/20">
                  <span className="text-slate-500 block">Flash Key</span>
                  <strong className="text-white text-sm">{activeMission.flashKey}</strong>
                </div>
                <div className="p-3 rounded-lg bg-[#0e0912] border border-rose-900/20">
                  <span className="text-slate-500 block">Rôles demandés</span>
                  <strong className="text-white text-sm">{activeMission.favoriteRoles || 'Libre'}</strong>
                </div>
                <div className="p-3 rounded-lg bg-[#0e0912] border border-rose-900/20">
                  <span className="text-slate-500 block">Champions préférés</span>
                  <strong className="text-white text-sm">{activeMission.favoriteChampions || 'Libre'}</strong>
                </div>
                <div className="p-3 rounded-lg bg-[#0e0912] border border-rose-900/20">
                  <span className="text-slate-500 block">Mode Hors-Ligne</span>
                  <strong className="text-emerald-400 text-sm">Obligatoire</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: MARKETPLACE DES COMMANDES DISPONIBLES */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-rose-900/20 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span>Pool des Commandes en Attente de Prise en Charge</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {marketOrders.length} commande(s) prête(s)
            </span>
          </div>

          {marketOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Toutes les commandes sont actuellement attribuées. Revenez d'ici quelques minutes !
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketOrders.map((order) => (
                <div
                  key={order.id}
                  className="glass-card rounded-2xl p-6 border border-rose-500/25 bg-[#120d15]/90 flex flex-col justify-between space-y-5 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold text-white px-3 py-1 rounded-lg bg-rose-950/80 border border-rose-500/40">
                      {order.orderCode}
                    </span>
                    <span className="text-lg font-mono font-black text-emerald-400">
                      +{order.boosterPayout.toFixed(2)} €
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e0912] border border-rose-500/15">
                    <div className="flex items-center gap-2">
                      <RankIcon tier={order.currentTier} size={42} />
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono block">Départ</span>
                        <span className="text-xs font-bold text-white">
                          {order.currentTier} {order.currentDivision}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-rose-500" />
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono block">Objectif</span>
                        <span className="text-xs font-bold text-white">
                          {order.targetTier} {order.targetDivision}
                        </span>
                      </div>
                      <RankIcon tier={order.targetTier} size={42} />
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-400 space-y-1">
                    <div>Serveur : <strong className="text-slate-200">{order.server}</strong> ({order.queue})</div>
                    <div>Flash : <strong className="text-white">{order.flashKey}</strong> • Rôles : <strong className="text-white">{order.favoriteRoles || 'Libre'}</strong></div>
                  </div>

                  <button
                    onClick={() => handleClaimOrder(order.id)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
                  >
                    <Zap size={14} className="fill-white" />
                    <span>Prendre en Charge la Commande</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: PORTEFEUILLE & RETRAITS */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Request Payout Form */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-rose-500/25 bg-[#120d15]/90 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wallet size={18} className="text-rose-400" />
              <span>Demander un Virement de Gains</span>
            </h3>

            {payoutMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-mono ${
                  payoutMsg.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                }`}
              >
                {payoutMsg.text}
              </div>
            )}

            <form onSubmit={handleRequestPayout} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Montant souhaité (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="20"
                  max={wallet?.boosterBalance || 0}
                  value={payoutForm.amount}
                  onChange={(e) => setPayoutForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder={`Max : ${(wallet?.boosterBalance || 0).toFixed(2)} €`}
                  className="w-full bg-[#0d0912] border border-rose-500/30 rounded-xl px-4 py-2.5 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Mode de Réception</label>
                <select
                  value={payoutForm.method}
                  onChange={(e) => setPayoutForm((p) => ({ ...p, method: e.target.value }))}
                  className="w-full bg-[#0d0912] border border-rose-500/30 rounded-xl px-4 py-2.5 text-xs text-white"
                >
                  <option value="PAYPAL">PayPal (Immédiat)</option>
                  <option value="SEPA">Virement Bancaire SEPA (IBAN)</option>
                  <option value="CRYPTO">Crypto USDT (Réseau TRC20 / Polygon)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Coordonnées de Réception</label>
                <input
                  type="text"
                  value={payoutForm.destination}
                  onChange={(e) => setPayoutForm((p) => ({ ...p, destination: e.target.value }))}
                  placeholder="Email PayPal, IBAN ou adresse USDT..."
                  className="w-full bg-[#0d0912] border border-rose-500/30 rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!payoutForm.amount || (wallet?.boosterBalance || 0) <= 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold uppercase tracking-wider text-xs shadow-lg disabled:opacity-40 cursor-pointer"
              >
                Valider la demande de virement
              </button>
            </form>
          </div>

          {/* Right: History */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-rose-500/25 bg-[#120d15]/90 space-y-4">
            <h3 className="text-base font-bold text-white">Historique de vos Retraits</h3>
            {(!wallet?.payouts || wallet.payouts.length === 0) ? (
              <p className="text-xs text-slate-500 font-mono py-8 text-center">Aucune demande de virement effectuée.</p>
            ) : (
              <div className="space-y-3">
                {wallet.payouts.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl bg-[#0e0912] border border-rose-500/15 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-white block text-sm">+{p.amount.toFixed(2)} €</span>
                      <span className="text-slate-500">{p.method} • {p.destination}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'APPROVED'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : p.status === 'REJECTED'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                    }`}>
                      {p.status === 'APPROVED' ? 'Payé' : p.status === 'REJECTED' ? 'Refusé' : 'En attente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
