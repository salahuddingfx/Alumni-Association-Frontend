import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api, { API_URL } from '../api/api';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
  const { i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const isBn = i18n.language === 'bn';

  useEffect(() => {
    api.get(`/gallery?category=${category}`)
      .then(res => {
        if (res.data.success) {
          setItems(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching gallery:', err));
  }, [category]);

  const mockItems = [
    { 
      _id: '1', 
      title: { en: 'Reunion Gala Celebration', bn: 'পুনর্মিলনী উৎসব ও আড্ডা' }, 
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600', 
      category: 'reunion' 
    },
    { 
      _id: '2', 
      title: { en: 'Annual Sports Tournament', bn: 'বার্ষিক ক্রীড়া প্রতিযোগিতা' }, 
      url: 'https://images.unsplash.com/photo-1508847154043-be12a26c4517?q=80&w=600', 
      category: 'sports' 
    },
    { 
      _id: '3', 
      title: { en: 'Career Seminar Session', bn: 'ক্যারিয়ার সেমিনার' }, 
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600', 
      category: 'seminar' 
    },
    { 
      _id: '4', 
      title: { en: 'Group Discussion & Meetup', bn: 'গ্রুপ ডিসকাশন ও গেট-টুগেদার' }, 
      url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=600', 
      category: 'reunion' 
    },
    { 
      _id: '5', 
      title: { en: 'Football Match Finals', bn: 'ফুটবল ম্যাচ ফাইনাল' }, 
      url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 
      category: 'sports' 
    },
    { 
      _id: '6', 
      title: { en: 'Alumni Core Committee Briefing', bn: 'কমিটি আলোচনা ও পরিকল্পনা' }, 
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600', 
      category: 'seminar' 
    }
  ];

  const displayItems = items.length > 0 ? items : mockItems;

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? displayItems.length - 1 : prev - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === displayItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-primary font-bn">
          {isBn ? 'ফটো ও ভিডিও গ্যালারি' : 'Photo & Video Gallery'}
        </h1>
        <p className="mt-4 text-gray-600 font-bn">
          {isBn ? 'আমাদের পুনর্মিলনী, সাংস্কৃতিক অনুষ্ঠান ও ক্রীড়া প্রতিযোগিতার স্মৃতিচারণ।' : 'Memories of our past reunions, cultural sessions, and sports celebrations.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center space-x-2 mb-10 overflow-x-auto pb-2">
        {[
          { key: '', label: isBn ? 'সব ছবি' : 'All Photos' },
          { key: 'reunion', label: isBn ? 'পুনর্মিলনী' : 'Reunion' },
          { key: 'sports', label: isBn ? 'ক্রীড়া' : 'Sports' },
          { key: 'seminar', label: isBn ? 'সেমিনার' : 'Seminar' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`px-5 py-2 rounded-full font-bold text-sm transition ${
              category === tab.key
                ? 'bg-secondary text-white shadow-md'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-slate-50'
            }`}
            onClick={() => setCategory(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {displayItems.map((item, index) => (
          <div 
            key={item._id} 
            onClick={() => openLightbox(index)}
            className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 group relative cursor-pointer"
          >
            <img src={item.url.startsWith('http') ? item.url : `${API_URL}${item.url}`} className="w-full h-auto object-cover group-hover:scale-102 transition duration-300" alt={item.title.en} />
            
            {/* Hover overlay with action icons */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
              <div className="flex justify-end">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Maximize2 size={16} />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-secondary font-extrabold uppercase tracking-wider block bg-secondary/15 px-2 py-0.5 rounded-full w-max mb-1.5 backdrop-blur-sm">
                  {item.category}
                </span>
                <span className="text-white font-extrabold text-base font-bn">
                  {isBn ? item.title.bn : item.title.en}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📸 FULL-SCREEN LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-4 select-none"
          >
            {/* Top Toolbar */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white/80 z-50">
              <span className="text-sm font-semibold">
                {lightboxIndex + 1} / {displayItems.length}
              </span>
              <button 
                onClick={closeLightbox} 
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Left Navigator */}
            <button 
              onClick={showPrev}
              className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition z-50"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Lightbox Image Stage */}
            <motion.div 
              key={lightboxIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative max-w-5xl max-h-[80vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={displayItems[lightboxIndex].url.startsWith('http') ? displayItems[lightboxIndex].url : `${API_URL}${displayItems[lightboxIndex].url}`} 
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" 
                alt={displayItems[lightboxIndex].title.en} 
              />
              
              <div className="mt-4 text-center text-white max-w-xl">
                <span className="text-xs text-secondary font-extrabold uppercase tracking-wider block bg-secondary/15 px-2 py-0.5 rounded-full w-max mx-auto mb-2">
                  {displayItems[lightboxIndex].category}
                </span>
                <h3 className="text-lg font-extrabold font-bn">
                  {isBn ? displayItems[lightboxIndex].title.bn : displayItems[lightboxIndex].title.en}
                </h3>
              </div>
            </motion.div>

            {/* Right Navigator */}
            <button 
              onClick={showNext}
              className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition z-50"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
