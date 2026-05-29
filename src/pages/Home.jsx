import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation, Keyboard } from 'swiper/modules';
import { ArrowRight, Calendar, Users, Megaphone, Trophy, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/settings.jsx';
import api, { API_URL } from '../api/api';

// 60fps high-performance count-up counter component
const AnimatedCounter = ({ value, suffix = '', isCurrency = false, isBn = false }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const numericValue = typeof value === 'number' 
      ? value 
      : parseInt(String(value).replace(/[^\d]/g, ''), 10);

    if (isNaN(numericValue) || numericValue === 0) {
      setDisplayCount(0);
      return;
    }

    const end = numericValue;
    const duration = 1500; 
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = progress * (2 - progress); // Ease out quad
      const current = Math.floor(easedProgress * end);
      
      setDisplayCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const toBnNum = (num) => {
    if (!isBn) return num.toLocaleString();
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, d => bnDigits[d]);
  };

  const formattedCount = isCurrency 
    ? (isBn ? '৳' + toBnNum(displayCount) : '৳' + displayCount.toLocaleString())
    : toBnNum(displayCount);

  return (
    <span>
      {formattedCount}
      {suffix}
    </span>
  );
};

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Dynamic Video Player component supporting YouTube, Facebook, and Cloudinary/Local uploaded videos
const VideoPlayer = ({ url }) => {
  if (!url) return null;

  // 1. YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={embedUrl}
        title="Alumni Association Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    );
  }

  // 2. Facebook
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={embedUrl}
        title="Alumni Association Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ border: 'none', overflow: 'hidden' }}
      ></iframe>
    );
  }

  // 3. Direct/Cloudinary/Uploaded Video (raw video formats)
  return (
    <video
      className="absolute inset-0 w-full h-full object-cover"
      src={url}
      controls
      playsInline
    />
  );
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const [notices, setNotices] = useState([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [stats, setStats] = useState({ totalAmount: 0, totalCount: 0 });
  const [membersCount, setMembersCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [targetEvent, setTargetEvent] = useState(null);
  const [slides, setSlides] = useState([]);
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const isBn = i18n.language === 'bn';
  const currentLang = i18n.language;

  const targetAmount = 1000000; // Target is ৳১০,০০,০০০ BDT

  // Fetch notices, stats, members, events, and hero slides
  useEffect(() => {
    // 1. Notices
    api.get('/notices')
      .then(res => {
        if (res.data.success) {
          setNotices(res.data.data.slice(0, 3));
        }
      })
      .catch(err => console.log('Error fetching notices:', err));

    // 2. Donation Stats
    api.get('/donations/stats')
      .then(res => {
        if (res.data.success) {
          setStats(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching donation stats:', err));

    // 3. Members Count
    api.get('/members')
      .then(res => {
        if (res.data.success && res.data.data) {
          const count = typeof res.data.data.total === 'number'
            ? res.data.data.total
            : (Array.isArray(res.data.data.members) ? res.data.data.members.length : 0);
          setMembersCount(count);
        }
      })
      .catch(err => console.log('Error fetching members count:', err));

    // 4. Events Count & Target Countdown Event
    api.get('/events')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setEventsCount(res.data.data.length);
          setEvents(res.data.data.slice(0, 3));
          
          // Find the nearest upcoming event
          const now = new Date().getTime();
          const upcoming = res.data.data
            .filter(e => new Date(e.date).getTime() > now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          if (upcoming.length > 0) {
            setTargetEvent(upcoming[0]);
          }
        }
      })
      .catch(err => console.log('Error fetching events:', err));

    // 5. Hero Slides
    api.get('/settings/hero_slides')
      .then(res => {
        if (res.data.success && res.data.data && Array.isArray(res.data.data.slides)) {
          setSlides(res.data.data.slides);
        }
      })
      .catch(err => console.log('Error fetching hero slides:', err));

    // 6. Recent Blogs
    api.get('/blogs')
      .then(res => {
        if (res.data.success) {
          setBlogs(res.data.data.slice(0, 3));
        }
      })
      .catch(err => console.log('Error fetching blogs:', err));
  }, []);

  // Countdown timer effect
  useEffect(() => {
    // Target date: nearest upcoming event or fallback to Dec 31, 2026
    const targetDateStr = targetEvent ? targetEvent.date : '2026-12-31T23:59:59';
    const target = new Date(targetDateStr).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetEvent]);

  const progressPercent = Math.min((stats.totalAmount / targetAmount) * 100, 100);

  // Convert numbers to Bengali string helper
  const toBnNum = (num) => {
    if (!isBn) return num.toLocaleString();
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, d => bnDigits[d]);
  };

  const defaultSlides = [
    {
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200",
      titleBn: "স্বাগতম প্রাক্তন পরিষদে",
      titleEn: "Welcome to Practon Alumni Association",
      subtitleBn: "আমাদের সকল প্রাক্তন শিক্ষার্থীদের ঐক্যবদ্ধ করার লক্ষ্যে পরিষদের পথচলা।",
      subtitleEn: "Connecting alumni, fostering friendships, and supporting our alma mater.",
      btnTextBn: "যুক্ত হোন",
      btnTextEn: "Join Us",
      btnLink: "/register",
      hasCountdown: false,
      hasDonation: false
    },
    {
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200",
      titleBn: targetEvent ? targetEvent.title.bn : "বার্ষিক পুনর্মিলনী অনুষ্ঠান ২০২৬",
      titleEn: targetEvent ? targetEvent.title.en : "Annual Reunion Ceremony 2026",
      subtitleBn: targetEvent ? "অনুষ্ঠানটি শুরু হতে আর মাত্র বাকি:" : "Annual Reunion is approaching. Register today!",
      subtitleEn: targetEvent ? "Countdown to the event:" : "Annual Reunion is approaching. Register today!",
      btnTextBn: "নিবন্ধন করুন",
      btnTextEn: "Register Now",
      btnLink: "/events",
      hasCountdown: true,
      hasDonation: false
    },
    {
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200",
      titleBn: "অনুদান তহবিল ও কল্যাণ ফান্ড",
      titleEn: "Alumni Welfare & Support Fund",
      subtitleBn: "ছাত্রবৃত্তি ফান্ড, জরুরি সংকটকালীন ত্রাণ ও ভবিষ্যৎ রিইউনিয়ন সফল করার কার্যক্রমে অনুদান দিন।",
      subtitleEn: "Make a contribution to fuel student scholarships, emergency relief, and upcoming reunion events.",
      btnTextBn: "অনুদান দিন",
      btnTextEn: "Donate Now",
      btnLink: "/donation",
      hasCountdown: false,
      hasDonation: true
    }
  ];

  const displaySlides = slides.length > 0 ? slides : defaultSlides;

  return (
    <div className="overflow-x-hidden font-english">
      {/* 🖼️ HERO SECTION WITH ANIMATED SLIDER */}
      <section className="relative h-[85vh] w-full bg-dark">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Navigation, Keyboard]}
          effect={'fade'}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          keyboard={{ enabled: true }}
          className="h-full w-full"
        >
          {displaySlides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative flex items-center justify-center bg-gradient-to-r from-dark to-primary/85">
              <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('${slide.image}')` }} />
              <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center text-left text-white w-full">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl sm:text-6xl font-extrabold font-bn leading-tight max-w-4xl"
                >
                  {isBn ? slide.titleBn : slide.titleEn}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-4 max-w-2xl text-lg text-gray-200 font-bn"
                >
                  {isBn ? slide.subtitleBn : slide.subtitleEn}
                </motion.p>

                {/* Countdown Board */}
                {slide.hasCountdown && (
                  <div className="mt-8 grid grid-cols-4 gap-4 max-w-lg">
                    {[
                      { label: isBn ? 'দিন' : 'Days', val: countdown.days },
                      { label: isBn ? 'ঘণ্টা' : 'Hours', val: countdown.hours },
                      { label: isBn ? 'মিনিট' : 'Mins', val: countdown.minutes },
                      { label: isBn ? 'সেকেন্ড' : 'Secs', val: countdown.seconds },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-5 border border-white/20">
                        <span className="block text-2xl sm:text-4xl font-bold text-secondary">{toBnNum(item.val)}</span>
                        <span className="text-xs uppercase text-gray-300 font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Donation Progress */}
                {slide.hasDonation && (
                  <div className="mt-6 max-w-md w-full">
                    <div className="bg-white/20 rounded-full h-4 overflow-hidden border border-white/10">
                      <div className="bg-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className="text-sm mt-2 block text-gray-300 font-bn">
                      {toBnNum(progressPercent.toFixed(1))}% {isBn ? 'লক্ষ্যমাত্রা' : 'of Target'} ৳{toBnNum(targetAmount)} {isBn ? 'টাকা সংগৃহীত হয়েছে' : 'BDT Raised'}
                    </span>
                  </div>
                )}

                {slide.btnLink && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-8"
                  >
                    <Link to={slide.btnLink} className="bg-secondary hover:bg-yellow-500 text-white font-bold px-8 py-3 rounded-full flex items-center space-x-2 transition shadow-lg w-fit">
                      {slide.hasDonation && <Heart size={16} className="fill-current" />}
                      <span>{isBn ? (slide.btnTextBn || 'ক্লিক করুন') : (slide.btnTextEn || 'Click Here')}</span>
                      {!slide.hasDonation && <ArrowRight size={18} />}
                    </Link>
                  </motion.div>
                )}
              </div>
            </SwiperSlide>
          ))}
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
            <span className="block text-3xl font-extrabold text-primary">
              <AnimatedCounter value={membersCount > 0 ? membersCount : 100} suffix="+" isBn={isBn} />
            </span>
            <span className="text-sm text-gray-500 font-medium">Active Registered Members</span>
          </div>
        </div>
      </section>

      {/* 📊 STATISTICS HIGHLIGHTS */}
      <section className="bg-primary py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,195,247,0.15),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {[
            { 
              icon: <Users size={32} className="text-secondary" />, 
              counter: <AnimatedCounter value={membersCount > 0 ? membersCount : 100} suffix="+" isBn={isBn} />, 
              label: isBn ? 'মোট সদস্য' : 'Active Members' 
            },
            { 
              icon: <Calendar size={32} className="text-secondary" />, 
              counter: <AnimatedCounter value={eventsCount} isBn={isBn} />, 
              label: isBn ? 'নিবন্ধিত ইভেন্ট' : 'Active Events' 
            },
            { 
              icon: <Trophy size={32} className="text-secondary" />, 
              counter: <AnimatedCounter value={10} suffix="+" isBn={isBn} />, 
              label: isBn ? 'পুরস্কার ও সম্মাননা' : 'Awards & Recognition' 
            },
            { 
              icon: <Heart size={32} className="text-secondary" />, 
              counter: <AnimatedCounter value={stats.totalAmount} isCurrency={true} isBn={isBn} />, 
              label: isBn ? 'সংগৃহীত অনুদান (টাকা)' : 'Total Donations (BDT)' 
            }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              {stat.icon}
              <span className="text-3xl sm:text-4xl font-extrabold font-bn mt-3">{stat.counter}</span>
              <span className="text-sm text-gray-300 font-bn mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 🎥 VIDEO & INTRODUCTION SECTION */}
      <section className="py-20 bg-dark text-white relative overflow-hidden">
        {/* Glowing background highlights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-slow-reverse" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: Professional Welcome & Core Values */}
            <div className="space-y-6">
              <span className="text-secondary font-bold text-sm uppercase tracking-wider block">
                {isBn ? "আমাদের লক্ষ্য ও উদ্দেশ্য" : "Our Mission & Vision"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-bn">
                {isBn ? "ঐতিহ্যের বন্ধনে প্রাক্তন পরিষদ" : "Cherishing Legacies, Inspiring Futures"}
              </h2>
              <p className="text-gray-300 font-bn leading-relaxed">
                {isBn 
                  ? "ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়ের ঐতিহ্য ও গৌরবকে সমুন্নত রাখতে আমাদের সকল প্রাক্তন শিক্ষার্থীদের এটি একটি সম্মিলিত প্ল্যাটফর্ম। আমরা পারস্পরিক ভ্রাতৃত্ববন্ধন জোরদার করতে এবং প্রিয় বিদ্যালয়ের উন্নয়নে অঙ্গীকারবদ্ধ।" 
                  : "A unified platform dedicated to keeping the legacy of Dhuapalong Govt. Primary School alive. We aim to bridge the gap between different generations of graduates, foster a supportive network, and contribute directly to school development."
                }
              </p>

              {/* Core Features / Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-secondary/15 text-secondary p-1.5 rounded-lg shrink-0 mt-0.5">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 font-bn">
                      {isBn ? "ভ্রাতৃত্ব ও সংযোগ" : "Strong Networking"}
                    </h4>
                    <p className="text-xs text-gray-400 font-bn mt-1 leading-relaxed">
                      {isBn ? "সকল ব্যাচের প্রাক্তনী ও পরিবারদের মধ্যে মজবুত সংযোগ স্থাপন।" : "Connecting graduates of all years across the country and globe."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-secondary/15 text-secondary p-1.5 rounded-lg shrink-0 mt-0.5">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 font-bn">
                      {isBn ? "বিদ্যালয়ের সামগ্রিক উন্নয়ন" : "Alma Mater Support"}
                    </h4>
                    <p className="text-xs text-gray-400 font-bn mt-1 leading-relaxed">
                      {isBn ? "বিদ্যালয়ের মেধা অন্বেষণ ও অবকাঠামো উন্নয়নে সহযোগিতা।" : "Contributing to classroom facilities, scholarships, and activities."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Responsive Video Showcase */}
            <div className="space-y-4">
              <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">
                {isBn ? "আমাদের প্রামাণ্যচিত্র দেখুন" : "Watch Our Documentary Video"}
              </span>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 aspect-video group">
                <VideoPlayer url={settings?.introVideoUrl || 'https://www.youtube.com/embed/9ycVq2kU7L0'} />
              </div>
            </div>
          </div>
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
              <div className="col-span-3 text-center py-12 text-sm text-gray-500 font-semibold font-bn">
                {isBn ? 'এখনো কোনো নোটিশ পোস্ট করা হয়নি।' : 'No announcements published yet.'}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
