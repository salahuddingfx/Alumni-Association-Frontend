import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Calendar, LogOut, Ticket, Mail, Phone, Tag, Edit, Save, X, Key } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');

  // Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');

  const fetchProfile = (token) => {
    axios.get('http://localhost:5000/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success) {
          const user = res.data.data.user;
          setProfile(user);
          setEditUsername(user.username || '');
          setEditEmail(user.email || '');
          setEditPhone(user.phone || '');
        }
      })
      .catch(() => {
        handleLogout();
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchProfile(token);

    // Fetch Registrations
    axios.get('http://localhost:5000/api/v1/events/my/registrations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success) {
          setRegistrations(res.data.data);
        }
      })
      .catch(() => {});
  }, [navigate]);

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
      const payload = {
        username: editUsername,
        email: editEmail,
        phone: editPhone,
      };
      if (editPassword) {
        payload.password = editPassword;
      }

      const res = await axios.put('http://localhost:5000/api/v1/auth/me', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setProfile(res.data.data.user);
        setIsEditing(false);
        setEditPassword('');
        setProfileMessage('Profile updated successfully!');
        setTimeout(() => setProfileMessage(''), 3000);
      }
    } catch (err) {
      setProfileMessage(err.response?.data?.message || 'Update failed');
    }
  };

  if (!profile) {
    return (
      <div className="py-20 text-center text-gray-500 font-semibold">
        Loading your dashboard...
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card / Update Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 h-fit">
          <div className="flex justify-between items-center pb-4 border-b border-gray-150">
            <h3 className="text-lg font-bold text-primary flex items-center space-x-2">
              <User size={20} className="text-secondary" />
              <span>Profile Details</span>
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-secondary font-bold flex items-center space-x-1 hover:underline"
              >
                <Edit size={14} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {profileMessage && (
            <div className={`p-3 rounded-lg text-xs font-bold ${profileMessage.includes('failed') || profileMessage.includes('taken') || profileMessage.includes('registered') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              {profileMessage}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-sm text-gray-700">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-secondary"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center space-x-1">
                  <Key size={12} />
                  <span>New Password (Leave blank to keep current)</span>
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
                  }}
                  className="bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold px-3 py-2 rounded-lg transition"
                >
                  <X size={16} />
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <span className="block text-xxs font-bold text-gray-400 uppercase">Username</span>
                <span className="text-base font-semibold text-dark">{profile.username || 'Not set'}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-gray-400 uppercase">Email Address</span>
                <span className="text-base font-semibold text-dark">{profile.email}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-gray-400 uppercase">Phone Number</span>
                <span className="text-base font-semibold text-dark">{profile.phone || 'Not set'}</span>
              </div>
              <div>
                <span className="block text-xxs font-bold text-gray-400 uppercase">System Role</span>
                <span className="text-base font-semibold text-secondary uppercase">{profile.role}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tickets Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-primary flex items-center space-x-2 pb-4 border-b border-gray-150">
            <Ticket size={20} className="text-secondary" />
            <span>My Registered Event Tickets</span>
          </h3>

          <div className="space-y-4">
            {registrations.length > 0 ? (
              registrations.map(reg => (
                <div key={reg._id} className="bg-slate-50 p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div>
                    <span className="bg-secondary/15 text-secondary text-xxs font-bold px-2 py-0.5 rounded-full uppercase">
                      {reg.paymentType.toUpperCase()} - {reg.paymentStatus.toUpperCase()}
                    </span>
                    <h4 className="text-lg font-bold text-primary font-bn mt-2">
                      {reg.eventId?.title?.bn || 'Reunion Event'}
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-500 font-bn">
                      <span>PSC Batch: <strong className="text-dark">{reg.pscBatch}</strong></span>
                      <span>Name: <strong className="text-dark">{reg.fullName}</strong></span>
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-2xl border border-gray-150 flex flex-col items-center justify-center shrink-0 w-28 h-28 shadow-sm hover:shadow-md transition">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${reg._id}`} 
                      alt="Ticket QR Code" 
                      className="w-16 h-16 object-contain"
                    />
                    <span className="text-[8px] text-emerald-600 font-extrabold uppercase mt-2 tracking-widest flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>SCAN TO ENTER</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 font-semibold">
                You have not registered for any events yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
