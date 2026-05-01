import React from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Phone, MapPin, Scale } from 'lucide-react';

export default function Imprint() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-20 space-y-12 md:space-y-16">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand/5 text-brand rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/10">
          <Shield size={14} /> KURUMSAL BİLGİLER
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">KÜNYE</h1>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-10 md:space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Scale size={16} className="text-brand" /> YÖNETİM
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">İmtiyaz Sahibi</p>
                <p className="text-lg font-bold text-slate-900">Sportal+ Medya Grubu A.Ş.</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Genel Yayın Yönetmeni</p>
                <p className="text-lg font-bold text-slate-900">Samet Büyük</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Mail size={16} className="text-brand" /> İLETİŞİM
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                  <Phone size={14} />
                </div>
                <p className="text-xs font-black text-slate-900 tracking-widest">+90 538 984 23 53</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                  <Mail size={14} />
                </div>
                <p className="text-xs font-black text-slate-900 tracking-widest lowercase">sportalplus@gmail.com</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand/10 group-hover:text-brand transition-colors mt-0.5">
                  <MapPin size={14} />
                </div>
                <p className="text-[10px] font-black text-slate-500 leading-relaxed uppercase tracking-widest">
                  TÜRKİYE'NİN DİJİTAL SAHASI <br />
                  <span className="text-brand/60">FİZİKSEL OFİS BULUNMAMAKTADIR</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-10 border-t border-slate-100 space-y-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">YASAL BİLDİRİMLER</h2>
          <p className="text-sm text-slate-500 leading-loose font-medium">
            Sportal+.com bir Sportal+ Medya Grubu kuruluşu olup, Türkiye Cumhuriyeti yasalarına uygun olarak faaliyet göstermektedir. 
            Yayınlanan tüm haber, fotoğraf ve videoların telif hakları ilgili ajanslara veya kurumumuza aittir. 
            Yazılı izin alınmaksızın içeriklerin kopyalanması ve başka platformlarda yayınlanması 5846 sayılı FSEK hükümleri uyarınca suçtur.
          </p>
        </section>
      </div>
    </div>
  );
}
