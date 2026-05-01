import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { News, newsService } from '../services/newsService';
import NewsCard from '../components/NewsCard';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Filter, Dribbble, Target } from 'lucide-react';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'all' | 'pro' | 'amateur'>('all');

  useEffect(() => {
    loadNews();
  }, [category, type]);

  const loadNews = async () => {
    if (!category) return;
    setLoading(true);
    let data;
    if (type === 'all') {
      const all = await newsService.getAllNews();
      data = all?.filter(n => n.category === category);
    } else {
      data = await newsService.getNewsByCategory(category, type === 'amateur');
    }
    setNews(data || []);
    setLoading(false);
  };

  const getCategoryInfo = () => {
    switch (category) {
      case 'football': return { name: 'Futbol', icon: Trophy };
      case 'basketball': return { name: 'Basketbol', icon: Dribbble };
      case 'volleyball': return { name: 'Voleybol', icon: Target };
      default: return { name: 'Spor', icon: Trophy };
    }
  };

  const { name: categoryName, icon: CategoryIcon } = getCategoryInfo();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12 md:space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 border-b border-slate-200 pb-8 md:pb-12">
        <div className="w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/5 text-brand rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6 border border-brand/10">
            <CategoryIcon size={12} className="md:hidden" />
            <CategoryIcon size={14} className="hidden md:block" /> KATEGORİ GÖRÜNÜMÜ
          </div>
          <h1 className="text-3xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-[1.1] md:leading-none">
            {categoryName} <span className="text-brand">HABERLERİ</span>
          </h1>
        </div>

        {category === 'football' && (
          <div className="flex bg-slate-100 p-1 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest shadow-inner border border-slate-200 w-full md:w-auto">
            <button
              onClick={() => setType('all')}
              className={`flex-1 md:flex-none px-4 md:px-5 py-2 md:py-2.5 rounded-lg transition-all ${type === 'all' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              TÜMÜ
            </button>
            <button
              onClick={() => setType('pro')}
              className={`flex-1 md:flex-none px-4 md:px-5 py-2 md:py-2.5 rounded-lg transition-all ${type === 'pro' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              PRO
            </button>
            <button
              onClick={() => setType('amateur')}
              className={`flex-1 md:flex-none px-4 md:px-5 py-2 md:py-2.5 rounded-lg transition-all ${type === 'amateur' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-500 hover:text-slate-800'}`}
            >
              AMATÖR
            </button>
          </div>
        )}
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${category}-${type}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {news.length > 0 ? (
              news.map(n => (
                <NewsCard key={n.id} news={n} />
              ))
            ) : (
              <div className="col-span-full py-40 text-center text-slate-400 space-y-6 bg-slate-100/50 rounded-3xl border border-dashed border-slate-300">
                 <Filter size={64} className="mx-auto opacity-10" />
                 <p className="text-sm font-bold uppercase tracking-widest">Bu filtrede henüz içerik girilmemiş.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
