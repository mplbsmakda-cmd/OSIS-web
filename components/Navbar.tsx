import React, { useState } from 'react';
import { NavLink } from '../types';
import { Menu, X, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const LINKS: NavLink[] = [
  { label: 'Beranda', path: '/' },
  { label: 'Tentang', path: '/about' },
  { label: 'E-Voting', path: '/voting' },
  { label: 'Berita', path: '/news' },
  // Admin link hidden for security. Access via /admin/login
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto bg-navy-800/80 backdrop-blur-md border border-navy-600/30 rounded-2xl px-6 py-3 flex justify-between items-center shadow-lg shadow-navy-900/50">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-md shadow-gold-500/20">
            <span className="font-serif font-bold text-navy-900 text-xl">OS</span>
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-slate-white tracking-wide text-sm">SMK LPPMRI 2</h1>
            <p className="text-xs text-gold-400 tracking-widest uppercase">Kedungreja</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-200 hover:text-gold-400 relative group ${
                isActive(link.path) ? 'text-gold-400' : 'text-slate-light'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full ${isActive(link.path) ? 'w-full' : ''}`}></span>
            </Link>
          ))}
        </div>

        {/* Action / Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:flex items-center gap-2 text-slate-white hover:text-gold-400 transition-colors">
             <UserCircle size={20} />
             <span className="text-xs font-semibold">LOGIN SISWA</span>
          </Link>
          
          <button 
            className="md:hidden text-slate-white hover:text-gold-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-24 left-6 right-6 bg-navy-800/95 backdrop-blur-xl border border-navy-600 rounded-xl p-6 flex flex-col gap-4 shadow-2xl md:hidden z-50">
          {LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium ${isActive(link.path) ? 'text-gold-400' : 'text-slate-white'}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-[1px] bg-navy-600 my-2"></div>
          <Link 
            to="/login" 
            onClick={() => setIsOpen(false)}
            className="text-gold-400 font-semibold flex items-center gap-2"
          >
            <UserCircle size={20} /> Portal Siswa
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;