import { Trophy, ShieldCheck, CheckCircle2, Flame } from 'lucide-react';
import { translations } from '../locales/translations';

export default function Hero({ lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const stats = [
    {
      value: '85.4%',
      label: t.severumWinrate,
      icon: <Trophy size={20} className="text-rose-500" />,
      glowBorder: 'border-rose-500/30',
      badgeBg: 'bg-rose-950/40',
    },
    {
      value: 'Secured',
      label: t.securedGateways,
      icon: <ShieldCheck size={20} className="text-rose-500" />,
      glowBorder: 'border-rose-500/30',
      badgeBg: 'bg-rose-950/40',
    },
    {
      value: '100%',
      label: t.refundGuarantee,
      icon: <CheckCircle2 size={20} className="text-rose-500" />,
      glowBorder: 'border-rose-500/30',
      badgeBg: 'bg-rose-950/40',
    },
  ];

  return (
    <section className="relative pt-12 pb-10 px-4 text-center overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Active Season Pill Badge (Portfolio Status Pill style) */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 backdrop-blur-md shadow-lg shadow-rose-950/50 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-rose-200 tracking-wide font-mono flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            RANKED SEASON 2026 ACTIVE
          </span>
        </div>

        {/* Hero Title with fiery gradient */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-4">
          League of Legends <br />
          <span className="text-gradient-fiery">Rankup Service</span>
        </h1>

        {/* Tagline */}
        <p className="max-w-2xl text-slate-300 text-sm sm:text-base font-normal leading-relaxed mb-10">
          {t.heroTagline}
        </p>

        {/* Stats Grid with Shimmer Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`glass-card shimmer-card rounded-2xl p-4 flex items-center gap-4 text-left border ${stat.glowBorder} bg-[#120d16]/80 hover:scale-[1.02] transition-transform`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 ${stat.badgeBg}`}
              >
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-slate-400 mt-0.5">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
