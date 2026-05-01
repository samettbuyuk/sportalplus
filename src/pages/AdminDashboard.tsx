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
  Pie
} from 'recharts';
import { newsService, News } from '../services/newsService';
import { motion } from 'motion/react';
import { Eye, Plus, MessageSquare, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, subDays, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';

function StatCard({ title, value, percentage, colorClass }: { title: string; value: string | number; percentage: number; colorClass: string }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
    >
      <div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</p>
      </div>
      <div className="mt-5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
      <p className="text-[10px] mt-3 text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tight">
        {percentage}% Performans Hedefi
      </p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allNews = await newsService.getAllNews();
      const rawClicks = await newsService.getAnalyticsSummary();
      
      if (allNews && rawClicks) {
        setNews(allNews);
        
        // 1. Prepare Category Distribution
        const cats: any = { football: 0, basketball: 0, volleyball: 0 };
        allNews.forEach(n => cats[n.category]++);
        setCategoryData(Object.entries(cats).map(([name, value]) => ({ name, value })));

        // 2. Prepare Click Timeline (Last 7 days)
        const timeline = [];
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          const count = (rawClicks as any[]).filter(c => 
            c.timestamp && isSameDay(c.timestamp.toDate(), date)
          ).length;
          timeline.push({
            date: format(date, 'd MMM', { locale: tr }),
            clicks: count
          });
        }
        setStats(timeline);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalViews = news.reduce((acc, n) => acc + (n.clickCount || 0), 0);
  const COLORS = ['#3b82f6', '#f97316', '#10b981']; // Blue, Orange, Emerald

  if (loading) return <div className="p-12 text-slate-400 font-bold text-center italic">Veriler Analiz Ediliyor...</div>;

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-10 bg-slate-50 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">Dashboard Akışı</h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium">Sportal+ platformunuzun anlık veri özeti.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full md:w-auto">
          <Link 
            to="/admin/analytics" 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-xs md:text-sm shadow-sm"
          >
            <BarChart3 size={16} /> <span className="md:hidden">Analiz</span><span className="hidden md:inline">Detaylı Analitik</span>
          </Link>
          <Link 
            to="/admin/news/new" 
            className="flex-1 md:flex-none btn-primary flex items-center justify-center gap-2 shadow-lg shadow-brand/10 px-4 md:px-8 py-2.5 md:py-3 text-xs md:text-sm"
          >
            <Plus size={16} /> <span className="md:hidden">Ekle</span><span className="hidden md:inline">+ Yeni Haber Ekle</span>
          </Link>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        <StatCard title="Bugünkü Toplam Tıklanma" value={totalViews} percentage={75} colorClass="bg-red-600" />
        <StatCard title="Yayınlanmış İçerik" value={news.length} percentage={60} colorClass="bg-blue-600" />
        <div className="sm:col-span-2 md:col-span-1">
          <StatCard title="Amatör Futbol Trafiği" value={news.filter(n => n.isAmateur).length} percentage={85} colorClass="bg-orange-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        {/* Click Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6 md:mb-10">
            <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <TrendingUp className="text-brand" size={14} />
               Trafik Analiz Grafigi
            </h3>
            <span className="text-[9px] md:text-[10px] font-bold text-slate-900 uppercase">Haftalık Rapor</span>
          </div>
          <div className="h-[250px] md:h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#dc2626" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#dc2626', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Kategori Dağılım Oranı</h3>
          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
             {categoryData.map((cat, idx) => (
                <div key={cat.name} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="capitalize text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cat.name}</span>
                   </div>
                   <span className="font-mono text-sm font-bold text-slate-800">{cat.value}</span>
                </div>
             ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
       >
         <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En Çok Etkileşim Alan Haberler</h3>
            <Link to="/admin/news" className="text-xs font-bold text-brand hover:underline uppercase tracking-tight">Tümünü Yönet</Link>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead>
               <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
                 <th className="px-8 py-4">Haber Başlığı</th>
                 <th className="px-8 py-4">Kategori</th>
                 <th className="px-8 py-4 text-right">Tıklanma</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {news.sort((a,b) => b.clickCount - a.clickCount).slice(0, 5).map(n => (
                 <tr key={n.id} className="hover:bg-slate-50/50 transition-colors">
                   <td className="px-8 py-5 font-semibold text-slate-800 text-sm">{n.title}</td>
                   <td className="px-8 py-5">
                     <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${n.category === 'football' ? 'bg-blue-100 text-blue-700' : n.category === 'basketball' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                       {n.category}
                     </span>
                   </td>
                   <td className="px-8 py-5 text-right font-mono font-bold text-slate-900 border-l border-slate-50">{n.clickCount.toLocaleString()}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </motion.div>
    </div>
  );
}


