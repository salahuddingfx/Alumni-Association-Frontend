import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Heart, Landmark, Smartphone, Trophy, UserCheck, ShieldAlert } from 'lucide-react';

const Donation = () => {
  const { i18n } = useTranslation();
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [stats, setStats] = useState({ totalAmount: 0, totalCount: 0 });
  const [recentDonations, setRecentDonations] = useState([]);
  const [message, setMessage] = useState('');
  const isBn = i18n.language === 'bn';

  const targetAmount = 1000000; // Target is ৳১০,০০,০০০ BDT

  useEffect(() => {
    // Fetch stats
    axios.get('http://localhost:5000/api/v1/donations/stats')
      .then(res => {
        if (res.data.success) {
          setStats(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching stats:', err));

    // Fetch recent donations list
    axios.get('http://localhost:5000/api/v1/donations')
      .then(res => {
        if (res.data.success) {
          setRecentDonations(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching recent donations:', err));
  }, [message]);

  const handleDonate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        donorName: isAnonymous ? { en: 'Anonymous', bn: 'বেনামী' } : { en: donorName, bn: donorName },
        email,
        amount: Number(amount),
        paymentMethod,
        isAnonymous,
      };

      const res = await axios.post('http://localhost:5000/api/v1/donations/checkout', payload);
      if (res.data.success) {
        setMessage(isBn ? 'অনুদান সফলভাবে সম্পন্ন হয়েছে! ধন্যবাদ।' : 'Donation completed successfully! Thank you.');
        setAmount('');
        setDonorName('');
        setEmail('');
        setIsAnonymous(false);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Premium mock donations list if DB is empty
  const mockDonations = [
    {
      _id: 'd1',
      donorName: { en: 'Salah Uddin Kader', bn: 'সালাহ উদ্দিন কাদের' },
      amount: 80000,
      isAnonymous: false,
      createdAt: '2026-05-24T10:00:00Z'
    },
    {
      _id: 'd2',
      donorName: { en: 'Anonymous', bn: 'বেনামী' },
      amount: 25000,
      isAnonymous: true,
      createdAt: '2026-05-25T14:30:00Z'
    },
    {
      _id: 'd3',
      donorName: { en: 'Sabbir Ahmed', bn: 'সাব্বির আহমেদ' },
      amount: 15000,
      isAnonymous: false,
      createdAt: '2026-05-26T08:15:00Z'
    }
  ];

  const currentStats = stats.totalAmount > 0 ? stats : { totalAmount: 120000, totalCount: 3 };
  const donationsList = recentDonations.length > 0 ? recentDonations : mockDonations;

  // Calculate percentages
  const progressPercent = Math.min((currentStats.totalAmount / targetAmount) * 100, 100);
  const remainingAmount = Math.max(targetAmount - currentStats.totalAmount, 0);

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-primary font-bn">
          {isBn ? 'অনুদান তহবিল ও প্রোগ্রেস' : 'Support Alma Mater & Progress'}
        </h1>
        <p className="mt-4 text-gray-600 font-bn">
          {isBn
            ? 'আমাদের ছাত্রবৃত্তি ফান্ড, জরুরি সংকটকালীন ত্রাণ ও ভবিষ্যৎ রিইউনিয়ন সফল করার কার্যক্রমে অনুদান দিন।'
            : 'Make a contribution to fuel student scholarships, emergency relief, and upcoming reunion events.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Donation Form Container - Left 7 Cols */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-2xl font-bold text-primary font-bn mb-6 flex items-center space-x-2">
            <Heart className="text-red-500 fill-current" size={24} />
            <span>{isBn ? 'অনুদান দিন (ফর্ম)' : 'Make a Contribution'}</span>
          </h3>

          {message && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-sm font-semibold">
              {message}
            </div>
          )}

          <form onSubmit={handleDonate} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{isBn ? 'দাতার নাম' : 'Donor Full Name'}</label>
              <input
                type="text"
                disabled={isAnonymous}
                placeholder={isAnonymous ? (isBn ? 'বেনামী অনুদান নির্বাচিত' : 'Anonymous Selected') : (isBn ? 'আপনার পূর্ণ নাম' : 'Enter Full Name')}
                className="w-full bg-slate-50 border border-gray-300 px-4 py-2.5 rounded-xl focus:outline-none focus:border-secondary text-sm font-bn disabled:bg-slate-100 disabled:text-gray-400"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                required={!isAnonymous}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-slate-50 border border-gray-300 px-4 py-2.5 rounded-xl focus:outline-none focus:border-secondary text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{isBn ? 'অনুদানের পরিমাণ (BDT)' : 'Amount (BDT)'}</label>
              <input
                type="number"
                placeholder="৳ Enter Amount"
                className="w-full bg-slate-50 border border-gray-300 px-4 py-2.5 rounded-xl focus:outline-none focus:border-secondary text-sm font-bold text-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2.5">{isBn ? 'পেমেন্ট মেথড সিলেক্ট করুন' : 'Select Payment Method'}</label>
              <div className="grid grid-cols-3 gap-3">
                {['bKash', 'Nagad', 'SSLCommerz'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3 rounded-xl border font-extrabold text-xs transition flex flex-col items-center justify-center space-y-1.5 ${
                      paymentMethod === method
                        ? 'border-secondary bg-secondary/5 text-secondary shadow-sm'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-slate-50'
                    }`}
                  >
                    {method === 'SSLCommerz' ? <Landmark size={18} /> : <Smartphone size={18} />}
                    <span>{method}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2.5 pt-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-secondary focus:ring-secondary h-4.5 w-4.5 accent-secondary"
              />
              <label htmlFor="anonymous" className="text-sm font-bold text-gray-700 cursor-pointer font-bn select-none">
                {isBn ? 'বেনামী অনুদান দিন (ওয়েবসাইটে নাম দেখাবে না)' : 'Donate Anonymously (Hide my identity)'}
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold py-3.5 rounded-xl shadow-md hover:shadow-lg transition mt-4 text-sm uppercase tracking-wider"
            >
              {isBn ? 'অনলাইন গেটওয়ে পেমেন্ট সিমুলেশন' : 'Simulate Gateway Checkout'}
            </button>
          </form>
        </div>

        {/* Campaign Stats & Leaderboard - Right 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Progress Card */}
          <div className="bg-slate-100 p-8 rounded-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-primary font-bn flex items-center space-x-2">
              <Trophy className="text-secondary" size={24} />
              <span>{isBn ? 'তহবিল ক্যাম্পেইন অগ্রগতি' : 'Campaign Progress'}</span>
            </h3>
            
            <div className="mt-6 space-y-4">
              <div>
                <span className="block text-xs text-gray-500 font-bold uppercase">{isBn ? 'মোট সংগ্রহ' : 'Raised So Far'}</span>
                <span className="text-3xl font-extrabold text-secondary">
                  ৳{currentStats.totalAmount.toLocaleString()} BDT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-gray-500 font-bold uppercase">{isBn ? 'মোট দাতা' : 'Total Donors'}</span>
                  <span className="text-lg font-extrabold text-primary font-bn">
                    {currentStats.totalCount} {isBn ? 'জন সদস্য' : 'Members'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 font-bold uppercase">{isBn ? 'বাকি লক্ষ্যমাত্রা' : 'Remaining Goal'}</span>
                  <span className="text-lg font-extrabold text-primary">
                    ৳{remainingAmount.toLocaleString()} BDT
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                <span>{progressPercent.toFixed(1)}% {isBn ? 'পূর্ণ' : 'Completed'}</span>
                <span>{isBn ? 'লক্ষ্য: ৳১০,০০,০০০' : 'Target: ৳1,000,000'}</span>
              </div>
              <div className="bg-slate-200 h-4 rounded-full overflow-hidden border border-slate-300">
                <div 
                  className="bg-secondary h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Donation Leaderboard */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-primary font-bn flex items-center space-x-2 mb-4">
              <UserCheck className="text-secondary" size={20} />
              <span>{isBn ? 'সাম্প্রতিক সম্মাননা তালিকা' : 'Donors Leaderboard'}</span>
            </h3>

            <div className="space-y-3">
              {donationsList.map((d, index) => {
                const isAnon = d.isAnonymous;
                const name = isAnon 
                  ? (isBn ? 'বেনামী দাতা' : 'Anonymous Donor') 
                  : (isBn ? d.donorName.bn : d.donorName.en);

                return (
                  <div key={d._id || index} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      {isAnon ? (
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center">
                          <ShieldAlert size={18} />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary font-extrabold flex items-center justify-center text-sm">
                          {name[0]}
                        </div>
                      )}
                      <div>
                        <span className="block font-bold text-sm text-primary font-bn">{name}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="font-extrabold text-sm text-secondary">
                      ৳{d.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Donation;
