import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { News, newsService } from '../services/newsService';
import { motion } from 'motion/react';
import { Calendar, Tag, Share2, ArrowLeft, Clock, Eye, Trophy, TrendingUp, User, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [related, setRelated] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorNewsCount, setAuthorNewsCount] = useState(0);

  useEffect(() => {
    const loadNews = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await newsService.getNewsBySlug(slug);
      if (data) {
        setNews(data);
        newsService.recordClick(data.id!);
        
        // Fetch author's news count
        const authorNews = await newsService.getNewsByAuthor(data.author);
        setAuthorNewsCount(authorNews.length);
        
        let relatedRes: News[] = [];
        if (data.tags && data.tags.length > 0) {
          // Attempt to find related news by tags
          const allNews = await newsService.getAllNews();
          if (allNews) {
            relatedRes = allNews.filter(n => 
              n.id !== data.id && 
              n.tags && 
              n.tags.some(t => data.tags.includes(t))
            );
          }
        }
        
        // Fallback to category if no tag-matched news found
        if (relatedRes.length === 0) {
          const catNews = await newsService.getNewsByCategory(data.category);
          relatedRes = catNews?.filter(r => r.id !== data.id) || [];
        }
        
        setRelated(relatedRes.slice(0, 5));
      }
      setLoading(false);
    };
    loadNews();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter">Haber Bulunamadı</h1>
        <Link to="/" className="text-brand font-bold hover:underline uppercase tracking-wide text-sm">Geri Dön</Link>
      </div>
    );
  }

  const formattedDate = news.createdAt?.toDate ? 
    format(news.createdAt.toDate(), 'd MMMM yyyy, HH:mm', { locale: tr }) : 
    '---';

  const catStyle = news.category === 'football' ? 'bg-blue-100 text-blue-700' : news.category === 'basketball' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 text-center space-y-6 md:space-y-8">
           <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand font-bold transition-colors text-[9px] md:text-[10px] uppercase tracking-widest bg-slate-50 px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-slate-200 shadow-sm">
             <ArrowLeft size={12} className="md:hidden" />
             <ArrowLeft size={14} className="hidden md:block" /> ANA SAYFAYA DÖN
           </Link>
           
           <div className="flex items-center justify-center gap-2 md:gap-3">
             <span className={`px-2.5 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded ${catStyle}`}>
               {news.category === 'football' ? 'Futbol' : news.category === 'basketball' ? 'Basketbol' : news.category === 'volleyball' ? 'Voleybol' : news.category}
             </span>
             {news.isAmateur && (
               <span className="px-2.5 md:px-3 py-0.5 md:py-1 bg-amber-100 text-amber-700 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded">
                 AMATÖR FUTBOL
               </span>
             )}
           </div>

           <h1 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.2] md:leading-[1.1] tracking-tight uppercase">
             {news.title}
           </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2 md:pt-4">
              <Link to={`/yazar/${encodeURIComponent(news.author || 'Sportal+ Editörü')}`} className="flex items-center gap-1.5 md:gap-2 hover:opacity-75 transition-opacity">
                <User size={12} className="text-brand md:hidden" />
                <User size={14} className="text-brand hidden md:block" />
                <span className="text-slate-900 border-b border-brand/30">{news.author || 'Sportal+ Editörü'}</span>
              </Link>
              <div className="flex items-center gap-1.5 md:gap-2">
                <Calendar size={12} className="text-slate-300 md:hidden" />
                <Calendar size={14} className="text-slate-300 hidden md:block" />
                {formattedDate}
              </div>
              <div className="hidden sm:flex items-center gap-1.5 md:gap-2">
                <Eye size={12} className="text-slate-300 md:hidden" />
                <Eye size={14} className="text-slate-300 hidden md:block" />
                {news.clickCount} Okunma
              </div>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 md:-mt-16 pb-16 md:pb-20">
        <div className="space-y-8 md:space-y-12">
          {/* Main Content Area */}
          <div className="relative aspect-[16/9] md:aspect-[21/10] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-2 md:border-4 border-white">
            <img 
              src={news.image} 
              alt={news.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 md:gap-12">
            <div className="lg:col-span-3 space-y-10 md:space-y-12">
              <article className="bg-white p-6 md:p-14 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <p className="text-lg md:text-xl font-bold text-slate-500 mb-8 md:mb-12 leading-relaxed font-serif italic border-l-4 md:border-l-8 border-brand/20 pl-4 md:pl-8">
                  {news.summary}
                </p>
                <div 
                  className="prose prose-slate prose-lg md:prose-xl max-w-none rich-text-content"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />

                {news.tags && news.tags.length > 0 && (
                  <div className="pt-12 mt-12 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Tag size={14} className="text-brand" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">İlgili Etiketler</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {news.tags.map((tag, idx) => (
                         <Link 
                           key={idx} 
                           to={`/etiket/${encodeURIComponent(tag)}`}
                           className="bg-slate-100 text-slate-600 hover:bg-brand hover:text-white transition-all duration-300 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wide"
                         >
                            #{tag}
                         </Link>
                       ))}
                    </div>
                  </div>
                )}

                <style>{`
                  .rich-text-content { 
                    max-width: 100%; 
                    overflow-x: hidden; 
                    word-wrap: break-word; 
                    overflow-wrap: break-word;
                    color: #1e293b;
                    font-size: 1.125rem;
                    line-height: 1.85;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                  }
                  .rich-text-content h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 2rem; margin-top: 3rem; color: #0f172a; tracking: -0.025em; line-height: 1.2; }
                  .rich-text-content h2 { font-size: 1.875rem; font-weight: 800; margin-bottom: 1.5rem; margin-top: 2.5rem; color: #0f172a; tracking: -0.025em; line-height: 1.3; }
                  .rich-text-content h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 1.25rem; margin-top: 2rem; color: #1e293b; line-height: 1.4; }
                  .rich-text-content p { margin-bottom: 1.75rem; font-weight: 400; }
                  .rich-text-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.75rem; }
                  .rich-text-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.75rem; }
                  .rich-text-content li { margin-bottom: 0.75rem; padding-left: 0.5rem; }
                  .rich-text-content strong { color: #0f172a; font-weight: 700; }
                  .rich-text-content a { color: #dc2626; text-decoration: underline; text-underline-offset: 4px; font-weight: 600; transition: opacity 0.2s; }
                  .rich-text-content a:hover { opacity: 0.8; }
                  .rich-text-content blockquote { border-left: 4px solid #dc2626; padding: 1.5rem 2rem; font-style: italic; color: #334155; margin: 2.5rem 0; font-size: 1.25rem; background: #f8fafc; border-radius: 0 1rem 1rem 0; font-weight: 500; }
                  .rich-text-content img { max-width: 100%; height: auto; border-radius: 1.5rem; margin: 3.5rem 0; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; display: block; }
                  .rich-text-content pre { background: #0f172a; color: #f8fafc; padding: 1.5rem; border-radius: 1rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; overflow-x: auto; margin: 2rem 0; font-size: 0.875rem; }
                `}</style>
              </article>

              {/* Author Widget */}
              <div id="author-box" className="bg-white rounded-3xl p-10 text-slate-800 shadow-xl relative overflow-hidden border border-slate-200">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 rotate-12 text-brand">
                   <Trophy size={100} />
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                   <div id="author-icon" className="w-24 h-24 rounded-2xl bg-brand/10 flex-shrink-0 flex items-center justify-center text-brand text-4xl shadow-sm border border-brand/20">
                     <UserCheck size={48} strokeWidth={1.5} />
                   </div>
                   <div className="text-center md:text-left space-y-4">
                      <div>
                        <h4 className="text-2xl font-black tracking-tight mb-1 text-slate-900">{news.author || 'Sportal+ Editörü'}</h4>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          <span className="text-[10px] font-black text-brand uppercase tracking-widest bg-brand/10 px-2 py-0.5 rounded border border-brand/20">EDİTÖR</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-200">DENEYİMLİ YAZAR</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-lg">
                        {news.author === 'Samet Büyük' 
                         ? "Sportal+ Baş Editörü. Türkiye ve dünya sporunun nabzını tutuyor, amatör liglerdeki tüm detayları süzüyor ve geniş vizyonuyla okuyuculara aktarıyor."
                         : `Sportal+ İçerik Yazarı. Türkiye ve dünya sporunun nabzını tutuyor, sahanın içindeki gelişmeleri süzüyor ve profesyonel analizlerle futbolseverlerin karşısına çıkıyor.`
                        }
                      </p>
                      <Link to={`/yazar/${encodeURIComponent(news.author || 'Sportal+ Editörü')}`} className="pt-4 flex items-center justify-center md:justify-start gap-10 border-t border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">YAYINLANAN HABER</span>
                          <span className="text-lg font-black text-slate-900">{authorNewsCount}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DENEYİM</span>
                          <span className="text-lg font-black text-slate-900">
                            {(() => {
                              // Starting from May 1 (Index 4), increments monthly
                              const startDate = news.author === 'Samet Büyük' ? new Date(2018, 4, 1) : new Date(2024, 4, 1);
                              const now = new Date();
                              let months = (now.getFullYear() - startDate.getFullYear()) * 12;
                              months -= startDate.getMonth();
                              months += now.getMonth();
                              
                              if (months < 12) return `${months} Ay`;
                              const years = Math.floor(months / 12);
                              const rem = months % 12;
                              return `${years} Yıl ${rem > 0 ? `${rem} Ay` : ''}`;
                            })()}
                          </span>
                        </div>
                      </Link>
                   </div>
                </div>
              </div>
            </div>

            {/* Right Side Info */}
            <aside className="space-y-10">
               <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-brand" />
                    İLGİLİ HABERLER
                  </h3>
                  <div className="space-y-8">
                    {related.map(item => (
                      <Link 
                        key={item.id} 
                        to={`/news/${item.slug}`} 
                        className="group block space-y-3"
                      >
                         <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                           <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                         </div>
                         <h4 className="text-xs font-black text-slate-800 group-hover:text-brand transition-colors line-clamp-2 leading-relaxed">
                            {item.title}
                         </h4>
                      </Link>
                    ))}
                  </div>

                  {news.tags && news.tags.length > 0 && (
                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        {news.tags.map((tag, idx) => (
                          <Link 
                            key={idx}
                            to={`/etiket/${encodeURIComponent(tag)}`}
                            className="text-[9px] font-black text-slate-400 hover:text-brand transition-colors uppercase tracking-widest border border-slate-100 px-2 py-1 rounded"
                          >
                            #{tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
               </div>
               
               <div className="bg-brand/5 p-8 rounded-3xl border-2 border-dashed border-brand/20 text-center">
                  <Share2 className="mx-auto text-brand mb-4" size={24} />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Paylaşmayı Unutma</h4>
                  <p className="text-[10px] text-slate-500 font-medium mb-6 uppercase tracking-tight">Spor dünyasındaki bu gelişmeyi arkadaşlarına ve sosyal medyaya aktar!</p>
                  <button className="text-[10px] font-black text-brand uppercase tracking-widest border-b border-brand pb-1 hover:text-black hover:border-black transition-colors">
                    Bağlantıyı Kopyala
                  </button>
               </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
