import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Calendar, MapPin, X, User, Phone, CheckCircle, Upload } from 'lucide-react';
import { convertBanglishToBengali } from '../utils/banglish';

const Events = () => {
  const { i18n } = useTranslation();
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
  const [paymentType, setPaymentType] = useState('cash'); // 'cash' or 'digital'
  
  const [message, setMessage] = useState('');
  const isBn = i18n.language === 'bn';

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/events')
      .then(res => {
        if (res.data.success) {
          setEvents(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching events:', err));
  }, []);

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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
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
      }

      const res = await axios.post(
        `http://localhost:5000/api/v1/events/${registeringEvent._id}/registration/register`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data.success) {
        setMessage(isBn ? 'রেজিস্ট্রেশন সফল! আপনার টিকেট নিচে তৈরি করা হলো।' : 'Registration successful! Your ticket has been generated below.');
        // Do not auto-clear immediately so the user can see and download the ticket pass
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
    setPaymentType('cash');
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
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
            <div className="p-8 max-h-[70vh] overflow-y-auto">
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
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-sm text-gray-700">
                  <div className="bg-slate-50 p-4 rounded-lg border border-gray-150 mb-4">
                    <span className="block text-xs font-bold text-primary uppercase">Target Event</span>
                    <span className="text-base font-bold text-dark font-bn">
                      {isBn ? registeringEvent.title.bn : registeringEvent.title.en}
                    </span>
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-gray-300 text-center">
                    <label className="cursor-pointer block">
                      <Upload className="mx-auto text-primary mb-2" size={24} />
                      <span className="text-xs font-bold text-primary block uppercase">Upload Member Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => setUserImage(e.target.files[0])}
                        required
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
