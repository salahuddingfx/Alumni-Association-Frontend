import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, Eye, Heart, Users, Award, Globe, Shield, Handshake, BookOpen, Star } from 'lucide-react';
import api from '../api/api';
import { CountUp } from '../hooks/useCountUp';

const About = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const containerRef = useRef(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [memberCount, setMemberCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const defaultTimeline = [
    { year: 'January 2025', titleEn: 'Foundation & Setup', titleBn: 'সংগঠনের শুভ সূচনা', descEn: 'The initial foundation of Practon Alumni Association was laid with a historic inaugural meeting of core founding members.', descBn: 'আমাদের সকল প্রাক্তন শিক্ষার্থীদের ঐক্যবদ্ধ করার লক্ষ্যে পরিষদের আনুষ্ঠানিকভাবে যাত্রা ও ভিত্তিপ্রস্তর স্থাপন।' },
    { year: 'Eid-ul-Adha 2025', titleEn: 'First Reunion & Meetup', titleBn: 'প্রথম পুনর্মিলনী ও গেট-টুগেদার', descEn: 'Our first historic grand reunion and meetup held during the festive season of Eid-ul-Adha.', descBn: 'পবিত্র ঈদুল আজহার বরকতময় ছুটিতে আমাদের প্রথম ঐতিহাসিক পুনর্মিলনী ও সবার সাথে এক প্রাণবন্ত মিটআপ।' },
    { year: 'September 2025', titleEn: 'Advisory Panel Selection', titleBn: 'উপদেষ্টা পরিষদ গঠন', descEn: 'Selection of our respected advisory panel and operational core committee.', descBn: 'সংগঠনের সঠিক দিকনির্দেশনার জন্য সম্মানিত উপদেষ্টা পরিষদ গঠন।' },
    { year: 'December 2025', titleEn: 'Constitution Drafted', titleBn: 'খসড়া গঠনতন্ত্র অনুমোদন', descEn: 'Formulation and approval of the association constitution.', descBn: 'পরিষদকে নিয়মতান্ত্রিক উপায়ে পরিচালনার লক্ষ্যে খসড়া গঠনতন্ত্র অনুমোদন।' },
    { year: 'January 2026', titleEn: 'Alumni Welfare Fund', titleBn: 'কল্যাণ তহবিল চালু', descEn: 'Established welfare funds to support batchmates and meritorious students.', descBn: 'বিপদে পড়া সদস্য ও মেধাবী শিক্ষার্থীদের সহায়তায় বিশেষ কল্যাণ তহবিল গঠন।' },
    { year: 'March 2026', titleEn: 'Global Network Connect', titleBn: 'গ্লোবাল মেম্বার ডিরেক্টরি', descEn: 'Initiated the registration phase for members across Bangladesh and the globe.', descBn: 'সারা বিশ্বে ছড়িয়ে থাকা সদস্যদের একত্রিত করতে বৈশ্বিক ডিরেক্টরি চালু।' },
    { year: 'May 2026', titleEn: 'MERN Stack Web Portal', titleBn: 'ডিজিটাল ওয়েব পোর্টাল', descEn: 'Salah Uddin Kader (Dpian) engineered the modern secure MERN Stack digital platform.', descBn: 'সালাহ উদ্দিন কাদের (দ্বীপান) কর্তৃক আধুনিক এমইআরএন স্ট্যাক পোর্টাল তৈরি।' },
    { year: 'December 2026', titleEn: 'Grand Reunion Planning', titleBn: 'বার্ষিক গ্র্যান্ড রিইউনিয়ন', descEn: 'Finalizing blueprints for the grand annual reunion ceremony.', descBn: 'বার্ষিক পুনর্মিলনী মিলনমেলার সুনির্দিষ্ট পরিকল্পনা নির্ধারণ।' },
  ];

  const defaultAdvisors = [
    { titleEn: 'Message from the Chief Advisor', titleBn: 'প্রধান উপদেষ্টার বাণী', messageEn: '"The bond between alumni is priceless. Through this association, I hope every graduate will reconnect with their roots and build a prosperous future for our beloved school."', messageBn: '"প্রাক্তন শিক্ষার্থীদের বন্ধন একটি অমূল্য সম্পদ। এই পরিষদের মাধ্যমে প্রতিটি গ্র্যাজুয়েট যেন তাদের শিকড়ের সাথে পুনরায় সংযুক্ত হতে পারে।"', nameEn: 'Prof. Dr. Abdul Karim Chowdhury', nameBn: 'অধ্যাপক ড. আব্দুল করিম চৌধুরী', roleEn: 'Chief Advisor', roleBn: 'প্রধান উপদেষ্টা' },
    { titleEn: 'Message from the President', titleBn: 'সভাপতির বার্তা', messageEn: '"This association is built on love, unity and shared memories. I invite every alumnus to actively participate and contribute to our collective mission."', messageBn: '"প্রাক্তন পরিষদ শুধু একটি সংগঠন নয়, এটি ভালোবাসা ও ঐক্যের আন্দোলন। আসুন সবাই একসাথে আমাদের সমাজকে উন্নত করি।"', nameEn: 'Engr. Md. Ashraful Islam', nameBn: 'ইঞ্জিনিয়ার মোঃ আশরাফুল ইসলাম', roleEn: 'President', roleBn: 'সভাপতি' },
    { titleEn: 'Message from the General Secretary', titleBn: 'সাধারণ সম্পাদকের বার্তা', messageEn: '"Our shared memories from Dhuapalong Primary School bind us forever. Let us weave a stronger network through active participation and mutual support."', messageBn: '"ধোয়াপালং প্রাথমিক বিদ্যালয়ের দিনগুলো আমাদের গভীরভাবে যুক্ত করে। সক্রিয় অংশগ্রহণে একটি শক্তিশালী নেটওয়ার্ক গড়ি।"', nameEn: 'Md. Salimullah', nameBn: 'মোঃ সালিমুল্লাহ', roleEn: 'General Secretary', roleBn: 'সাধারণ সম্পাদক' },
  ];

  useEffect(() => {
    api.get('/settings/timeline_events')
      .then(res => {
        if (res.data.success && res.data.data?.events?.length > 0) setTimelineEvents(res.data.data.events);
        else setTimelineEvents(defaultTimeline);
      })
      .catch(() => setTimelineEvents(defaultTimeline));

    api.get('/settings/advisor_messages')
      .then(res => {
        if (res.data.success && res.data.data?.advisors?.length > 0) setAdvisors(res.data.data.advisors);
        else setAdvisors(defaultAdvisors);
      })
      .catch(() => setAdvisors(defaultAdvisors));

    api.get('/members?limit=1')
      .then(res => {
        if (res.data.success) setMemberCount(res.data.data.total || 0);
      })
      .catch(() => {});
  }, []);

  const displayTimeline = timelineEvents.length > 0 ? timelineEvents : defaultTimeline;
  const displayAdvisors = advisors.length > 0 ? advisors : defaultAdvisors;

  const stats = [
    { val: memberCount, suffix: '+', labelEn: 'Registered Alumni', labelBn: 'নিবন্ধিত সদস্য', icon: <Users size={22} /> },
    { val: 10, suffix: '+', labelEn: 'Graduation Batches', labelBn: 'গ্র্যাজুয়েশন ব্যাচ', icon: <Award size={22} /> },
    { val: 2025, suffix: '', labelEn: 'Established', labelBn: 'প্রতিষ্ঠাকাল', icon: <Star size={22} /> },
    { val: 3, suffix: '+', labelEn: 'Events Organised', labelBn: 'আয়োজিত অনুষ্ঠান', icon: <Globe size={22} /> },
  ];

  const values = [
    { icon: <Heart className="text-rose-500" size={28} />, titleEn: 'Brotherhood & Sisterhood', titleBn: 'ভ্রাতৃত্ব ও বন্ধন', descEn: 'We believe in the power of lifelong bonds forged in the classrooms and playgrounds of Dhuapalong Primary School.', descBn: 'ধোয়াপালং প্রাথমিক বিদ্যালয়ের শ্রেণীকক্ষ ও মাঠে গড়ে ওঠা আজীবনের বন্ধনে আমরা বিশ্বাস করি।' },
    { icon: <Shield className="text-blue-500" size={28} />, titleEn: 'Integrity & Transparency', titleBn: 'সততা ও স্বচ্ছতা', descEn: 'All our operations, fund management and decision-making are conducted with full transparency and accountability.', descBn: 'আমাদের সকল কার্যক্রম, তহবিল ব্যবস্থাপনা ও সিদ্ধান্ত গ্রহণ সম্পূর্ণ স্বচ্ছতার সাথে পরিচালিত হয়।' },
    { icon: <Handshake className="text-emerald-500" size={28} />, titleEn: 'Community Service', titleBn: 'সমাজসেবা', descEn: 'We give back to our roots — supporting current students, welfare assistance and local community development.', descBn: 'আমরা আমাদের শিকড়কে ফিরিয়ে দিই — বর্তমান শিক্ষার্থী, কল্যাণ সহায়তা ও স্থানীয় উন্নয়নে অবদান রাখি।' },
    { icon: <BookOpen className="text-amber-500" size={28} />, titleEn: 'Lifelong Learning', titleBn: 'আজীবন শিক্ষা', descEn: 'We champion continuous personal and professional growth through seminars, mentorship and knowledge sharing.', descBn: 'সেমিনার, মেন্টরশিপ ও জ্ঞান ভাগাভাগির মাধ্যমে ব্যক্তিগত ও পেশাদার বিকাশকে আমরা সর্বদা সমর্থন করি।' },
  ];

  return (
    <div className="overflow-hidden">

      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-slate-900 text-white py-24 px-6 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <span className="inline-block bg-secondary/20 text-secondary border border-secondary/40 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            {isBn ? 'আমাদের সম্পর্কে' : 'About Us'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-bn leading-tight mb-6">
            {isBn
              ? 'ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়\nপ্রাক্তন শিক্ষার্থী পরিষদ'
              : 'Dhuapalong Govt. Primary School\nAlumni Association'}
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-bn leading-relaxed max-w-3xl mx-auto">
            {isBn
              ? 'আমরা হলাম ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়ের বিভিন্ন প্রজন্মের প্রাক্তন শিক্ষার্থীদের একটি ঐক্যবদ্ধ পরিবার। ২০২৫ সালে প্রতিষ্ঠিত এই পরিষদ স্মৃতি, সম্প্রীতি ও সমাজসেবার সেতু হিসেবে কাজ করে।'
              : 'We are a united family of alumni from Dhuapalong Government Primary School across all generations. Founded in 2025, this association serves as a bridge of memories, harmony and community service.'}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center"
              >
                <div className="flex justify-center mb-2 text-secondary">{stat.icon}</div>
                <div className="text-3xl font-extrabold text-white">
                  <CountUp value={stat.val} suffix={stat.suffix} isBn={isBn} />
                </div>
                <div className="text-xs text-white/60 font-bn mt-1">
                  {isBn ? stat.labelBn : stat.labelEn}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── MISSION & VISION ─────────────────────────────────────────── */}
      <div className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-secondary text-xs font-bold uppercase tracking-widest">
            {isBn ? 'আমাদের লক্ষ্য' : 'Our Purpose'}
          </span>
          <h2 className="text-3xl font-extrabold text-primary font-bn mt-2">
            {isBn ? 'উদ্দেশ্য, লক্ষ্য ও দৃষ্টিভঙ্গি' : 'Mission, Vision & Goals'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="group bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-8 hover:border-primary/40 hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Target className="text-primary" size={28} />
            </div>
            <h3 className="text-2xl font-extrabold text-primary font-bn mb-4">
              {isBn ? 'আমাদের অভিলক্ষ্য' : 'Our Mission'}
            </h3>
            <p className="text-gray-600 font-bn leading-relaxed text-base">
              {isBn
                ? 'ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়ের সকল প্রাক্তন শিক্ষার্থীকে একটি সক্রিয়, অন্তর্ভুক্তিমূলক ও সহায়ক প্ল্যাটফর্মের মাধ্যমে একত্রিত করা; বর্তমান শিক্ষার্থীদের উৎসাহিত করা; এবং আমাদের প্রিয় বিদ্যালয় ও সম্প্রদায়ের উন্নয়নে অর্থবহ অবদান রাখা।'
                : 'To unite all alumni of Dhuapalong Government Primary School through an active, inclusive and supportive platform; to inspire current students; and to make meaningful contributions to the development of our beloved school and community.'}
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="group bg-gradient-to-br from-secondary/5 to-amber-50 border border-secondary/20 rounded-3xl p-8 hover:border-secondary/40 hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6">
              <Eye className="text-secondary" size={28} />
            </div>
            <h3 className="text-2xl font-extrabold text-primary font-bn mb-4">
              {isBn ? 'আমাদের দৃষ্টিভঙ্গি' : 'Our Vision'}
            </h3>
            <p className="text-gray-600 font-bn leading-relaxed text-base">
              {isBn
                ? 'বাংলাদেশের সেরা প্রাথমিক বিদ্যালয় প্রাক্তনী সংগঠন হিসেবে নিজেদের প্রতিষ্ঠিত করা, যেখানে সদস্যরা ক্যারিয়ার সুযোগ, সামাজিক সংযোগ এবং সম্প্রদায় উন্নয়নে একে অপরকে সহায়তা করবে এবং এই বিদ্যালয়টিকে জাতীয়ভাবে সম্মানিত করবে।'
                : 'To become the finest primary school alumni association in Bangladesh, where members support each other in career opportunities, social connections and community development — making Dhuapalong Primary School nationally respected and celebrated.'}
            </p>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-md hover:border-secondary/30 transition-all"
            >
              <div className="flex justify-center mb-4">{val.icon}</div>
              <h4 className="font-bold text-primary font-bn text-sm mb-2">
                {isBn ? val.titleBn : val.titleEn}
              </h4>
              <p className="text-xs text-gray-500 font-bn leading-relaxed">
                {isBn ? val.descBn : val.descEn}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── TIMELINE ─────────────────────────────────────────────────── */}
      <div className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-secondary text-xs font-bold uppercase tracking-widest">
              {isBn ? 'আমাদের যাত্রা' : 'Our Journey'}
            </span>
            <h2 className="text-3xl font-extrabold text-primary font-bn mt-2">
              {isBn ? 'পরিষদের ইতিহাস ও মাইলফলক' : 'History & Milestones'}
            </h2>
            <p className="mt-3 text-gray-500 font-bn max-w-2xl mx-auto">
              {isBn
                ? '২০২৫ থেকে আজ পর্যন্ত আমাদের গৌরবময় পথচলার গুরুত্বপূর্ণ মুহূর্তগুলো।'
                : 'The important moments of our glorious journey from 2025 to the present day.'}
            </p>
          </div>

          <div ref={containerRef} className="relative max-w-5xl mx-auto py-10">
            {/* Background static line */}
            <div className="absolute left-6 -ml-[2px] md:left-1/2 md:-ml-[2px] h-full w-[3px] bg-gray-200 rounded-full" />
            {/* Scroll-drawing progress line */}
            <motion.div
              style={{ scaleY }}
              className="absolute left-6 -ml-[2px] md:left-1/2 md:-ml-[2px] h-full w-[3px] bg-gradient-to-b from-secondary to-primary origin-top rounded-full z-10"
            />

            <div className="space-y-12">
              {displayTimeline.map((event, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={index} className="relative flex flex-col md:flex-row items-center justify-between w-full">
                    {/* Left card */}
                    <div className={`w-full md:w-[calc(50%-36px)] flex justify-end order-2 md:order-1 ${isEven ? 'block' : 'hidden md:block opacity-0 pointer-events-none'}`}>
                      {isEven && (
                        <motion.div
                          initial={{ opacity: 0, x: -50, scale: 0.95 }}
                          whileInView={{ opacity: 1, x: 0, scale: 1 }}
                          viewport={{ once: false, amount: 0.3 }}
                          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm w-full relative group cursor-pointer ml-12 md:ml-0"
                        >
                          <span className="text-secondary font-bold text-xs bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full">
                            {event.year}
                          </span>
                          <h3 className="font-extrabold text-lg text-primary font-bn mt-4 group-hover:text-secondary transition-colors">
                            {isBn ? event.titleBn : event.titleEn}
                          </h3>
                          <p className="text-sm text-gray-500 font-bn mt-2 leading-relaxed">
                            {isBn ? event.descBn : event.descEn}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Center dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: false, amount: 0.5 }}
                      className="absolute left-6 -ml-[11px] md:left-1/2 md:-ml-[11px] w-[22px] h-[22px] bg-white rounded-full border-4 border-secondary shadow-lg z-20"
                    />

                    {/* Right card */}
                    <div className={`w-full md:w-[calc(50%-36px)] flex justify-start order-3 ${!isEven ? 'block' : 'hidden md:block opacity-0 pointer-events-none'}`}>
                      {!isEven && (
                        <motion.div
                          initial={{ opacity: 0, x: 50, scale: 0.95 }}
                          whileInView={{ opacity: 1, x: 0, scale: 1 }}
                          viewport={{ once: false, amount: 0.3 }}
                          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm w-full relative group cursor-pointer ml-12 md:ml-0"
                        >
                          <span className="text-secondary font-bold text-xs bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full">
                            {event.year}
                          </span>
                          <h3 className="font-extrabold text-lg text-primary font-bn mt-4 group-hover:text-secondary transition-colors">
                            {isBn ? event.titleBn : event.titleEn}
                          </h3>
                          <p className="text-sm text-gray-500 font-bn mt-2 leading-relaxed">
                            {isBn ? event.descBn : event.descEn}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── ADVISOR MESSAGES ─────────────────────────────────────────── */}
      <div className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-secondary text-xs font-bold uppercase tracking-widest">
            {isBn ? 'নেতৃত্বের বার্তা' : 'Leadership Messages'}
          </span>
          <h2 className="text-3xl font-extrabold text-primary font-bn mt-2">
            {isBn ? 'উপদেষ্টা ও নেতৃত্বের বাণী' : 'Messages from Our Leaders'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayAdvisors.map((advisor, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-slate-50 to-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -translate-y-8 translate-x-8" />
              <h3 className="text-base font-extrabold text-primary font-bn mb-4 relative">
                {isBn ? advisor.titleBn : advisor.titleEn}
              </h3>
              <p className="text-gray-600 italic font-bn text-sm leading-relaxed mb-6 relative">
                {isBn ? advisor.messageBn : advisor.messageEn}
              </p>
              <div className="flex items-center space-x-3 border-t border-gray-100 pt-4 relative">
                <div className="w-11 h-11 bg-primary rounded-full shrink-0 flex items-center justify-center text-white font-extrabold text-base">
                  {(isBn ? advisor.nameBn : advisor.nameEn)?.[0] || 'A'}
                </div>
                <div>
                  <span className="block font-bold text-dark text-sm font-bn">
                    {isBn ? advisor.nameBn : advisor.nameEn}
                  </span>
                  <span className="text-xs text-secondary font-bold font-bn">
                    {isBn ? advisor.roleBn : advisor.roleEn}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;
