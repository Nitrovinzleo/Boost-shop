import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Hero from './components/Hero';
import Calculator from './components/Calculator';
import Coaching from './components/Coaching';
import AntiDecay from './components/AntiDecay';
import Footer from './components/Footer';
import CoachingModal from './components/Modals/CoachingModal';
import CheckoutModal from './components/Modals/CheckoutModal';
import ClientDashboard from './components/Dashboards/ClientDashboard';
import BoosterDashboard from './components/Dashboards/BoosterDashboard';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import AuthModal from './components/Dashboards/AuthModal';
import wallpImg from './assets/WallP.png';
import { translations } from './locales/translations';

export default function App() {
  const [lang, setLang] = useState('fr');
  const [view, setView] = useState('home'); // 'home', 'boosting', 'coaching', 'antidecay', 'dashboard-client', 'dashboard-booster', 'dashboard-admin'
  const [isCoachingModalOpen, setIsCoachingModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState({
    boostType: 'division',
    server: 'EUW',
    queue: 'Solo/Duo (5v5)',
    price: 0,
  });

  const t = translations[lang] || translations.fr || translations.en;

  // Ensure page always starts at the very top (Y=0) without browser auto-restoring scroll
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const rafId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
    const t1 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 40);
    const t2 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 120);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [view]);

  const handleViewChange = (newView) => {
    setView(newView);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleCoachingNavClick = () => {
    if (view === 'coaching') return;
    setIsCoachingModalOpen(true);
  };

  const handleConfirmCoachingIntro = () => {
    setIsCoachingModalOpen(false);
    setView('coaching');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleOpenCheckout = (details = {}) => {
    setCheckoutDetails(details);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08060a] text-white flex flex-col relative overflow-x-clip">
      {/* Background Decor Layer (Clips orbs without breaking position:sticky on header) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Cinematic LoL Wallpaper Background Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 18%, rgba(8, 6, 10, 0.60) 0%, rgba(8, 6, 10, 0.88) 60%, #08060a 100%), url(${wallpImg})`,
          }}
        />

        {/* Background Ambient Orbs (Portfolio style) */}
        <div className="glow-orb-ruby top-10 left-1/4 -translate-x-1/2 opacity-70 animate-pulse-subtle" />
        <div className="glow-orb-gold top-40 right-10 opacity-30" />
        <div className="glow-orb-ruby top-1/2 left-10 opacity-40" />
        <div className="glow-orb-ruby bottom-20 right-1/4 opacity-40" />

        {/* Subtle Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ef4444 1px, transparent 1px), linear-gradient(to bottom, #ef4444 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main Content & Navigation Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky Navigation */}
        <Navbar
          lang={lang}
          onChangeLang={setLang}
          activeView={view}
          onViewChange={handleViewChange}
          onCoachingClick={handleCoachingNavClick}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 pb-16 pt-4">
          {view === 'home' && (
            <Home
              lang={lang}
              onNavigateToBoosting={() => handleViewChange('boosting')}
              onNavigateToCoaching={handleCoachingNavClick}
              onNavigateToAntiDecay={() => handleViewChange('antidecay')}
            />
          )}

          {view === 'boosting' && (
            <div className="animate-tab-entrance">
              <Hero lang={lang} />
              <div className="text-center max-w-3xl mx-auto px-4 mb-2">
                <h2 className="text-2xl md:text-4xl font-black text-white mb-2">
                  {t.calcTitle}
                </h2>
                <p className="text-slate-400 text-xs md:text-sm">
                  {t.calcSubtitle}
                </p>
              </div>

              <Calculator
                lang={lang}
                onOpenCheckout={handleOpenCheckout}
              />
            </div>
          )}

          {view === 'coaching' && (
            <div className="animate-tab-entrance">
              <Hero lang={lang} />
              <Coaching
                lang={lang}
                onOpenCheckout={handleOpenCheckout}
              />
            </div>
          )}

          {view === 'antidecay' && (
            <div className="animate-tab-entrance">
              <AntiDecay
                lang={lang}
                onOpenCheckout={handleOpenCheckout}
              />
            </div>
          )}

          {view === 'dashboard-client' && (
            <div className="animate-tab-entrance">
              <ClientDashboard onNavigateToBoosting={() => handleViewChange('boosting')} />
            </div>
          )}

          {view === 'dashboard-booster' && (
            <div className="animate-tab-entrance">
              <BoosterDashboard />
            </div>
          )}

          {view === 'dashboard-admin' && (
            <div className="animate-tab-entrance">
              <AdminDashboard />
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />

        {/* Modals */}
        <CoachingModal
          isOpen={isCoachingModalOpen}
          onClose={() => setIsCoachingModalOpen(false)}
          lang={lang}
          onConfirm={handleConfirmCoachingIntro}
        />

        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          orderDetails={checkoutDetails}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={() => {}}
        />
      </div>
    </div>
  );
}
