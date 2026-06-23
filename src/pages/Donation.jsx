import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Heart, Landmark, Smartphone, Trophy, UserCheck, ShieldAlert, Download, Award, BarChart3 } from 'lucide-react';
import { useSettings } from '../context/settings.jsx';
import { CountUp } from '../hooks/useCountUp';
import { motion } from 'framer-motion';

const Donation = () => {
  const { i18n } = useTranslation();
  const { settings } = useSettings();
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
    api.get('/donations/stats')
      .then(res => {
        if (res.data.success) {
          setStats(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching stats:', err));

    // Fetch recent donations list
    api.get('/donations')
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

      const res = await api.post('/donations/checkout', payload);
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

  const currentStats = stats;
  const donationsList = recentDonations;

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

      {/* Treasury Cash Flow Visualization */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-12">
        <h3 className="text-lg font-bold text-primary font-bn flex items-center space-x-2 mb-4">
          <BarChart3 className="text-secondary" size={20} />
          <span>{isBn ? 'ফান্ড বণ্টন প্রবাহচিত্র (Treasury Cash Flow Chart)' : 'Treasury Flow Diagram'}</span>
        </h3>
        <p className="text-xs text-gray-500 mb-6 font-bn">
          {isBn 
            ? 'স্বচ্ছতা আমাদের মূল ভিত্তি। আমাদের ফান্ডগুলোর উৎস এবং ব্যয়ের খাতসমূহ এই ফ্লো-চার্ট থেকে সরাসরি দেখে নিতে পারেন।' 
            : 'Transparency is our foundation. Trace exactly where your donations flow (from Inflow channels to Central Fund to specific Allocations).'}
        </p>

        <div className="w-full overflow-x-auto">
          <svg className="w-full min-w-[640px]" height="180" viewBox="0 0 800 180">
            <defs>
              <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E2125B" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#003B73" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F9A826" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#003B73" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#003B73" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#003B73" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Inflow Nodes */}
            <rect x="10" y="20" width="120" height="40" rx="6" fill="#E2125B" />
            <text x="70" y="44" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">Mobile Banking</text>
            
            <rect x="10" y="90" width="120" height="40" rx="6" fill="#F9A826" />
            <text x="70" y="114" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">Bank Transfer</text>

            {/* Central Node */}
            <rect x="340" y="55" width="120" height="50" rx="8" fill="#003B73" />
            <text x="400" y="80" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">Central Treasury</text>
            <text x="400" y="94" fill="#F9A826" fontSize="9" fontWeight="bold" textAnchor="middle">৳{currentStats.totalAmount.toLocaleString()} BDT</text>

            {/* Outflow Nodes */}
            <rect x="670" y="10" width="120" height="35" rx="6" fill="#10B981" />
            <text x="730" y="32" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Scholarships (45%)</text>
            
            <rect x="670" y="60" width="120" height="35" rx="6" fill="#3B82F6" />
            <text x="730" y="82" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Event Hosting (35%)</text>
            
            <rect x="670" y="110" width="120" height="35" rx="6" fill="#8B5CF6" />
            <text x="730" y="132" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Emergency Relief (20%)</text>

            {/* Flow Paths (Sankey Links) */}
            <path d="M 130 40 C 230 40, 240 70, 340 70" stroke="url(#g1)" strokeWidth="15" fill="none" />
            <path d="M 130 110 C 230 110, 240 90, 340 90" stroke="url(#g2)" strokeWidth="10" fill="none" />

            <path d="M 460 70 C 560 70, 570 27, 670 27" stroke="url(#g3)" strokeWidth="12" fill="none" />
            <path d="M 460 80 C 560 80, 570 77, 670 77" stroke="url(#g4)" strokeWidth="9" fill="none" />
            <path d="M 460 90 C 560 90, 570 127, 670 127" stroke="url(#g3)" strokeWidth="6" fill="none" />
          </svg>
        </div>
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
                  <CountUp value={currentStats.totalAmount} prefix="৳" suffix=" BDT" isBn={isBn} />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-gray-500 font-bold uppercase">{isBn ? 'মোট দাতা' : 'Total Donors'}</span>
                  <span className="text-lg font-extrabold text-primary font-bn">
                    <CountUp value={currentStats.totalCount} suffix={isBn ? ' জন সদস্য' : ' Members'} isBn={isBn} />
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 font-bold uppercase">{isBn ? 'বাকি লক্ষ্যমাত্রা' : 'Remaining Goal'}</span>
                  <span className="text-lg font-extrabold text-primary">
                    <CountUp value={remainingAmount} prefix="৳" suffix=" BDT" isBn={isBn} />
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
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="bg-secondary h-full rounded-full" 
                />
              </div>
            </div>
          </div>

          {/* Manual Payment Numbers from Settings */}
          <div className="bg-slate-100 p-6 rounded-2xl border border-gray-200">
            <h3 className="text-lg font-bold text-primary font-bn flex items-center space-x-2 mb-4">
              <Smartphone className="text-secondary" size={20} />
              <span>{isBn ? 'সরাসরি মোবাইল ব্যাংকিং অনুদান' : 'Manual Mobile Donation'}</span>
            </h3>
            <div className="space-y-3 text-sm text-gray-700 font-bn">
              <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                {isBn 
                  ? 'আপনারা চাইলে সরাসরি নিচের অ্যাকাউন্টসমূহে "Send Money" বা "Payment" করতে পারেন:' 
                  : 'You can also directly send money or pay to the following official numbers:'}
              </p>
              {settings.bkash && (
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-[#E2125B]">bKash (বিকাশ)</span>
                  <span className="font-mono text-primary font-bold">{settings.bkash}</span>
                </div>
              )}
              {settings.nagad && (
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-[#F7941D]">Nagad (নগদ)</span>
                  <span className="font-mono text-primary font-bold">{settings.nagad}</span>
                </div>
              )}
              {settings.rocket && (
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-[#8C3494]">Rocket (রকেট)</span>
                  <span className="font-mono text-primary font-bold">{settings.rocket}</span>
                </div>
              )}
            </div>
          </div>

          {/* Donation Leaderboard */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-primary font-bn flex items-center space-x-2 mb-4">
              <UserCheck className="text-secondary" size={20} />
              <span>{isBn ? 'সাম্প্রতিক সম্মাননা তালিকা' : 'Donors Leaderboard'}</span>
            </h3>

            <div className="space-y-3">
              {donationsList.length > 0 ? (
                donationsList.map((d, index) => {
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
                            {name ? name[0] : 'U'}
                          </div>
                        )}
                        <div>
                          <span className="block font-bold text-sm text-primary font-bn">{name}</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(d.createdAt || d.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-secondary">
                          ৳{d.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => {
                            const token = localStorage.getItem('accessToken');
                            window.open(`http://localhost:5000/api/donations/${d._id}/receipt?token=${token}`, '_blank');
                          }}
                          className="text-primary hover:text-secondary p-1 hover:bg-slate-100 rounded transition"
                          title={isBn ? 'রশিদ ডাউনলোড করুন' : 'Download Receipt'}
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-gray-500 font-semibold font-bn">
                  {isBn ? 'এখনো কোনো অনুদান পাওয়া যায়নি।' : 'No donations recorded yet.'}
                </div>
              )}
            </div>
          </div>

          {/* Batch-wise Leaderboard */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-primary font-bn flex items-center space-x-2 mb-4">
              <Award className="text-secondary" size={20} />
              <span>{isBn ? 'ব্যাচভিত্তিক অবদান র‍্যাংকিং' : 'Batch Leaderboard'}</span>
            </h3>
            <p className="text-xxs text-gray-500 mb-4 font-bn">
              {isBn ? 'স্বাস্থ্যকর প্রতিযোগিতার মাধ্যমে আপনার ব্যাচকে শীর্ষে নিয়ে যান!' : 'Propel your batch to the top with friendly competition!'}
            </p>
            <div className="space-y-3.5">
              {[
                { batch: 'Batch 2012', amount: 185000, pct: 100 },
                { batch: 'Batch 2015', amount: 125000, pct: 67 },
                { batch: 'Batch 2018', amount: 90000, pct: 48 },
                { batch: 'Batch 2020', amount: 60000, pct: 32 }
              ].map((bl, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-gray-700">
                    <span className="font-bn">{bl.batch}</span>
                    <span className="text-secondary font-mono">
                      <CountUp value={bl.amount} prefix="৳" isBn={isBn} />
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bl.pct}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-primary h-full rounded-full" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Donation;
