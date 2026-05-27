import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Calendar, User, Clock, ArrowLeft, FileText } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/v1/blogs/${slug}`)
      .then(res => {
        if (res.data.success) {
          setBlog(res.data.data);
        }
      })
      .catch(err => {
        console.log(err);
        setError(isBn ? 'নিবন্ধটি খুঁজে পাওয়া যায়নি।' : 'Article not found.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, isBn]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-semibold text-gray-500 font-bn">
        {isBn ? 'ব্লগ লোড হচ্ছে...' : 'Loading article...'}
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-semibold font-bn">
          {error || (isBn ? 'দুঃখিত, কোনো তথ্য নেই।' : 'No details available.')}
        </div>
        <Link to="/blog" className="inline-flex items-center space-x-1.5 text-primary hover:text-secondary font-bold mt-6 text-sm">
          <ArrowLeft size={16} />
          <span>{isBn ? 'ব্লগে ফিরে যান' : 'Back to Blog'}</span>
        </Link>
      </div>
    );
  }

  const title = isBn ? blog.title.bn : blog.title.en;
  const content = isBn ? blog.content.bn : blog.content.en;

  return (
    <div className="py-12 px-6 max-w-4xl mx-auto">
      {/* Back link */}
      <Link to="/blog" className="inline-flex items-center space-x-1.5 text-slate-500 hover:text-secondary font-bold text-xs uppercase tracking-wider mb-8 transition">
        <ArrowLeft size={14} />
        <span>{isBn ? 'ব্লগে ফিরে যান' : 'Back to Articles'}</span>
      </Link>

      <article className="space-y-6">
        {/* Category badge */}
        <span className="inline-block bg-primary/10 text-primary border border-primary/20 text-xxs font-extrabold uppercase px-2.5 py-0.5 rounded-full">
          {blog.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary font-bn leading-tight">
          {title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pb-6 border-b border-gray-200 font-semibold">
          <span className="flex items-center space-x-1.5">
            <Calendar size={14} />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="flex items-center space-x-1.5">
            <User size={14} />
            <span className="font-bn">{blog.author}</span>
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="flex items-center space-x-1.5">
            <Clock size={14} />
            <span>{blog.readTime} {isBn ? 'মিনিট পঠন' : 'min read'}</span>
          </span>
        </div>

        {/* Main Banner Image */}
        {blog.thumbnail && (
          <div className="w-full h-[350px] bg-slate-100 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <img 
              src={blog.thumbnail.startsWith('http') ? blog.thumbnail : `http://localhost:5000${blog.thumbnail}`} 
              className="w-full h-full object-cover" 
              alt={title} 
            />
          </div>
        )}

        {/* Content Paragraphs */}
        <div className="text-gray-750 text-base leading-relaxed font-bn space-y-4 pt-4 whitespace-pre-line">
          {content}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
