import React, { useState, useEffect } from 'react';
import Hero3D from '../components/Hero3D';
import NewsModal from '../components/NewsModal';
import { motion } from 'framer-motion';
import { NewsItem } from '../types';
import { apiService } from '../services/votingService';
import { Calendar, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const res = await apiService.content.getNews();
      if (res.success && res.data) {
        // Ambil 3 berita terbaru saja untuk Home
        setNewsList(res.data.slice(0, 3));
      }
    };
    fetchNews();
  }, []);

  const openNews = (news: NewsItem) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-navy-900">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <Hero3D />
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold-400 font-mono tracking-widest mb-4 text-sm md:text-base">
              OFFICIAL PORTAL
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-slate-white mb-6 leading-tight">
              OSIS <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-white to-slate-500">
                SMK LPPMRI 2
              </span>
            </h1>
            <p className="text-slate-light max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed">
              Membangun Generasi Unggul dengan Integritas, Kreativitas, dan Inovasi Teknologi di Era Digital.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link 
                to="/about" 
                className="px-8 py-3 rounded-full border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-navy-900 transition-all duration-300 font-semibold tracking-wide"
              >
                TENTANG KAMI
              </Link>
              <Link 
                to="/voting" 
                className="px-8 py-3 rounded-full bg-navy-600 text-white hover:bg-navy-500 transition-all duration-300 font-semibold tracking-wide flex items-center gap-2"
              >
                <Activity size={18} /> E-VOTING
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold-400 to-transparent"></div>
        </motion.div>
      </section>

      {/* News Section (Masonry Effect) */}
      <section id="news" className="py-20 px-6 bg-navy-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-white mb-2">Berita Terbaru</h2>
              <div className="h-1 w-20 bg-gold-400 rounded-full"></div>
            </div>
            <Link to="/news" className="text-gold-400 flex items-center gap-2 hover:gap-3 transition-all text-sm font-semibold">
              LIHAT ARSIP BERITA <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.length === 0 ? (
              <div className="col-span-3 text-center py-12 bg-navy-800 rounded-xl border border-navy-700 border-dashed">
                 <p className="text-slate-500">Belum ada berita yang dipublikasikan.</p>
              </div>
            ) : (
              newsList.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-navy-800 border border-navy-700 rounded-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 shadow-xl hover:shadow-gold-500/10 cursor-pointer flex flex-col h-full"
                  onClick={() => openNews(news)}
                >
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <img 
                      src={news.imageUrl} 
                      alt={news.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-navy-900/80 backdrop-blur px-3 py-1 rounded text-xs font-bold text-gold-400 border border-gold-400/30">
                      {news.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
                      <Calendar size={12} />
                      <span>{news.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-white mb-3 group-hover:text-gold-400 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-slate-light text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                      {news.excerpt}
                    </p>
                    <div className="mt-auto text-gold-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Baca Selengkapnya <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer Preview */}
      <footer className="bg-navy-950 py-12 border-t border-navy-800 text-center">
        <p className="text-slate-500 text-sm">
          © 2024 OSIS SMK LPPMRI 2 KEDUNGREJA. All Rights Reserved. <br/>
          Designed with <span className="text-gold-400">Futuristic Elegance</span>
        </p>
      </footer>

      <NewsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        news={selectedNews} 
      />
    </div>
  );
};

export default Home;