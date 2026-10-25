import { useState } from 'react';
import { Shield, Sparkles, User, Users } from 'lucide-react';
import RankIcon from './RankIcon';
import CustomSelect from './CustomSelect';
import CheckoutCard from './CheckoutCard';
import {
  TIERS,
  DIVISIONS,
  SERVERS,
  QUEUES,
  calculateBoostPricing,
  getRankValue,
  isApexTier,
} from '../logic/pricingEngine';
import { translations } from '../locales/translations';

export default function Calculator({ lang = 'en', onOpenCheckout }) {
  const [boostType, setBoostType] = useState('division'); // division, placement, win

  // Division states
  const [currentTier, setCurrentTier] = useState('Iron');
  const [currentDivision, setCurrentDivision] = useState('IV');
  const [currentLp, setCurrentLp] = useState(0);
  const [desiredTier, setDesiredTier] = useState('Bronze');
  const [desiredDivision, setDesiredDivision] = useState('IV');
  const [desiredLp, setDesiredLp] = useState(100);

  // Placement states
  const [placementTier, setPlacementTier] = useState('Gold');
  const [placementGames, setPlacementGames] = useState(5);

  // Win states
  const [winTier, setWinTier] = useState('Gold');
  const [winCount, setWinCount] = useState(5);

  // Global order config
  const [server, setServer] = useState('EUW');
  const [queue, setQueue] = useState('Solo/Duo (5v5)');
  const [isDuo, setIsDuo] = useState(false);

  // Addons
  const [addons, setAddons] = useState({
    offlineMode: false,
    specificChampions: false,
    priorityOrder: false,
    streamGames: false,
  });

  const [promoDiscount, setPromoDiscount] = useState(0);

  const t = translations[lang] || translations.en;

  const pricing = calculateBoostPricing({
    boostType,
    currentTier,
    currentDivision,
    currentLp,
    desiredTier,
    desiredDivision,
    desiredLp,
    placementTier,
    placementGames,
    winTier,
    winCount,
    addons,
    isDuo,
    promoDiscount,
  });

  const toggleAddon = (key) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCurrentTierSelect = (tier) => {
    setCurrentTier(tier);
    const isCurrentApex = isApexTier(tier);
    const newDiv = isCurrentApex ? 'IV' : currentDivision;
    const newLp = isCurrentApex ? 0 : currentLp;
    if (isCurrentApex) setCurrentLp(0);

    const curVal = getRankValue(tier, newDiv, newLp);
    const desVal = getRankValue(desiredTier, desiredDivision, desiredLp);
    if (desVal <= curVal) {
      const curIdx = TIERS.indexOf(tier);
      if (curIdx < TIERS.length - 1) {
        const nextTier = TIERS[curIdx + 1];
        setDesiredTier(nextTier);
        if (isApexTier(nextTier)) {
          setDesiredLp(100);
        } else {
          setDesiredDivision('IV');
        }
      } else {
        setDesiredTier('Challenger');
        setDesiredLp(100);
      }
    }
  };

  const handleDesiredTierSelect = (tier) => {
    setDesiredTier(tier);
    if (isApexTier(tier) && desiredLp === 0) {
      setDesiredLp(100);
    }
  };

  const handleCurrentDivSelect = (div) => {
    setCurrentDivision(div);
    const curVal = getRankValue(currentTier, div, currentLp);
    const desVal = getRankValue(desiredTier, desiredDivision, desiredLp);
    if (desVal <= curVal) {
      const curIdx = TIERS.indexOf(currentTier);
      if (curIdx < TIERS.length - 1) {
        const nextTier = TIERS[curIdx + 1];
        setDesiredTier(nextTier);
        if (isApexTier(nextTier)) {
          setDesiredLp(100);
        } else {
          setDesiredDivision('IV');
        }
      } else {
        setDesiredTier('Challenger');
        setDesiredLp(100);
      }
    }
  };

  const orderDetails = {
    boostType,
    currentTier,
    currentDivision,
    currentLp,
    desiredTier,
    desiredDivision,
    desiredLp,
    placementTier,
    placementGames,
    winTier,
    winCount,
    server,
    queue,
    isDuo,
    addons,
    price: pricing.sale,
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-tab-entrance">
      {/* Navigation Tabs Pill (Portfolio Segment Style) */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-1.5 bg-[#140d17]/90 border border-rose-900/30 rounded-full p-1.5 backdrop-blur-md shadow-inner shadow-black/50">
          <button
            type="button"
            onClick={() => setBoostType('division')}
            className={`min-h-[42px] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              boostType === 'division'
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-950/80 tab-active-glow font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-rose-950/30'
            }`}
          >
            {t.divisionBoost}
          </button>
          <button
            type="button"
            onClick={() => setBoostType('placement')}
            className={`min-h-[42px] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              boostType === 'placement'
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-950/80 tab-active-glow font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-rose-950/30'
            }`}
          >
            {t.placementBoost}
          </button>
          <button
            type="button"
            onClick={() => setBoostType('win')}
            className={`min-h-[42px] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              boostType === 'win'
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-950/80 tab-active-glow font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-rose-950/30'
            }`}
          >
            {t.netWinsBoost}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Selectors Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* DIVISION BOOST UI */}
          {boostType === 'division' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Rank Panel */}
              <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/85 text-left shadow-xl shadow-black/40">
                <div className="flex items-center gap-4 mb-5 pb-4 border-b border-rose-900/20">
                  <RankIcon tier={currentTier} size={72} />
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300/80">
                      {t.currentRank}
                    </span>
                    <h4 className="text-xl font-black text-white">
                      {currentTier} {!isApexTier(currentTier) ? currentDivision : `${currentLp} LP`}
                    </h4>
                  </div>
                </div>

                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Palier
                </label>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-5">
                  {TIERS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => handleCurrentTierSelect(tier)}
                      className={`min-h-[38px] py-2 px-0.5 rounded-xl text-[11px] font-bold uppercase transition-all duration-150 cursor-pointer ${
                        currentTier === tier
                          ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950 border border-rose-500/60 font-black scale-[1.02]'
                          : 'bg-[#18111d] text-slate-300 border border-rose-500/15 hover:border-rose-500/40 hover:text-white hover:bg-rose-950/20'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                {!isApexTier(currentTier) ? (
                  <>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                      Division
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {DIVISIONS.map((div) => (
                        <button
                          key={div}
                          type="button"
                          onClick={() => handleCurrentDivSelect(div)}
                          className={`min-h-[40px] py-2 rounded-xl text-xs font-extrabold transition-all duration-150 cursor-pointer ${
                            currentDivision === div
                              ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950 border border-rose-500/60 font-black scale-[1.02]'
                              : 'bg-[#18111d] text-slate-300 border border-rose-500/15 hover:border-rose-500/40 hover:text-white hover:bg-rose-950/20'
                          }`}
                        >
                          {div}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-400">{t.currentLp}</span>
                      <span className="text-rose-400 font-mono font-bold">{currentLp} LP</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="25"
                      value={currentLp}
                      onChange={(e) => setCurrentLp(parseInt(e.target.value, 10))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Desired Rank Panel */}
              <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/85 text-left shadow-xl shadow-black/40">
                <div className="flex items-center gap-4 mb-5 pb-4 border-b border-rose-900/20">
                  <RankIcon tier={desiredTier} size={72} />
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300/80">
                      {t.desiredRank}
                    </span>
                    <h4 className="text-xl font-black text-white">
                      {desiredTier} {!isApexTier(desiredTier) ? desiredDivision : `${desiredLp} LP`}
                    </h4>
                  </div>
                </div>

                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Palier
                </label>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-5">
                  {TIERS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => handleDesiredTierSelect(tier)}
                      className={`min-h-[38px] py-2 px-0.5 rounded-xl text-[11px] font-bold uppercase transition-all duration-150 cursor-pointer ${
                        desiredTier === tier
                          ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950 border border-rose-500/60 font-black scale-[1.02]'
                          : 'bg-[#18111d] text-slate-300 border border-rose-500/15 hover:border-rose-500/40 hover:text-white hover:bg-rose-950/20'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                {!isApexTier(desiredTier) ? (
                  <>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                      Division
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {DIVISIONS.map((div) => (
                        <button
                          key={div}
                          type="button"
                          onClick={() => setDesiredDivision(div)}
                          className={`min-h-[40px] py-2 rounded-xl text-xs font-extrabold transition-all duration-150 cursor-pointer ${
                            desiredDivision === div
                              ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950 border border-rose-500/60 font-black scale-[1.02]'
                              : 'bg-[#18111d] text-slate-300 border border-rose-500/15 hover:border-rose-500/40 hover:text-white hover:bg-rose-950/20'
                          }`}
                        >
                          {div}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-400">{t.desiredLp}</span>
                      <span className="text-rose-400 font-mono font-bold">{desiredLp} LP</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1500"
                      step="50"
                      value={desiredLp}
                      onChange={(e) => setDesiredLp(parseInt(e.target.value, 10))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PLACEMENT BOOST UI */}
          {boostType === 'placement' && (
            <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/85 text-left shadow-xl shadow-black/40">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-rose-900/20">
                <RankIcon tier={placementTier} size={72} />
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300/80">
                    Saison Précédente
                  </span>
                  <h4 className="text-xl font-black text-white">{placementTier}</h4>
                </div>
              </div>

              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Palier Précédent
              </label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-6">
                {TIERS.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setPlacementTier(tier)}
                    className={`min-h-[38px] py-2 px-0.5 rounded-xl text-[11px] font-bold uppercase transition-all duration-150 cursor-pointer ${
                      placementTier === tier
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950 border border-rose-500/60 font-black scale-[1.02]'
                        : 'bg-[#18111d] text-slate-300 border border-rose-500/15 hover:border-rose-500/40 hover:text-white hover:bg-rose-950/20'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="text-slate-300">{t.placementGamesLabel}</span>
                <span className="text-xl text-rose-400 font-black">{placementGames} Games</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={placementGames}
                onChange={(e) => setPlacementGames(parseInt(e.target.value, 10))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          )}

          {/* NET WINS BOOST UI */}
          {boostType === 'win' && (
            <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/85 text-left shadow-xl shadow-black/40">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-rose-900/20">
                <RankIcon tier={winTier} size={72} />
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-300/80">
                    Rang Actuel
                  </span>
                  <h4 className="text-xl font-black text-white">{winTier}</h4>
                </div>
              </div>

              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Palier Actuel
              </label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-6">
                {TIERS.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setWinTier(tier)}
                    className={`min-h-[38px] py-2 px-0.5 rounded-xl text-[11px] font-bold uppercase transition-all duration-150 cursor-pointer ${
                      winTier === tier
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950 border border-rose-500/60 font-black scale-[1.02]'
                        : 'bg-[#18111d] text-slate-300 border border-rose-500/15 hover:border-rose-500/40 hover:text-white hover:bg-rose-950/20'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="text-slate-300">{t.netWinsLabel}</span>
                <span className="text-xl text-rose-400 font-black">{winCount} Wins</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={winCount}
                onChange={(e) => setWinCount(parseInt(e.target.value, 10))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          )}

          {/* Config Controls (Server, Queue, Solo/Duo Mode) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 text-left">
                {t.server}
              </label>
              <CustomSelect
                options={SERVERS}
                value={server}
                onChange={setServer}
                ariaLabel={t.server}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 text-left">
                {t.queue}
              </label>
              <CustomSelect
                options={QUEUES}
                value={queue}
                onChange={setQueue}
                ariaLabel={t.queue}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 text-left">
                {t.boosterMode}
              </label>
              <div className="flex p-1 rounded-xl bg-[#140e19] border border-rose-500/20 min-h-[44px]">
                <button
                  type="button"
                  onClick={() => setIsDuo(false)}
                  className={`flex-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    !isDuo
                      ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User size={14} />
                  <span>Solo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDuo(true)}
                  className={`flex-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isDuo
                      ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={14} />
                  <span>Duo (+40%)</span>
                </button>
              </div>
            </div>
          </div>

          {/* ADD-ONS SECTION */}
          <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/85 text-left shadow-xl shadow-black/40">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-rose-400" />
              <span>{t.addonsTitle}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Offline Mode */}
              <label
                onClick={() => toggleAddon('offlineMode')}
                className={`p-4 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all duration-200 ${
                  addons.offlineMode
                    ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/60'
                    : 'bg-[#150f1c] border-rose-500/15 hover:border-rose-500/40 hover:bg-rose-950/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.offlineMode}
                  onChange={() => {}}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <div>
                  <div className="text-xs font-extrabold text-white">{t.offlineMode}</div>
                  <div className="text-[11px] text-slate-400">{t.offlineDesc}</div>
                </div>
              </label>

              {/* Specific Champions */}
              <label
                onClick={() => toggleAddon('specificChampions')}
                className={`p-4 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all duration-200 ${
                  addons.specificChampions
                    ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/60'
                    : 'bg-[#150f1c] border-rose-500/15 hover:border-rose-500/40 hover:bg-rose-950/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.specificChampions}
                  onChange={() => {}}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <div>
                  <div className="text-xs font-extrabold text-white">{t.champions}</div>
                  <div className="text-[11px] text-slate-400">{t.championsDesc}</div>
                </div>
              </label>

              {/* Priority Order */}
              <label
                onClick={() => toggleAddon('priorityOrder')}
                className={`p-4 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all duration-200 ${
                  addons.priorityOrder
                    ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/60'
                    : 'bg-[#150f1c] border-rose-500/15 hover:border-rose-500/40 hover:bg-rose-950/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.priorityOrder}
                  onChange={() => {}}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <div>
                  <div className="text-xs font-extrabold text-white">{t.priority}</div>
                  <div className="text-[11px] text-slate-400">{t.priorityDesc}</div>
                </div>
              </label>

              {/* Stream Games */}
              <label
                onClick={() => toggleAddon('streamGames')}
                className={`p-4 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all duration-200 ${
                  addons.streamGames
                    ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/60'
                    : 'bg-[#150f1c] border-rose-500/15 hover:border-rose-500/40 hover:bg-rose-950/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons.streamGames}
                  onChange={() => {}}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <div>
                  <div className="text-xs font-extrabold text-white">{t.stream}</div>
                  <div className="text-[11px] text-slate-400">{t.streamDesc}</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sticky Summary Column */}
        <div className="lg:col-span-4">
          <CheckoutCard
            lang={lang}
            orderDetails={orderDetails}
            prices={pricing}
            validationError={pricing.validationError}
            promoDiscount={promoDiscount}
            onApplyPromo={setPromoDiscount}
            onCheckout={onOpenCheckout}
          />
        </div>
      </div>
    </section>
  );
}
