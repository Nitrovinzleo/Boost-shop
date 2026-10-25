import { useState, useRef, useEffect } from 'react';
import { LogIn, Menu, X, Sparkles, Flame, Check, User, Shield, Trophy, ShieldAlert, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import logoImg from '../assets/logo-severum.png';
import FlagIcon from './FlagIcon';
import { translations } from '../locales/translations';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'pl', label: 'Polski' },
];

export default function Navbar({
  lang = 'en',
  onChangeLang,
  activeView = 'boosting',
  onViewChange,
  onCoachingClick,
  onOpenAuth,
}) {
  const { user, isAuthenticated, role, logout, quickLoginAs } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langRef = useRef(null);
  const userMenuRef = useRef(null);

  const t = translations[lang] || translations.en;

  const getDashboardView = () => {
    if (role === 'ADMIN') return 'dashboard-admin';
    if (role === 'BOOSTER') return 'dashboard-booster';
    return 'dashboard-client';
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-rose-950 via-rose-900 to-[#120d15] text-rose-200 py-1.5 px-4 text-xs font-semibold tracking-wider text-center flex items-center justify-center gap-2 border-b border-rose-500/20 shadow-md">
        <Sparkles size={13} className="text-rose-400 animate-pulse" />
        <span className="font-mono text-[11px] uppercase">{t.todaySale}</span>
      </div>

      {/* Main Glass Navigation (Portfolio Navbar Style) */}
      <nav className="glass-nav py-3 px-4 sm:px-6 lg:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Title (Unconstrained, Large with Rounded Corners & Ruby Glow) */}
          <button
            type="button"
            onClick={() => onViewChange('home')}
            className="flex items-center gap-3.5 bg-transparent border-0 cursor-pointer p-0.5 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg"
          >
            <img
              src={logoImg}
              alt="Severum Logo"
              className="h-12 sm:h-14 md:h-16 w-auto rounded-2xl overflow-hidden object-contain filter drop-shadow-[0_0_14px_rgba(225,29,72,0.45)] group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-wider text-white group-hover:text-rose-400 transition-colors uppercase font-mono">
                SEVERUM
              </span>
              <span className="text-[11px] text-rose-300/80 font-mono tracking-wider flex items-center gap-1 font-bold uppercase">
                <Flame className="w-3 h-3 text-rose-500" /> Rankup Service
              </span>
            </div>
          </button>

          {/* Desktop Nav Links (Portfolio Segment Style) */}
          <div className="hidden md:flex items-center gap-1 bg-[#140d17]/80 border border-rose-900/30 rounded-full px-2 py-1 backdrop-blur-md shadow-inner shadow-black/40">
            <button
              type="button"
              onClick={() => onViewChange('home')}
              className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-150 cursor-pointer ${
                activeView === 'home'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950/80 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-rose-950/40'
              }`}
            >
              {t.navHome}
            </button>
            <button
              type="button"
              onClick={() => onViewChange('boosting')}
              className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-150 cursor-pointer ${
                activeView === 'boosting'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950/80 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-rose-950/40'
              }`}
            >
              {t.navBoosting}
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeView !== 'coaching') onCoachingClick();
              }}
              className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-150 cursor-pointer ${
                activeView === 'coaching'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950/80 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-rose-950/40'
              }`}
            >
              {t.navCoaching}
            </button>
            <button
              type="button"
              onClick={() => onViewChange('antidecay')}
              className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-150 cursor-pointer ${
                activeView === 'antidecay'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950/80 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-rose-950/40'
              }`}
            >
              {t.navAntiDecay || 'Anti-Decay'}
            </button>

            {/* Dashboard Tab for Logged-In Users */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => onViewChange(getDashboardView())}
                className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  activeView.startsWith('dashboard-')
                    ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-rose-950/80 font-bold'
                    : 'text-rose-300 hover:text-white hover:bg-rose-950/40'
                }`}
              >
                <LayoutDashboard size={13} />
                <span>
                  {role === 'ADMIN' ? 'Espace Admin' : role === 'BOOSTER' ? 'Espace Booster' : 'Mes Commandes'}
                </span>
              </button>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-label={t.selectLanguage}
                className="min-h-[38px] px-3 py-1.5 rounded-full bg-[#140e19] border border-rose-500/25 text-slate-200 text-xs font-bold flex items-center gap-2 hover:border-rose-500/50 hover:bg-[#1a1221] transition-all cursor-pointer shadow-sm group"
              >
                <FlagIcon code={lang} className="w-4 h-3 rounded-xs shadow-xs" />
                <span className="uppercase font-mono text-[11px] font-bold text-slate-200 group-hover:text-white">
                  {lang}
                </span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#130d17]/98 border border-rose-500/30 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.85)] backdrop-blur-xl p-1.5 z-50 animate-tab-entrance">
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        onChangeLang(item.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-semibold rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        lang === item.code
                          ? 'bg-rose-950/70 text-white font-bold border border-rose-500/30'
                          : 'text-slate-300 hover:bg-rose-950/30 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <FlagIcon code={item.code} className="w-4 h-3 rounded-xs" />
                        <span>{item.label}</span>
                      </span>
                      {lang === item.code && (
                        <Check size={14} className="text-rose-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Button or User Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="min-h-[38px] px-3 py-1.5 rounded-full bg-[#140e19] border border-rose-500/30 text-white text-xs font-bold flex items-center gap-2 hover:border-rose-500/60 hover:bg-[#1c1223] transition-all cursor-pointer shadow-md group"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-600 to-amber-500 flex items-center justify-center text-[10px] font-black">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-semibold text-slate-200 group-hover:text-white max-w-[90px] truncate">
                    {user?.name}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                      role === 'ADMIN'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : role === 'BOOSTER'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {role}
                  </span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#130d17]/98 border border-rose-500/30 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.85)] backdrop-blur-xl p-2 z-50 animate-tab-entrance space-y-1">
                    <div className="px-3 py-2 border-b border-rose-900/30">
                      <span className="text-[11px] text-slate-400 block font-mono truncate">{user?.email}</span>
                      <span className="text-xs font-bold text-white block mt-0.5">{user?.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onViewChange(getDashboardView());
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-bold rounded-lg flex items-center gap-2.5 text-white bg-rose-950/60 border border-rose-500/30 hover:bg-rose-900/60 transition-colors cursor-pointer"
                    >
                      <LayoutDashboard size={14} className="text-rose-400" />
                      <span>Mon Dashboard</span>
                    </button>

                    <div className="pt-1 border-t border-rose-900/20">
                      <span className="text-[9px] font-mono text-slate-500 uppercase px-3 py-1 block">
                        ⚡ Basculer de Rôle (Test) :
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          await quickLoginAs('CLIENT');
                          onViewChange('dashboard-client');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-[11px] font-mono rounded-md hover:bg-emerald-950/40 text-emerald-300 flex items-center justify-between cursor-pointer"
                      >
                        <span>Espace Client</span>
                        {role === 'CLIENT' && <Check size={12} />}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await quickLoginAs('BOOSTER');
                          onViewChange('dashboard-booster');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-[11px] font-mono rounded-md hover:bg-rose-950/40 text-rose-300 flex items-center justify-between cursor-pointer"
                      >
                        <span>Espace Booster</span>
                        {role === 'BOOSTER' && <Check size={12} />}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await quickLoginAs('ADMIN');
                          onViewChange('dashboard-admin');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-[11px] font-mono rounded-md hover:bg-amber-950/40 text-amber-300 flex items-center justify-between cursor-pointer"
                      >
                        <span>Espace Admin</span>
                        {role === 'ADMIN' && <Check size={12} />}
                      </button>
                    </div>

                    <div className="pt-1 border-t border-rose-900/20">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          onViewChange('home');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs font-semibold rounded-lg flex items-center gap-2 text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <LogOut size={13} />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 shadow-lg shadow-rose-950/50 hover:shadow-rose-950/80 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
              >
                <LogIn size={14} />
                <span>{t.navLogIn}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#140e19] border border-rose-500/20 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-rose-900/30 flex flex-col gap-2 animate-tab-entrance">
            <button
              type="button"
              onClick={() => {
                onViewChange('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-bold uppercase tracking-wider ${
                activeView === 'home' ? 'bg-rose-950/60 text-white border border-rose-500/30' : 'text-slate-300'
              }`}
            >
              {t.navHome}
            </button>
            <button
              type="button"
              onClick={() => {
                onViewChange('boosting');
                setMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-bold uppercase tracking-wider ${
                activeView === 'boosting' ? 'bg-rose-950/60 text-white border border-rose-500/30' : 'text-slate-300'
              }`}
            >
              {t.navBoosting}
            </button>
            <button
              type="button"
              onClick={() => {
                onCoachingClick();
                setMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-bold uppercase tracking-wider ${
                activeView === 'coaching' ? 'bg-rose-950/60 text-white border border-rose-500/30' : 'text-slate-300'
              }`}
            >
              {t.navCoaching}
            </button>
            <button
              type="button"
              onClick={() => {
                onViewChange('antidecay');
                setMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-bold uppercase tracking-wider ${
                activeView === 'antidecay' ? 'bg-rose-950/60 text-white border border-rose-500/30' : 'text-slate-300'
              }`}
            >
              {t.navAntiDecay || 'Anti-Decay'}
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  onViewChange(getDashboardView());
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-left text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-rose-600 to-amber-500 text-white flex items-center justify-between shadow-lg shadow-rose-950/60"
              >
                <span>{role === 'ADMIN' ? 'Espace Admin' : role === 'BOOSTER' ? 'Espace Booster' : 'Mes Commandes'}</span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-black/40">{role}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-left text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-rose-600 to-amber-500 text-white flex items-center gap-2 shadow-lg shadow-rose-950/60"
              >
                <LogIn size={15} />
                <span>{t.navLogIn}</span>
              </button>
            )}

            {/* Mobile Language Switcher Row */}
            <div className="pt-2 mt-2 border-t border-rose-900/30 flex items-center justify-between px-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Langue :</span>
              <div className="flex items-center gap-1.5">
                {LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      onChangeLang(item.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                      lang === item.code
                        ? 'bg-rose-950/80 border-rose-500/60 ring-1 ring-rose-400'
                        : 'bg-[#150e1b] border-rose-500/20 opacity-70 hover:opacity-100'
                    }`}
                    title={item.label}
                  >
                    <FlagIcon code={item.code} className="w-5 h-3.5 rounded-xs" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
