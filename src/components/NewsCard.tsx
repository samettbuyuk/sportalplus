import React from 'react';
import { Link } from 'react-router-dom';
import { News } from '../services/newsService';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion } from 'motion/react';
import { ExternalLink, Clock, Eye, Trophy, Dribbble, Target, Zap } from 'lucide-react';

interface NewsCardProps {
  key?: string;
  news: News;
  layout?: 'grid' | 'list' | 'featured';
}

const getCategoryInfo = (category: string) => {
  switch (category) {
    case 'football': return { name: 'FUTBOL', icon: Trophy, style: 'bg-blue-100 text-blue-700' };
    case 'basketball': return { name: 'BASKETBOL', icon: Dribbble, style: 'bg-orange-100 text-orange-700' };
    case 'volleyball': return { name: 'VOLEYBOL', icon: Target, style: 'bg-emerald-100 text-emerald-700' };
    default: return { name: category.toUpperCase(), icon: Zap, style: 'bg-slate-100 text-slate-700' };
  }
};

export default function NewsCard({ news, layout = 'grid' }: NewsCardProps) {
  const dateStr = news.createdAt?.toDate ? 
    formatDistanceToNow(news.createdAt.toDate(), { addSuffix: true, locale: tr }) : 
    'Az önce';

  const { name: catName, icon: CatIcon, style: catStyle } = getCategoryInfo(news.category);

  if (layout === 'featured') {
    return (
      <Link to={`/news/${news.slug}`} className="group relative block aspect-[21/9] overflow-hidden rounded-2xl bg-slate-900 shadow-xl border border-slate-200">
        <img
          src={news.image}
          alt={news.title}
          className="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className={`flex items-center gap-2 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${catStyle}`}>
              <CatIcon size={12} />
              {catName}
            </span>
            {news.isAmateur && (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded">
                Amatör
              </span>
            )}
            <span className="flex items-center gap-1.5 text-slate-300 text-xs font-medium">
              <Clock size={14} />
              {dateStr}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] mb-6 group-hover:text-slate-100 transition-colors">
            {news.title}
          </h2>
          <p className="text-slate-300 text-lg md:text-xl line-clamp-2 font-medium opacity-90 leading-relaxed">
            {news.summary}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`news-card group ${layout === 'list' ? 'flex gap-6' : 'flex flex-col'}`}
    >
      <Link to={`/news/${news.slug}`} className={`overflow-hidden bg-slate-100 ${layout === 'list' ? 'w-1/3 aspect-[4/3]' : 'aspect-[16/10] w-full'}`}>
        <img
          src={news.image}
          alt={news.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </Link>
      <div className={`p-6 flex flex-col flex-grow ${layout === 'list' ? 'w-2/3 py-4' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${catStyle}`}>
            <CatIcon size={10} />
            {catName}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 capitalize flex items-center gap-1">
             <Clock size={10} /> {dateStr}
          </span>
        </div>
        <Link to={`/news/${news.slug}`} className="block">
          <h3 className={`font-bold text-slate-900 group-hover:text-brand transition-colors mb-3 line-clamp-2 leading-snug ${layout === 'list' ? 'text-xl' : 'text-lg'}`}>
            {news.title}
          </h3>
        </Link>
        <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow font-medium leading-relaxed">
          {news.summary}
        </p>
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {news.tags.slice(0, 3).map((tag, idx) => (
              <Link 
                key={idx}
                to={`/etiket/${encodeURIComponent(tag)}`}
                className="text-[9px] font-black text-slate-400 hover:text-brand bg-slate-50 border border-slate-100 px-2 py-0.5 rounded transition-colors uppercase tracking-widest"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <Link 
            to={`/news/${news.slug}`} 
            className="text-xs font-bold text-slate-900 flex items-center gap-1.5 hover:text-brand transition-colors"
          >
            HABERİ OKU <ExternalLink size={14} />
          </Link>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
            <Eye size={12} /> {news.clickCount} Okunma
          </div>
        </div>
      </div>
    </motion.div>
  );
}
