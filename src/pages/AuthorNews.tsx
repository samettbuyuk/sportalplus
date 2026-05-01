import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { News, newsService } from '../services/newsService';
import { motion } from 'motion/react';
import { User, Calendar, Eye, ArrowLeft, Trophy, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function AuthorNews() {
  const { authorName } = useParams<{ authorName: string }>();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      if (authorName) {
        const decodedName = decodeURIComponent(authorName);
        const data = await newsService.getNewsByAuthor(decodedName);
        setNews(data || []);
      }
      setLoading(false);
    };
    loadNews();
  }, [authorName]);

  const calculateExperience = () => {
    // Starting from May 1 (Index 4), increments monthly
    const startDate = decodedName === 'Samet Büyük' ? new Date(2018, 4, 1) : new Date(2024, 4, 1);
    const now = new Date();
    
    let months = (now.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += now.getMonth();
    
    if (months < 12) {
      return `${months} Ay`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} Yıl ${remainingMonths > 0 ? `${remainingMonths} Ay` : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const decodedName = authorName ? decodeURIComponent(authorName) : 'Editör';

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand transition-colors mb-12">
          <ArrowLeft size={14} /> Geri Dön
        </Link>

        {/* Author Profile Header */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-slate-200 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 rotate-12 text-brand pointer-events-none">
            <Trophy size={160} />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
            <div className="w-32 h-32 rounded-3xl bg-brand/10 flex items-center justify-center text-brand shadow-sm border border-brand/20 flex-shrink-0">
               <User size={64} strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="mb-6">
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-3">
                  <span className="text-[10px] font-black text-brand uppercase tracking-widest bg-brand/10 px-3 py-1 rounded border border-brand/20">RESMİ EDİTÖR</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded border border-slate-200">TEYİT EDİLMİŞ HESAP</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{decodedName}</h1>
              </div>

              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mb-8">
                {decodedName === 'Samet Büyük' 
                  ? "Sportal+ Baş Editörü. Türkiye ve dünya sporunun nabzını tutuyor, amatör liglerdeki tüm detayları süzüyor ve geniş vizyonuyla okuyuculara aktarıyor."
                  : "Sportal+ İçerik Yazarı. Türkiye ve dünya sporunun nabzını tutuyor, sahanın içindeki gelişmeleri süzüyor ve profesyonel analizlerle futbolseverlerin karşısına çıkıyor."}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-12 pt-8 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Toplam Haber</span>
                  <span className="text-3xl font-black text-slate-900">{news.length}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deneyim</span>
                  <span className="text-3xl font-black text-slate-900">{calculateExperience()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Author News List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Yazarın Son Haberleri</h2>
             <div className="h-1 flex-1 mx-8 bg-slate-200 rounded-full hidden md:block opacity-50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, idx) => (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
              >
                <Link to={`/news/${item.slug}`} className="relative h-56 overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      {item.category === 'football' ? 'FUTBOL' : item.category === 'basketball' ? 'BASKETBOL' : 'VOLEYBOL'}
                    </span>
                  </div>
                </Link>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-300" />
                      {item.createdAt?.seconds ? format(new Date(item.createdAt.seconds * 1000), 'd MMMM yyyy', { locale: tr }) : 'Yeni Haber'}
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <Eye size={14} className="text-slate-300" />
                      {item.clickCount}
                    </div>
                  </div>

                  <Link to={`/news/${item.slug}`} className="block group-hover:text-brand transition-colors mb-4 flex-1">
                    <h3 className="text-xl font-bold leading-tight line-clamp-2 uppercase tracking-tight">{item.title}</h3>
                  </Link>

                  <Link 
                    to={`/news/${item.slug}`}
                    className="inline-flex items-center gap-2 text-[10px] font-black text-brand uppercase tracking-widest pt-6 border-t border-slate-50 mt-auto"
                  >
                    Haberi Oku <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {news.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <User size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest">Bu yazara ait henüz haber bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
