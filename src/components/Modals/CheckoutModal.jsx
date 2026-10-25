import { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, Mail, CreditCard, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import logoImg from '../../assets/logo-severum.png';
import discordLogo from '../../assets/discord-logo.png';

export default function CheckoutModal({ isOpen, onClose, orderDetails = {} }) {
  const [step, setStep] = useState('auth'); // auth, forgot_password, payment, success
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [discordUser, setDiscordUser] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Payment mock states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [orderId, setOrderId] = useState('');

  const handleClose = () => {
    setStep('auth');
    setIsLogin(true);
    setEmail('');
    setPassword('');
    setDiscordUser('');
    setResetSent(false);
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setOrderId('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('severum_token');
    try {
      if (token) {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            boostType: orderDetails.boostType || 'division',
            server: orderDetails.server || 'EUW',
            queue: orderDetails.queue || 'Solo/Duo (5v5)',
            currentTier: orderDetails.currentTier || 'Gold',
            currentDivision: orderDetails.currentDivision || 'IV',
            currentLp: orderDetails.currentLp || 0,
            targetTier: orderDetails.desiredTier || orderDetails.targetTier || 'Emerald',
            targetDivision: orderDetails.desiredDivision || orderDetails.targetDivision || 'IV',
            targetLp: orderDetails.desiredLp || orderDetails.targetLp || 0,
            flashKey: orderDetails.flashKey || 'D',
            favoriteRoles: Array.isArray(orderDetails.roles) ? orderDetails.roles.join(', ') : null,
            favoriteChampions: Array.isArray(orderDetails.champions) ? orderDetails.champions.join(', ') : null,
            offlineMode: orderDetails.offlineMode !== false,
            totalPrice: orderPrice || 45.0,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setOrderId(data.order?.orderCode || '#SV-8492');
          setStep('success');
          return;
        }
      }
    } catch (err) {
      console.error('Error creating order in db:', err);
    }
    setOrderId('#SV-' + Math.floor(1000 + Math.random() * 9000));
    setStep('success');
  };

  const orderPrice = orderDetails.price || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[480px] my-auto max-h-[90vh] flex flex-col rounded-2xl border border-[#e11d48]/25 bg-[#120d16]/98 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_-10px_rgba(225,29,72,0.25)] text-left relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-3.5 right-3.5 w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-[#f43f5e]/40 hover:bg-[#e11d48]/20 flex items-center justify-center transition-all cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          {/* STEP 1: AUTHENTICATION */}
          {step === 'auth' && (
            <div>
              <div className="text-center mb-4">
                <img
                  src={logoImg}
                  alt="Severum Logo"
                  className="h-14 w-auto mx-auto rounded-2xl overflow-hidden object-contain filter drop-shadow-[0_0_14px_rgba(225,29,72,0.45)] mb-2"
                />
                <h4 id="checkout-modal-title" className="text-lg font-black tracking-wider text-gradient-ruby mb-0.5">
                  SEVERUM
                </h4>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
                  Rankup Service
                </span>
              </div>

              {/* Tabs: Sign In / Register */}
              <div className="flex p-1 rounded-xl bg-[#0e0912] border border-[#e11d48]/20 mb-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isLogin ? 'bg-[#e11d48] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !isLogin ? 'bg-[#e11d48] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Inscription
                </button>
              </div>

              {/* Discord Button */}
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold flex items-center justify-center gap-2.5 shadow-[0_4px_14px_rgba(88,101,242,0.35)] transition-all cursor-pointer mb-4"
              >
                <img src={discordLogo} alt="Discord" className="w-5 h-5 object-contain" />
                <span>Continuer avec Discord</span>
              </button>

              <div className="flex items-center gap-3 my-3">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  ou avec e-mail
                </span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              {/* Auth Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Adresse E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full bg-[#0d0912] border border-[#e11d48]/25 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#f43f5e]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Mot de Passe
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => setStep('forgot_password')}
                        className="text-[10px] text-[#f43f5e] hover:underline bg-transparent border-0 cursor-pointer p-0"
                      >
                        Mot de passe oublié ?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0d0912] border border-[#e11d48]/25 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#f43f5e]"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Pseudo Discord (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={discordUser}
                      onChange={(e) => setDiscordUser(e.target.value)}
                      placeholder="Pseudo#1234"
                      className="w-full bg-[#0d0912] border border-[#e11d48]/25 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#f43f5e]"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full min-h-[46px] py-3 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white text-xs font-extrabold uppercase tracking-wider shadow-[0_6px_20px_rgba(225,29,72,0.4)] hover:shadow-[0_8px_25px_rgba(225,29,72,0.6)] hover:-translate-y-0.5 transition-all cursor-pointer mt-4"
                >
                  {isLogin ? 'Se connecter & Continuer' : 'Créer un compte & Continuer'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: FORGOT PASSWORD */}
          {step === 'forgot_password' && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setStep('auth');
                  setResetSent(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-4 bg-transparent border-0 cursor-pointer p-0"
              >
                <ArrowLeft size={14} />
                <span>Retour</span>
              </button>

              <div className="text-center mb-4">
                <h4 className="text-base font-extrabold text-white mb-1">
                  Récupération de mot de passe
                </h4>
                <p className="text-xs text-slate-400">
                  Entrez votre adresse email pour recevoir un lien de réinitialisation.
                </p>
              </div>

              {!resetSent ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setResetSent(true);
                  }}
                  className="space-y-4"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full bg-[#0d0912] border border-[#e11d48]/25 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#f43f5e]"
                  />
                  <button
                    type="submit"
                    className="w-full min-h-[46px] py-3 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:brightness-110 transition-all cursor-pointer"
                  >
                    Envoyer le lien
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-[#0c0810] border border-[#e11d48]/20 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#e11d48]/20 text-[#f43f5e] flex items-center justify-center mx-auto">
                    <Mail size={18} />
                  </div>
                  <h5 className="text-xs font-bold text-white">E-mail envoyé</h5>
                  <p className="text-[11px] text-slate-400">
                    Vérifiez votre boîte de réception pour réinitialiser vos identifiants.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PAYMENT MOCK */}
          {step === 'payment' && (
            <div>
              <div className="text-center mb-4">
                <h4 className="text-lg font-black text-white mb-0.5">Paiement Sécurisé</h4>
                <p className="text-xs text-slate-400">
                  Règlement de votre commande : <span className="text-[#f43f5e] font-bold font-mono">${orderPrice.toFixed(2)}</span>
                </p>
              </div>

              {/* Order Overview Mini Box */}
              <div className="p-3.5 rounded-xl bg-[#0c0810] border border-[#e11d48]/15 mb-4 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Service :</span>
                  <span className="font-semibold text-white uppercase">{orderDetails.boostType}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Serveur :</span>
                  <span className="font-semibold text-white">{orderDetails.server}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>File :</span>
                  <span className="font-semibold text-white">{orderDetails.queue}</span>
                </div>
              </div>

              {/* Card Inputs */}
              <form onSubmit={handlePaymentSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Titulaire de la carte
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full bg-[#0d0912] border border-[#e11d48]/25 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#f43f5e]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="19"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4000 1234 5678 9010"
                    className="w-full bg-[#0d0912] border border-[#e11d48]/25 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#f43f5e]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Expiration
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="5"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full bg-[#0d0912] border border-[#e11d48]/25 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#f43f5e]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      required
                      maxLength="4"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-[#0d0912] border border-[#e11d48]/25 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#f43f5e]"
                    />
                  </div>
                </div>

                {/* Seals */}
                <div className="flex justify-between items-center py-2 text-[10px] text-slate-400 border-t border-white/5 mt-2">
                  <span className="flex items-center gap-1">
                    <Lock size={12} className="text-[#10b981]" />
                    Chiffrement SSL 256-bit
                  </span>
                  <div className="flex gap-1.5 font-mono font-bold text-[9px]">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">VISA</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Mastercard</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">PayPal</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[46px] py-3 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white text-xs font-extrabold uppercase tracking-wider shadow-[0_6px_20px_rgba(225,29,72,0.4)] hover:shadow-[0_8px_25px_rgba(225,29,72,0.6)] hover:-translate-y-0.5 transition-all cursor-pointer mt-3"
                >
                  Régler ${orderPrice.toFixed(2)} en toute sécurité
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="text-center py-2 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                <CheckCircle2 size={30} />
              </div>

              <div>
                <h4 className="text-lg font-black text-white">Commande Validée avec Succès !</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Votre paiement a été confirmé. Un booster Master certifié a été assigné à votre compte.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0c0810] border border-[#e11d48]/15 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Numéro de Commande :</span>
                  <span className="font-mono font-bold text-white">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Statut :</span>
                  <span className="font-bold text-emerald-400">Attribution du Booster...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Délai estimé :</span>
                  <span className="font-bold text-[#f43f5e]">Moins de 15 minutes</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
              >
                Retour au site
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
