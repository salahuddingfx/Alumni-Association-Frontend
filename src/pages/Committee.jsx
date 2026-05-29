import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Mail, Facebook, Linkedin } from 'lucide-react';
import { getImageUrl } from '../utils/image';

const Committee = () => {
  const { i18n } = useTranslation();
  const [members, setMembers] = useState([]);
  const isBn = i18n.language === 'bn';

  useEffect(() => {
    api.get('/committees')
      .then(res => {
        if (res.data.success) {
          setMembers(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching committee:', err));
  }, []);

  // Standard Mock Members in case DB is empty
  const displayMembers = members.length > 0 ? members : [
    {
      _id: '1',
      name: { en: 'Dr. Rafiqul Islam', bn: 'ড. রফিকুল ইসলাম' },
      role: { en: 'President', bn: 'সভাপতি' },
      type: 'president',
      image: '',
      socialLinks: { facebook: '#', linkedin: '#', email: 'president@practonalumni.org' }
    },
    {
      _id: '2',
      name: { en: 'Engr. Mahbubur Rahman', bn: 'প্রকৌশলী মাহবুবুর রহমান' },
      role: { en: 'General Secretary', bn: 'সাধারণ সম্পাদক' },
      type: 'secretary',
      image: '',
      socialLinks: { facebook: '#', linkedin: '#', email: 'secretary@practonalumni.org' }
    },
    {
      _id: '3',
      name: { en: 'Kamrul Hasan', bn: 'কামরুল হাসান' },
      role: { en: 'Treasurer', bn: 'কোষাধ্যক্ষ' },
      type: 'executive',
      image: '',
      socialLinks: { facebook: '#', linkedin: '#', email: 'treasurer@practonalumni.org' }
    }
  ];

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-primary font-bn">
          {isBn ? 'উপদেষ্টা ও নির্বাহী কমিটি' : 'Advisory & Executive Committee'}
        </h1>
        <p className="mt-4 text-gray-600">
          {isBn
            ? 'পরিষদ পরিচালনাকারী সম্মানিত উপদেষ্টা ও কার্যনির্বাহী কমিটির সদস্যবৃন্দ।'
            : 'Honorable Advisors and Executive Committee Members leading the association.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayMembers.map((member) => (
          <div key={member._id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
            <div className="h-64 bg-slate-200 relative flex items-center justify-center">
              {member.image ? (
                <img src={getImageUrl(member.image)} className="w-full h-full object-cover" alt={member.name.en} />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl font-bn">
                  {isBn ? member.name.bn[0] : member.name.en[0]}
                </div>
              )}
              <span className="absolute bottom-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {isBn ? member.role.bn : member.role.en}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl text-primary font-bn">
                {isBn ? member.name.bn : member.name.en}
              </h3>
              
              {/* Social Links */}
              <div className="mt-6 flex space-x-3 text-gray-400">
                <a href={member.socialLinks?.facebook} className="hover:text-primary transition-colors">
                  <Facebook size={20} />
                </a>
                <a href={member.socialLinks?.linkedin} className="hover:text-primary transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href={`mailto:${member.socialLinks?.email}`} className="hover:text-primary transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Committee;
