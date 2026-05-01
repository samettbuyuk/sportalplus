import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { newsService, News } from '../services/newsService';
import { Save, ArrowLeft, Image as ImageIcon, Search, CheckCircle2, AlertCircle, Link2, Copy, FileCode, Dribbble, Trophy, Target } from 'lucide-react';

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'link', 'image', 'blockquote', 'code-block'
];

interface SEOScore {
  score: number;
  checks: {
    label: string;
    passed: boolean;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export default function AdminEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assetUrl, setAssetUrl] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [isAddingNewAuthor, setIsAddingNewAuthor] = useState(false);
  
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'blockquote', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: function(this: any) {
          const url = window.prompt('Lütfen resim URL bağlantısını yapıştırın:');
          if (url) {
            const quill = this.quill;
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', url);
          }
        }
      }
    }
  }), []);

  const [formData, setFormData] = useState<Omit<News, 'id' | 'clickCount' | 'createdAt'>>({
    title: '',
    summary: '',
    content: '',
    author: 'Samet Büyük',
    image: '',
    category: 'football',
    isAmateur: false,
    slug: '',
    tags: []
  });

  const [seoAnalysis, setSeoAnalysis] = useState<SEOScore>({ score: 0, checks: [] });
  const [contentSize, setContentSize] = useState(0);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (id) {
      loadNews();
    }
    loadAuthors();
  }, [id]);

  const loadAuthors = async () => {
    const list = await newsService.getAuthors();
    if (list) setAuthors(list);
  };

  useEffect(() => {
    // Calculate approximate byte size of the document
    const size = new Blob([JSON.stringify(formData)]).size;
    setContentSize(size);

    const checks = [
      { label: 'Başlık Uzunluğu (50-70 karakter)', passed: formData.title.length >= 50 && formData.title.length <= 70, priority: 'high' as const },
      { label: 'Özet Derinliği (>120 karakter)', passed: formData.summary.length >= 120, priority: 'high' as const },
      { label: 'İçerik Uzunluğu (>1000 karakter)', passed: formData.content.replace(/<[^>]*>/g, '').length > 1000, priority: 'medium' as const },
      { label: 'Veritabanı Boyut Sınırı (1MB)', passed: size < 1048576, priority: 'high' as const },
      { label: 'Etiket Ataması (En az 3 etiket)', passed: (formData.tags || []).length >= 3, priority: 'medium' as const },
      { label: 'Kapak Görseli Tanımlı', passed: (formData.image || '').length > 10, priority: 'medium' as const },
      { label: 'Haber Başlığı ve Slug Uyumu', passed: (formData.slug || '').length > 5 && (formData.title || '').toLowerCase().includes((formData.slug || '').split('-')[0]), priority: 'low' as const },
    ];
    
    const passedCount = checks.filter(c => c.passed).length;
    setSeoAnalysis({
      score: Math.round((passedCount / checks.length) * 100),
      checks
    });
  }, [formData]);

  const loadNews = async () => {
    const all = await newsService.getAllNews();
    const item = all?.find(n => n.id === id);
    if (item) {
      const { id: _, clickCount: __, createdAt: ___, ...rest } = item;
      setFormData({
        title: rest.title || '',
        summary: rest.summary || '',
        content: rest.content || '',
        author: rest.author || 'Samet Büyük',
        image: rest.image || '',
        category: rest.category || 'football',
        isAmateur: !!rest.isAmateur,
        slug: rest.slug || '',
        tags: rest.tags || []
      });
      setTagInput((rest.tags || []).join(', '));
    }
  };

  const generateSlug = (title: string) => {
    const trMap: { [key: string]: string } = {
      'ç': 'c', 'ğ': 'g', 'ş': 's', 'ü': 'u', 'ö': 'o', 'ı': 'i',
      'Ç': 'c', 'Ğ': 'g', 'Ş': 's', 'Ü': 'u', 'Ö': 'o', 'İ': 'i'
    };
    
    let slug = title.split('').map(char => trMap[char] || char).join('');
    
    return slug
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const finalValue = type === 'checkbox' ? (e.target as any).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
      ...(name === 'title' && !id ? { slug: generateSlug(value) } : {})
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    const tagArray = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags: tagArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await newsService.updateNews(id, formData);
      } else {
        await newsService.createNews(formData);
      }
      navigate('/admin/news');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-10">
        <style>{`
          .quill .ql-container {
            border-bottom-left-radius: 1.5rem;
            border-bottom-right-radius: 1.5rem;
            background: #f8fafc;
            min-height: 400px;
            font-family: inherit;
          }
          .quill .ql-toolbar {
            border-top-left-radius: 1.5rem;
            border-top-right-radius: 1.5rem;
            background: white;
            border-color: #e2e8f0;
            padding: 1rem;
          }
          .quill .ql-stroke {
            stroke: #64748b;
          }
        `}</style>
        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
            <Link to="/admin/news" className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-sm transition-all text-slate-400 hover:text-slate-900">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">
                {id ? 'İçerik Düzenleme' : 'Yeni İçerik Girişi'}
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Haber ve Analiz Modülü</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || contentSize > 1048576}
            className="w-full md:w-auto btn-primary flex items-center justify-center gap-2 shadow-xl shadow-brand/10 px-8 py-3.5 disabled:opacity-50 text-sm"
          >
            <Save size={18} /> {loading ? 'İŞLENİYOR...' : 'YAYINLA'}
          </button>
        </header>

        <form className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-10 pb-20">
          <div className="xl:col-span-2 space-y-6 md:space-y-8">
            <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8 md:space-y-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Haber Ana Başlığı</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 md:px-6 py-3 md:py-4 text-lg md:text-2xl font-bold text-slate-900 focus:ring-4 focus:ring-brand/5 focus:border-brand outline-none transition-all placeholder:text-slate-300"
                  placeholder="Çarpıcı bir başlık giriniz..."
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Spot Metni (Özet)</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-600 focus:ring-4 focus:ring-brand/5 focus:border-brand outline-none transition-all resize-none leading-relaxed"
                  placeholder="Okuyucuyu içeriğe çekecek kısa bir özet..."
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Tam Metin (İçerik)</label>
                <div className="rich-editor relative">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleContentChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Haberin tüm detaylarını buraya dokuyun..."
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest border transition-all ${
                      contentSize > 900000 
                        ? 'bg-red-100 text-red-600 border-red-200 animate-pulse' 
                        : contentSize > 500000 
                          ? 'bg-orange-100 text-orange-600 border-orange-200' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {Math.round(contentSize / 1024)} KB / 1024 KB
                    </div>
                  </div>
                  {contentSize > 1048576 && (
                    <div className="mt-3 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                      <AlertCircle size={20} className="text-red-500" />
                      <p className="text-[11px] font-bold text-red-700 uppercase tracking-tight">
                        Haber boyutu 1MB limitini aşıyor! Lütfen büyük resimleri URL olarak ekleyin.
                      </p>
                    </div>
                  )}
                  <p className="mt-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 leading-none">
                    <AlertCircle size={10} /> İpucu: Resimleri doğrudan yapıştırmak yerine URL olarak eklerseniz limit aşılmaz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Haber Editörü / Yazar</label>
                  <button 
                    type="button"
                    onClick={() => setIsAddingNewAuthor(!isAddingNewAuthor)}
                    className="text-[9px] font-black text-brand uppercase tracking-widest hover:underline"
                  >
                    {isAddingNewAuthor ? 'Listeden Seç' : '+ Yeni Ekle'}
                  </button>
                </div>
                
                {isAddingNewAuthor ? (
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Yeni yazar adı..."
                    autoFocus
                  />
                ) : (
                  <select
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand"
                  >
                    <option value="">Yazar Seçiniz</option>
                    {authors.map(author => (
                      <option key={author} value={author}>{author}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Haber Etiketleri (Virgül ile ayırın)</label>
                <div className="relative">
                  <input
                    name="tags"
                    value={tagInput}
                    onChange={handleTagsChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand"
                    placeholder="spor, mac, futbol, haber..."
                  />
                  {(formData.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(formData.tags || []).map((tag, idx) => (
                        <span key={idx} className="bg-brand/10 text-brand text-[9px] font-black px-2 py-0.5 rounded uppercase">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Kapak Görseli</label>
                <div className="space-y-6">
                   {formData.image && (
                     <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-50">
                       <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                     </div>
                   )}
                   <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-400 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                        placeholder="Resim URL bağlantısı..."
                      />
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Branş Kategorisi</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'football', name: 'FUTBOL', icon: Trophy },
                    { id: 'basketball', name: 'BASKETBOL', icon: Dribbble },
                    { id: 'volleyball', name: 'VOLEYBOL', icon: Target },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.id as any }))}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                        formData.category === cat.id
                          ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <cat.icon size={20} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.category === 'football' && (
                <label className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl cursor-pointer group hover:bg-slate-100 transition-colors border border-slate-100">
                  <input
                    type="checkbox"
                    name="isAmateur"
                    checked={formData.isAmateur}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span className="text-xs font-black text-slate-900 uppercase">Amatör Lig Haberi</span>
                </label>
              )}

              <div className="space-y-8 pt-4">
                {/* SEO Analysis Panel */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <Search size={14} className="text-brand" /> SEO ANALİZİ
                    </h3>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-black ${seoAnalysis.score > 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      %{seoAnalysis.score}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {seoAnalysis.checks.map((check, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        {check.passed ? (
                          <CheckCircle2 size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle size={12} className={`mt-0.5 flex-shrink-0 ${check.priority === 'high' ? 'text-red-500' : 'text-slate-300'}`} />
                        )}
                        <span className={`text-[10px] font-bold leading-tight ${check.passed ? 'text-slate-600' : 'text-slate-400'}`}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media Helper Tool */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
                   <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Link2 size={14} className="text-brand" /> ARA GÖRSEL PANELİ
                      </h3>
                      <ImageIcon size={14} className="text-white/20" />
                   </div>
                    <div className="space-y-3">
                      <input 
                        type="text"
                        placeholder="Resim URL'si yapıştır..."
                        value={assetUrl}
                        onChange={(e) => setAssetUrl(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-medium text-white outline-none focus:border-brand transition-colors"
                      />
                      {assetUrl && (
                        <div className="space-y-2">
                           <div className="relative group">
                             <img src={assetUrl} className="w-full aspect-video object-cover rounded-lg border border-white/10" alt="Preview" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                               <span className="text-[9px] font-black uppercase tracking-widest">Önizleme</span>
                             </div>
                           </div>
                           <button 
                            type="button"
                            onClick={() => { 
                              navigator.clipboard.writeText(assetUrl);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-brand hover:bg-red-700 text-white rounded-xl text-[10px] font-black tracking-widest transition-all shadow-lg shadow-brand/20"
                           >
                             <Copy size={12} /> URL KOPYALA
                           </button>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        Ara görsel eklemek için URL'yi kopyalayın ve yazı alanındaki <span className="text-white">"image (resim)"</span> butonuna basıp yapıştırın.
                      </p>
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">SEO URL (Slug)</label>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 font-mono text-[10px] text-slate-400 outline-none"
                  placeholder="otomatik-olusturulur"
                />
              </div>

              <div className="pt-6">
                 <button 
                  type="button" 
                  onClick={() => navigate('/admin/news')}
                  className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                >
                  DEĞİŞİKLİKLERİ İPTAL ET
                 </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
