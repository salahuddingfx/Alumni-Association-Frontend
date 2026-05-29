import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { getImageUrl } from '../utils/image';
import { Globe, ExternalLink, ShieldCheck, Award, Handshake, HeartHandshake } from 'lucide-react';

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
    { key: 'local_gov', labelEn: 'Local Government', labelBn: 'স্থানীয় সরকার সংস্থা' },
    { key: 'ngo_partner', labelEn: 'NGO & Development', labelBn: 'এনজিও ও উন্নয়ন সংস্থা' },
    { key: 'scholarship_sponsor', labelEn: 'Scholarship & Welfare', labelBn: 'বৃত্তি ও কল্যাণ তহবিল' },
    { key: 'tech_partner', labelEn: 'Tech & Digital', labelBn: 'তথ্যপ্রযুক্তি ও ডিজিটাল' },
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
      case 'local_gov':
        return isBn ? 'স্থানীয় সরকার' : 'Local Gov';
      case 'ngo_partner':
        return isBn ? 'উন্নয়ন সহযোগী' : 'NGO & Dev Partner';
      case 'scholarship_sponsor':
        return isBn ? 'বৃত্তি ও কল্যাণ' : 'Scholarship & Welfare';
      case 'tech_partner':
        return isBn ? 'প্রযুক্তি অংশীদার' : 'Tech & Digital Partner';
      default:
        return isBn ? 'পৃষ্ঠপোষক' : 'Collaborator';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'local_gov':
        return <ShieldCheck className="text-emerald-500" size={16} />;
      case 'ngo_partner':
        return <HeartHandshake className="text-teal-500" size={16} />;
      case 'scholarship_sponsor':
        return <Award className="text-amber-500" size={16} />;
      case 'tech_partner':
        return <Globe className="text-sky-500" size={16} />;
      default:
        return <Handshake className="text-slate-500" size={16} />;
    }
  };

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-secondary font-bold text-sm uppercase tracking-wider block font-english">
          {isBn ? "সহযোগিতা ও পৃষ্ঠপোষকতা" : "Partnership Network"}
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary font-bn tracking-tight">
          {isBn ? 'আমাদের অংশীদার ও পৃষ্ঠপোষক' : 'Our Partners & Sponsors'}
        </h1>
        <p className="text-gray-600 font-bn text-sm sm:text-base leading-relaxed">
          {isBn 
            ? 'ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয় প্রাক্তন শিক্ষার্থী পরিষদের বিভিন্ন কল্যাণমুখী উদ্যোগ ও উন্নয়নে সহযোগী প্রতিষ্ঠানসমূহের তালিকা।' 
            : 'We are incredibly proud to collaborate with local bodies, non-profits, trusts, and technology providers to empower our alumni and current students.'
          }
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 py-2 border-y border-gray-150">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleFilter(cat.key)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold font-bn transition shadow-sm uppercase tracking-wide ${
              activeCategory === cat.key
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-slate-50 hover:text-primary border border-gray-200'
            }`}
          >
            {isBn ? cat.labelBn : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Partners Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 animate-pulse">
              <div className="h-24 bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-150 rounded w-2/3 mx-auto" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : filteredPartners.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPartners.map((partner) => (
            <div
              key={partner._id}
              className="bg-white rounded-2xl border border-gray-150 p-6 flex flex-col justify-between items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-350 relative group overflow-hidden"
            >
              {/* Top abstract line */}
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
              <div className="mt-5 space-y-2 flex-grow">
                <div className="inline-flex items-center space-x-1.5 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-550 border border-slate-200">
                  {getTypeIcon(partner.type)}
                  <span className="uppercase tracking-wider font-english">{getTypeLabel(partner.type)}</span>
                </div>

                <h3 className="text-lg font-bold text-primary font-bn leading-snug group-hover:text-secondary transition-colors duration-250">
                  {isBn ? partner.name?.bn : partner.name?.en}
                </h3>
                {partner.name?.en && isBn && (
                  <p className="text-xxs font-semibold text-slate-400 font-english uppercase tracking-wider">{partner.name.en}</p>
                )}
              </div>

              {/* Website Trigger Button */}
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
                  <div className="w-full flex items-center justify-center space-x-1.5 text-slate-400 py-2 text-xxs font-bold uppercase tracking-wider">
                    <span>{isBn ? 'কোনো ওয়েবসাইট নেই' : 'No Website Provided'}</span>
                  </div>
                )}
              </div>
            </div>
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
  );
};

export default Partners;
