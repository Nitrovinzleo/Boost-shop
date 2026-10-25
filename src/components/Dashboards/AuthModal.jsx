import { useState } from 'react';
import { X, Lock, Mail, User, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo-severum.png';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { login, register, quickLoginAs } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('CLIENT');
  const [discordTag, setDiscordTag] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register({ email, password, name, role, discordTag });
      } else {
        await login(email, password);
      }
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (demoRole) => {
    setError(null);
    setLoading(true);
    try {
      await quickLoginAs(demoRole);
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setError(err.message || 'Erreur de connexion démo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-md rounded-2xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl relative bg-[#120d15]/95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-rose-950/40 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Logo & Title */}
        <div className="text-center mb-6">
          <img
            src={logoImg}
            alt="Severum"
            className="h-14 w-auto mx-auto rounded-2xl mb-3 drop-shadow-[0_0_12px_rgba(225,29,72,0.4)]"
          />
          <h3 className="text-xl font-black text-white">
            {isRegister ? 'Créer un Compte Severum' : 'Espace Membre Severum'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister
              ? 'Accédez au suivi en direct de vos boosts ou postulez en tant que pro'
              : 'Connectez-vous pour accéder à vos dashboards Client, Booster ou Admin'}
          </p>
        </div>

        {/* Error notice */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs font-mono text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
          {isRegister && (
            <>
              <div>
                <label className="text-slate-400 block mb-1">Nom / Pseudo</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre pseudo"
                    className="w-full bg-[#0d0912] border border-rose-500/25 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Type de Compte</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#0d0912] border border-rose-500/25 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="CLIENT">Client (Suivi de commande & boost)</option>
                  <option value="BOOSTER">Booster Pro (Top 0.1% vérifié)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tag Discord (optionnel)</label>
                <input
                  type="text"
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  placeholder="Ex: MonPseudo#1234"
                  className="w-full bg-[#0d0912] border border-rose-500/25 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-slate-400 block mb-1">Adresse Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@domaine.com"
                className="w-full bg-[#0d0912] border border-rose-500/25 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Mot de passe</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0d0912] border border-rose-500/25 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-rose-950/60 disabled:opacity-50 transition-all cursor-pointer mt-2"
          >
            {loading ? 'Chargement...' : isRegister ? 'Créer mon compte' : 'Se Connecter'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-4 text-xs font-mono">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-slate-400 hover:text-white underline cursor-pointer"
          >
            {isRegister
              ? 'Déjà un compte ? Connectez-vous'
              : 'Pas encore de compte ? S\'inscrire'}
          </button>
        </div>

        {/* Fast 1-Click Demo Accounts for Easy Testing */}
        <div className="mt-6 pt-5 border-t border-rose-900/30">
          <span className="text-[10px] font-mono uppercase text-slate-500 block text-center mb-2.5">
            ⚡ Accès Test Rapide en 1 Clic :
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('CLIENT')}
              className="py-2 px-1 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold hover:bg-emerald-900/80 transition-colors cursor-pointer text-center"
            >
              Demo Client
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('BOOSTER')}
              className="py-2 px-1 rounded-lg bg-rose-950/70 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-bold hover:bg-rose-900/80 transition-colors cursor-pointer text-center"
            >
              Demo Booster
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('ADMIN')}
              className="py-2 px-1 rounded-lg bg-amber-950/70 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold hover:bg-amber-900/80 transition-colors cursor-pointer text-center"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
