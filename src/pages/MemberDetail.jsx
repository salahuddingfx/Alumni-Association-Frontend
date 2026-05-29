import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { getImageUrl } from '../utils/image';
import { Mail, Phone, Building, Calendar, Droplet, User, Award, Facebook, Linkedin, Twitter, Globe, ArrowLeft, ShieldAlert } from 'lucide-react';
import SEO from '../components/SEO';

const MemberDetail = () => {
  const { memberId } = useParams();
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get(`/members/${memberId}`)
      .then(res => {
        if (res.data.success && res.data.data) {
          setMember(res.data.data);
        } else {
          setError(isBn ? 'সদস্যের তথ্য পাওয়া যায়নি।' : 'Alumni member details not found.');
        }
      })
      .catch(err => {
        console.error('Error fetching member detail:', err);
        setError(err.response?.data?.message || (isBn ? 'তথ্য লোড করতে ব্যর্থ হয়েছে।' : 'Failed to load member profile details.'));
      })
      .finally(() => setLoading(false));
  }, [memberId, isBn]);

  if (loading) {
    return (
      <div className="py-24 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500 font-bn">{isBn ? 'প্রোফাইল লোড হচ্ছে...' : 'Loading profile...'}</span>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="py-20 px-6 max-w-md mx-auto text-center space-y-4">
        <ShieldAlert size={48} className="mx-auto text-rose-500" />
        <h2 className="text-xl font-bold text-gray-800 font-bn">{error || (isBn ? 'ত্রুটি ঘটেছে' : 'Error Occurred')}</h2>
        <Link to="/members" className="inline-flex items-center space-x-1 bg-primary text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-primary-dark transition shadow">
          <ArrowLeft size={14} />
          <span>{isBn ? 'ডিরেক্টরিতে ফিরে যান' : 'Back to Directory'}</span>
        </Link>
      </div>
    );
  }

  const isFemale = member.gender?.toLowerCase() === 'female';
  const memberName = isBn ? member.name.bn : member.name.en;
  const memberBio = isBn ? (member.bio?.bn || member.bio?.en) : (member.bio?.en || member.bio?.bn);

  return (
    <div className="py-16 px-6 max-w-4xl mx-auto">
      {/* Dynamic SEO Tags */}
      <SEO 
        title={memberName}
        description={memberBio || `${memberName} - PSC Batch of ${member.pscBatch || member.batch}. ${member.profession || ''}`}
        image={member.profilePhoto}
        url={`/members/${member.user?.username || member._id}`}
      />

      {/* Back Button */}
      <Link to="/members" className="inline-flex items-center space-x-2 text-primary font-bold hover:text-secondary mb-8 transition text-sm">
        <ArrowLeft size={16} />
        <span>{isBn ? 'ডিরেক্টরিতে ফিরে যান' : 'Back to Directory'}</span>
      </Link>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl">
        {/* Banner/Header background gradient */}
        <div className="h-40 bg-gradient-to-r from-primary to-primary-dark relative"></div>

        {/* Profile Info Section */}
        <div className="px-6 md:px-12 pb-12 relative">
          
          {/* Avatar floating overlapping the banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 mb-8 md:space-x-6">
            <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-lg shrink-0 border border-gray-150 overflow-hidden">
              <img 
                src={member.profilePhoto ? getImageUrl(member.profilePhoto) : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name.en)}`} 
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
                {isBn ? 'প্রাক্তন শিক্ষার্থী' : 'Alumnus'}
              </span>
              <h1 className="text-3xl font-extrabold text-primary font-bn mt-2">
                {isBn ? member.name.bn : member.name.en}
              </h1>
              {isBn && member.name.en && (
                <p className="text-gray-500 font-medium text-sm mt-0.5">{member.name.en}</p>
              )}
            </div>

            {/* Blood group floating tag */}
            {member.bloodGroup && (
              <div className="mt-4 md:mt-0 flex items-center space-x-1.5 bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl text-sm font-extrabold border border-rose-100 shadow-sm w-fit">
                <Droplet size={16} className="fill-current text-rose-500" />
                <span>{isBn ? `গ্রুপ: ${member.bloodGroup}` : `Blood: ${member.bloodGroup}`}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-gray-100">
            {/* Left Column - Core Info (8 cols) */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Bio Block */}
              {memberBio && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{isBn ? 'সংক্ষিপ্ত পরিচিতি' : 'Biography / Status'}</h3>
                  <p className="text-gray-700 leading-relaxed font-bn text-base bg-slate-50 p-4 rounded-2xl border border-gray-150">
                    {memberBio}
                  </p>
                </div>
              )}

              {/* Professional Background */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{isBn ? 'পেশাগত তথ্য' : 'Professional Background'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-start space-x-3">
                    <Award size={18} className="text-secondary mt-0.5" />
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">{isBn ? 'পেশা' : 'Profession'}</span>
                      <span className="text-sm font-semibold text-gray-800 leading-tight">{member.profession || (isBn ? 'উল্লেখ নেই' : 'Not Specified')}</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-start space-x-3">
                    <Building size={18} className="text-secondary mt-0.5" />
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">{isBn ? 'প্রতিষ্ঠান' : 'Organization'}</span>
                      <span className="text-sm font-semibold text-gray-800 leading-tight">{member.currentOrganization || (isBn ? 'উল্লেখ নেই' : 'Not Specified')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{isBn ? 'যোগাযোগের মাধ্যম' : 'Contact Details'}</h3>
                {isFemale ? (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 text-center flex flex-col items-center space-y-2">
                    <ShieldAlert size={32} className="text-amber-500" />
                    <h4 className="text-sm font-bold text-slate-800 font-bn">
                      {isBn ? 'যোগাযোগের তথ্য গোপন রাখা হয়েছে' : 'Contact Details Private'}
                    </h4>
                    <p className="text-xs text-gray-500 font-bn leading-normal max-w-sm">
                      {isBn 
                        ? 'নিরাপত্তা ও প্রাইভেসি রক্ষার্থে আমাদের নারী সদস্যদের ব্যক্তিগত কন্টাক্ট ডিটেইলস পাবলিকলি দেখানো হয় না।' 
                        : 'To protect the privacy of our female alumni community members, personal phone numbers and emails are kept private.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href={`mailto:${member.email}`} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center space-x-3 hover:border-secondary hover:shadow-sm transition group">
                      <Mail size={18} className="text-gray-400 group-hover:text-secondary" />
                      <div className="truncate">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">{isBn ? 'ইমেইল' : 'Email Address'}</span>
                        <span className="text-xs font-semibold text-gray-800 group-hover:text-primary truncate block">{member.email}</span>
                      </div>
                    </a>
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center space-x-3 hover:border-secondary hover:shadow-sm transition group">
                        <Phone size={18} className="text-gray-400 group-hover:text-secondary" />
                        <div>
                          <span className="block text-[10px] text-gray-400 font-bold uppercase">{isBn ? 'ফোন নম্বর' : 'Phone Number'}</span>
                          <span className="text-xs font-semibold text-gray-800 group-hover:text-primary">{member.phone}</span>
                        </div>
                      </a>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column - Directory Specs (4 cols) */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Academic Details Card */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-gray-150 space-y-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isBn ? 'শিক্ষাগত যোগ্যতা' : 'Educational Milestones'}</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar size={18} className="text-primary shrink-0" />
                    <div>
                      <span className="block text-[9px] text-gray-400 font-bold uppercase">PSC Batch</span>
                      <span className="text-sm font-bold text-gray-800">Batch {member.pscBatch || 'N/A'}</span>
                    </div>
                  </div>
                  {member.batch && (
                    <div className="flex items-center space-x-3">
                      <Calendar size={18} className="text-primary shrink-0" />
                      <div>
                        <span className="block text-[9px] text-gray-400 font-bold uppercase">SSC Batch</span>
                        <span className="text-sm font-bold text-gray-800">Batch {member.batch}</span>
                      </div>
                    </div>
                  )}
                  {member.hscBatch && (
                    <div className="flex items-center space-x-3">
                      <Calendar size={18} className="text-primary shrink-0" />
                      <div>
                        <span className="block text-[9px] text-gray-400 font-bold uppercase">HSC Batch</span>
                        <span className="text-sm font-bold text-gray-800">Batch {member.hscBatch}</span>
                      </div>
                    </div>
                  )}
                  {member.higherEducation && (
                    <div className="flex items-start space-x-3 border-t border-gray-200/60 pt-3">
                      <Award size={18} className="text-secondary shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] text-gray-400 font-bold uppercase">{isBn ? 'উচ্চশিক্ষা ও ডিগ্রি' : 'Higher Education / Diploma / Degrees'}</span>
                        <span className="text-xs font-semibold text-slate-700 leading-normal block">{member.higherEducation}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 border-t border-gray-200/60 pt-3">
                    <User size={18} className="text-primary shrink-0" />
                    <div>
                      <span className="block text-[9px] text-gray-400 font-bold uppercase">{isBn ? 'লিঙ্গ' : 'Gender'}</span>
                      <span className="text-sm font-bold text-gray-800 uppercase">{member.gender || 'Male'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              {(member.socialLinks?.facebook || member.socialLinks?.linkedin || member.socialLinks?.twitter || member.socialLinks?.website) && (
                <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isBn ? 'সামাজিক যোগসূত্র' : 'Social Profiles'}</h4>
                  <div className="flex flex-col space-y-3">
                    {member.socialLinks?.facebook && (
                      <a 
                        href={member.socialLinks.facebook.startsWith('http') ? member.socialLinks.facebook : `https://${member.socialLinks.facebook}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center space-x-2 text-gray-600 hover:text-[#1877F2] transition-colors text-xs font-semibold"
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
                        className="flex items-center space-x-2 text-gray-600 hover:text-[#0A66C2] transition-colors text-xs font-semibold"
                      >
                        <Linkedin size={16} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {member.socialLinks?.twitter && (
                      <a 
                        href={member.socialLinks.twitter.startsWith('http') ? member.socialLinks.twitter : `https://${member.socialLinks.twitter}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center space-x-2 text-gray-600 hover:text-[#1DA1F2] transition-colors text-xs font-semibold"
                      >
                        <Twitter size={16} />
                        <span>Twitter / X</span>
                      </a>
                    )}
                    {member.socialLinks?.website && (
                      <a 
                        href={member.socialLinks.website.startsWith('http') ? member.socialLinks.website : `https://${member.socialLinks.website}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center space-x-2 text-gray-600 hover:text-secondary transition-colors text-xs font-semibold"
                      >
                        <Globe size={16} />
                        <span>Website</span>
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

export default MemberDetail;
