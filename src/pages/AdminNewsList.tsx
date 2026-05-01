import { useEffect, useState } from 'react';
import { newsService, News } from '../services/newsService';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, ExternalLink, Plus, Search, Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function AdminNewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    const data = await newsService.getAllNews();
    setNews(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu haberi kalıcı olarak silmek istediğinize emin misiniz?')) {
      await newsService.deleteNews(id);
      loadNews();
    }
  };

  const filteredNews = news.filter(n => 
    (n.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.content || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-10 bg-slate-50 min-h-screen space-y-6 md:space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">İçerik Kütüphanesi</h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium">Yayınlanan tüm haberlerin merkezi yönetim alanı.</p>
        </div>
        <Link 
          to="/admin/news/new" 
          className="w-full md:w-auto btn-primary flex items-center justify-center gap-2 shadow-lg shadow-brand/10 px-8 py-3 text-sm"
        >
          <Plus size={18} /> + Yeni Haber Ekle
        </Link>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 md:p-8 border-b border-slate-100 bg-white">
          <div className="relative w-full md:max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Haber başlığı veya kategori ile ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all font-medium text-xs md:text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
                <th className="px-8 py-5">Görsel</th>
                <th className="px-8 py-5">Haber Detayı</th>
                <th className="px-8 py-5">Kategori</th>
                <th className="px-8 py-5">Yayın Tarihi</th>
                <th className="px-8 py-5">Analiz</th>
                <th className="px-8 py-5 text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                   <td colSpan={6} className="text-center py-24 text-slate-400 font-bold italic text-sm">Veriler Getiriliyor...</td>
                </tr>
              ) : filteredNews.length === 0 ? (
                <tr>
                   <td colSpan={6} className="text-center py-24 text-slate-400 font-bold italic text-sm">Aranan kriterlerde haber bulunamadı.</td>
                </tr>
              ) : (
                filteredNews.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={n.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-800 text-sm mb-1 leading-tight max-w-md line-clamp-1 group-hover:text-brand transition-colors">{n.title}</div>
                      <div className="flex items-center gap-2">
                        {n.isAmateur && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Amatör</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${n.category === 'football' ? 'bg-blue-100 text-blue-700' : n.category === 'basketball' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {n.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-tight">
                          <Calendar size={14} className="text-slate-300" />
                          {n.createdAt?.toDate ? format(n.createdAt.toDate(), 'd MMM yyyy', { locale: tr }) : '---'}
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2 text-xs text-slate-900 font-black">
                          <Eye size={14} className="text-brand" />
                          {n.clickCount.toLocaleString()}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Link to={`/admin/news/edit/${n.id}`} className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all border border-slate-100">
                            <Edit size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(n.id!)}
                            className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all border border-slate-100"
                          >
                            <Trash2 size={16} />
                          </button>
                          <Link to={`/news/${n.slug}`} target="_blank" className="p-2.5 bg-slate-50 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-100">
                            <ExternalLink size={16} />
                          </Link>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
