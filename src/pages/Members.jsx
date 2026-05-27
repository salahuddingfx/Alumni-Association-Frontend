import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api, { API_URL } from '../api/api';
import { Search, Mail, Building, Droplet, Calendar, Award } from 'lucide-react';

const Members = () => {
  const { i18n } = useTranslation();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [pscBatch, setPscBatch] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [professionFilter, setProfessionFilter] = useState('');
  const isBn = i18n.language === 'bn';

  useEffect(() => {
    // Fetch members with filters from API (Fallback to client-side filtering if API is empty)
    api.get(`/members?search=${search}&pscBatch=${pscBatch}&bloodGroup=${bloodGroup}`)
      .then(res => {
        if (res.data.success) {
          setMembers(res.data.data.members);
        }
      })
      .catch(err => console.log('Error fetching members:', err));
  }, [search, pscBatch, bloodGroup]);

  const sourceMembers = members;

  // Filter members on client-side for immediate responsive feel
  const filteredMembers = sourceMembers.filter(m => {
    if (!m.name || !m.email) return false;
    const nameMatch = isBn
      ? (m.name.bn || '').toLowerCase().includes(search.toLowerCase())
      : (m.name.en || '').toLowerCase().includes(search.toLowerCase());
    const emailMatch = m.email.toLowerCase().includes(search.toLowerCase());
    const orgMatch = (m.currentOrganization || '').toLowerCase().includes(search.toLowerCase());
    const profMatch = (m.profession || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesSearch = search === '' || nameMatch || emailMatch || orgMatch || profMatch;
    const matchesPsc = pscBatch === '' || m.pscBatch === pscBatch;
    const matchesBlood = bloodGroup === '' || m.bloodGroup === bloodGroup;
    const matchesProfFilter = professionFilter === '' || (m.profession || '').toLowerCase().includes(professionFilter.toLowerCase());

    return matchesSearch && matchesPsc && matchesBlood && matchesProfFilter;
  });

  const uniquePscBatches = [...new Set(sourceMembers.map(m => m.pscBatch).filter(Boolean))].sort();
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-primary font-bn">
          {isBn ? 'প্রাক্তন সদস্য ডিরেক্টরি' : 'Alumni Member Directory'}
        </h1>
        <p className="mt-4 text-gray-600 font-bn">
          {isBn 
            ? 'খুঁজুন আপনার ব্যাচমেট, রক্তের গ্রুপ অথবা নির্দিষ্ট পেশাদার প্রাক্তন শিক্ষার্থীদের।' 
            : 'Find your batchmates, search by blood group or specific professional backgrounds.'}
        </p>
      </div>

      {/* Advanced Filters Block */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Text Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={isBn ? 'নাম বা ইমেইল দিয়ে খুঁজুন...' : 'Search by name/email...'}
              className="w-full bg-white border border-gray-300 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-secondary text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* PSC Batch Dropdown */}
          <div>
            <select
              className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-xl focus:outline-none focus:border-secondary text-sm"
              value={pscBatch}
              onChange={(e) => setPscBatch(e.target.value)}
            >
              <option value="">{isBn ? 'সব পিএসসি ব্যাচ' : 'All PSC Batches'}</option>
              {uniquePscBatches.map(b => (
                <option key={b} value={b}>{isBn ? `ব্যাচ ${b}` : `Batch ${b}`}</option>
              ))}
            </select>
          </div>

          {/* Blood Group Dropdown */}
          <div>
            <select
              className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-xl focus:outline-none focus:border-secondary text-sm font-bold text-red-600"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              <option value="" className="text-gray-700 font-normal">{isBn ? 'রক্তের গ্রুপ (সব)' : 'Blood Group (All)'}</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* Profession Search */}
          <div className="relative">
            <Award className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={isBn ? 'পেশা (যেমন: Engineer)...' : 'Profession filter...'}
              className="w-full bg-white border border-gray-300 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-secondary text-sm"
              value={professionFilter}
              onChange={(e) => setProfessionFilter(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div key={member._id} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-secondary shadow-sm hover:shadow-md transition-all flex items-start space-x-4 relative group">
              
              {/* Blood Group Flag Badge */}
              <div className="absolute top-4 right-4 flex items-center space-x-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-extrabold border border-red-100">
                <Droplet size={12} className="fill-current text-red-500" />
                <span>{member.bloodGroup}</span>
              </div>

              {/* Avatar Image / Initial Circle */}
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary overflow-hidden flex items-center justify-center font-extrabold text-xl shrink-0 border border-slate-100">
                {member.profilePhoto ? (
                  <img src={member.profilePhoto.startsWith('http') ? member.profilePhoto : `${API_URL}${member.profilePhoto}`} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span>{isBn ? (member.name.bn ? member.name.bn[0] : 'প') : (member.name.en ? member.name.en[0] : 'P')}</span>
                )}
              </div>

              <div className="space-y-1.5 pr-12">
                <h3 className="font-extrabold text-lg text-primary font-bn group-hover:text-secondary transition-colors">
                  {isBn ? member.name.bn : member.name.en}
                </h3>
                
                <div className="flex items-center space-x-3 text-xs text-gray-500 font-bold">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>SSC: {member.batch}</span>
                  </div>
                  <span>•</span>
                  <span>PSC: {member.pscBatch}</span>
                </div>

                <div className="space-y-1 text-sm text-gray-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start space-x-1.5">
                    <Building size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="leading-snug">{member.profession} {member.currentOrganization && `at ${member.currentOrganization}`}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate max-w-[180px]">{member.email}</span>
                  </div>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 font-bn">
            {isBn ? 'দুঃখিত, কোনো মিল পাওয়া যায়নি!' : 'No matching alumni found!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
