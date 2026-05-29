import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { Calendar, User, Clock, ArrowRight, Search, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/image';

const Blog = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    api.get('/blogs')
      .then(res => {
        if (res.data.success) {
          setBlogs(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching blogs:', err));
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const title = isBn ? blog.title.bn : blog.title.en;
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-primary font-bn">
          {isBn ? 'প্রাক্তনীদের ব্লগ ও সংবাদ' : 'Alumni Blog & News'}
        </h1>
        <p className="mt-4 text-gray-600 font-bn">
          {isBn ? 'পড়ুন আমাদের সফল প্রাক্তন শিক্ষার্থীদের অনুপ্রেরণামূলক গল্প ও নানা সংবাদ।' : 'Read inspirational stories, updates, and articles from our alumni community.'}
        </p>
      </div>

      {/* Controls: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-slate-50 p-6 rounded-2xl border border-gray-200">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={isBn ? 'অনুসন্ধান করুন...' : 'Search articles...'}
            className="w-full bg-white border border-gray-300 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-secondary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all', label: isBn ? 'সব নিবন্ধ' : 'All Articles' },
            { key: 'news', label: isBn ? 'সংবাদ' : 'News' },
            { key: 'story', label: isBn ? 'গল্প' : 'Story' },
            { key: 'achievement', label: isBn ? 'সাফল্য' : 'Achievement' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCategoryFilter(tab.key)}
              className={`px-4 py-2 rounded-full font-bold text-xs uppercase transition tracking-wider ${
                categoryFilter === tab.key
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map(blog => {
            const title = isBn ? blog.title.bn : blog.title.en;
            const contentSnippet = isBn ? blog.content.bn : blog.content.en;

            return (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                    {blog.thumbnail ? (
                      <img 
                        src={getImageUrl(blog.thumbnail)} 
                        className="w-full h-full object-cover" 
                        alt={title} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-slate-100">
                        <FileText size={40} />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-primary/95 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center space-x-3 text-xxs text-gray-450 mb-3 font-semibold">
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <User size={12} />
                        <span className="font-bn">{blog.author}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{blog.readTime} {isBn ? 'মি.' : 'min'}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-primary font-bn line-clamp-2 hover:text-secondary transition-colors">
                      <Link to={`/blog/${blog.slug}`}>{title}</Link>
                    </h3>
                    <p className="mt-3 text-gray-600 text-sm font-bn line-clamp-3 leading-relaxed">
                      {contentSnippet}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link 
                    to={`/blog/${blog.slug}`} 
                    className="text-secondary hover:text-primary font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 w-fit group"
                  >
                    <span>{isBn ? 'আরও পড়ুন' : 'Read More'}</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <FileText className="mx-auto text-gray-350 mb-3" size={48} />
          <h3 className="font-bold text-gray-600 font-bn">
            {isBn ? 'কোনো ব্লগ পোস্ট পাওয়া যায়নি' : 'No articles match your search'}
          </h3>
          <p className="text-sm text-gray-450 mt-1 font-bn">
            {isBn ? 'অন্য কোনো বিষয় লিখে আবার চেষ্টা করুন।' : 'Try checking another category or refining your search term.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Blog;
