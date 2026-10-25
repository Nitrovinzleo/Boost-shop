import { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Star,
  Clock,
  Trophy,
  EyeOff,
  Lock,
  Users,
  Sparkles,
  Flame,
  HelpCircle,
  ChevronDown,
  Layers,
  GraduationCap,
} from 'lucide-react';
import RankIcon from './RankIcon';
import { homeTranslations } from '../locales/homeTranslations';

export default function Home({
  lang = 'en',
  onNavigateToBoosting,
  onNavigateToCoaching,
  onNavigateToAntiDecay,
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const t = homeTranslations[lang] || homeTranslations.en;

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="w-full space-y-24 md:space-y-32">
      {/* 1. HERO PITCH & LIVE STATS */}
      <section className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          {/* Active Season Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 backdrop-blur-md shadow-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-rose-200 tracking-wide flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              {t.heroBadge}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
            {t.heroTitle} <br />
            <span className="text-gradient-fiery">{t.heroHighlight}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed mb-8">
            {t.heroDescription}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto mb-16">
            <button
              type="button"
              onClick={onNavigateToBoosting}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 shadow-xl shadow-rose-950/80 hover:shadow-rose-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white text-white" />
              <span>{t.ctaBoost}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onNavigateToCoaching}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm text-rose-200 bg-[#160e19] hover:bg-rose-950/50 border border-rose-500/35 hover:border-rose-400/70 transition-all duration-200 shadow-lg shadow-black/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-rose-400" />
              <span>{t.ctaCoaching}</span>
            </button>
          </div>

          {/* Stats Bento Grid with Red SVG Icons and Pure Crisp Text (No white gradient) */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {t.stats.map((stat, idx) => {
              const icons = [
                <Trophy key="0" className="w-5 h-5 text-rose-500" />,
                <Clock key="1" className="w-5 h-5 text-rose-500" />,
                <Flame key="2" className="w-5 h-5 text-rose-500" />,
                <ShieldCheck key="3" className="w-5 h-5 text-rose-500" />,
              ];

              return (
                <div
                  key={idx}
                  className="glass-card shimmer-card rounded-2xl p-5 border border-rose-500/25 bg-[#120d15]/90 flex flex-col items-center justify-center text-center shadow-lg shadow-black/40 hover:border-rose-500/50 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-950/70 border border-rose-500/30 flex items-center justify-center mb-3 shadow-md shadow-rose-950/50">
                    {icons[idx % icons.length]}
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1 font-mono">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (4 STEPS) */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            Processus Étape par Étape
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.howItWorksTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            {t.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {t.steps.map((item, idx) => (
            <div
              key={idx}
              className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/90 flex flex-col justify-between text-left group hover:border-rose-500/50 transition-all duration-300 shadow-xl shadow-black/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-rose-500/40 group-hover:text-rose-400 transition-colors font-mono">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-300">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-rose-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-rose-900/20 flex items-center justify-between text-[11px] font-mono text-rose-400">
                <span>Phase {item.step}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ENTERPRISE SECURITY & PRIVACY */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Normes Antiban Stricte
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.securityTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            {t.securitySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.securityFeatures.map((feat, idx) => {
            const icons = [
              <Lock key="1" className="w-5 h-5 text-rose-400" />,
              <EyeOff key="2" className="w-5 h-5 text-amber-400" />,
              <Shield key="3" className="w-5 h-5 text-emerald-400" />,
              <Trophy key="4" className="w-5 h-5 text-cyan-400" />,
            ];

            return (
              <div
                key={idx}
                className="glass-card shimmer-card rounded-2xl p-6 sm:p-7 border border-rose-500/20 bg-[#120d15]/90 flex items-start gap-4 text-left shadow-xl shadow-black/40 hover:border-rose-500/50 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-[#1c1220] border border-rose-500/30 shrink-0">
                  {icons[idx % icons.length]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COMPARISON: BOOST VS COACHING */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            Orientation Personnalisée
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.comparisonTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            {t.comparisonSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Boost Card */}
          <div className="glass-card shimmer-card rounded-3xl p-7 sm:p-9 border border-rose-500/30 bg-[#120d15]/95 flex flex-col justify-between text-left shadow-2xl shadow-black/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  Service Phare
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  Résultat Garanti
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                {t.boostTitle}
              </h3>
              <p className="text-sm text-slate-300/80 mb-6 leading-relaxed">
                {t.boostDesc}
              </p>

              <ul className="space-y-3 mb-8">
                {t.boostPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={onNavigateToBoosting}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-950/70 hover:shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
            >
              <span>Accéder au Calculateur de Boost</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Coaching Card */}
          <div className="glass-card shimmer-card rounded-3xl p-7 sm:p-9 border border-amber-500/25 bg-[#120d15]/95 flex flex-col justify-between text-left shadow-2xl shadow-black/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  Progression Durable
                </span>
                <span className="text-xs font-mono font-bold text-rose-400">
                  1-on-1 Discord
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                {t.coachingTitle}
              </h3>
              <p className="text-sm text-slate-300/80 mb-6 leading-relaxed">
                {t.coachingDesc}
              </p>

              <ul className="space-y-3 mb-8">
                {t.coachingPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={onNavigateToCoaching}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-amber-200 bg-[#19111c] hover:bg-amber-950/40 border border-amber-500/35 hover:border-amber-400/60 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md"
            >
              <span>Configurer une Session Coaching</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4.5. ANTI-DECAY & RETENTION SHOWCASE */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card shimmer-card rounded-3xl p-8 sm:p-12 border border-rose-500/30 bg-gradient-to-br from-[#1c1022] via-[#120d16] to-[#09060b] shadow-2xl shadow-black/60 relative overflow-hidden text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Service d'Abonnement • Sans Engagement
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">
                Maintenez votre Rang & <span className="text-gradient-fiery">Neutralisez le Decay Riot</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed max-w-2xl">
                En Diamant, Master, Grandmaster et Challenger, l'inactivité entraîne une perte automatique de LP (jusqu'à -75 LP/jour). Nos boosters jouent le quota exact de parties d'entretien pour protéger votre rang et votre MMR.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300 mb-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e0912] border border-rose-500/20">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Master : 39€/m</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e0912] border border-rose-500/20">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>GrandMaster : 89€/m</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e0912] border border-rose-500/20">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Challenger : 179€/m</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
              <button
                type="button"
                onClick={onNavigateToAntiDecay}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 shadow-xl shadow-rose-950/80 hover:shadow-rose-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <Shield className="w-4 h-4 fill-white" />
                <span>Découvrir l'Anti-Decay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-slate-400 mt-2 font-mono">
                Résiliable à tout moment en 1 clic
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP 0.1% PRO ROSTER */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-rose-400" />
            Effectif Professionnel
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.teamTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            {t.teamSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {t.team.map((member, idx) => (
            <div
              key={idx}
              className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-sm glass-card shimmer-card rounded-2xl p-6 sm:p-7 border border-rose-500/20 bg-[#120d15]/90 flex flex-col items-center text-center shadow-xl shadow-black/40 group hover:border-rose-500/50 transition-all duration-300"
            >
              <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                <RankIcon tier={member.tier} size={88} />
              </div>

              <div className="flex items-center gap-2.5 mb-1 justify-center">
                <h4 className="text-xl font-black text-white">
                  {member.name}
                </h4>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-semibold shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{t.onlineStatus || 'En ligne'}</span>
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-4">
                {member.rank}
              </span>

              <div className="w-full pt-3 pb-2 border-t border-rose-900/20 space-y-2.5 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rôle Principal :</span>
                  <span className="text-slate-200 font-bold">{member.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Statut :</span>
                  <span className="text-emerald-400 font-bold font-mono">{member.winrate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Serveur :</span>
                  <span className="text-slate-300 font-mono font-medium">{member.games}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-rose-900/20">
                  <span className="text-slate-400">{t.seniorityLabel || 'Ancienneté Severum :'}</span>
                  <span className="text-rose-200 font-semibold font-mono text-[11px] bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-500/25">
                    {member.seniority}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* 6th Big Square Card: et 32 autres M+ */}
          <div className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-sm glass-card shimmer-card rounded-2xl p-6 sm:p-7 border border-rose-500/30 bg-gradient-to-b from-[#18101e] to-[#120d15] flex flex-col items-center justify-between text-center shadow-xl shadow-black/40 group hover:border-rose-500/60 transition-all duration-300 relative overflow-hidden">
            {/* Ambient Ruby Orb in Background */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-600/15 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-600/30 transition-all" />

            <div className="w-full flex flex-col items-center">
              {/* Highlight Icon Emblem */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-rose-950/80 to-[#140c18] border border-rose-500/40 flex items-center justify-center mb-4 shadow-lg shadow-rose-950/50 group-hover:scale-105 group-hover:border-rose-500 transition-all duration-300">
                <Users className="w-10 h-10 text-rose-400 group-hover:text-rose-300 transition-colors" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 mb-2 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{t.teamExtraCardSubtitle || 'Effectif Severum'}</span>
              </div>

              <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-2">
                {t.teamExtraCardTitle || 'et 32 autres M+'}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed max-w-[260px] mb-3">
                {t.teamExtraCardDesc || 'Boosters & coachs Master, Grandmaster et Challenger certifiés prêts à intervenir.'}
              </p>
            </div>

            <div className="w-full pt-3 pb-2 border-t border-rose-900/20 space-y-2 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Paliers :</span>
                <span className="text-rose-300 font-bold font-mono">Master ➔ Challenger</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Disponibilité :</span>
                <span className="text-emerald-400 font-bold font-mono">24/7 En Ligne</span>
              </div>
              <div className="pt-2 border-t border-rose-900/20 text-center">
                <span className="text-rose-200 font-semibold font-mono text-[11px] bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/25 inline-flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  Top 0.1% Audité
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED REVIEWS & SOCIAL PROOF */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Note Trustpilot 4.9/5
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.reviewsTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            {t.reviewsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.reviews.map((rev, idx) => (
            <div
              key={idx}
              className="glass-card shimmer-card rounded-2xl p-6 sm:p-7 border border-rose-500/20 bg-[#120d15]/90 flex flex-col justify-between text-left shadow-xl shadow-black/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {rev.date}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/20 text-xs font-mono font-bold text-rose-300 mb-4">
                  <span>{rev.fromTier}</span>
                  <ArrowRight className="w-3 h-3 text-rose-400" />
                  <span className="text-white font-extrabold">{rev.toTier}</span>
                  <span className="text-slate-400 ml-1">({rev.server})</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-rose-900/20 flex items-center justify-between text-xs font-medium">
                <span className="text-white font-semibold">{rev.author}</span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Commande vérifiée
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. INTERACTIVE FAQ */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
            Transparence Absolue
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            {t.faqSubtitle}
          </p>
        </div>

        <div className="space-y-3.5">
          {t.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-rose-500/20 bg-[#120d15]/90 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <span className="text-sm sm:text-base font-bold text-white flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-rose-950/80 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      Q
                    </span>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-rose-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-rose-950/40">
                    <p className="mt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FINAL HIGH-IMPACT CTA BANNER */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        <div className="glass-card shimmer-card rounded-3xl p-8 sm:p-14 border border-rose-500/35 bg-gradient-to-br from-[#1c1022] via-[#120d16] to-[#09060b] text-center shadow-2xl shadow-rose-950/40 relative overflow-hidden">
          <div className="glow-orb-ruby top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-6 shadow-lg shadow-rose-950/80">
              <Sparkles className="w-6 h-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              {t.ctaBannerTitle}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
              {t.ctaBannerSubtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={onNavigateToBoosting}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 shadow-xl shadow-rose-950/80 hover:shadow-rose-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>{t.ctaBoost}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateToCoaching}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-rose-200 bg-[#160e19] hover:bg-rose-950/50 border border-rose-500/35 hover:border-rose-400/70 transition-all duration-200 shadow-lg cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-rose-400" />
                <span>{t.ctaCoaching}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
