import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Share2 } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsItem | null;
}

const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, news }) => {
  if (!news) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-900/90 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-navy-800 border border-navy-600 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Image Header */}
            <div className="relative h-64 shrink-0">
              <img 
                src={news.imageUrl} 
                alt={news.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-800 to-transparent"></div>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur transition-colors"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                 <span className="inline-block px-3 py-1 bg-gold-500 text-navy-900 text-xs font-bold rounded mb-2">
                    {news.category}
                 </span>
                 <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{news.title}</h2>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-6 text-slate-400 text-sm mb-6 border-b border-navy-700 pb-4">
                 <div className="flex items-center gap-2">
                    <Calendar size={16} /> {news.date}
                 </div>
                 <div className="flex items-center gap-2">
                    <Tag size={16} /> OSIS News
                 </div>
                 <button className="ml-auto flex items-center gap-2 text-gold-400 hover:text-gold-300">
                    <Share2 size={16} /> Share
                 </button>
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                <p className="font-semibold text-lg text-slate-200 mb-4">{news.excerpt}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p className="mt-4">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewsModal;