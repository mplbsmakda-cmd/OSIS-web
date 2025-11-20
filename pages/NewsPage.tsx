import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NewsItem } from '../types';
import { apiService } from '../services/votingService';
import NewsModal from '../components/NewsModal';
import { Search, Calendar, Tag, ArrowRight } from 'lucide-react';

const NewsPage: React.FC = () => {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const res = await apiService.content.getNews();
      if (res.success && res.data) {
        setAllNews(res.data);
        setFilteredNews(res.data);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = allNews.filter(news => 
        news.title.toLowerCase().includes(lowerQuery) || 
        news.category.toLowerCase().includes(lowerQuery) ||
        news.excerpt.toLowerCase().includes(lowerQuery)
    );
    setFilteredNews(filtered);
  }, [searchQuery, allNews]);

  const openNews = (news: NewsItem) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-navy-900 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
           <div>
              <h1 className="text-4xl font-serif font-bold text-slate-white mb-2">Arsip Berita</h1>
              <p className="text-slate-400">Informasi terkini seputar kegiatan sekolah dan OSIS.</p>
           </div>
           
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-3.5 text-slate-500" size={20} />
              <input 
                type="text" 
                placeholder="Cari berita..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-800 border border-navy-600 text-slate-white pl-12 pr-4 py-3 rounded-full focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
              />
           </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredNews.length === 0 ? (
              <div className="col-span-3 py-20 text-center">
                 <p className="text-slate-500 text-lg">Tidak ada berita yang ditemukan.</p>
              </div>
           ) : (
              filteredNews.map((news, idx) => (
                <motion.div
                   key={news.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   onClick={() => openNews(news)}
                   className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gold-500/5 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
                >
                   <div className="relative h-56 overflow-hidden shrink-0">
                      <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-4 left-4">
                          <span className="bg-gold-500 text-navy-900 text-xs font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                              <Tag size={12} /> {news.category}
                          </span>
                      </div>
                   </div>
                   <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
                         <Calendar size={14} /> {news.date}
                      </div>
                      <h2 className="text-xl font-bold text-slate-white mb-3 line-clamp-2 group-hover:text-gold-400 transition-colors">{news.title}</h2>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">{news.excerpt}</p>
                      <div className="mt-auto pt-4 border-t border-navy-700 flex justify-between items-center">
                         <span className="text-gold-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                             Baca <ArrowRight size={16} />
                         </span>
                      </div>
                   </div>
                </motion.div>
              ))
           )}
        </div>
      </div>

      <NewsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        news={selectedNews} 
      />
    </div>
  );
};

export default NewsPage;