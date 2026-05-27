import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api, { API_URL } from '../api/api';
import { Calendar, MapPin, X, User, Phone, CheckCircle, Upload, CreditCard } from 'lucide-react';
import { convertBanglishToBengali } from '../utils/banglish';
import { useSettings } from '../context/settings.jsx';

const Events = () => {
  const { i18n } = useTranslation();
  const { settings } = useSettings();
  const [events, setEvents] = useState([]);
  const [registeringEvent, setRegisteringEvent] = useState(null);
  
  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [fathersName, setFathersName] = useState('');
  const [mothersName, setMothersName] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('single');
  const [spouseName, setSpouseName] = useState('');
  const [gender, setGender] = useState('male');
  const [pscBatch, setPscBatch] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState('');
  const [paymentType, setPaymentType] = useState('cash'); // 'cash' or 'digital'
  const [digitalProvider, setDigitalProvider] = useState('bKash'); // 'bKash' or 'Nagad'
  
  // Checkout Modal State
  const [showCheckoutOverlay, setShowCheckoutOverlay] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Number, 2: OTP, 3: PIN, 4: Loading
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutOtp, setCheckoutOtp] = useState('');
  const [checkoutPin, setCheckoutPin] = useState('');

  const [message, setMessage] = useState('');
  const isBn = i18n.language === 'bn';

  const toBnNum = (num) => {
    if (!isBn) return num.toLocaleString();
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, d => bnDigits[d]);
  };

  const calculateEventFee = (batchStr) => {
    const defaultFee = settings.eventDefaultFee || 1500;
    const batchFees = settings.eventBatchFees || [];

    if (!batchStr) return defaultFee;

    const match = batchStr.match(/\d{4}/);
    if (!match) return defaultFee;
    
    const year = parseInt(match[0], 10);

    for (const rule of batchFees) {
      if (!rule.batches || !rule.fee) continue;

      const parts = rule.batches.split(',').map(s => s.trim());
      for (const part of parts) {
        if (part.includes('-')) {
          const rangeParts = part.split('-').map(s => parseInt(s.trim(), 10));
          if (rangeParts.length === 2 && !isNaN(rangeParts[0]) && !isNaN(rangeParts[1])) {
            const min = Math.min(rangeParts[0], rangeParts[1]);
            const max = Math.max(rangeParts[0], rangeParts[1]);
            if (year >= min && year <= max) {
              return Number(rule.fee);
            }
          }
        } else {
          const exactYear = parseInt(part, 10);
          if (!isNaN(exactYear) && exactYear === year) {
            return Number(rule.fee);
          }
        }
      }
    }

    return defaultFee;
  };

  const calculateProcessingFee = (baseFee) => {
    if (paymentType !== 'digital') return 0;
    
    const feeType = settings.digitalFeeType || 'percentage';
    const feeVal = Number(settings.digitalFeeValue) || 0;

    if (feeType === 'percentage') {
      return Math.round(baseFee * (feeVal / 100));
    }
    return feeVal;
  };

  const currentFee = calculateEventFee(pscBatch);
  const processingFee = calculateProcessingFee(currentFee);
  const totalFee = currentFee + processingFee;

  useEffect(() => {
    api.get('/events')
      .then(res => {
        if (res.data.success) {
          setEvents(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching events:', err));
  }, []);

  // Lock body scroll when event modal is open
  useEffect(() => {
    if (registeringEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [registeringEvent]);

  // Auto-populate user and member details when registering for an event
  useEffect(() => {
    if (registeringEvent) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Fetch user auth details
        api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            if (res.data.success && res.data.data?.user) {
              const u = res.data.data.user;
              if (u.email) setEmail(u.email);
              if (u.phone) {
                setContactNumber(u.phone);
                setWhatsappNumber(u.phone);
              }
            }
          })
          .catch(err => console.log('Error fetching user auth for event registration:', err));

        // Fetch member profile details
        api.get('/members/my/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            if (res.data.success && res.data.data) {
              const m = res.data.data;
              if (m.name?.en) setFullName(m.name.en);
              else if (m.name?.bn) setFullName(m.name.bn);
              
              if (m.pscBatch) setPscBatch(m.pscBatch);
              if (m.phone) {
                setContactNumber(m.phone);
                setWhatsappNumber(m.phone);
              }
              if (m.profilePhoto) {
                const photoUrl = m.profilePhoto.startsWith('http') ? m.profilePhoto : `${API_URL}${m.profilePhoto}`;
                setExistingPhoto(photoUrl);
              }
            }
          })
          .catch(err => console.log('Error fetching member profile for event registration:', err));
      }
    }
  }, [registeringEvent]);

  const displayEvents = events.length > 0 ? events : [
    {
      _id: '1',
      title: { en: 'Annual Reunion & Gala Dinner 2026', bn: 'বার্ষিক পুনর্মিলনী ও নৈশভোজ ২০২৬' },
      description: { en: 'A night to reconnect and remember our campus days with live music and dynamic sessions.', bn: 'পুরনো ক্যাম্পাসের দিনগুলো মনে করা এবং পরিচিত হওয়ার এক জাঁকজমকপূর্ণ মিলনমেলা।' },
      date: '2026-12-31T18:00:00',
      location: { en: 'Main Campus Field', bn: 'প্রধান ক্যাম্পাস প্রাঙ্গণ' },
      category: 'reunion',
      banner: ''
    },
    {
      _id: '2',
      title: { en: 'Career mentoring seminar', bn: 'ক্যারিয়ার মেন্টরিং সেমিনার' },
      description: { en: 'Guidance and job preparation advice for current students from established alumni.', bn: 'চলতি শিক্ষার্থীদের চাকরি প্রস্তুতি ও বাস্তব অভিজ্ঞতা শেয়ারিং সেমিনার।' },
      date: '2026-06-15T10:00:00',
      location: { en: 'Auditorium Hall', bn: 'অডিটোরিয়াম হল' },
      category: 'seminar',
      banner: ''
    }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!userImage && !existingPhoto) {
      alert(isBn ? 'অনুগ্রহ করে আপনার একটি ছবি আপলোড করুন!' : 'Please upload your photo!');
      return;
    }
    if (paymentType === 'digital') {
      setShowCheckoutOverlay(true);
      setCheckoutStep(1);
    } else {
      executeRegistration();
    }
  };

  const executeRegistration = async () => {
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('fathersName', fathersName);
      formData.append('mothersName', mothersName);
      formData.append('maritalStatus', maritalStatus);
      formData.append('spouseName', maritalStatus === 'married' ? spouseName : '');
      formData.append('gender', gender);
      formData.append('pscBatch', pscBatch);
      formData.append('whatsappNumber', whatsappNumber);
      formData.append('contactNumber', contactNumber);
      formData.append('email', email);
      formData.append('fullAddress', fullAddress);
      formData.append('paymentType', paymentType);
      
      if (userImage) {
        formData.append('userImage', userImage);
      } else if (existingPhoto) {
        formData.append('userImage', existingPhoto);
      }

      const res = await api.post(
        `/events/${registeringEvent._id}/registration/register`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data.success) {
        setMessage(isBn ? 'রেজিস্ট্রেশন সফল! আপনার ডিজিটাল এন্ট্রি পাসটি নিচে তৈরি করা হলো।' : 'Registration successful! Your digital entry pass has been successfully generated.');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleCloseModal = () => {
    setRegisteringEvent(null);
    setMessage('');
    setFullName('');
    setFathersName('');
    setMothersName('');
    setMaritalStatus('single');
    setSpouseName('');
    setPscBatch('');
    setWhatsappNumber('');
    setContactNumber('');
    setEmail('');
    setFullAddress('');
    setUserImage(null);
    setExistingPhoto('');
    setPaymentType('cash');
    setShowCheckoutOverlay(false);
    setCheckoutStep(1);
    setCheckoutPhone('');
    setCheckoutOtp('');
    setCheckoutPin('');
  };

  const handleCheckoutProceed = () => {
    if (checkoutStep === 1) {
      if (!checkoutPhone || checkoutPhone.length < 11) {
        alert(isBn ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।' : 'Please enter a valid 11-digit mobile number.');
        return;
      }
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      if (!checkoutOtp) {
        alert(isBn ? 'অনুগ্রহ করে সঠিক ওটিপি দিন।' : 'Please enter a valid verification code.');
        return;
      }
      setCheckoutStep(3);
    } else if (checkoutStep === 3) {
      if (!checkoutPin) {
        alert(isBn ? 'অনুগ্রহ করে সঠিক পিন নম্বর দিন।' : 'Please enter a valid PIN.');
        return;
      }
      setCheckoutStep(4);
      // Simulate verification loader and submit
      setTimeout(() => {
        setShowCheckoutOverlay(false);
        executeRegistration();
      }, 2000);
    }
  };

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-primary font-bn">
          {isBn ? 'ইভেন্টসমূহ' : 'Events & Programs'}
        </h1>
        <p className="mt-4 text-gray-600">
          {isBn ? 'প্রাক্তন পরিষদের সাথে যুক্ত থাকুন আমাদের নিয়মিত ইভেন্ট ও মিলনমেলায়।' : 'Stay engaged with our upcoming events, seminars, and networking gatherings.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayEvents.map((event) => (
          <div key={event._id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition">
            <div className="h-48 bg-primary/10 relative flex items-center justify-center">
              <span className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                {event.category}
              </span>
              <Calendar size={48} className="text-primary/30" />
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-primary font-bn">
                  {isBn ? event.title.bn : event.title.en}
                </h3>
                <p className="mt-2 text-sm text-gray-600 font-bn">
                  {isBn ? event.description.bn : event.description.en}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between text-xs text-gray-500 space-y-4 sm:space-y-0 sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin size={12} />
                    <span className="font-bn">{isBn ? event.location.bn : event.location.en}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setRegisteringEvent(event)}
                  className="bg-secondary hover:bg-yellow-500 text-white font-bold px-5 py-2 rounded-full shadow transition text-xs uppercase tracking-wide text-center"
                >
                  {isBn ? 'নিবন্ধন করুন' : 'Register Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Registration Modal Form */}
      {registeringEvent && (
        <div className="fixed inset-0 z-45 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150 my-8">
            {/* Modal Header */}
            <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User size={18} className="text-secondary" />
                <span className="font-bold text-sm font-bn">
                  {isBn ? 'ইভেন্ট রেজিস্ট্রেশন ফর্ম' : 'Event Registration Form'}
                </span>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content / Form */}
            <div className="p-8 max-h-[70vh] overflow-y-auto relative custom-scrollbar">
              
              {/* simulated checkout overlay */}
              {showCheckoutOverlay && (
                <div className="absolute inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-6 backdrop-blur-md">
                  {digitalProvider === 'bKash' ? (
                    /* bKash theme overlay */
                    <div className="bg-[#E2125B] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#b80e4a] flex flex-col justify-between text-white font-bn select-none">
                      {/* Logo header */}
                      <div className="bg-white p-4 flex justify-between items-center border-b-4 border-[#b80e4a]">
                        <img src="https://web.archive.org/web/20220313075143/https://www.bkash.com/sites/default/files/bKash%20Logo_0.png" alt="bKash Logo" className="h-10 object-contain mx-auto" />
                      </div>
                      
                      <div className="p-6 space-y-6 text-center">
                        <div className="text-sm bg-black/10 py-2 rounded-lg">
                          <span>{isBn ? 'প্রাক্তন পরিষদ ইভেন্ট ফি' : 'Practon Alumni Event Reg Fee'}</span>
                          <span className="block text-lg font-extrabold mt-1">৳{toBnNum(totalFee)}.০০</span>
                        </div>

                        {checkoutStep === 1 && (
                          <div className="space-y-4">
                            <label className="block text-sm font-semibold">{isBn ? 'আপনার বিকাশ অ্যাকাউন্ট নম্বর দিন' : 'Enter your bKash Account Number'}</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 017XXXXXXXX"
                              className="w-full bg-white text-slate-800 text-center font-bold tracking-widest text-lg py-3 rounded-lg border-2 border-[#b80e4a] focus:outline-none"
                              value={checkoutPhone}
                              onChange={e => setCheckoutPhone(e.target.value)}
                              maxLength={11}
                            />
                            <p className="text-[10px] text-pink-200 leading-snug">{isBn ? 'এই পেমেন্ট গেটওয়েটি একটি প্র্যাকটিক্যাল ডেমো। আপনার ব্যক্তিগত নম্বর দিন।' : 'This gateway is a simulation demo. Enter your personal phone number.'}</p>
                          </div>
                        )}

                        {checkoutStep === 2 && (
                          <div className="space-y-4">
                            <label className="block text-sm font-semibold">{isBn ? 'বিকাশ ভেরিফিকেশন কোড (OTP) দিন' : 'Enter bKash Verification Code (OTP)'}</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 123456"
                              className="w-full bg-white text-slate-800 text-center font-bold tracking-widest text-lg py-3 rounded-lg border-2 border-[#b80e4a] focus:outline-none"
                              value={checkoutOtp}
                              onChange={e => setCheckoutOtp(e.target.value)}
                            />
                            <p className="text-[10px] text-pink-200">{isBn ? 'যেকোনো ৬ সংখ্যার ওটিপি দিয়ে প্রসিডিউট করুন।' : 'Enter any 6-digit OTP code to proceed.'}</p>
                          </div>
                        )}

                        {checkoutStep === 3 && (
                          <div className="space-y-4">
                            <label className="block text-sm font-semibold">{isBn ? 'আপনার বিকাশ পিন (PIN) নম্বর দিন' : 'Enter your bKash PIN'}</label>
                            <input 
                              type="password" 
                              placeholder="••••"
                              className="w-full bg-white text-slate-800 text-center font-bold tracking-widest text-lg py-3 rounded-lg border-2 border-[#b80e4a] focus:outline-none"
                              value={checkoutPin}
                              onChange={e => setCheckoutPin(e.target.value)}
                              maxLength={5}
                            />
                            <p className="text-[10px] text-pink-200">{isBn ? 'ডেমো পিন দিয়ে পেমেন্ট সম্পন্ন করুন।' : 'Enter simulated PIN code to complete registration.'}</p>
                          </div>
                        )}

                        {checkoutStep === 4 && (
                          <div className="py-6 space-y-4 flex flex-col items-center">
                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm font-bold tracking-wider uppercase">{isBn ? 'পেমেন্ট যাচাই করা হচ্ছে...' : 'Verifying simulated payment...'}</span>
                          </div>
                        )}
                      </div>

                      {checkoutStep < 4 && (
                        <div className="flex bg-slate-100/10 text-sm">
                          <button 
                            type="button" 
                            onClick={() => setShowCheckoutOverlay(false)}
                            className="flex-1 py-4 text-pink-100 hover:text-white border-r border-white/10 font-bold"
                          >
                            {isBn ? 'বন্ধ করুন' : 'CLOSE'}
                          </button>
                          <button 
                            type="button" 
                            onClick={handleCheckoutProceed}
                            className="flex-1 py-4 text-white hover:bg-black/10 font-extrabold"
                          >
                            {isBn ? 'নিশ্চিত করুন' : 'PROCEED'}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Nagad theme overlay */
                    <div className="bg-[#F25C22] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#d84a12] flex flex-col justify-between text-white font-bn select-none">
                      {/* Logo header */}
                      <div className="bg-white p-4 flex justify-between items-center border-b-4 border-[#d84a12]">
                        <img src="https://web.archive.org/web/20220331045934/https://nagad.com.bd/wp-content/uploads/2020/09/Nagad-Logo-1.png" alt="Nagad Logo" className="h-10 object-contain mx-auto" />
                      </div>
                      
                      <div className="p-6 space-y-6 text-center">
                        <div className="text-sm bg-black/10 py-2 rounded-lg">
                          <span>{isBn ? 'প্রাক্তন পরিষদ ইভেন্ট ফি' : 'Practon Alumni Event Reg Fee'}</span>
                          <span className="block text-lg font-extrabold mt-1">৳{toBnNum(totalFee)}.০০</span>
                        </div>

                        {checkoutStep === 1 && (
                          <div className="space-y-4">
                            <label className="block text-sm font-semibold">{isBn ? 'আপনার নগদ অ্যাকাউন্ট নম্বর দিন' : 'Enter your Nagad Account Number'}</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 017XXXXXXXX"
                              className="w-full bg-white text-slate-800 text-center font-bold tracking-widest text-lg py-3 rounded-lg border-2 border-[#d84a12] focus:outline-none"
                              value={checkoutPhone}
                              onChange={e => setCheckoutPhone(e.target.value)}
                              maxLength={11}
                            />
                            <p className="text-[10px] text-orange-200 leading-snug">{isBn ? 'এই পেমেন্ট গেটওয়েটি একটি প্র্যাকটিক্যাল ডেমো। আপনার ব্যক্তিগত নম্বর দিন।' : 'This gateway is a simulation demo. Enter your personal phone number.'}</p>
                          </div>
                        )}

                        {checkoutStep === 2 && (
                          <div className="space-y-4">
                            <label className="block text-sm font-semibold">{isBn ? 'নগদ ওটিপি (OTP) ভেরিফিকেশন কোড দিন' : 'Enter Nagad Verification Code (OTP)'}</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 123456"
                              className="w-full bg-white text-slate-800 text-center font-bold tracking-widest text-lg py-3 rounded-lg border-2 border-[#d84a12] focus:outline-none"
                              value={checkoutOtp}
                              onChange={e => setCheckoutOtp(e.target.value)}
                            />
                            <p className="text-[10px] text-orange-200">{isBn ? 'যেকোনো ৬ সংখ্যার ওটিপি দিয়ে প্রসিডিউট করুন।' : 'Enter any 6-digit OTP code to proceed.'}</p>
                          </div>
                        )}

                        {checkoutStep === 3 && (
                          <div className="space-y-4">
                            <label className="block text-sm font-semibold">{isBn ? 'আপনার নগদ পিন (PIN) নম্বর দিন' : 'Enter your Nagad PIN'}</label>
                            <input 
                              type="password" 
                              placeholder="••••"
                              className="w-full bg-white text-slate-800 text-center font-bold tracking-widest text-lg py-3 rounded-lg border-2 border-[#d84a12] focus:outline-none"
                              value={checkoutPin}
                              onChange={e => setCheckoutPin(e.target.value)}
                              maxLength={4}
                            />
                            <p className="text-[10px] text-orange-200">{isBn ? 'ডেমো পিন দিয়ে পেমেন্ট সম্পন্ন করুন।' : 'Enter simulated PIN code to complete registration.'}</p>
                          </div>
                        )}

                        {checkoutStep === 4 && (
                          <div className="py-6 space-y-4 flex flex-col items-center">
                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm font-bold tracking-wider uppercase">{isBn ? 'পেমেন্ট যাচাই করা হচ্ছে...' : 'Verifying simulated payment...'}</span>
                          </div>
                        )}
                      </div>

                      {checkoutStep < 4 && (
                        <div className="flex bg-slate-100/10 text-sm">
                          <button 
                            type="button" 
                            onClick={() => setShowCheckoutOverlay(false)}
                            className="flex-1 py-4 text-orange-100 hover:text-white border-r border-white/10 font-bold"
                          >
                            {isBn ? 'বন্ধ করুন' : 'CLOSE'}
                          </button>
                          <button 
                            type="button" 
                            onClick={handleCheckoutProceed}
                            className="flex-1 py-4 text-white hover:bg-black/10 font-extrabold"
                          >
                            {isBn ? 'নিশ্চিত করুন' : 'PROCEED'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {message ? (
                <div className="text-center py-6 space-y-6">
                  <div className="flex flex-col items-center space-y-2">
                    <CheckCircle className="text-emerald-500" size={48} />
                    <h3 className="text-xl font-extrabold text-primary font-bn">{isBn ? 'রেজিস্ট্রেশন সফল হয়েছে!' : 'Registration Successful!'}</h3>
                    <p className="text-xs text-gray-500">{isBn ? 'আপনার ডিজিটাল এন্ট্রি পাসটি নিচে জেনারেট করা হলো।' : 'Your digital entry pass has been successfully generated below.'}</p>
                  </div>
                  
                  {/* Premium Ticket Card Mockup */}
                  <div className="bg-gradient-to-br from-primary to-primary/95 text-white p-6 rounded-3xl shadow-xl max-w-md mx-auto text-left relative overflow-hidden border border-white/10">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex justify-between items-start pb-4 border-b border-white/15">
                      <div>
                        <span className="text-[10px] text-secondary font-extrabold uppercase tracking-widest">OFFICIAL ENTRY PASS</span>
                        <h4 className="text-base font-extrabold font-bn leading-snug mt-1">
                          {isBn ? registeringEvent.title.bn : registeringEvent.title.en}
                        </h4>
                      </div>
                      <div className="bg-white p-1.5 rounded-xl shrink-0 shadow">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${fullName}-${pscBatch}`} 
                          alt="Verification QR" 
                          className="w-12 h-12"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-bn">
                      <div>
                        <span className="block text-[9px] text-slate-300 uppercase">Attendee Name</span>
                        <span className="font-extrabold text-sm truncate block">{fullName}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-300 uppercase">PSC Batch</span>
                        <span className="font-extrabold text-sm block">{pscBatch}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-300 uppercase">WhatsApp</span>
                        <span className="font-extrabold text-sm block">{whatsappNumber}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-300 uppercase">Fee Status</span>
                        <span className="font-extrabold text-xs bg-secondary text-primary font-bold px-1.5 py-0.5 rounded uppercase w-max block mt-0.5">
                          {paymentType === 'cash' ? 'PENDING CASH' : 'PAID DIGITAL'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-dashed border-white/20 flex justify-between items-center text-[10px] text-slate-300 font-bn">
                      <span>{isBn ? 'অনুগ্রহ করে গেটে কিউআর কোডটি দেখান' : 'Please present the QR Code at the gate'}</span>
                      <span className="font-extrabold text-white">#PRACTON2026</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className="bg-primary hover:bg-primary/95 text-white font-extrabold px-6 py-2.5 rounded-xl shadow transition text-sm font-bn"
                  >
                    {isBn ? 'বন্ধ করুন' : 'Close Ticket'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 text-sm text-gray-700">
                  <div className="bg-slate-50 p-4 rounded-lg border border-gray-150 mb-4">
                    <span className="block text-xs font-bold text-primary uppercase">Target Event</span>
                    <span className="text-base font-bold text-dark font-bn">
                      {isBn ? registeringEvent.title.bn : registeringEvent.title.en}
                    </span>
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-gray-300 text-center flex flex-col items-center justify-center">
                    {userImage ? (
                      <div className="mb-2 relative">
                        <img src={URL.createObjectURL(userImage)} alt="Selected preview" className="w-16 h-16 object-cover rounded-full border border-gray-300" />
                        <button type="button" onClick={() => setUserImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                          <X size={12} />
                        </button>
                      </div>
                    ) : existingPhoto ? (
                      <div className="mb-2 relative">
                        <img src={existingPhoto} alt="Profile preview" className="w-16 h-16 object-cover rounded-full border border-gray-300" />
                        <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 truncate whitespace-nowrap">Profile Photo</span>
                      </div>
                    ) : (
                      <Upload className="mx-auto text-primary mb-2" size={24} />
                    )}
                    <label className="cursor-pointer block">
                      <span className="text-xs font-bold text-primary block uppercase">
                        {existingPhoto ? 'Change Photo' : 'Upload Member Photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => setUserImage(e.target.files[0])}
                        required={!existingPhoto}
                      />
                    </label>
                    {userImage && <span className="text-xs text-gray-500 font-semibold mt-1 block">Selected: {userImage.name}</span>}
                  </div>

                  {/* Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex justify-between items-center">
                        <span>Full Name</span>
                        <button
                          type="button"
                          onClick={() => setFullName(convertBanglishToBengali(fullName))}
                          className="text-[10px] text-secondary font-bold hover:underline"
                        >
                          {isBn ? 'বাংলায় রূপান্তর ✍️' : 'Phonetic Bangla ✍️'}
                        </button>
                      </label>
                      <input type="text" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg" value={fullName} onChange={e => setFullName(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">PSC Batch</label>
                      <input type="text" placeholder="e.g. PSC 2012" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg" value={pscBatch} onChange={e => setPscBatch(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex justify-between items-center">
                        <span>Father's Name</span>
                        <button
                          type="button"
                          onClick={() => setFathersName(convertBanglishToBengali(fathersName))}
                          className="text-[10px] text-secondary font-bold hover:underline"
                        >
                          {isBn ? 'বাংলায় রূপান্তর ✍️' : 'Phonetic Bangla ✍️'}
                        </button>
                      </label>
                      <input type="text" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg" value={fathersName} onChange={e => setFathersName(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex justify-between items-center">
                        <span>Mother's Name</span>
                        <button
                          type="button"
                          onClick={() => setMothersName(convertBanglishToBengali(mothersName))}
                          className="text-[10px] text-secondary font-bold hover:underline"
                        >
                          {isBn ? 'বাংলায় রূপান্তর ✍️' : 'Phonetic Bangla ✍️'}
                        </button>
                      </label>
                      <input type="text" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg" value={mothersName} onChange={e => setMothersName(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gender</label>
                      <select className="w-full bg-slate-50 border border-gray-300 px-3 py-2.5 rounded-lg" value={gender} onChange={e => setGender(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Marital Status</label>
                      <select className="w-full bg-slate-50 border border-gray-300 px-3 py-2.5 rounded-lg" value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)}>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                      </select>
                    </div>
                  </div>

                  {maritalStatus === 'married' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex justify-between items-center">
                        <span>Spouse Name (Husband Name if Female)</span>
                        <button
                          type="button"
                          onClick={() => setSpouseName(convertBanglishToBengali(spouseName))}
                          className="text-[10px] text-secondary font-bold hover:underline"
                        >
                          {isBn ? 'বাংলায় রূপান্তর ✍️' : 'Phonetic Bangla ✍️'}
                        </button>
                      </label>
                      <input type="text" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg" value={spouseName} onChange={e => setSpouseName(e.target.value)} required />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Number</label>
                      <input type="text" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg" value={contactNumber} onChange={e => setContactNumber(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">WhatsApp Number</label>
                      <input type="text" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address (For ticket delivery)</label>
                      <input type="email" className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                  </div>

                  {/* Payment Method Option */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-gray-200">
                    <div className="space-y-1.5 mb-3 pb-2 border-b border-gray-200 font-bn text-sm">
                      <div className="flex justify-between items-center text-gray-600">
                        <span>{isBn ? 'রেজিস্ট্রেশন ফি' : 'Registration Fee'}</span>
                        <span className="font-bold">৳{toBnNum(currentFee)} BDT</span>
                      </div>
                      {paymentType === 'digital' && processingFee > 0 && (
                        <div className="flex justify-between items-center text-gray-500 text-xs">
                          <span>
                            {isBn ? 'অনলাইন প্রসেসিং ফি' : 'Online Processing Fee'}{' '}
                            ({settings.digitalFeeType === 'percentage' ? `${settings.digitalFeeValue}%` : (isBn ? 'ফিক্সড' : 'Fixed')})
                          </span>
                          <span className="font-bold">৳{toBnNum(processingFee)} BDT</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-dark font-extrabold pt-1">
                        <span>{isBn ? 'মোট পরিশোধযোগ্য টাকা' : 'Total Payable Amount'}</span>
                        <span className="text-base text-secondary">৳{toBnNum(totalFee)} BDT</span>
                      </div>
                    </div>
                    <label className="block text-xs font-bold text-primary uppercase mb-2">Select Registration Fee Method</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentType"
                          value="cash"
                          checked={paymentType === 'cash'}
                          onChange={() => setPaymentType('cash')}
                          className="text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="text-sm font-semibold">Cash On Hand (হাতাহাতি ক্যাশ)</span>
                      </label>
                      <label className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentType"
                          value="digital"
                          checked={paymentType === 'digital'}
                          onChange={() => setPaymentType('digital')}
                          className="text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="text-sm font-semibold">Digital Payment (অনলাইন পেমেন্ট)</span>
                      </label>
                    </div>

                    {paymentType === 'digital' && (
                      <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                        <label className="block text-xs font-bold text-primary uppercase">Select Gateway Channel</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setDigitalProvider('bKash')}
                            className={`py-3 rounded-xl border font-extrabold text-xs transition flex flex-col items-center justify-center space-y-1 ${
                              digitalProvider === 'bKash'
                                ? 'border-[#E2125B] bg-[#E2125B]/5 text-[#E2125B]'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>bKash (বিকাশ)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDigitalProvider('Nagad')}
                            className={`py-3 rounded-xl border font-extrabold text-xs transition flex flex-col items-center justify-center space-y-1 ${
                              digitalProvider === 'Nagad'
                                ? 'border-[#F25C22] bg-[#F25C22]/5 text-[#F25C22]'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>Nagad (নগদ)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex justify-between items-center">
                      <span>Full Address</span>
                      <button
                        type="button"
                        onClick={() => setFullAddress(convertBanglishToBengali(fullAddress))}
                        className="text-[10px] text-secondary font-bold hover:underline"
                      >
                        {isBn ? 'বাংলায় রূপান্তর ✍️' : 'Phonetic Bangla ✍️'}
                      </button>
                    </label>
                    <textarea rows={2} className="w-full bg-slate-50 border border-gray-300 px-3 py-2 rounded-lg" value={fullAddress} onChange={e => setFullAddress(e.target.value)} required />
                  </div>

                  <div className="pt-4 border-t border-gray-150 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setRegisteringEvent(null)}
                      className="bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold px-5 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2 rounded-lg transition shadow"
                    >
                      Submit Registration
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
