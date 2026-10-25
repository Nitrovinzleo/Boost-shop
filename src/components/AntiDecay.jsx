import { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Flame,
  ArrowRight,
  Clock,
  Zap,
  Users,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import RankIcon from './RankIcon';
import {
  ANTI_DECAY_PLANS,
  calculateAntiDecayPrice,
} from '../logic/antiDecayEngine';
import { antiDecayTranslations } from '../locales/antiDecayTranslations';

export default function AntiDecay({ lang = 'en', onOpenCheckout }) {
  const [selectedPlanId, setSelectedPlanId] = useState('master');
  const [addons, setAddons] = useState({
    duoRetainer: false,
    specificChampions: false,
  });

  const t = antiDecayTranslations[lang] || antiDecayTranslations.en;

  const { finalPrice, plan } = calculateAntiDecayPrice({
    planId: selectedPlanId,
    addons,
  });

  const toggleAddon = (key) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubscribe = () => {
    if (onOpenCheckout) {
      onOpenCheckout({
        boostType: `Abonnement Anti-Decay (${plan.name})`,
        server: 'EUW',
        queue: addons.duoRetainer ? 'Duo Retainer (5v5)' : 'Solo Retainer (5v5)',
        price: finalPrice,
      });
    }
  };

  return (
    <div className="w-full space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HERO HEADER */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          {t.badge}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          {t.title} <br />
          <span className="text-gradient-fiery">{t.highlight}</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* 2. PLANS & SUMMARY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Plans Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-rose-900/20 text-left">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>{t.selectPlan}</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              3 Formules Disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ANTI_DECAY_PLANS.map((item) => {
              const isSelected = selectedPlanId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedPlanId(item.id)}
                  className={`glass-card shimmer-card rounded-2xl p-6 border flex flex-col justify-between text-left cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? 'border-rose-500/70 bg-[#170e1c] shadow-[0_0_25px_-5px_rgba(244,63,94,0.35)] scale-[1.02]'
                      : 'border-rose-500/20 bg-[#120d15]/85 hover:border-rose-500/40 hover:bg-[#160e1b]'
                  }`}
                >
                  {item.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-600 to-amber-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow-md">
                      Populaire
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <RankIcon tier={item.tier} size={58} />
                      <div className="text-right">
                        <span className="text-2xl font-black text-white text-gradient-ruby block">
                          {item.monthlyPrice.toFixed(2)} €
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {t.perMonth}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-lg font-black text-white mb-1">
                      {item.name}
                    </h4>
                    <span className="inline-block text-[11px] font-mono font-bold text-rose-400 mb-3">
                      {item.frequency}
                    </span>

                    <p className="text-xs text-slate-400 mb-4 font-medium border-b border-rose-900/20 pb-3">
                      Cible : <strong className="text-slate-200">{item.targetRanks}</strong>
                    </p>

                    <ul className="space-y-2 mb-6">
                      {item.features.map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-2 text-xs text-slate-300 leading-tight"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanId(item.id);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950 font-black'
                        : 'bg-[#1a111f] text-slate-300 border border-rose-500/20 hover:text-white hover:bg-rose-950/40'
                    }`}
                  >
                    {isSelected ? 'Formule Sélectionnée' : 'Sélectionner'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add-ons Box */}
          <div className="glass-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/90 text-left">
            <h4 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>{t.addonsTitle}</span>
            </h4>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#0e0912] border border-rose-500/20 hover:border-rose-500/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addons.duoRetainer}
                    onChange={() => toggleAddon('duoRetainer')}
                    className="w-4 h-4 accent-rose-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-rose-300 transition-colors">
                      {t.duoLabel}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {t.duoDesc}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">
                  +35%
                </span>
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#0e0912] border border-rose-500/20 hover:border-rose-500/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addons.specificChampions}
                    onChange={() => toggleAddon('specificChampions')}
                    className="w-4 h-4 accent-rose-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-rose-300 transition-colors">
                      {t.champLabel}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {t.champDesc}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">
                  +15%
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Sticky Summary Card */}
        <div className="lg:col-span-4">
          <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/90 backdrop-blur-xl sticky top-24 shadow-2xl shadow-black/60 text-left">
            <h3 className="text-base font-extrabold text-white pb-3 border-b border-rose-900/20 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.summaryTitle}</span>
              </span>
              <span className="text-[10px] font-mono text-rose-300 uppercase tracking-widest bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/30">
                Mensuel
              </span>
            </h3>

            <div className="p-4 rounded-xl bg-[#0e0912] border border-rose-500/20 flex items-center gap-4 mb-4">
              <RankIcon tier={plan.tier} size={54} />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Formule Active
                </span>
                <h4 className="text-base font-black text-white">
                  {plan.name}
                </h4>
                <span className="text-xs text-rose-400 font-mono">
                  {plan.frequency}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-medium text-slate-300 mb-6">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Formule de base :</span>
                <span className="font-semibold text-white">{plan.monthlyPrice.toFixed(2)} €</span>
              </div>
              {addons.duoRetainer && (
                <div className="flex justify-between py-1 border-b border-white/5 text-rose-300">
                  <span>Duo Retainer (+35%) :</span>
                  <span className="font-mono">+{(plan.monthlyPrice * 0.35).toFixed(2)} €</span>
                </div>
              )}
              {addons.specificChampions && (
                <div className="flex justify-between py-1 border-b border-white/5 text-rose-300">
                  <span>Champions Dédiés (+15%) :</span>
                  <span className="font-mono">+{(plan.monthlyPrice * 0.15).toFixed(2)} €</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/40 to-[#120d15] border border-rose-500/30 mb-6 text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Tarif Total de l'Abonnement
              </span>
              <div className="text-3xl font-black text-white text-gradient-fiery">
                {finalPrice.toFixed(2)} € <span className="text-xs text-slate-400 font-normal">/ mois</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubscribe}
              className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 shadow-xl shadow-rose-950/80 hover:shadow-rose-600/40 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] mb-3"
            >
              <span>{t.startPlan}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-slate-400 font-medium">
              {t.noCommitment}
            </p>
          </div>
        </div>
      </div>

      {/* 3. RIOT DECAY EDUCATION & FAQ */}
      <div className="glass-card rounded-2xl p-7 border border-rose-500/20 bg-[#120d15]/90 text-left">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <h3 className="text-lg font-extrabold text-white">
            {t.riotRuleTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          <div className="p-4 rounded-xl bg-[#0e0912] border border-rose-500/20">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Paliers Diamant
            </h4>
            <p>{t.riotRuleDiamond}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0e0912] border border-rose-500/20">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Paliers Apex (Master / Grandmaster / Challenger)
            </h4>
            <p>{t.riotRuleMaster}</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 italic border-t border-rose-900/20 pt-4">
          {t.whyRetainer}
        </p>
      </div>
    </div>
  );
}
