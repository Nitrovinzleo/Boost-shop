import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RankIcon from '../RankIcon';
import OrderChatModal from './OrderChatModal';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'users', 'payouts'
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatOrder, setSelectedChatOrder] = useState(null);
  const [reassignModalOrder, setReassignModalOrder] = useState(null);
  const [modalSelectedBoosterId, setModalSelectedBoosterId] = useState('');
  const [inlineDrafts, setInlineDrafts] = useState({});
  const [savingReassign, setSavingReassign] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [disputePackageData, setDisputePackageData] = useState(null);
  const [disputeCopied, setDisputeCopied] = useState(false);

  const fetchAdminData = async () => {
    if (!token) return;
    try {
      const [metRes, ordRes, usrRes] = await Promise.all([
        fetch('/api/admin/metrics', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (metRes.ok) {
        const d = await metRes.json();
        setMetrics(d.metrics);
        setPendingPayouts(d.pendingPayouts || []);
      }
      if (ordRes.ok) {
        const d = await ordRes.json();
        setOrders(d.orders || []);
      }
      if (usrRes.ok) {
        const d = await usrRes.json();
        setUsers(d.users || []);
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 6000);
    return () => clearInterval(interval);
  }, [token]);

  const handleApproveBooster = async (userId, approved) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve-booster`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved }),
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Error approving booster:', err);
    }
  };

  const handleProcessPayout = async (payoutId, action) => {
    try {
      const res = await fetch(`/api/admin/payouts/${payoutId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Payout process error:', err);
    }
  };

  const handleSaveReassignment = async (orderId, targetBoosterId) => {
    setSavingReassign(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/reassign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ boosterId: targetBoosterId ? targetBoosterId.trim() : null }),
      });
      const data = await res.json();
      if (res.ok) {
        setInlineDrafts((prev) => {
          const next = { ...prev };
          delete next[orderId];
          return next;
        });
        setReassignModalOrder(null);
        setToastMsg('Réassignation enregistrée avec succès !');
        setTimeout(() => setToastMsg(null), 3000);
        fetchAdminData();
      } else {
        alert(data.error || 'Erreur lors de la réassignation');
      }
    } catch (err) {
      console.error('Reassign error:', err);
    } finally {
      setSavingReassign(false);
    }
  };

  const boosters = users.filter((u) => u.role === 'BOOSTER' || u.role === 'ADMIN');

  const handleOpenDisputePackage = async (orderId) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/dispute-package`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDisputePackageData(data);
      } else {
        alert('Erreur lors de la récupération du dossier litige');
      }
    } catch (err) {
      console.error('Error fetching dispute package:', err);
    }
  };

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Header Admin */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-rose-900/30">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-black text-white">Centre de Contrôle Administrateur</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Surveillance opérationnelle, modération des commandes et gestion financière Severum.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-rose-900/40 transition-colors cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-rose-500/20 bg-[#120d15]/90 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Volume Brut (GMV)</span>
          <div className="text-2xl font-black text-white font-mono">
            {metrics ? `${metrics.totalRevenue.toFixed(2)} €` : '...'}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Paiements validés</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-rose-500/20 bg-[#120d15]/90 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Marge Nette Severum (30%)</span>
          <div className="text-2xl font-black text-gradient-fiery font-mono">
            {metrics ? `${metrics.platformProfit.toFixed(2)} €` : '...'}
          </div>
          <span className="text-[10px] text-amber-400 font-mono">Revenu plateforme</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-rose-500/20 bg-[#120d15]/90 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Commandes Actives</span>
          <div className="text-2xl font-black text-white font-mono">
            {metrics?.activeOrdersCount ?? '...'}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {metrics?.completedOrdersCount ?? 0} finalisées avec succès
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-rose-500/20 bg-[#120d15]/90 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Roster Boosters</span>
          <div className="text-2xl font-black text-white font-mono">
            {metrics?.totalBoosters ?? '...'}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {metrics?.onlineBoosters ?? 0} en ligne en ce moment
          </span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-rose-900/30 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-rose-950/30'
          }`}
        >
          <Layers size={14} />
          <span>Toutes les Commandes ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-rose-950/30'
          }`}
        >
          <Users size={14} />
          <span>Gestion Utilisateurs ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'payouts'
              ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-rose-950/30'
          }`}
        >
          <DollarSign size={14} />
          <span>Virements en Attente ({pendingPayouts.length})</span>
        </button>
      </div>

      {/* 4. TAB 1: ALL ORDERS */}
      {activeTab === 'orders' && (
        <div className="glass-card rounded-2xl border border-rose-500/20 bg-[#120d15]/90 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#180f1e] text-slate-400 border-b border-rose-900/30">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Objectif</th>
                  <th className="p-4">Booster Assigné</th>
                  <th className="p-4">Progression Live</th>
                  <th className="p-4">Montant (€)</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-950/30 text-slate-300">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-rose-950/20 transition-colors">
                    <td className="p-4 font-bold text-white">{o.orderCode}</td>
                    <td className="p-4">{o.client?.name || 'Client'}</td>
                    <td className="p-4">
                      {o.currentTier} {o.currentDivision} ➔ <strong className="text-white">{o.targetTier} {o.targetDivision}</strong>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 min-w-[220px]">
                        <select
                          value={
                            inlineDrafts[o.id] !== undefined
                              ? inlineDrafts[o.id]
                              : (o.boosterId || '')
                          }
                          onChange={(e) =>
                            setInlineDrafts((prev) => ({ ...prev, [o.id]: e.target.value }))
                          }
                          className="bg-[#0e0912] border border-rose-500/30 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-rose-400 font-mono"
                        >
                          <option value="">-- Aucun (Marketplace) --</option>
                          {boosters.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.boosterPeakRank || 'Master'}) {b.boosterIsOnline ? '🟢' : '⚪'}
                            </option>
                          ))}
                        </select>

                        {inlineDrafts[o.id] !== undefined &&
                          inlineDrafts[o.id] !== (o.boosterId || '') && (
                            <button
                              onClick={() =>
                                handleSaveReassignment(o.id, inlineDrafts[o.id])
                              }
                              disabled={savingReassign}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-emerald-950/60 cursor-pointer animate-pulse transition-all"
                              title="Sauvegarder"
                            >
                              <CheckCircle2 size={13} />
                              <span>Sauvegarder</span>
                            </button>
                          )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-200">
                        {o.liveTier} {o.liveDivision} ({o.liveLp} LP)
                      </span>{' '}
                      <span className="text-emerald-400 font-bold">(+{o.winsCount}V)</span>
                    </td>
                    <td className="p-4 font-bold text-white font-mono">{o.totalPrice.toFixed(2)} €</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          o.status === 'COMPLETED'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : o.status === 'IN_PROGRESS'
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                            : o.status === 'PAUSED'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                            : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'instant' });
                          setSelectedChatOrder(o);
                        }}
                        className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:text-white"
                        title="Voir la discussion"
                      >
                        <MessageSquare size={13} className="inline mr-1" />
                        Chat
                      </button>
                      <button
                        onClick={() => {
                          setReassignModalOrder(o);
                          setModalSelectedBoosterId(o.boosterId || '');
                        }}
                        className="px-2.5 py-1 rounded bg-[#1b1422] border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-950/40 cursor-pointer"
                        title="Ouvrir la liste de réassignation"
                      >
                        Réassigner
                      </button>
                      <button
                        onClick={() => handleOpenDisputePackage(o.id)}
                        className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-900/40 cursor-pointer"
                        title="Dossier de preuve anti-chargeback (PayPal / Stripe)"
                      >
                        <ShieldCheck size={13} className="inline mr-1" />
                        Dossier Litige
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB 2: USERS */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-2xl border border-rose-500/20 bg-[#120d15]/90 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#180f1e] text-slate-400 border-b border-rose-900/30">
                <tr>
                  <th className="p-4">Nom</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Rôle</th>
                  <th className="p-4">Spécialité / Peak</th>
                  <th className="p-4">Solde (€)</th>
                  <th className="p-4">Statut Approbation</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-950/30 text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-rose-950/20 transition-colors">
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-amber-950 text-amber-300'
                          : u.role === 'BOOSTER'
                          ? 'bg-rose-950 text-rose-300'
                          : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.role === 'BOOSTER' ? `${u.boosterPeakRank || 'Apex'} • ${u.boosterMainRole || 'All'}` : '—'}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {u.role === 'BOOSTER' ? `${(u.boosterBalance || 0).toFixed(2)} €` : '—'}
                    </td>
                    <td className="p-4">
                      {u.role === 'BOOSTER' ? (
                        u.boosterIsApproved ? (
                          <span className="text-emerald-400 font-bold">Approuvé</span>
                        ) : (
                          <span className="text-amber-400 font-bold">En attente</span>
                        )
                      ) : (
                        <span className="text-slate-500">Actif</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {u.role === 'BOOSTER' && (
                        <button
                          onClick={() => handleApproveBooster(u.id, !u.boosterIsApproved)}
                          className={`px-3 py-1 rounded text-[11px] font-bold ${
                            u.boosterIsApproved
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/30 hover:bg-rose-900'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900'
                          }`}
                        >
                          {u.boosterIsApproved ? 'Suspendre' : 'Valider'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. TAB 3: PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="glass-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/90 space-y-4 shadow-2xl">
          <h3 className="text-base font-bold text-white">Demandes de Retrait Boosters à Valider</h3>

          {pendingPayouts.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono py-8 text-center">Aucune demande de virement en attente.</p>
          ) : (
            <div className="space-y-3">
              {pendingPayouts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-[#0e0912] border border-rose-500/20 flex flex-wrap items-center justify-between gap-4 text-xs font-mono"
                >
                  <div>
                    <span className="text-lg font-black text-white font-mono block">
                      {p.amount.toFixed(2)} €
                    </span>
                    <span className="text-slate-400">
                      Booster : <strong className="text-slate-200">{p.booster?.name}</strong> ({p.booster?.email})
                    </span>
                    <div className="text-slate-500 mt-1">
                      Mode : <strong className="text-amber-400">{p.method}</strong> • Destination : <span className="text-white select-all">{p.destination}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleProcessPayout(p.id, 'APPROVE')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold uppercase text-[11px] shadow-md hover:from-emerald-500 hover:to-teal-400 cursor-pointer"
                    >
                      <CheckCircle2 size={13} className="inline mr-1" />
                      Valider Virement Effectué
                    </button>
                    <button
                      onClick={() => handleProcessPayout(p.id, 'REJECT')}
                      className="px-4 py-2 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 font-bold uppercase text-[11px] hover:bg-rose-900 cursor-pointer"
                    >
                      <XCircle size={13} className="inline mr-1" />
                      Refuser & Recréditer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Reassign Modal */}
      {reassignModalOrder && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setReassignModalOrder(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overscroll-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-lg rounded-2xl border border-rose-500/30 bg-[#120d15]/95 shadow-2xl p-6 space-y-5 -translate-y-4 sm:-translate-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-rose-900/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Réassigner la Commande <span className="font-mono text-rose-400">{reassignModalOrder.orderCode}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Client : {reassignModalOrder.client?.name} • {reassignModalOrder.server}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReassignModalOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-950/40 cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Recap Rangs */}
            <div className="p-3.5 rounded-xl bg-[#0a060d] border border-rose-500/20 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Trajectoire</span>
                <strong className="text-white">
                  {reassignModalOrder.currentTier} {reassignModalOrder.currentDivision} ➔ {reassignModalOrder.targetTier} {reassignModalOrder.targetDivision}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Booster Actuel</span>
                <strong className={reassignModalOrder.booster?.name ? 'text-emerald-400' : 'text-amber-400'}>
                  {reassignModalOrder.booster?.name || 'Aucun (Marketplace)'}
                </strong>
              </div>
            </div>

            {/* Select Booster */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 font-bold block">
                Sélectionner le Nouveau Booster dans la Liste :
              </label>
              <select
                value={modalSelectedBoosterId}
                onChange={(e) => setModalSelectedBoosterId(e.target.value)}
                className="w-full bg-[#0a060d] border border-rose-500/40 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-rose-400"
              >
                <option value="">-- Aucun booster (Remettre sur la Marketplace) --</option>
                {boosters.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.boosterPeakRank || 'Master'} - {b.boosterMainRole || 'Flex'}) {b.boosterIsOnline ? '🟢 En Ligne' : '⚪ Hors Ligne'} ({b._count?.boosterOrders || 0} missions)
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Booster Info Card */}
            {modalSelectedBoosterId && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs font-mono space-y-1">
                {(() => {
                  const b = boosters.find((x) => x.id === modalSelectedBoosterId);
                  if (!b) return null;
                  return (
                    <>
                      <div className="flex justify-between text-slate-300">
                        <span>Nom : <strong className="text-white">{b.name}</strong></span>
                        <span>Peak : <strong className="text-amber-400">{b.boosterPeakRank || 'Master'}</strong></span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>Discord : {b.discordTag || 'Non renseigné'}</span>
                        <span className={b.boosterIsOnline ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                          {b.boosterIsOnline ? '● Actuellement En Ligne' : '○ Actuellement Hors Ligne'}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-rose-900/20">
              <button
                type="button"
                onClick={() => setReassignModalOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleSaveReassignment(reassignModalOrder.id, modalSelectedBoosterId)}
                disabled={savingReassign}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={15} />
                <span>{savingReassign ? 'Enregistrement...' : 'Sauvegarder'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Package Modal */}
      {disputePackageData && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDisputePackageData(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overscroll-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-2xl max-h-[85vh] rounded-2xl border border-amber-500/30 bg-[#120d15]/95 shadow-2xl p-6 flex flex-col space-y-4 -translate-y-4 sm:-translate-y-6 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-rose-900/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Dossier Anti-Chargeback & Litige PayPal / Stripe
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Commande <span className="text-rose-400">{disputePackageData.order.orderCode}</span> • Client : {disputePackageData.order.client?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDisputePackageData(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-950/40 cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-mono">
              {/* Section 1: Preuve Légale de Renonciation */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                <span className="text-emerald-400 font-bold block text-[11px]">
                  ✓ Renonciation au Droit de Rétractation (Art. L. 221-28)
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Case légale acceptée par le client le : <strong>{new Date(disputePackageData.order.waiverAcceptedAt || disputePackageData.order.createdAt).toLocaleString('fr-FR')}</strong>
                </p>
                <p className="text-slate-400 text-[10px]">
                  IP Client : <strong className="text-white">{disputePackageData.order.clientIp || '127.0.0.1'}</strong> • Moyen : <strong className="text-amber-300">{disputePackageData.order.paymentMethod || 'PAYPAL_DIGITAL'}</strong>
                </p>
              </div>

              {/* Section 2: Preuve d'Exécution & Rangs */}
              <div className="p-3.5 rounded-xl bg-[#09060b] border border-rose-500/20 space-y-1.5">
                <span className="text-white font-bold block text-[11px]">
                  📦 Preuve de Livraison du Service Numérique
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                  <div>Départ : <strong className="text-white">{disputePackageData.order.currentTier} {disputePackageData.order.currentDivision}</strong></div>
                  <div>Cible Livrée : <strong className="text-emerald-400">{disputePackageData.order.liveTier} {disputePackageData.order.liveDivision}</strong></div>
                  <div>Victoires : <strong className="text-emerald-400">+{disputePackageData.order.winsCount}V</strong></div>
                  <div>Statut : <strong className="text-white">{disputePackageData.order.status}</strong></div>
                </div>
                {disputePackageData.order.proofScreenshot && (
                  <div className="pt-1 text-[11px]">
                    Lien de preuve certifié : <a href={disputePackageData.order.proofScreenshot} target="_blank" rel="noreferrer" className="text-rose-400 underline">{disputePackageData.order.proofScreenshot}</a>
                  </div>
                )}
              </div>

              {/* Section 3: Texte pré-rempli pour PayPal */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-300 font-bold flex justify-between items-center">
                  <span>Argumentaire Juridique Prêt à Soumettre (PayPal Resolution Center) :</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(disputePackageData.paypalLegalDefense);
                      setDisputeCopied(true);
                      setTimeout(() => setDisputeCopied(false), 2500);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {disputeCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{disputeCopied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </label>
                <textarea
                  readOnly
                  rows={6}
                  value={disputePackageData.paypalLegalDefense}
                  className="w-full bg-[#0a060d] border border-rose-500/30 rounded-xl p-3 text-[11px] text-slate-300 font-mono select-all focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-rose-900/30 text-xs font-mono">
              <span className="text-slate-400 text-[10px]">Conforme Art. L. 221-28 Code de la consommation</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(disputePackageData.paypalLegalDefense);
                  setDisputeCopied(true);
                  setTimeout(() => setDisputeCopied(false), 2500);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-950/50 cursor-pointer"
              >
                <Copy size={13} />
                <span>{disputeCopied ? 'Copié pour PayPal !' : 'Copier Dossier PayPal'}</span>
              </button>
            </div>
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
