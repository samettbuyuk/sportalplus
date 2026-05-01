import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { News, newsService } from '../services/newsService';
import { motion } from 'motion/react';
import { Tag, Calendar, Eye, ArrowLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function TagNews() {
  const { tagName } = useParams<{ tagName: string }>();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      if (tagName) {
        const decodedTag = decodeURIComponent(tagName);
        const data = await newsService.getNewsByTag(decodedTag);
        setNews(data || []);
      }
      setLoading(false);
    };
    loadNews();
  }, [tagName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const decodedTag = tagName ? decodeURIComponent(tagName) : '';

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand transition-colors mb-12">
          <ArrowLeft size={14} /> Ana Sayfa
        </Link>

        {/* Tag Header */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-slate-200 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 rotate-12 text-brand pointer-events-none">
            <Tag size={160} />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-brand/10 flex items-center justify-center text-brand shadow-sm border border-brand/20 flex-shrink-0">
               <Tag size={48} strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest bg-brand/10 px-3 py-1 rounded border border-brand/20 mb-3 inline-block">ETİKET ARŞİVİ</span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">#{decodedTag}</h1>
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                BU ETİKET İLE ETİKETLENMİŞ TOPLAM {news.length} HABER BULUNDU.
              </p>
            </div>
          </div>
        </div>

        {/* Tag News List */}
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

                <p className="text-slate-600 text-sm line-clamp-2 mb-6">
                  {item.summary}
                </p>

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
            <Tag size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest">Bu etikete ait henüz haber bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
