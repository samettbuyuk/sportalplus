import { useState } from 'react';
import { User } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { signInWithGoogle } from '../lib/firebase';
import { User as UserIcon, Lock, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLoginProps {
  user: User | null | undefined;
}

export default function AdminLogin({ user }: AdminLoginProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" />;

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Giriş penceresi kapatıldı.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Bu alan adı Firebase konsolunda yetkilendirilmemiş. Lütfen admin ile görüşün.');
      } else {
        setError('Giriş yapılırken bir hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand to-slate-900" />
        
        <div className="text-center space-y-6">
          <div className="mx-auto h-20 w-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center shadow-inner">
            {loading ? (
              <Loader2 className="text-brand animate-spin" size={32} />
            ) : (
              <Lock className="text-slate-900" size={32} />
            )}
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              ADMİN <span className="text-brand">PANELİ</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Merkezi Yönetim Sistemi</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3"
            >
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
              <p className="text-xs font-bold text-red-600 leading-relaxed">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`group relative w-full flex items-center justify-center gap-3 py-5 px-6 border-2 transition-all duration-500 rounded-2xl shadow-xl shadow-slate-200 overflow-hidden ${
              loading 
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <UserIcon size={18} className="transition-transform group-hover:scale-110" />
            )}
            {loading ? 'HAZIRLANIYOR...' : 'GOOGLE İLE OTURUM AÇ'}
            {!loading && <ChevronRight size={16} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />}
          </button>
        </div>

        <div className="pt-4 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
            Bu alan sadece yetkili editörler içindir. <br/>
            Erişim için <span className="text-brand">sporhaber.com</span> desteğiyle görüşün.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
