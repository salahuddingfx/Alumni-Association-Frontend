import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { getImageUrl } from '../utils/image';
import { Mail, Facebook, Linkedin, ArrowLeft, ShieldAlert, Award, Calendar, Bookmark } from 'lucide-react';
import SEO from '../components/SEO';

const CommitteeDetail = () => {
  const { committeeId } = useParams();
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get(`/committees/${committeeId}`)
      .then(res => {
        if (res.data.success && res.data.data) {
          setMember(res.data.data);
        } else {
          setError(isBn ? 'কমিটি সদস্যের তথ্য পাওয়া যায়নি।' : 'Committee member details not found.');
        }
      })
      .catch(err => {
        console.error('Error fetching committee detail:', err);
        setError(err.response?.data?.message || (isBn ? 'তথ্য লোড করতে ব্যর্থ হয়েছে।' : 'Failed to load committee member details.'));
      })
      .finally(() => setLoading(false));
  }, [committeeId, isBn]);

  if (loading) {
    return (
      <div className="py-24 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500 font-bn">{isBn ? 'কমিটি প্রোফাইল লোড হচ্ছে...' : 'Loading profile...'}</span>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="py-20 px-6 max-w-md mx-auto text-center space-y-4">
        <ShieldAlert size={48} className="mx-auto text-rose-500" />
        <h2 className="text-xl font-bold text-gray-800 font-bn">{error || (isBn ? 'ত্রুটি ঘটেছে' : 'Error Occurred')}</h2>
        <Link to="/committee" className="inline-flex items-center space-x-1 bg-primary text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-primary-dark transition shadow">
          <ArrowLeft size={14} />
          <span>{isBn ? 'কমিটিতে ফিরে যান' : 'Back to Committee'}</span>
        </Link>
      </div>
    );
  }

  const memberName = isBn ? member.name.bn : member.name.en;
  const memberRole = isBn ? member.role.bn : member.role.en;
  const memberTypeLabel = {
    president: isBn ? 'সভাপতি' : 'President',
    secretary: isBn ? 'সাধারণ সম্পাদক' : 'Secretary',
    advisor: isBn ? 'উপদেষ্টা' : 'Advisor',
    executive: isBn ? 'কার্যনির্বাহী সদস্য' : 'Executive Member',
    former: isBn ? 'সাবেক সদস্য' : 'Former Member',
  }[member.type] || member.type;

  return (
    <div className="py-16 px-6 max-w-4xl mx-auto">
      {/* Dynamic SEO Tags */}
      <SEO 
        title={memberName}
        description={`${memberRole} - Committee member of Practon Alumni Association.`}
        image={member.image}
        url={`/committee/${member.slug || member._id}`}
      />

      {/* Back Button */}
      <Link to="/committee" className="inline-flex items-center space-x-2 text-primary font-bold hover:text-secondary mb-8 transition text-sm">
        <ArrowLeft size={16} />
        <span>{isBn ? 'কমিটিতে ফিরে যান' : 'Back to Committee'}</span>
      </Link>

      {/* Details Card */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl">
        {/* Banner/Header background gradient */}
        <div className="h-40 bg-gradient-to-r from-[#0c223c] to-primary relative"></div>

        {/* Profile Info Section */}
        <div className="px-6 md:px-12 pb-12 relative">
          
          {/* Avatar floating overlapping the banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 mb-8 md:space-x-6">
            <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-lg shrink-0 border border-gray-150 overflow-hidden">
              <img 
                src={member.image ? getImageUrl(member.image) : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name.en)}`} 
                className="w-full h-full object-cover rounded-2xl" 
                alt={memberName} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'><rect width='100%' height='100%' fill='%23f3f4f6'/><path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z'/></svg>";
                }}
              />
            </div>
            
            <div className="mt-4 md:mt-0 flex-1">
              <span className="text-[10px] bg-secondary/15 text-secondary border border-secondary/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                {isBn ? 'কমিটি সদস্য' : 'Committee Member'}
              </span>
              <h1 className="text-3xl font-extrabold text-primary font-bn mt-2">
                {isBn ? member.name.bn : member.name.en}
              </h1>
              {isBn && member.name.en && (
                <p className="text-gray-500 font-medium text-sm mt-0.5">{member.name.en}</p>
              )}
            </div>

            {/* Position floating tag */}
            <div className="mt-4 md:mt-0 flex items-center space-x-1.5 bg-secondary/10 text-secondary border border-secondary/20 px-4 py-2 rounded-2xl text-sm font-extrabold shadow-sm w-fit">
              <Bookmark size={16} />
              <span>{memberRole}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-gray-100">
            {/* Left Column - Core Info (8 cols) */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Committee Description / Status */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{isBn ? 'পরিষদ পদবি' : 'Position Details'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-start space-x-3">
                    <Award size={18} className="text-secondary mt-0.5" />
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">{isBn ? 'ভূমিকা' : 'Role'}</span>
                      <span className="text-sm font-semibold text-gray-800 leading-tight">{memberRole}</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-start space-x-3">
                    <Calendar size={18} className="text-secondary mt-0.5" />
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">{isBn ? 'কমিটি ক্যাটাগরি' : 'Category'}</span>
                      <span className="text-sm font-semibold text-gray-800 leading-tight">{memberTypeLabel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact / Email (If available) */}
              {member.socialLinks?.email && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{isBn ? 'অফিসিয়াল যোগাযোগ' : 'Official Contact'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href={`mailto:${member.socialLinks.email}`} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center space-x-3 hover:border-secondary hover:shadow-sm transition group">
                      <Mail size={18} className="text-gray-400 group-hover:text-secondary" />
                      <div className="truncate">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">{isBn ? 'অফিসিয়াল ইমেইল' : 'Official Email'}</span>
                        <span className="text-xs font-semibold text-gray-800 group-hover:text-primary truncate block">{member.socialLinks.email}</span>
                      </div>
                    </a>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column - Social specs (4 cols) */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Committee Social Channels */}
              {(member.socialLinks?.facebook || member.socialLinks?.linkedin || member.socialLinks?.email) && (
                <div className="bg-slate-50 p-6 rounded-3xl border border-gray-150 space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isBn ? 'সামাজিক যোগসূত্র' : 'Social Links'}</h4>
                  <div className="flex flex-col space-y-3">
                    {member.socialLinks?.facebook && (
                      <a 
                        href={member.socialLinks.facebook.startsWith('http') ? member.socialLinks.facebook : `https://${member.socialLinks.facebook}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center space-x-2 text-gray-650 hover:text-[#1877F2] transition-colors text-xs font-semibold"
                      >
                        <Facebook size={16} />
                        <span>Facebook</span>
                      </a>
                    )}
                    {member.socialLinks?.linkedin && (
                      <a 
                        href={member.socialLinks.linkedin.startsWith('http') ? member.socialLinks.linkedin : `https://${member.socialLinks.linkedin}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center space-x-2 text-gray-650 hover:text-[#0A66C2] transition-colors text-xs font-semibold"
                      >
                        <Linkedin size={16} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {member.socialLinks?.email && (
                      <a 
                        href={`mailto:${member.socialLinks.email}`} 
                        className="flex items-center space-x-2 text-gray-650 hover:text-secondary transition-colors text-xs font-semibold"
                      >
                        <Mail size={16} />
                        <span>Email Address</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommitteeDetail;
