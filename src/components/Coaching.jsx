import { useState } from 'react';
import { Sword, Trees, Sparkles, Target, Shield, Plus, Minus, UserCheck, Video, Flame } from 'lucide-react';
import RankIcon from './RankIcon';
import { TIERS } from '../logic/pricingEngine';
import { COACHING_ROLES, calculateCoachingPricing } from '../logic/coachingEngine';
import { translations } from '../locales/translations';

const ROLE_ICONS = {
  top: Sword,
  jungle: Trees,
  mid: Sparkles,
  adc: Target,
  support: Shield,
};

export default function Coaching({ lang = 'en', onOpenCheckout }) {
  const [currentTier, setCurrentTier] = useState('Silver');
  const [desiredTier, setDesiredTier] = useState('Gold');
  const [selectedRole, setSelectedRole] = useState('mid');
  const [gamesReview, setGamesReview] = useState(1);
  const [coachingHours, setCoachingHours] = useState(1);

  // Form contact inputs
  const [discordTag, setDiscordTag] = useState('');
  const [opggLink, setOpggLink] = useState('');
  const [champions, setChampions] = useState('');
  const [formError, setFormError] = useState('');

  // Addons
  const [addons, setAddons] = useState({
    liveSpectate: false,
    proCoach: false,
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  const t = translations[lang] || translations.en;

  const pricing = calculateCoachingPricing({
    currentTier,
    desiredTier,
    gamesReview,
    coachingHours,
    addons,
    promoDiscount,
  });

  const toggleAddon = (key) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SEVERUM10') {
      setPromoDiscount(0.10);
      setPromoMessage('Code SEVERUM10 appliqué (-10%) !');
    } else {
      setPromoMessage('Code promo invalide.');
    }
  };

  const handleStartBooking = (e) => {
    e.preventDefault();
    if (!discordTag.trim()) {
      setFormError('Identifiant Discord requis.');
      return;
    }
    if (!opggLink.trim()) {
      setFormError('Lien de profil OP.GG requis.');
      return;
    }
    if (!champions.trim()) {
      setFormError('Veuillez spécifier les champions à travailler.');
      return;
    }
    setFormError('');

    onOpenCheckout({
      boostType: 'Coaching LoL',
      currentTier,
      desiredTier,
      selectedRole,
      gamesReview,
      coachingHours,
      discordTag,
      opggLink,
      champions,
      addons,
      server: 'EUW/NA',
      queue: 'Salon Vocal Discord',
      price: pricing.sale,
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-tab-entrance">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
          LoL Premium <span className="text-gradient-fiery">Coaching</span>
        </h2>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto">{t.coachingSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Coaching Form Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Rank Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Elo */}
            <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/85 text-left shadow-xl shadow-black/40">
              <div className="flex items-center gap-4 mb-4 pb-3 border-b border-rose-900/20">
                <RankIcon tier={currentTier} size={64} />
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300/80">
                    {t.currentEloLabel}
                  </span>
                  <h4 className="text-lg font-black text-white">{currentTier}</h4>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {TIERS.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setCurrentTier(tier)}
                    className={`min-h-[40px] py-1.5 px-1 rounded-xl text-xs font-bold uppercase transition-all duration-150 cursor-pointer ${
                      currentTier === tier
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950 border border-rose-500/60 font-black scale-[1.02]'
                        : 'bg-[#18111d] text-slate-300 border border-rose-500/15 hover:border-rose-500/40 hover:text-white hover:bg-rose-950/20'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Elo */}
            <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/85 text-left shadow-xl shadow-black/40">
              <div className="flex items-center gap-4 mb-4 pb-3 border-b border-rose-900/20">
                <RankIcon tier={desiredTier} size={64} />
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300/80">
                    {t.targetEloLabel}
                  </span>
                  <h4 className="text-lg font-black text-white">{desiredTier}</h4>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {TIERS.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setDesiredTier(tier)}
                    className={`min-h-[40px] py-1.5 px-1 rounded-xl text-xs font-bold uppercase transition-all duration-150 cursor-pointer ${
                      desiredTier === tier
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950 border border-rose-500/60 font-black scale-[1.02]'
                        : 'bg-[#18111d] text-slate-300 border border-rose-500/15 hover:border-rose-500/40 hover:text-white hover:bg-rose-950/20'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Role / Lane Selection */}
          <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/85 text-left shadow-xl shadow-black/40">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Flame size={14} className="text-rose-500" />
              <span>{t.roleSelectLabel}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {COACHING_ROLES.map((role) => {
                const IconComponent = ROLE_ICONS[role.id] || Sword;
                const isSelected = selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-rose-500 shadow-lg shadow-rose-950 font-bold scale-[1.03]'
                        : 'bg-[#150f1c] border-rose-500/15 text-slate-300 hover:border-rose-500/40 hover:text-white hover:bg-rose-950/20'
                    }`}
                  >
                    <IconComponent size={20} className={isSelected ? 'text-white' : 'text-rose-400'} />
                    <span className="text-xs font-black uppercase">{role.name}</span>
                    <span className="text-[10px] opacity-80">{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Games to review */}
            <div className="glass-card shimmer-card rounded-2xl p-5 border border-rose-500/20 bg-[#120d15]/85 flex items-center justify-between shadow-xl shadow-black/40">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t.gamesReviewLabel}
                </span>
                <span className="text-2xl font-black text-white">{gamesReview} Games</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGamesReview((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-[#18111d] border border-rose-500/25 text-white flex items-center justify-center hover:bg-rose-950/40 hover:border-rose-500/50 transition-colors cursor-pointer"
                >
                  <Minus size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setGamesReview((prev) => Math.min(10, prev + 1))}
                  className="w-10 h-10 rounded-xl bg-[#18111d] border border-rose-500/25 text-white flex items-center justify-center hover:bg-rose-950/40 hover:border-rose-500/50 transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Coaching Hours */}
            <div className="glass-card shimmer-card rounded-2xl p-5 border border-rose-500/20 bg-[#120d15]/85 flex items-center justify-between shadow-xl shadow-black/40">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t.coachingHoursLabel}
                </span>
                <span className="text-2xl font-black text-white">{coachingHours} Heures</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCoachingHours((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-[#18111d] border border-rose-500/25 text-white flex items-center justify-center hover:bg-rose-950/40 hover:border-rose-500/50 transition-colors cursor-pointer"
                >
                  <Minus size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setCoachingHours((prev) => Math.min(10, prev + 1))}
                  className="w-10 h-10 rounded-xl bg-[#18111d] border border-rose-500/25 text-white flex items-center justify-center hover:bg-rose-950/40 hover:border-rose-500/50 transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Addons */}
          <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/85 text-left shadow-xl shadow-black/40">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-rose-400" />
              <span>{t.addonsCoachingTitle}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label
                onClick={() => toggleAddon('liveSpectate')}
                className={`p-4 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all duration-200 ${
                  addons.liveSpectate
                    ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/60'
                    : 'bg-[#150f1c] border-rose-500/15 hover:border-rose-500/40 hover:bg-rose-950/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.liveSpectate}
                  onChange={() => {}}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <div>
                  <div className="text-xs font-extrabold text-white">{t.liveSpectateLabel} (+20%)</div>
                  <div className="text-[11px] text-slate-400">{t.liveSpectateDesc}</div>
                </div>
              </label>

              <label
                onClick={() => toggleAddon('proCoach')}
                className={`p-4 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all duration-200 ${
                  addons.proCoach
                    ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/60'
                    : 'bg-[#150f1c] border-rose-500/15 hover:border-rose-500/40 hover:bg-rose-950/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.proCoach}
                  onChange={() => {}}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <div>
                  <div className="text-xs font-extrabold text-white">{t.proCoachLabel} (+15%)</div>
                  <div className="text-[11px] text-slate-400">{t.proCoachDesc}</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Details & Checkout Action */}
        <div className="lg:col-span-4">
          <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/90 sticky top-24 text-left shadow-2xl shadow-black/60">
            <h3 className="text-base font-extrabold text-white pb-3 border-b border-rose-900/20 mb-4 flex items-center gap-2">
              <UserCheck size={16} className="text-rose-400" />
              <span>{t.coachingContactDetails}</span>
            </h3>

            {formError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-semibold mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleStartBooking} className="space-y-4 mb-6">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {t.discordTagLabel} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.discordTagPlaceholder}
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  className="w-full bg-[#0d0912] border border-rose-500/25 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {t.opggLabel} *
                </label>
                <input
                  type="url"
                  required
                  placeholder={t.opggPlaceholder}
                  value={opggLink}
                  onChange={(e) => setOpggLink(e.target.value)}
                  className="w-full bg-[#0d0912] border border-rose-500/25 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {t.championsLabel} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.championsPlaceholder}
                  value={champions}
                  onChange={(e) => setChampions(e.target.value)}
                  className="w-full bg-[#0d0912] border border-rose-500/25 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              {/* Promo input */}
              <div className="pt-2">
                <div className="flex rounded-xl overflow-hidden border border-rose-500/25 bg-[#0d0912] focus-within:border-rose-500 transition-colors">
                  <input
                    type="text"
                    placeholder={t.promoPlaceholder}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-transparent px-3.5 py-2 text-xs text-white uppercase font-bold outline-none placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white text-xs font-bold uppercase cursor-pointer hover:brightness-110 transition-all"
                  >
                    {t.applyPromo}
                  </button>
                </div>
                {promoMessage && (
                  <p className="text-[11px] font-semibold text-emerald-400 mt-1">
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-rose-900/20">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>{t.originalPrice}</span>
                  <span className="line-through">${pricing.original.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {t.salePrice}
                  </span>
                  <span className="text-3xl font-black text-gradient-fiery drop-shadow-[0_0_16px_rgba(225,29,72,0.4)]">
                    ${pricing.sale.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-950/60 hover:shadow-rose-950/90 hover:scale-[1.02] active:scale-100 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>{t.buyCoachingBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
