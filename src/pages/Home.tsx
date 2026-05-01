import { useEffect, useState } from 'react';
import { News, newsService } from '../services/newsService';
import NewsCard from '../components/NewsCard';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Zap, Newspaper, ArrowRight, Dribbble, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import TwitterTimeline from '../components/TwitterTimeline';

export default function Home() {
  const [featuredNews, setFeaturedNews] = useState<News | null>(null);
  const [recentNews, setRecentNews] = useState<News[]>([]);
  const [footballType, setFootballType] = useState<'pro' | 'amateur'>('pro');
  const [footballNews, setFootballNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = newsService.subscribeToRecentNews(24, (all) => {
      if (all && all.length > 0) {
        setFeaturedNews(all[0]);
        // Only slice if there are more than 1
        setRecentNews(all.length > 1 ? all.slice(1) : []);
      } else {
        setFeaturedNews(null);
        setRecentNews([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadCategoryData = async () => {
      const fbNews = await newsService.getNewsByCategory('football', footballType === 'amateur');
      setFootballNews(fbNews?.slice(0, 4) || []);
    };
    loadCategoryData();
  }, [footballType]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'football': return Trophy;
      case 'basketball': return Dribbble;
      case 'volleyball': return Target;
      default: return Zap;
    }
  };

  if (loading && recentNews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16 md:space-y-24">
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left: Main Feed (8 columns) */}
        <div className="lg:col-span-8 space-y-16 md:space-y-20">
          {/* Latest News Section */}
          <section id="son-gelismeler" className="space-y-10 md:space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-slate-100 pb-6 md:pb-10 gap-6 md:gap-8">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4"
                >
                  <div className="h-1 w-12 md:h-1.5 md:w-16 bg-brand rounded-full" />
                  <span className="text-[10px] md:text-[11px] font-black text-brand uppercase tracking-[0.3em] md:tracking-[0.4em]">CANLI VE GÜNCEL</span>
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                  SON <span className="text-brand">GELİŞMELER</span>
                </h2>
              </div>
              
              <div className="hidden md:block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <span className="w-2 h-2 bg-brand rounded-full animate-pulse" />
                  {recentNews.length + (featuredNews ? 1 : 0)} HABER AKIŞI
                </span>
              </div>
            </div>

            <div className="space-y-12 md:space-y-16">
              {featuredNews && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative group rounded-[32px] md:rounded-[64px] overflow-hidden bg-slate-950 shadow-2xl ring-1 ring-white/10"
                >
                  <div className="aspect-[16/9] md:aspect-[21/10] relative overflow-hidden">
                    <img 
                      src={featuredNews.image} 
                      className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[2s] ease-out shadow-inner" 
                      alt={featuredNews.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full space-y-3 md:space-y-4">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      <span className="bg-brand text-white text-[8px] md:text-[9px] font-black px-3 py-1 md:px-4 md:py-1.5 rounded-lg shadow-lg shadow-brand/20 uppercase tracking-[0.1em] md:tracking-[0.2em]">
                        MANŞET
                      </span>
                      <span className="text-white/50 text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2 backdrop-blur-md bg-white/5 px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-white/5">
                        {(() => {
                          const Icon = getCategoryIcon(featuredNews.category);
                          return (
                            <>
                              <Icon size={10} className="text-brand md:hidden" />
                              <Icon size={12} className="text-brand hidden md:block" />
                            </>
                          );
                        })()}
                        {featuredNews.category === 'football' ? 'FUTBOL' : featuredNews.category === 'basketball' ? 'BASKETBOL' : featuredNews.category === 'volleyball' ? 'VOLEYBOL' : featuredNews.category}
                      </span>
                    </div>
                    <Link to={`/news/${featuredNews.slug}`} className="block group/title">
                      <h3 className="text-xl md:text-4xl font-black text-white tracking-tight uppercase leading-snug group-hover/title:text-brand transition-all duration-500">
                        {featuredNews.title}
                      </h3>
                    </Link>
                    <p className="text-white/40 text-xs md:text-base font-medium leading-relaxed max-w-xl line-clamp-2">
                      {featuredNews.summary}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-12 md:gap-y-16">
                {recentNews.length > 0 ? (
                  recentNews.map((n, idx) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (idx % 2) * 0.1 }}
                    >
                      <NewsCard news={n} />
                    </motion.div>
                  ))
                ) : (
                  !featuredNews && (
                    <div className="col-span-2 py-40 text-center bg-white rounded-[64px] border-4 border-dashed border-slate-100">
                      <div className="inline-flex p-10 bg-slate-50 rounded-full mb-8 text-slate-200">
                        <Newspaper size={64} />
                      </div>
                      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm">Akış şu an boş görünüyor</p>
                    </div>
                  )
                )}
              </div>
            </div>
            
            <div className="flex justify-center pt-6">
              <Link to="/category/football" className="px-10 py-5 bg-white hover:bg-slate-900 border-2 border-slate-100 text-slate-900 hover:text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3 shadow-sm hover:shadow-xl">
                TÜM ARŞİVE GÖZ AT <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </div>

        {/* Right: Sidebar (4 columns) */}
        <aside className="lg:col-span-4 space-y-16">
          <section className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="bg-slate-950 p-2.5 rounded-xl text-white shadow-lg">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </div>
                CANLI AKIŞ
              </h2>
              <a href="https://x.com/sportalplus" target="_blank" rel="noreferrer" className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline px-4 py-2 bg-brand/5 rounded-full">
                TAKİP ET
              </a>
            </div>
            
            <div className="space-y-0 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 min-h-[400px] flex flex-col">
              <TwitterTimeline
                screenName="sportalplus"
                height={600}
              />
              <div className="p-4 bg-slate-100/50 text-center border-t border-slate-200">
                <a 
                  href="https://x.com/sportalplus" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[9px] font-black text-slate-400 hover:text-brand uppercase tracking-widest transition-colors"
                >
                  X.com'da Görüntüle
                </a>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-slate-50 text-center">
               <div className="flex justify-center gap-6 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
               </div>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-loose">
                 © 2026 Sportal+ Medya Grubu <br/> 
                 <span className="text-slate-900">Türkiye'nin En Büyük Yerel Ağı</span>
               </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
