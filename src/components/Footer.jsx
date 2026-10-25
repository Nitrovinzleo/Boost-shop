import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#060408] border-t border-[#e11d48]/15 mt-20 py-12 px-4 md:px-8 text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider text-gradient-ruby">
              SEVERUM
            </span>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase bg-[#e11d48]/10 px-2 py-0.5 rounded border border-[#e11d48]/20">
              Rankup
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Plateforme haut de gamme de boosting et de coaching pour League of Legends. Service rapide, sécurisé et anonymat garanti par les meilleurs joueurs Master et Challenger.
          </p>
        </div>

        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Services
          </h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#boosting" className="hover:text-white transition-colors">Boost de Division</a></li>
            <li><a href="#placements" className="hover:text-white transition-colors">Matchs de Placement</a></li>
            <li><a href="#netwins" className="hover:text-white transition-colors">Victoires Nettes</a></li>
            <li><a href="#coaching" className="hover:text-white transition-colors">Coaching Privé</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Assistance & Sécurité
          </h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-1.5 text-emerald-400">
              <Shield size={13} />
              <span>Garantie Satisfait ou Remboursé</span>
            </li>
            <li><a href="#faq" className="hover:text-white transition-colors">Questions Fréquentes</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Support Discord 24/7</a></li>
            <li><a href="#terms" className="hover:text-white transition-colors">Conditions Générales</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>&copy; {new Date().getFullYear()} Severum. Tous droits réservés.</p>
        <p className="max-w-md text-center md:text-right">
          Severum n'est pas affilié, approuvé ou associé à Riot Games ou League of Legends.
        </p>
      </div>
    </footer>
  );
}
