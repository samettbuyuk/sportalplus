import React from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, FileText, ShieldCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-20 space-y-12 md:space-y-16">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand/5 text-brand rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/10">
          <Lock size={14} /> GÜVENLİK PROTOKOLLERİ
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">GİZLİLİK POLİTİKASI</h1>
      </header>

      <div className="bg-white rounded-[40px] border border-slate-200 p-8 md:p-12 shadow-sm space-y-10 md:space-y-12">
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-brand">
            <ShieldCheck size={24} />
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">VERİ KORUMA</h2>
          </div>
          <p className="text-sm text-slate-500 leading-loose font-medium">
            Kullanıcılarımızın gizliliği bizim için en öncelikli konudur. Sportal+.com üzerinden toplanan veriler, 
            6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca en yüksek güvenlik standartlarında korunmaktadır. 
            Verileriniz, açık rızanız olmaksızın üçüncü taraflarla kesinlikle paylaşılmaz.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Eye size={20} className="text-brand" />
            </div>
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">ÇEREZ POLİTİKASI</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-bold">
              Kullanıcı deneyimini optimize etmek amacıyla çerez (cookie) teknolojisini kullanmaktayız. 
              Bu veriler sadece anonim istatistiksel analizler için işlenmektedir.
            </p>
          </div>

          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <FileText size={20} className="text-brand" />
            </div>
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">KULLANIM ŞARTLARI</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-bold">
              Platformumuzda yer alan yorum alanları ve kullanıcı etkileşimleri, genel ahlak kuralları 
              ve yasal çerçeve içerisinde denetlenmektedir.
            </p>
          </div>
        </div>

        <section className="pt-10 border-t border-slate-100">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
             Son Güncelleme: 01.05.2026 | Sportal+ Medya Grubu Hukuk Departmanı
           </p>
        </section>
      </div>
    </div>
  );
}
