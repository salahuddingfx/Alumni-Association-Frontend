import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { getImageUrl } from '../utils/image';
import { Globe, ExternalLink, ShieldCheck, Award, Handshake, HeartHandshake, ArrowRight, Users } from 'lucide-react';

const Partners = () => {
  const { i18n } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const isBn = i18n.language === 'bn';

  useEffect(() => {
    setLoading(true);
    api.get('/partners')
      .then(res => {
        if (res.data.success) {
          setPartners(res.data.data);
          setFilteredPartners(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching partners:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { key: 'all', labelEn: 'All Partners', labelBn: 'সকল সহযোগী' },
    { key: 'local_gov', labelEn: 'Local Government', labelBn: 'স্থানীয় সরকার' },
    { key: 'ngo_partner', labelEn: 'NGO & Development', labelBn: 'এনজিও ও উন্নয়ন' },
    { key: 'scholarship_sponsor', labelEn: 'Scholarship & Welfare', labelBn: 'বৃত্তি ও কল্যাণ' },
    { key: 'tech_partner', labelEn: 'Tech & Digital', labelBn: 'প্রযুক্তি' },
    { key: 'other', labelEn: 'Others', labelBn: 'অন্যান্য' },
  ];

  const handleFilter = (categoryKey) => {
    setActiveCategory(categoryKey);
    if (categoryKey === 'all') {
      setFilteredPartners(partners);
    } else {
      setFilteredPartners(partners.filter(p => p.type === categoryKey));
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'local_gov': return isBn ? 'স্থানীয় সরকার' : 'Local Gov';
      case 'ngo_partner': return isBn ? 'উন্নয়ন সহযোগী' : 'NGO & Dev';
      case 'scholarship_sponsor': return isBn ? 'বৃত্তি ও কল্যাণ' : 'Scholarship';
      case 'tech_partner': return isBn ? 'প্রযুক্তি অংশীদার' : 'Tech Partner';
      default: return isBn ? 'পৃষ্ঠপোষক' : 'Collaborator';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'local_gov': return <ShieldCheck className="text-emerald-500" size={16} />;
      case 'ngo_partner': return <HeartHandshake className="text-teal-500" size={16} />;
      case 'scholarship_sponsor': return <Award className="text-amber-500" size={16} />;
      case 'tech_partner': return <Globe className="text-sky-500" size={16} />;
      default: return <Handshake className="text-slate-500" size={16} />;
    }
  };

  const stats = [
    { val: partners.length, labelEn: 'Total Partners', labelBn: 'মোট সহযোগী' },
    { val: partners.filter(p => p.type === 'scholarship_sponsor').length, labelEn: 'Scholarship Sponsors', labelBn: 'বৃত্তি পৃষ্ঠপোষক' },
    { val: partners.filter(p => p.website).length, labelEn: 'With Websites', labelBn: 'ওয়েবসাইট আছে' },
    { val: partners.filter(p => p.type === 'local_gov').length, labelEn: 'Gov. Bodies', labelBn: 'সরকারি সংস্থা' },
  ];

  return (
    <div className="overflow-hidden">

      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-slate-900 text-white py-24 px-6 overflow-hidden">
        {/* Background dot pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <span className="inline-block bg-secondary/20 text-secondary border border-secondary/40 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 font-english">
            {isBn ? 'সহযোগিতা ও পৃষ্ঠপোষকতা' : 'Partnership Network'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-bn leading-tight mb-6">
            {isBn ? 'আমাদের অংশীদার ও পৃষ্ঠপোষক' : 'Our Partners & Sponsors'}
          </h1>
          <p className="text-lg text-white/80 font-bn leading-relaxed max-w-3xl mx-auto">
            {isBn
              ? 'ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয় প্রাক্তন শিক্ষার্থী পরিষদের কল্যাণমুখী উদ্যোগ ও উন্নয়নে যেসব প্রতিষ্ঠান সহযোগিতা করছে তাদের তালিকা।'
              : 'We are proud to collaborate with local bodies, non-profits, trusts and technology providers to empower our alumni and support current students.'
            }
          </p>

          {/* Stats row */}
          {!loading && partners.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center"
                >
                  <div className="text-3xl font-extrabold text-white">{stat.val}</div>
                  <div className="text-xs text-white/60 font-bn mt-1">
                    {isBn ? stat.labelBn : stat.labelEn}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ─── FILTER + GRID ─────────────────────────────────────────────── */}
      <div className="py-16 px-6 max-w-7xl mx-auto space-y-10">

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleFilter(cat.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-bn transition-all shadow-sm uppercase tracking-wide ${
                activeCategory === cat.key
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-white text-gray-600 hover:bg-slate-50 hover:text-primary border border-gray-200 hover:border-primary/30'
              }`}
            >
              {isBn ? cat.labelBn : cat.labelEn}
              {cat.key !== 'all' && (
                <span className="ml-1.5 opacity-60 text-[9px]">
                  ({partners.filter(p => cat.key === 'all' ? true : p.type === cat.key).length})
                </span>
              )}
              {cat.key === 'all' && (
                <span className="ml-1.5 opacity-60 text-[9px]">({partners.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 animate-pulse">
                <div className="h-24 bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-2/3 mx-auto" />
                <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : filteredPartners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredPartners.map((partner, idx) => (
              <motion.div
                key={partner._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="bg-white rounded-2xl border border-gray-150 p-6 flex flex-col justify-between items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Gradient top line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-secondary to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Logo Area */}
                <div className="w-full h-32 flex items-center justify-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 group-hover:bg-slate-50 transition-colors">
                  <img
                    src={getImageUrl(partner.logo)}
                    alt={isBn ? partner.name?.bn : partner.name?.en}
                    className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105"
                  />
                </div>

                {/* Card Body */}
                <div className="mt-5 space-y-2 flex-grow w-full">
                  <div className="inline-flex items-center space-x-1.5 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 border border-slate-200">
                    {getTypeIcon(partner.type)}
                    <span className="uppercase tracking-wider font-english">{getTypeLabel(partner.type)}</span>
                  </div>

                  <h3 className="text-lg font-bold text-primary font-bn leading-snug group-hover:text-secondary transition-colors duration-250">
                    {isBn ? partner.name?.bn : partner.name?.en}
                  </h3>
                  {partner.name?.en && isBn && (
                    <p className="text-[9px] font-semibold text-slate-400 font-english uppercase tracking-wider">{partner.name.en}</p>
                  )}
                </div>

                {/* Website Button */}
                <div className="mt-6 w-full pt-4 border-t border-slate-100">
                  {partner.website ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center space-x-2 bg-slate-50 hover:bg-primary hover:text-white text-primary border border-slate-200 hover:border-primary font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wide transition-all"
                    >
                      <Globe size={14} />
                      <span>{isBn ? 'ওয়েবসাইট ভিজিট' : 'Visit Website'}</span>
                      <ExternalLink size={12} className="opacity-70" />
                    </a>
                  ) : (
                    <div className="w-full flex items-center justify-center space-x-1.5 text-slate-400 py-2 text-[9px] font-bold uppercase tracking-wider">
                      <span>{isBn ? 'কোনো ওয়েবসাইট নেই' : 'No Website Provided'}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-300">
            <Handshake size={48} className="mx-auto text-slate-400 mb-3" />
            <p className="text-gray-500 font-bn text-base">
              {isBn
                ? 'এই ক্যাটাগরিতে বর্তমানে কোনো সহযোগী বা পৃষ্ঠপোষক নেই।'
                : 'There are currently no sponsors or partners in this category.'
              }
            </p>
          </div>
        )}
      </div>

      {/* ─── BECOME A PARTNER CTA ─────────────────────────────────────── */}
      <div className="py-20 px-6 bg-gradient-to-br from-slate-900 to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,168,38,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="max-w-3xl mx-auto text-center relative z-10 space-y-6"
        >
          <span className="inline-block bg-secondary/20 text-secondary border border-secondary/40 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full font-english">
            {isBn ? 'অংশীদার হতে চান?' : 'Become a Partner'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-bn">
            {isBn ? 'আমাদের সাথে যুক্ত হোন' : 'Join Our Partnership Network'}
          </h2>
          <p className="text-white/70 font-bn max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? 'আপনার প্রতিষ্ঠান বা সংস্থা আমাদের মিশনে অংশ নিতে চাইলে আজই আমাদের সাথে যোগাযোগ করুন এবং আমাদের প্রাক্তনী নেটওয়ার্কের অংশ হোন।'
              : 'If your organization or institution would like to be part of our mission, contact us today and become a proud part of our alumni network.'
            }
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link
              to="/contact"
              className="bg-secondary hover:bg-yellow-500 text-white font-bold px-10 py-3.5 rounded-full transition shadow-lg w-full sm:w-auto uppercase tracking-wide text-sm font-english flex items-center justify-center space-x-2"
            >
              <span>{isBn ? 'যোগাযোগ করুন' : 'Get In Touch'}</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/about"
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white/40 hover:border-white/60 font-bold px-10 py-3.5 rounded-full transition w-full sm:w-auto uppercase tracking-wide text-sm font-english"
            >
              {isBn ? 'আমাদের সম্পর্কে' : 'Learn About Us'}
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Partners;
