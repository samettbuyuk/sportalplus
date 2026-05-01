import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';
import { newsService, News } from '../services/newsService';
import { logout } from '../lib/firebase';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, Clock, MousePointer2, Calendar, Target, ArrowLeft, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format, subDays, isSameDay, startOfDay, eachDayOfInterval, isWithinInterval, subMonths } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AnalyticsStat {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
}

export default function AdminAnalytics() {
  const [news, setNews] = useState<News[]>([]);
  const [clicks, setClicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyTimeline, setDailyTimeline] = useState<any[]>([]);
  const [categoryComparison, setCategoryComparison] = useState<any[]>([]);
  const [hourlyStats, setHourlyStats] = useState<any[]>([]);

  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [allClicks, setAllClicks] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const [allNews, rawClicks] = await Promise.all([
        newsService.getAllNews(),
        newsService.getAnalyticsSummary()
      ]);

      if (allNews && rawClicks) {
        setNews(allNews);
        setAllClicks(rawClicks);
        processAnalytics(allNews, rawClicks, timeRange);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, [timeRange]);

  const processAnalytics = (allNews: News[], rawClicks: any[], range: string) => {
    const daysCount = range === '7d' ? 7 : range === '14d' ? 14 : 30;
    
    // 1. Timeline based on range
    const days = eachDayOfInterval({
      start: subDays(new Date(), daysCount - 1),
      end: new Date()
    });

    const timeline = days.map(day => {
      const dayClicks = rawClicks.filter(c => 
        c.timestamp && isSameDay(c.timestamp.toDate(), day)
      ).length;
      return {
        name: format(day, 'd MMM', { locale: tr }),
        fullDate: day,
        clicks: dayClicks
      };
    });
    setDailyTimeline(timeline);

    // Filter clicks for the specific range for other stats too if needed
    const filteredClicks = rawClicks.filter(c => {
      if (!c.timestamp) return false;
      const date = c.timestamp.toDate();
      return isWithinInterval(date, {
        start: startOfDay(subDays(new Date(), daysCount - 1)),
        end: new Date()
      });
    });
    setClicks(filteredClicks);

    // 2. Category Performance Comparison
    const catStats: any = { football: 0, basketball: 0, volleyball: 0 };
    allNews.forEach(n => {
      catStats[n.category] += n.clickCount || 0;
    });
    setCategoryComparison(Object.entries(catStats).map(([name, value]) => ({ 
      name: name === 'football' ? 'Futbol' : name === 'basketball' ? 'Basketbol' : 'Voleybol', 
      value 
    })));

    // 3. Hourly Activity
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, count: 0 }));
    filteredClicks.forEach(c => {
      if (c.timestamp) {
        const h = c.timestamp.toDate().getHours();
        hours[h].count++;
      }
    });
    setHourlyStats(hours);
  };

  const totalClicks = news.reduce((acc, n) => acc + (n.clickCount || 0), 0);
  const avgClicksPerNews = (totalClicks / (news.length || 1)).toFixed(1);
  const amateurPercent = ((news.filter(n => n.isAmateur).length / (news.length || 1)) * 100).toFixed(0);

  const stats: AnalyticsStat[] = [
    { label: 'Toplam Etkileşim', value: totalClicks.toLocaleString(), change: '+12.5%', isPositive: true, icon: MousePointer2 },
    { label: 'Haber Başına Tıklama', value: avgClicksPerNews, change: '+5.2%', isPositive: true, icon: Target },
    { label: 'Amatör İçerik Oranı', value: `%${amateurPercent}`, change: '-2.1%', isPositive: false, icon: Users },
    { label: 'Aktif Haber Sayısı', value: news.length, change: '+8', isPositive: true, icon: Calendar },
  ];

  if (loading) return (
    <div className="p-12 text-slate-400 font-bold text-center italic animate-pulse">
      İleri Düzey Analizler Hazırlanıyor...
    </div>
  );

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-12 bg-slate-50 min-h-screen">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/admin" className="p-2.5 md:p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl shadow-sm transition-all text-slate-400 hover:text-slate-900">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Veri Analitiği</h1>
              <p className="text-slate-500 text-[10px] md:text-sm font-medium mt-1 md:mt-2">İçerik performansı ve kullanıcı davranış analizi.</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="md:hidden p-2 text-slate-400 hover:text-brand transition-colors"
            title="Çıkış Yap"
          >
            <LogOut size={20} />
          </button>
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm gap-1 flex-grow lg:flex-none overflow-x-auto">
             {(['7d', '14d', '30d'] as const).map((range) => (
               <button 
                 key={range}
                 onClick={() => setTimeRange(range)}
                 className={`flex-1 md:flex-none px-4 md:px-6 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${timeRange === range ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                 {range === '7d' ? '7 GÜN' : range === '14d' ? '14 GÜN' : '30 GÜN'}
               </button>
             ))}
          </div>
          <button 
            onClick={handleLogout}
            className="hidden md:flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-all text-sm"
          >
            <LogOut size={16} /> Çıkış Yap
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 group-hover:scale-110 transition-transform">
              <stat.icon size={40} />
            </div>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 md:mb-4">{stat.label}</p>
            <div className="flex items-end gap-2 md:gap-3">
              <span className="text-2xl md:text-4xl font-black text-slate-900 leading-none">{stat.value}</span>
              <span className={`text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full mb-0.5 md:mb-1 ${stat.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        {/* Main Traffic Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="xl:col-span-2 bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
            <div>
              <h3 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                <TrendingUp className="text-brand" size={16} />
                Trafik Trendi (14 GÜN)
              </h3>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mt-1 md:mt-2">Günlük Sayfa Görüntüleme Sayıları</p>
            </div>
            <div className="flex gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-brand" />
               <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="h-[250px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTimeline}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={15} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dx={-15} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                    fontSize: '10px', 
                    fontWeight: '900',
                    textTransform: 'uppercase'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#dc2626" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorClicks)"
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#dc2626' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Performance */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm"
        >
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10">Kategori Performansı</h3>
          <div className="space-y-10">
             {categoryComparison.sort((a,b) => b.value - a.value).map((cat, idx) => {
               const percentage = ((cat.value / (totalClicks || 1)) * 100).toFixed(1);
               const colorClass = cat.name === 'Futbol' ? 'bg-blue-600' : cat.name === 'Basketbol' ? 'bg-orange-600' : 'bg-emerald-600';
               return (
                 <div key={cat.name} className="space-y-4">
                   <div className="flex justify-between items-end">
                     <div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Branş Etkileşimi</span>
                       <span className="text-sm font-black text-slate-900 uppercase">{cat.name}</span>
                     </div>
                     <span className="text-lg font-black text-slate-900">%{percentage}</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.2 }}
                        className={`h-full ${colorClass}`} 
                     />
                   </div>
                 </div>
               );
             })}
          </div>

          <div className="mt-16 p-6 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-4 mb-4">
                <Clock className="text-brand" size={18} />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">En Aktif Saat Aralığı</span>
             </div>
             {hourlyStats.length > 0 && (
               <p className="text-2xl font-black text-slate-900">
                 {hourlyStats.reduce((prev, current) => (prev.count > current.count) ? prev : current).hour}
               </p>
             )}
             <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-tight">Kullanıcıların en yoğun etkileşim kurduğu zaman dilimi.</p>
          </div>
        </motion.div>
      </div>

      {/* Content Ranking Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Haber Performans Sıralaması</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Etkileşim hacmine göre içerik analizi</p>
          </div>
          <BarChart3 size={24} className="text-slate-200" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-100">
                <th className="px-10 py-6">İçerik Başlığı</th>
                <th className="px-10 py-6">Kategori</th>
                <th className="px-10 py-6">Tip</th>
                <th className="px-10 py-6 text-right">Tıklanma</th>
                <th className="px-10 py-6 text-right">Performans Skoru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {news.sort((a,b) => b.clickCount - a.clickCount).slice(0, 10).map((n, i) => {
                const score = (n.clickCount / 10).toFixed(1);
                return (
                  <tr key={n.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6 font-bold text-slate-900 text-sm group-hover:text-brand transition-colors">
                      <span className="text-slate-300 mr-4 font-mono">{(i+1).toString().padStart(2, '0')}</span>
                      {n.title}
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-3 py-1 rounded text-[10px] font-black uppercase ${n.category === 'football' ? 'bg-blue-100 text-blue-700' : n.category === 'basketball' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {n.category}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      {n.isAmateur ? (
                         <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded uppercase tracking-tighter border border-amber-100">Amatör</span>
                      ) : (
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Pro</span>
                      )}
                    </td>
                    <td className="px-10 py-6 text-right font-mono font-black text-slate-900">{n.clickCount.toLocaleString()}</td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 text-brand font-black">
                         <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-brand" style={{ width: `${Math.min(Number(score) * 2, 100)}%` }} />
                         </div>
                         {score}
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
