import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/5 py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 border-b border-white/5 pb-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-brand w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-1 ring-white/10">
                S+
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase">
                SPORTAL<span className="text-brand">+</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs font-medium leading-relaxed">
              Türkiye'nin en yeni spor platformu. Sportal+ ile sahanın içindeki tutkuyu anlık olarak paylaşıyoruz.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-12 gap-y-4 md:gap-y-6 text-sm md:text-base font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-100">
            <Link to="/kunye" className="hover:text-brand transition-all hover:scale-110">KÜNYE</Link>
            <Link to="/gizlilik" className="hover:text-brand transition-all hover:scale-110">GİZLİLİK</Link>
          </div>
        </div>

        <div className="mt-8 flex justify-center md:justify-end">
           <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity">
             © 2026 Sportal+ Medya Grubu | Tüm Hakları Saklıdır
           </p>
        </div>
      </div>
    </footer>
  );
}
