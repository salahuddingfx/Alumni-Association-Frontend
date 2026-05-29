import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { API_URL } from '../api/api';
import { User, Calendar, LogOut, Ticket, Mail, Phone, Tag, Edit, Save, X, Key, Upload, ShieldAlert, CheckCircle, AlertCircle, ShieldCheck, RefreshCw, Smartphone, CreditCard } from 'lucide-react';
import { initClientSocket } from '../utils/socket';
import { getImageUrl } from '../utils/image';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [profile, setProfile] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');

  // Editing States for Account Login Settings
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState('');
  const [profileMessage, setProfileMessage] = useState('');

  // Directory Profile States
  const [memberProfile, setMemberProfile] = useState(null);
  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [batch, setBatch] = useState('');
  const [pscBatch, setPscBatch] = useState('');
  const [hscBatch, setHscBatch] = useState('');
  const [higherEducation, setHigherEducation] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [gender, setGender] = useState('Male');
  const [profession, setProfession] = useState('');
  const [currentOrganization, setCurrentOrganization] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [bioEn, setBioEn] = useState('');
  const [bioBn, setBioBn] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [memberMsg, setMemberMsg] = useState('');
  const [savingMember, setSavingMember] = useState(false);

  // Virtual ID Card States
  const [idCardData, setIdCardData] = useState(null);
  const [idCardLoading, setIdCardLoading] = useState(false);
  const [idCardFlip, setIdCardFlip] = useState(false);

  const fetchIdCard = (token) => {
    setIdCardLoading(true);
    api.get('/members/my/id-card', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success) {
          setIdCardData(res.data.data);
        }
      })
      .catch(err => {
        console.log('ID Card fetch error:', err);
      })
      .finally(() => {
        setIdCardLoading(false);
      });
  };

  const fetchProfile = (token) => {
    api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success) {
          const user = res.data.data.user;
          setProfile(user);
          setEditUsername(user.username || '');
          setEditEmail(user.email || '');
          setEditPhone(user.phone || '');
          setEditFullName(user.fullName || '');
          if (user.profilePhoto) {
            setUserPhotoPreview(getImageUrl(user.profilePhoto));
          } else {
            setUserPhotoPreview('');
          }
        }
      })
      .catch(() => {
        handleLogout();
      });
  };

  const fetchMemberProfile = (token) => {
    api.get('/members/my/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success && res.data.data) {
          const m = res.data.data;
          setMemberProfile(m);
          setNameEn(m.name?.en || '');
          setNameBn(m.name?.bn || '');
          setBatch(m.batch || '');
          setPscBatch(m.pscBatch || '');
          setHscBatch(m.hscBatch || '');
          setHigherEducation(m.higherEducation || '');
          setBloodGroup(m.bloodGroup || 'O+');
          setGender(m.gender || 'Male');
          setProfession(m.profession || '');
          setCurrentOrganization(m.currentOrganization || '');
          setMemberPhone(m.phone || '');
          setBioEn(m.bio?.en || '');
          setBioBn(m.bio?.bn || '');
          setFacebook(m.socialLinks?.facebook || '');
          setLinkedin(m.socialLinks?.linkedin || '');
          setTwitter(m.socialLinks?.twitter || '');
          setWebsite(m.socialLinks?.website || '');
          setIsPublic(m.isPublic !== false);
          initClientSocket(m);
          if (m.profilePhoto) {
            setProfilePhotoPreview(getImageUrl(m.profilePhoto));
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchProfile(token);
    fetchMemberProfile(token);
    fetchIdCard(token);

    // Fetch Registrations
    api.get('/events/my/registrations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success) {
          setRegistrations(res.data.data);
        }
      })
      .catch(() => {});
  }, [navigate]);

  // Countdown timer for TOTP token refetching every 30s
  useEffect(() => {
    let timer;
    if (idCardData) {
      timer = setInterval(() => {
        setIdCardData(prev => {
          if (!prev) return null;
          if (prev.expiresIn <= 1) {
            const token = localStorage.getItem('accessToken');
            fetchIdCard(token);
            return prev;
          }
          return { ...prev, expiresIn: prev.expiresIn - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [idCardData]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('username', editUsername);
      formData.append('email', editEmail);
      formData.append('phone', editPhone);
      formData.append('fullName', editFullName);
      if (editPassword) {
        formData.append('password', editPassword);
      }
      if (userPhotoFile) {
        formData.append('profilePhoto', userPhotoFile);
      }

      const res = await api.put('/auth/me', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setProfile(res.data.data.user);
        setIsEditing(false);
        setEditPassword('');
        setUserPhotoFile(null);
        fetchMemberProfile(token);
        setProfileMessage('Account login settings updated successfully!');
        setTimeout(() => setProfileMessage(''), 3000);
      }
    } catch (err) {
      setProfileMessage(err.response?.data?.message || 'Update failed');
    }
  };

  const handleSaveMemberProfile = async (e) => {
    e.preventDefault();
    setMemberMsg('');
    try {
      setSavingMember(true);
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('name', JSON.stringify({ en: nameEn, bn: nameBn }));
      formData.append('batch', batch);
      formData.append('pscBatch', pscBatch);
      formData.append('hscBatch', hscBatch);
      formData.append('higherEducation', higherEducation);
      formData.append('bloodGroup', bloodGroup);
      formData.append('gender', gender);
      formData.append('profession', profession);
      formData.append('currentOrganization', currentOrganization);
      formData.append('phone', memberPhone);
      formData.append('bio', JSON.stringify({ en: bioEn, bn: bioBn }));
      formData.append('socialLinks', JSON.stringify({ facebook, linkedin, twitter, website }));
      formData.append('isPublic', isPublic);
      if (profilePhotoFile) {
        formData.append('profilePhoto', profilePhotoFile);
      }

      const res = await api.put('/members/my/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setMemberProfile(res.data.data);
        fetchProfile(token);
        fetchIdCard(token);
        setMemberMsg(isBn ? 'ডিরেক্টরি প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' : 'Directory profile updated successfully!');
        if (res.data.data.profilePhoto) {
          setProfilePhotoPreview(getImageUrl(res.data.data.profilePhoto));
        }
        setTimeout(() => setMemberMsg(''), 3000);
      }
    } catch (err) {
      setMemberMsg(err.response?.data?.message || 'Profile save failed');
    } finally {
      setSavingMember(false);
    }
  };

  if (!profile) {
    return (
      <div className="py-20 text-center text-gray-500 font-semibold font-bn">
        {isBn ? 'ড্যাশবোর্ড লোড হচ্ছে...' : 'Loading your dashboard...'}
      </div>
    );
  }

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-primary text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div>
          <span className="text-secondary font-bold text-xs uppercase tracking-wider">Member Area</span>
          <h1 className="text-3xl font-extrabold font-bn mt-1">
            স্বাগতম, {profile.username || 'প্রাক্তন সদস্য'}
          </h1>
          <p className="text-sm text-slate-200 mt-1">{profile.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-full transition"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column - Account login settings & Tickets list - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Virtual Alumni Identity Card */}
          {idCardData ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-primary flex items-center justify-between pb-4 border-b border-gray-150">
                <div className="flex items-center space-x-2">
                  <CreditCard size={18} className="text-secondary" />
                  <span>Virtual Alumni ID Card</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                  <ShieldCheck size={10} />
                  <span>Verified Pass</span>
                </span>
              </h3>

              {/* Flip Card Wrapper */}
              <div 
                className="relative w-full aspect-[1.586/1] rounded-2xl cursor-pointer select-none overflow-hidden transition-all duration-500 shadow-lg border border-primary/10"
                onClick={() => setIdCardFlip(!idCardFlip)}
                style={{
                  perspective: '1000px',
                }}
              >
                {/* Card Container for 3D flip effect */}
                <div 
                  className="w-full h-full relative transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: idCardFlip ? 'rotateY(180deg)' : 'none',
                  }}
                >
                  {/* FRONT SIDE */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary to-primary-dark p-5 rounded-2xl flex flex-col justify-between text-white"
                    style={{
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white/10 rounded-full border border-secondary/40 flex items-center justify-center font-bold text-white text-xs">
                          প
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold font-bn tracking-wide">প্রাক্তন শিক্ষার্থী পরিষদ</span>
                          <span className="text-[7px] text-slate-300 font-medium uppercase tracking-wider">Alumni Card</span>
                        </div>
                      </div>
                      <span className="text-[8px] border border-secondary/30 bg-secondary/10 px-2 py-0.5 rounded text-secondary font-extrabold uppercase tracking-widest">Official</span>
                    </div>

                    {/* Card Body */}
                    <div className="flex items-center space-x-4 my-auto">
                      <div className="w-14 h-14 rounded-full border-2 border-secondary overflow-hidden bg-white/15 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md">
                        {idCardData.member.profilePhoto ? (
                          <img src={getImageUrl(idCardData.member.profilePhoto)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          idCardData.member.name.en.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold font-bn tracking-wide leading-tight">{idCardData.member.name.en}</h4>
                        <p className="text-[9px] font-bn text-slate-300">{idCardData.member.name.bn}</p>
                        <div className="flex space-x-3 text-[8px] text-slate-200 mt-1">
                          <div>
                            <span className="text-gray-400 block text-[6px] uppercase">Batch</span>
                            <span className="font-bold">{idCardData.member.batch}</span>
                          </div>
                          {idCardData.member.bloodGroup && (
                            <div>
                              <span className="text-gray-400 block text-[6px] uppercase">Blood</span>
                              <span className="font-bold text-rose-300">{idCardData.member.bloodGroup}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-400 block text-[6px] uppercase">ID</span>
                            <span className="font-mono">{idCardData.member._id.toString().slice(-6).toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[7px] text-slate-300 uppercase tracking-widest">
                      <span>Practon Alumni Portal</span>
                      <span className="text-slate-400">Click to flip</span>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0c223c] to-[#040e1a] p-5 rounded-2xl flex flex-col justify-between text-white border border-primary/20"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-[8px] text-secondary font-bold uppercase tracking-wider">Dynamic Gate Check-In Pass</span>
                      <div className="flex items-center space-x-1 text-[8px] text-gray-400">
                        <RefreshCw size={8} className="animate-spin text-secondary" />
                        <span>Expires in {idCardData.expiresIn}s</span>
                      </div>
                    </div>

                    {/* Card Body - QR & Barcode */}
                    <div className="flex items-center justify-around my-auto">
                      <div className="bg-white p-1 rounded-lg shadow-md border border-gray-255 shrink-0">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(idCardData.verificationUrl)}`} 
                          alt="Dynamic QR Code" 
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <div className="font-mono text-base tracking-widest font-bold text-secondary">
                          {idCardData.totpToken}
                        </div>
                        <p className="text-[7px] text-slate-300 max-w-[120px] mx-auto leading-normal">
                          Scan at gate for authenticated entrance. Valid for 30s.
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-[6px] text-gray-500 uppercase tracking-widest border-t border-white/10 pt-2">
                      Secured by SHA-256 OTP Algorithm
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const token = localStorage.getItem('accessToken');
                    window.open(`http://localhost:5000/api/members/my/id-card/pkpass?token=${token}`, '_blank');
                  }}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-lg flex items-center justify-center space-x-2 shadow transition text-xs uppercase"
                >
                  <Smartphone size={14} className="text-secondary" />
                  <span>Apple Wallet Pass</span>
                </button>
              </div>
            </div>
          ) : !idCardLoading && !memberProfile ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-center">
              <CreditCard size={32} className="mx-auto text-gray-400" />
              <h4 className="text-sm font-bold text-primary">Virtual ID Card Locked</h4>
              <p className="text-xs text-gray-500 font-bn leading-relaxed px-4">
                {isBn 
                  ? 'আপনার ভার্চুয়াল আইডি কার্ড জেনারেট করতে অনুগ্রহ করে ডিরেক্টরি প্রোফাইলটি সম্পূর্ণ করুন।' 
                  : 'Please complete your Directory Profile on the right to activate your Virtual Alumnus Identity Card.'}
              </p>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
              <RefreshCw size={24} className="mx-auto text-secondary animate-spin mb-2" />
              <span className="text-xs text-gray-500">Generating secure ID card...</span>
            </div>
          )}

          {/* Account Login Settings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 h-fit">
            <div className="flex justify-between items-center pb-4 border-b border-gray-150">
              <h3 className="text-sm font-bold text-primary flex items-center space-x-2">
                <User size={16} className="text-secondary" />
                <span>Account Login Settings</span>
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-secondary font-bold flex items-center space-x-1 hover:underline"
                >
                  <Edit size={12} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {profileMessage && (
              <div className="p-3 bg-slate-50 text-secondary border border-gray-200 rounded-lg text-xs font-bold">
                {profileMessage}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs text-gray-700">
                {/* Photo File Selector */}
                <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-gray-300 text-center flex flex-col items-center justify-center">
                  {userPhotoFile ? (
                    <div className="mb-2 relative">
                      <img src={URL.createObjectURL(userPhotoFile)} alt="Selected preview" className="w-16 h-16 object-cover rounded-full border border-gray-300" />
                      <button type="button" onClick={() => setUserPhotoFile(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                        <X size={12} />
                      </button>
                    </div>
                  ) : userPhotoPreview ? (
                    <div className="mb-2 relative">
                      <img src={userPhotoPreview} alt="Profile preview" className="w-16 h-16 object-cover rounded-full border border-gray-300" />
                    </div>
                  ) : (
                    <Upload className="mx-auto text-primary mb-2" size={20} />
                  )}
                  <label className="cursor-pointer block">
                    <span className="text-[10px] font-bold text-primary block uppercase">
                      {userPhotoPreview ? 'Change Account Photo' : 'Upload Account Photo'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files[0]) {
                          setUserPhotoFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-500 uppercase mb-1 flex items-center space-x-1">
                    <Key size={12} />
                    <span>New Password (Leave blank to keep)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                  />
                </div>

                <div className="flex space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex-1 bg-secondary text-white hover:bg-yellow-500 font-bold py-2 rounded-lg flex items-center justify-center space-x-1 shadow transition"
                  >
                    <Save size={14} />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setProfileMessage('');
                      setEditUsername(profile.username || '');
                      setEditEmail(profile.email || '');
                      setEditPhone(profile.phone || '');
                      setEditFullName(profile.fullName || '');
                      setUserPhotoFile(null);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-2 pb-4 border-b border-gray-100 mb-2">
                  <div className="w-20 h-20 rounded-full border-2 border-primary relative overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shadow">
                    {userPhotoPreview ? (
                      <img src={userPhotoPreview} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{(profile.fullName || profile.username || 'P').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-dark font-bn">{profile.fullName || 'No Full Name set'}</h4>
                  <span className="text-[10px] bg-secondary/15 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{profile.role}</span>
                </div>

                <div className="space-y-3.5 text-xs text-gray-650">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Full Name</span>
                    <span className="text-sm font-semibold text-dark font-bn">{profile.fullName || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Username</span>
                    <span className="text-sm font-semibold text-dark">{profile.username || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Email Address</span>
                    <span className="text-sm font-semibold text-dark">{profile.email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Phone Number</span>
                    <span className="text-sm font-semibold text-dark">{profile.phone || 'Not set'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tickets list */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-primary flex items-center space-x-2 pb-4 border-b border-gray-150">
              <Ticket size={18} className="text-secondary" />
              <span>My Registered Tickets ({registrations.length})</span>
            </h3>

            <div className="space-y-4 overflow-y-auto max-h-[350px]">
              {registrations.length > 0 ? (
                registrations.map(reg => (
                  <div key={reg._id} className="bg-slate-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        reg.paymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {reg.paymentStatus.toUpperCase()}
                      </span>
                      <h4 className="text-sm font-bold text-primary font-bn mt-2 line-clamp-1">
                        {reg.eventId?.title?.bn || 'Reunion Event'}
                      </h4>
                      <span className="text-[10px] text-gray-500 font-bn mt-1 block">PSC Batch: {reg.pscBatch} • {reg.fullName}</span>
                    </div>
                    <div className="bg-white p-1 rounded-lg border border-gray-250 shrink-0 shadow-sm">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${reg._id}`} 
                        alt="QR Code" 
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-gray-400 font-semibold font-bn">
                  {isBn ? 'এখনো কোনো রেজিস্ট্রেশন নেই।' : 'No event registrations found.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Alumni Directory Profile - 7 cols */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-150">
            <h3 className="text-lg font-bold text-primary flex items-center space-x-2">
              <User size={20} className="text-secondary" />
              <span>Alumni Directory Profile</span>
            </h3>

            {memberProfile && (
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xxs font-bold ${
                memberProfile.isApproved 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              }`}>
                {memberProfile.isApproved ? <CheckCircle size={12} /> : <ShieldAlert size={12} />}
                <span>{memberProfile.isApproved ? 'Listed/Public Profile' : 'Pending Verification'}</span>
              </div>
            )}
          </div>

          {memberMsg && (
            <div className="p-3 bg-slate-50 text-secondary border border-gray-200 rounded-lg text-xs font-bold">
              {memberMsg}
            </div>
          )}

          <form onSubmit={handleSaveMemberProfile} className="space-y-4 text-xs text-gray-700">
            {/* Photo upload and info warning */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-gray-200">
              <div className="w-20 h-20 bg-secondary/15 text-secondary flex items-center justify-center rounded-2xl overflow-hidden shrink-0 border border-slate-200 relative group">
                {profilePhotoPreview ? (
                  <img src={profilePhotoPreview} className="w-full h-full object-cover" alt="" />
                ) : (
                  <User size={32} />
                )}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <Upload size={18} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files[0]) {
                        setProfilePhotoFile(e.target.files[0]);
                        setProfilePhotoPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </label>
              </div>
              <div className="space-y-1">
                <span className="block font-bold text-slate-800 text-sm">{isBn ? 'আপনার প্রোফাইল ফটো আপলোড করুন' : 'Upload Profile Picture'}</span>
                <span className="block text-gray-500 text-xxs leading-snug">
                  {isBn 
                    ? 'ডিরেক্টরি তালিকায় দেখানোর জন্য একটি ছবি যুক্ত করা আবশ্যক। ফাইল সাইজ সর্বোচ্চ ১০এমবি।' 
                    : 'A profile photo is required to display your card in the alumni directory list. Max 10MB.'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Full Name (English)</label>
                <input type="text" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm" value={nameEn} onChange={e => setNameEn(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Full Name (Bengali)</label>
                <input type="text" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm font-bn" value={nameBn} onChange={e => setNameBn(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">PSC Batch</label>
                <input type="text" placeholder="e.g. 2010" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm font-bold" value={pscBatch} onChange={e => setPscBatch(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Blood Group</label>
                <select className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm font-bold text-red-600" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} required>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Gender</label>
                <select className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm font-bold text-primary" value={gender} onChange={e => setGender(e.target.value)} required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Profession / Designation</label>
                <input type="text" placeholder="e.g. Engineer, Business" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm" value={profession} onChange={e => setProfession(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Current Organization</label>
                <input type="text" placeholder="e.g. Tech Corp" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm" value={currentOrganization} onChange={e => setCurrentOrganization(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Public Contact Number</label>
              <input type="text" placeholder="+8801700000000" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm" value={memberPhone} onChange={e => setMemberPhone(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Facebook Profile Link</label>
                <input type="url" placeholder="https://facebook.com/username" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm" value={facebook} onChange={e => setFacebook(e.target.value)} />
              </div>
              <div>
                <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">LinkedIn Profile Link</label>
                <input type="url" placeholder="https://linkedin.com/in/username" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Twitter/X Profile Link</label>
                <input type="url" placeholder="https://twitter.com/username" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm" value={twitter} onChange={e => setTwitter(e.target.value)} />
              </div>
              <div>
                <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Personal Website / Portfolio</label>
                <input type="url" placeholder="https://example.com" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Short Bio (English)</label>
              <textarea rows={2} placeholder="A short description about yourself..." className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm leading-relaxed" value={bioEn} onChange={e => setBioEn(e.target.value)} />
            </div>
            <div>
              <label className="block text-xxs font-bold text-gray-500 uppercase mb-1">Short Bio (Bengali)</label>
              <textarea rows={2} placeholder="নিজের সম্পর্কে একটি ছোট বিবরণ..." className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary text-sm leading-relaxed font-bn" value={bioBn} onChange={e => setBioBn(e.target.value)} />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="is_public"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
                className="rounded text-primary focus:ring-primary h-4.5 w-4.5"
              />
              <label htmlFor="is_public" className="font-bold text-slate-650 cursor-pointer font-bn select-none">
                {isBn ? 'এই প্রোফাইলটি ডিরেক্টরি তালিকায় উন্মুক্ত দেখাবে' : 'List my profile in the public alumni directory'}
              </label>
            </div>

            <button
              type="submit"
              disabled={savingMember}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-1.5 shadow-md transition uppercase tracking-wide text-xs"
            >
              <Save size={14} />
              <span>{savingMember ? 'Saving Profile...' : 'Save Directory Profile'}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
