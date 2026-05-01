import { Link } from 'react-router-dom';
import { Trophy, Home, Menu, X, Dribbble, Zap, Target } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Futbol', path: '/category/football', icon: Trophy },
    { name: 'Basketbol', path: '/category/basketball', icon: Dribbble },
    { name: 'Voleybol', path: '/category/volleyball', icon: Target },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <div className="bg-brand w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md ring-1 ring-slate-100">
              S+
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 uppercase">
              SPORTAL<span className="text-brand">+</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-slate-500 hover:text-brand font-semibold text-sm transition-colors tracking-wide uppercase"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-slate-200 shadow-2xl p-6 flex flex-col gap-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-sm uppercase tracking-wide transition-all"
              >
                <link.icon size={18} className="text-brand" />
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
