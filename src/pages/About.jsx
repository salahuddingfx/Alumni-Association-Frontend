import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';

const About = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const timelineEvents = [
    {
      year: isBn ? '২০২৫ (জানুয়ারি)' : 'January 2025',
      titleEn: 'Foundation & Setup',
      titleBn: 'সংগঠনের শুভ সূচনা',
      descEn: 'The initial foundation of Practon Alumni Association was laid by our core founding members.',
      descBn: 'আমাদের সকল প্রাক্তন শিক্ষার্থীদের ঐক্যবদ্ধ করার লক্ষ্যে পরিষদের আনুষ্ঠানিকভাবে যাত্রা ও ভিত্তিপ্রস্তর স্থাপন।'
    },
    {
      year: isBn ? '২০২৫ (ঈদুল আজহা)' : 'Eid-ul-Adha 2025',
      titleEn: 'First Reunion & Meetup',
      titleBn: 'প্রথম পুনর্মিলনী ও গেট-টুগেদার',
      descEn: 'Our first historic grand reunion and meetup held during the festive season of Eid-ul-Adha with all alumni.',
      descBn: 'পবিত্র ঈদুল আজহার বরকতময় ছুটিতে আমাদের প্রথম ঐতিহাসিক পুনর্মিলনী ও সবার সাথে এক প্রাণবন্ত মিটআপ।'
    },
    {
      year: isBn ? '২০২৫ (সেপ্টেম্বর)' : 'September 2025',
      titleEn: 'Advisory Panel Selection',
      titleBn: 'উপদেষ্টা পরিষদ ও আহ্বায়ক কমিটি গঠন',
      descEn: 'Selection of our respected advisory panel and operational core committee to manage general tasks.',
      descBn: 'সংগঠনের সঠিক দিকনির্দেশনা ও দৈনন্দিন কার্যক্রম পরিচালনায় সম্মানিত উপদেষ্টা পরিষদ গঠন।'
    },
    {
      year: isBn ? '২০২৫ (ডিসেম্বর)' : 'December 2025',
      titleEn: 'Constitution Drafted',
      titleBn: 'খসড়া গঠনতন্ত্র অনুমোদন',
      descEn: 'Formulation and approval of the association constitution to guide operations transparently.',
      descBn: 'পরিষদকে নিয়মতান্ত্রিক ও স্বচ্ছ উপায়ে পরিচালনার লক্ষ্যে খসড়া গঠনতন্ত্র প্রণয়ন ও সদস্যদের অনুমোদন।'
    },
    {
      year: isBn ? '২০২৬ (জানুয়ারি)' : 'January 2026',
      titleEn: 'Alumni Welfare Fund',
      titleBn: 'কল্যাণ ও সেবা তহবিল চালুকরণ',
      descEn: 'Established welfare funds to support batchmates and current students in emergency scenarios.',
      descBn: 'বিপদে পড়া প্রাক্তন সদস্য এবং মেধাবী ছাত্র-ছাত্রীদের তাৎক্ষণিক সাহায্যার্থে বিশেষ কল্যাণ তহবিল গঠন।'
    },
    {
      year: isBn ? '২০২৬ (মার্চ)' : 'March 2026',
      titleEn: 'Global Network Connect',
      titleBn: 'গ্লোবাল মেম্বার ডিরেক্টরি',
      descEn: 'Initiated the registration phase to catalog directory profiles of members residing across the globe.',
      descBn: 'সারা বিশ্বে ছড়িয়ে থাকা সদস্যদের এক ছাদের নিচে আনতে বৈশ্বিক মেম্বার ডিরেক্টরি চালুকরণ।'
    },
    {
      year: isBn ? '২০২৬ (মে)' : 'May 2026',
      titleEn: 'MERN Stack Web Portal',
      titleBn: 'ডিজিটাল ওয়েব ইঞ্জিনিয়ারিং',
      descEn: 'Salah Uddin Kader (Dpian) engineered the modern responsive MERN Stack web platform.',
      descBn: 'সালাহ উদ্দিন কাদের (Dpian) কর্তৃক আধুনিক ও সিকিউরড এমইআরএন স্ট্যাক প্ল্যাটফর্মের ডিজাইন ও কোডিং।'
    },
    {
      year: isBn ? '২০২৬ (ডিসেম্বর)' : 'December 2026',
      titleEn: 'Grand Reunion Planning',
      titleBn: 'বার্ষিক গ্র্যান্ড রিইউনিয়ন পরিকল্পনা',
      descEn: 'Finished structural blueprints for the grand reunion ceremony to bring everyone home once again.',
      descBn: 'পরবর্তী চমৎকার ও জাঁকজমকপূর্ণ বার্ষিক পুনর্মিলনী মিলনমেলার সুনির্দিষ্ট পরিকল্পনা ও রূপরেখা নির্ধারণ।'
    }
  ];

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-20 overflow-hidden">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-primary font-bn">
          {isBn ? 'আমাদের ইতিহাস ও লক্ষ্য' : 'Our History & Mission'}
        </h1>
        <p className="mt-4 text-gray-600 text-lg font-bn">
          {isBn
            ? '২০২৫ থেকে শুরু হওয়া আমাদের গৌরবময় পথচলার ইতিহাস ও ভবিষ্যৎ রূপরেখা।'
            : 'The historical timeline of our journey starting from 2025 and our future roadmap.'}
        </p>
      </div>

      {/* ⏳ TIMELINE COMPONENT */}
      <div ref={containerRef} className="relative max-w-5xl mx-auto py-10">
        {/* Background static line */}
        <div className="absolute left-6 -ml-[2px] md:left-1/2 md:-ml-[2px] h-full w-1 bg-slate-200 rounded-full" />
        
        {/* Scroll-drawing progress line */}
        <motion.div
          style={{ scaleY }}
          className="absolute left-6 -ml-[2px] md:left-1/2 md:-ml-[2px] h-full w-1 bg-secondary origin-top rounded-full z-10"
        />

        <div className="space-y-12">
          {timelineEvents.map((event, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="relative flex flex-col md:flex-row items-center justify-between w-full">
                
                {/* Left Side Content (If Even) - Hidden on Mobile if Odd */}
                <div className={`w-full md:w-[calc(50%-30px)] flex justify-end order-2 md:order-1 ${isEven ? 'block' : 'hidden md:block opacity-0 pointer-events-none'}`}>
                  {isEven && (
                    <motion.div
                      initial={{ opacity: 0, x: -50, scale: 0.95 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ type: "spring", stiffness: 60, damping: 15 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md w-full relative group cursor-pointer ml-12 md:ml-0"
                    >
                      <span className="text-secondary font-bold text-sm bg-secondary/10 px-3 py-1 rounded-full">{event.year}</span>
                      <h3 className="font-extrabold text-lg text-primary font-bn mt-4 group-hover:text-secondary transition-colors">
                        {isBn ? event.titleBn : event.titleEn}
                      </h3>
                      <p className="text-sm text-gray-600 font-bn mt-2 leading-relaxed">
                        {isBn ? event.descBn : event.descEn}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Center dot (Centered on Desktop, Left-aligned on Mobile) */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  className="absolute left-6 -ml-[10px] md:left-1/2 md:-ml-[10px] w-5 h-5 bg-white rounded-full border-4 border-secondary shadow-lg z-20"
                />

                {/* Right Side Content (If Odd) - Hidden on Mobile if Even */}
                <div className={`w-full md:w-[calc(50%-30px)] flex justify-start order-3 ${!isEven ? 'block' : 'hidden md:block opacity-0 pointer-events-none'}`}>
                  {!isEven && (
                    <motion.div
                      initial={{ opacity: 0, x: 50, scale: 0.95 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ type: "spring", stiffness: 60, damping: 15 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md w-full relative group cursor-pointer ml-12 md:ml-0"
                    >
                      <span className="text-secondary font-bold text-sm bg-secondary/10 px-3 py-1 rounded-full">{event.year}</span>
                      <h3 className="font-extrabold text-lg text-primary font-bn mt-4 group-hover:text-secondary transition-colors">
                        {isBn ? event.titleBn : event.titleEn}
                      </h3>
                      <p className="text-sm text-gray-600 font-bn mt-2 leading-relaxed">
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

      {/* Advisor Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
        <div className="bg-slate-100 p-8 rounded-2xl border border-gray-200">
          <h3 className="text-xl font-bold text-primary font-bn">{isBn ? 'প্রধান উপদেষ্টার বাণী' : 'Message from Chief Advisor'}</h3>
          <p className="mt-4 text-gray-600 italic font-bn">
            {isBn
              ? '"আমাদের প্রাক্তন শিক্ষার্থীদের সাফল্য সবসময় আমাদের অনুপ্রেরণা জোগায়। আমরা সবাই একত্রিত হয়ে এই পরিষদকে আরও উচ্চতায় নিয়ে যাবো।"'
              : '"The success of our alumni is always our pride. Together, we will elevate this association to greater heights."'}
          </p>
          <div className="mt-6 flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full" />
            <div>
              <span className="block font-bold text-dark font-bn">{isBn ? 'অধ্যাপক ড. আব্দুল করিম' : 'Prof. Dr. Abdul Karim'}</span>
              <span className="text-xs text-gray-500">Chief Advisor</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 p-8 rounded-2xl border border-gray-200">
          <h3 className="text-xl font-bold text-primary font-bn">{isBn ? 'সাধারণ সম্পাদকের বার্তা' : 'Message from General Secretary'}</h3>
          <p className="mt-4 text-gray-600 italic font-bn">
            {isBn
              ? '"প্রাক্তন পরিষদ শুধু একটি সংগঠন নয়, এটি আমাদের আবেগ ও সংস্কৃতির অবিচ্ছেদ্য অংশ। আসুন সবাই কাঁধে কাঁধ মিলিয়ে কাজ করি।"'
              : '"This association is not just an organization, it is an emotion and a family. Let us work shoulder to shoulder."'}
          </p>
          <div className="mt-6 flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full" />
            <div>
              <span className="block font-bold text-dark font-bn">{isBn ? 'জনাব আশরাফুল ইসলাম' : 'Ashraful Islam'}</span>
              <span className="text-xs text-gray-500">General Secretary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
