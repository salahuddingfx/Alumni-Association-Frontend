import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { ArrowRight, Calendar, Users, Megaphone, Trophy, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [notices, setNotices] = useState([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Mock Target Date: Dec 31, 2026 for reunion countdown
  useEffect(() => {
    const target = new Date('2026-12-31T23:59:59').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch notices
  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/notices')
      .then(res => {
        if (res.data.success) {
          setNotices(res.data.data.slice(0, 3));
        }
      })
      .catch(err => console.log('Error fetching notices:', err));
  }, []);

  const currentLang = i18n.language;

  return (
    <div className="overflow-x-hidden font-english">
      {/* 🖼️ HERO SECTION WITH ANIMATED SLIDER */}
      <section className="relative h-[85vh] w-full bg-dark">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect={'fade'}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {/* Slide 1 - Welcome */}
          <SwiperSlide className="relative flex items-center justify-center bg-gradient-to-r from-dark to-primary/80">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200')" }} />
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center text-left text-white">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-6xl font-extrabold font-bn leading-tight"
              >
                {t('hero.welcome')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-4 max-w-2xl text-lg text-gray-200"
              >
                {t('hero.subtitle')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link to="/register" className="bg-secondary hover:bg-yellow-500 text-white font-bold px-8 py-3 rounded-full flex items-center space-x-2 transition shadow-lg">
                  <span>{t('hero.join')}</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/events" className="border-2 border-white hover:bg-white hover:text-dark text-white font-bold px-8 py-3 rounded-full transition">
                  {t('hero.explore')}
                </Link>
              </motion.div>
            </div>
          </SwiperSlide>

          {/* Slide 2 - Reunion Countdown */}
          <SwiperSlide className="relative flex items-center justify-center bg-gradient-to-r from-dark to-primary/95">
            <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200')" }} />
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white">
              <h2 className="text-3xl sm:text-5xl font-bold font-bn">বার্ষিক পুনর্মিলনী অনুষ্ঠান ২০২৬</h2>
              <p className="mt-2 text-gray-300">Annual Reunion Ceremony 2026 is approaching. Register today!</p>
              
              {/* Countdown Board */}
              <div className="mt-8 grid grid-cols-4 gap-4 max-w-lg">
                {[
                  { label: 'Days', val: countdown.days },
                  { label: 'Hours', val: countdown.hours },
                  { label: 'Mins', val: countdown.minutes },
                  { label: 'Secs', val: countdown.seconds },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-5 border border-white/20">
                    <span className="block text-2xl sm:text-4xl font-bold text-secondary">{item.val}</span>
                    <span className="text-xs uppercase text-gray-300 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/events" className="bg-secondary hover:bg-yellow-500 text-white font-bold px-8 py-3 rounded-full transition shadow-lg">
                  Register Now
                </Link>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 - Donation */}
          <SwiperSlide className="relative flex items-center justify-center bg-gradient-to-r from-dark to-primary/80">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200')" }} />
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center text-left text-white">
              <h2 className="text-3xl sm:text-5xl font-bold font-bn">{t('donation.title')}</h2>
              <p className="mt-4 max-w-xl text-gray-200">{t('donation.subtitle')}</p>
              
              {/* Progress Simulation */}
              <div className="mt-6 max-w-md w-full bg-white/20 rounded-full h-4 overflow-hidden border border-white/10">
                <div className="bg-secondary h-full rounded-full" style={{ width: '72%' }} />
              </div>
              <span className="text-sm mt-2 text-gray-300">72% of Target 10,00,000 BDT Raised</span>

              <div className="mt-6">
                <Link to="/donation" className="bg-secondary hover:bg-yellow-500 text-white font-bold px-8 py-3 rounded-full flex items-center space-x-2 w-fit transition shadow-lg">
                  <Heart size={16} className="fill-current" />
                  <span>{t('donation.donate_now')}</span>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* 📖 ABOUT SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-secondary font-bold text-sm uppercase tracking-wider">Who We Are</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary font-bn mt-2">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
          <p className="mt-6 text-gray-600 leading-relaxed font-bn">
            প্রাক্তন পরিষদ আমাদের প্রিয় শিক্ষাপ্রতিষ্ঠানের সকল প্রাক্তন শিক্ষার্থীদের ঐক্যবদ্ধ করার একটি প্রয়াস। আমরা পারস্পরিক ভ্রাতৃত্ববন্ধন, সামাজিক দায়বদ্ধতা, ও শিক্ষাপ্রতিষ্ঠানের সামগ্রিক উন্নয়নে কাজ করে চলেছি।
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Our mission is to foster a lifelong connection among alumni, support student excellence, and honor the rich heritage of our beloved institution through professional development, mentoring, and philanthropic campaigns.
          </p>
          <div className="mt-8">
            <Link to="/about" className="text-primary hover:text-secondary font-bold flex items-center space-x-1.5 group transition">
              <span>Read Full History</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        <div className="relative">
          {/* Glassmorphic card mockup */}
          <div className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800" className="object-cover w-full h-full" alt="Campus Building" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hidden sm:block">
            <span className="block text-3xl font-extrabold text-primary">১০,০০০+</span>
            <span className="text-sm text-gray-500 font-medium">Active Registered Alumni</span>
          </div>
        </div>
      </section>

      {/* 📊 STATISTICS HIGHLIGHTS */}
      <section className="bg-primary py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,195,247,0.15),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {[
            { icon: <Users size={32} className="text-secondary" />, count: '১০,০০০+', label: 'মোট সদস্য' },
            { icon: <Calendar size={32} className="text-secondary" />, count: '১২+', label: 'বার্ষিক ইভেন্ট' },
            { icon: <Trophy size={32} className="text-secondary" />, count: '৫০+', label: 'পুরস্কার ও সম্মাননা' },
            { icon: <Heart size={32} className="text-secondary" />, count: '৫,০০,০০০+', label: 'সংগৃহীত অনুদান (টাকা)' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              {stat.icon}
              <span className="text-3xl sm:text-4xl font-extrabold font-bn mt-3">{stat.count}</span>
              <span className="text-sm text-gray-300 font-bn mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 📢 NOTICE BOARD PREVIEW */}
      <section className="py-20 bg-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-secondary font-bold text-sm uppercase tracking-wider">Announcements</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary font-bn mt-2">{t('notice.title')}</h2>
            </div>
            <Link to="/notices" className="text-primary hover:text-secondary font-bold flex items-center space-x-1 group">
              <span>View All Notices</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <div key={notice._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        notice.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {notice.priority.toUpperCase()}
                      </span>
                      {notice.isSticky && <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-bold rounded-full">Sticky</span>}
                    </div>
                    <h3 className="font-bold text-lg text-primary font-bn line-clamp-2">
                      {currentLang === 'bn' ? notice.title.bn : notice.title.en}
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm font-bn line-clamp-3">
                      {currentLang === 'bn' ? notice.content.bn : notice.content.en}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                    <span>{new Date(notice.publishDate).toLocaleDateString()}</span>
                    <Link to={`/notices/${notice._id}`} className="text-secondary hover:text-primary font-bold">Read More &rarr;</Link>
                  </div>
                </div>
              ))
            ) : (
              // Mock Notices in case server is not running or empty
              [1, 2, 3].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold rounded-full">NORMAL</span>
                    </div>
                    <h3 className="font-bold text-lg text-primary font-bn">
                      {currentLang === 'bn' ? 'বার্ষিক পুনর্মিলনী রেজিস্ট্রেশন শুরু হয়েছে' : 'Annual Reunion Registration Started'}
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm font-bn">
                      {currentLang === 'bn' 
                        ? 'সকল প্রাক্তন শিক্ষার্থীদের জন্য আনন্দের সাথে জানানো যাচ্ছে যে আগামী পুনর্মিলনীর জন্য নিবন্ধন প্রক্রিয়া শুরু হয়েছে।' 
                        : 'We are pleased to announce that the registration for the upcoming reunion is now open to all alumni.'}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                    <span>May 27, 2026</span>
                    <Link to="/notices" className="text-secondary hover:text-primary font-bold">Read More &rarr;</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
