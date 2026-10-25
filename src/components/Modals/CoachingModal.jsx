import { useEffect } from 'react';
import { X, Mic, Monitor, Calendar, Sparkles } from 'lucide-react';
import logoImg from '../../assets/logo-severum.png';
import { translations } from '../../locales/translations';

export default function CoachingModal({ isOpen, onClose, lang = 'en', onConfirm }) {
  const t = translations[lang] || translations.en;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[480px] my-auto max-h-[90vh] flex flex-col rounded-2xl border border-[#e11d48]/25 bg-[#120d16]/98 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_-10px_rgba(225,29,72,0.25)] text-left relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="coaching-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeModal}
          className="absolute top-3.5 right-3.5 w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-[#f43f5e]/40 hover:bg-[#e11d48]/20 flex items-center justify-center transition-all cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          {/* Header Branding */}
          <div className="text-center mb-4">
            <img
              src={logoImg}
              alt="Severum Logo"
              className="h-14 w-auto mx-auto rounded-2xl overflow-hidden object-contain filter drop-shadow-[0_0_14px_rgba(225,29,72,0.45)] mb-2"
            />
            <h4 className="text-lg font-black tracking-wider text-gradient-ruby mb-0.5">
              SEVERUM
            </h4>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
              {t.navCoaching}
            </span>
          </div>

          <h3
            id="coaching-modal-title"
            className="text-base font-extrabold text-white text-center mb-4"
          >
            {t.coachingModalTitle}
          </h3>

          {/* Terms & Modalities Card List */}
          <div className="space-y-3 p-4 rounded-xl bg-[#0c0810]/85 border border-[#e11d48]/15 mb-5">
            {/* Term 1 */}
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-lg bg-[#e11d48]/15 border border-[#e11d48]/30 text-[#f43f5e] flex items-center justify-center shrink-0">
                <Mic size={16} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white mb-0.5">
                  {t.coachingTerm1Title}
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.coachingTerm1Desc}
                </p>
              </div>
            </div>

            {/* Term 2 */}
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-lg bg-[#e11d48]/15 border border-[#e11d48]/30 text-[#f43f5e] flex items-center justify-center shrink-0">
                <Monitor size={16} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white mb-0.5">
                  {t.coachingTerm2Title}
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.coachingTerm2Desc}
                </p>
              </div>
            </div>

            {/* Term 3 */}
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-lg bg-[#e11d48]/15 border border-[#e11d48]/30 text-[#f43f5e] flex items-center justify-center shrink-0">
                <Calendar size={16} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white mb-0.5">
                  {t.coachingTerm3Title}
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.coachingTerm3Desc}
                </p>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={onConfirm}
            className="w-full min-h-[46px] py-3 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white text-xs font-extrabold uppercase tracking-wider shadow-[0_6px_20px_rgba(225,29,72,0.4)] hover:shadow-[0_8px_25px_rgba(225,29,72,0.6)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={15} />
            <span>{t.coachingBtnStart}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
