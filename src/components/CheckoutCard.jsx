import { useState } from 'react';
import { ArrowRight, Tag, ShieldCheck, Sparkles, Flame } from 'lucide-react';
import RankIcon from './RankIcon';
import { isApexTier } from '../logic/pricingEngine';
import { translations } from '../locales/translations';

export default function CheckoutCard({
  lang = 'en',
  orderDetails,
  prices,
  validationError,
  promoDiscount,
  onApplyPromo,
  onCheckout,
}) {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState({ text: '', isError: false });

  const t = translations[lang] || translations.en;

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const code = promoInput.trim().toUpperCase();
    if (code === 'SEVERUM10') {
      onApplyPromo(0.10);
      setPromoMessage({ text: 'Code SEVERUM10 appliqué (-10%) !', isError: false });
    } else if (code === 'CHALLENGER') {
      onApplyPromo(0.15);
      setPromoMessage({ text: 'Code CHALLENGER appliqué (-15%) !', isError: false });
    } else if (code === 'SEVERUM40') {
      onApplyPromo(0.40);
      setPromoMessage({ text: 'Code SEVERUM40 appliqué (-40%) !', isError: false });
    } else {
      setPromoMessage({ text: 'Code promo invalide.', isError: true });
    }
  };

  const isPriceZero = prices.sale <= 0;

  return (
    <div className="glass-card shimmer-card rounded-2xl p-6 border border-rose-500/20 bg-[#120d15]/90 backdrop-blur-xl sticky top-24 shadow-2xl shadow-black/60">
      <h3 className="text-base font-extrabold text-white pb-3 border-b border-rose-900/20 mb-4 text-left flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-rose-500" />
          <span>{t.orderSummary}</span>
        </span>
        <span className="text-[10px] font-mono text-rose-300 uppercase tracking-widest bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-500/30">
          LoL Rankup
        </span>
      </h3>

      {/* Visual Rank Comparison */}
      {orderDetails.boostType === 'division' && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0d0912]/90 border border-rose-500/20 mb-4">
          <div className="flex flex-col items-center">
            <RankIcon tier={orderDetails.currentTier} size={54} />
            <span className="text-[11px] font-bold text-white mt-1">
              {orderDetails.currentTier} {!isApexTier(orderDetails.currentTier) ? orderDetails.currentDivision : `${orderDetails.currentLp} LP`}
            </span>
          </div>

          <div className="flex flex-col items-center px-2">
            <ArrowRight size={18} className="text-rose-400 animate-pulse" />
          </div>

          <div className="flex flex-col items-center">
            <RankIcon tier={orderDetails.desiredTier} size={54} />
            <span className="text-[11px] font-bold text-white mt-1">
              {orderDetails.desiredTier} {!isApexTier(orderDetails.desiredTier) ? orderDetails.desiredDivision : `${orderDetails.desiredLp} LP`}
            </span>
          </div>
        </div>
      )}

      {/* Order Details List */}
      <div className="space-y-2 text-xs font-medium text-slate-300 mb-5 text-left">
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">{t.type}</span>
          <span className="font-semibold text-white uppercase">
            {orderDetails.boostType === 'division' ? t.divisionBoost : orderDetails.boostType === 'placement' ? t.placementBoost : t.netWinsBoost}
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">{t.server} / {t.queue}</span>
          <span className="font-semibold text-white">
            {orderDetails.server} • {orderDetails.queue}
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-slate-400">{t.boosterMode}</span>
          <span className="font-semibold text-white">
            {orderDetails.isDuo ? t.duoBoost : t.soloBoost}
          </span>
        </div>

        {/* Add-ons list if any active */}
        {Object.entries(orderDetails.addons || {}).some(([_, v]) => v) && (
          <div className="pt-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
              {t.activeAddons}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {orderDetails.addons.offlineMode && (
                <span className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-200 text-[10px] font-bold">
                  {t.offlineMode}
                </span>
              )}
              {orderDetails.addons.specificChampions && (
                <span className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-200 text-[10px] font-bold">
                  {t.champions} (+15%)
                </span>
              )}
              {orderDetails.addons.priorityOrder && (
                <span className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-200 text-[10px] font-bold">
                  {t.priority} (+20%)
                </span>
              )}
              {orderDetails.addons.streamGames && (
                <span className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-200 text-[10px] font-bold">
                  {t.stream} (+15%)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Promo Code Form */}
      <form onSubmit={handlePromoSubmit} className="mb-5">
        <div className="flex rounded-xl overflow-hidden border border-rose-500/25 focus-within:border-rose-500 transition-colors bg-[#0d0912]">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder={t.promoPlaceholder}
            className="w-full bg-transparent px-3.5 py-2.5 text-xs text-white uppercase font-bold tracking-wider outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="px-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shrink-0 cursor-pointer"
          >
            {t.applyPromo}
          </button>
        </div>
        {promoMessage.text && (
          <p className={`text-[11px] font-semibold mt-1.5 text-left ${promoMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
            {promoMessage.text}
          </p>
        )}
      </form>

      {/* Price Breakdown */}
      <div className="pt-3 border-t border-rose-900/20">
        {validationError ? (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-semibold text-center mb-4">
            {validationError}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>{t.originalPrice}</span>
              <span className="line-through decoration-slate-500 font-semibold">
                ${prices.original.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-baseline mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t.salePrice}
              </span>
              <span className="text-3xl font-black text-gradient-fiery drop-shadow-[0_0_16px_rgba(225,29,72,0.4)]">
                ${prices.sale.toFixed(2)}
              </span>
            </div>

            {['Diamond', 'Master', 'Grandmaster', 'Challenger'].includes(orderDetails.desiredTier || orderDetails.currentTier) && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/20 mb-4 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span>Maintien anti-decay recommandé</span>
                </span>
                <span className="text-[10px] font-mono text-rose-400 font-bold">Dès 39€/m</span>
              </div>
            )}

            {/* Action Button (Portfolio CTA Style) */}
            <button
              type="button"
              disabled={isPriceZero}
              onClick={onCheckout}
              className="w-full min-h-[48px] py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-950/60 hover:shadow-rose-950/90 hover:scale-[1.02] active:scale-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>{t.orderNow}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-3 text-center">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>{t.secureCheckout}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
