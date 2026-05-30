import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Github, Globe, Twitter, Linkedin, Mail, ExternalLink,
  Code2, Server, Layers, Smartphone, Palette, Zap, Shield, Database
} from 'lucide-react';
import SEO from '../components/SEO';

const GITHUB_USERNAME = 'salahuddingfx';
const AVATAR_URL = `https://github.com/${GITHUB_USERNAME}.png`;
const PORTFOLIO_URL = 'https://salahuddin.codes';
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;
const TWITTER_URL = `https://twitter.com/${GITHUB_USERNAME}`;
const LINKEDIN_URL = `https://linkedin.com/in/${GITHUB_USERNAME}`;
const EMAIL = 'info.salahuddinkader@gmail.com';

const skills = [
  { label: 'React / Vite', level: 95, color: '#61DAFB' },
  { label: 'Node.js / Express', level: 92, color: '#68A063' },
  { label: 'MongoDB / Mongoose', level: 88, color: '#47A248' },
  { label: 'Socket.io', level: 85, color: '#F9A826' },
  { label: 'Tailwind CSS', level: 96, color: '#38BDF8' },
  { label: 'REST API Design', level: 90, color: '#A78BFA' },
];

const contributions = [
  {
    icon: <Layers size={22} />,
    title: 'Platform Architecture',
    titleBn: 'প্ল্যাটফর্ম আর্কিটেকচার',
    desc: 'Full MERN stack design with role-based auth, JWT token rotation, Socket.io real-time pipelines, and Cloudinary CDN media delivery.',
    descBn: 'রোল-ভিত্তিক অথেন্টিকেশন, JWT টোকেন রোটেশন, Socket.io রিয়েল-টাইম পাইপলাইন এবং Cloudinary CDN মিডিয়া ডেলিভারি সহ সম্পূর্ণ MERN স্ট্যাক ডিজাইন।',
    color: '#003B73',
  },
  {
    icon: <Palette size={22} />,
    title: 'UI / UX Design',
    titleBn: 'ইউআই / ইউএক্স ডিজাইন',
    desc: 'Glassmorphism, wave animations, dark mode, bilingual (BN/EN) layout, responsive grids, and premium micro-interaction design systems.',
    descBn: 'গ্লাসমরফিজম, ওয়েভ অ্যানিমেশন, ডার্ক মোড, দ্বিভাষিক (BN/EN) লেআউট, রেসপন্সিভ গ্রিড এবং প্রিমিয়াম মাইক্রো-ইন্টারঅ্যাকশন ডিজাইন সিস্টেম।',
    color: '#F9A826',
  },
  {
    icon: <Database size={22} />,
    title: 'Database & API',
    titleBn: 'ডেটাবেজ ও API',
    desc: 'Mongoose schema design, pagination, aggregation pipelines, Zod validation, audit logging, and multi-role admin REST API.',
    descBn: 'Mongoose স্কিমা ডিজাইন, পেজিনেশন, অ্যাগ্রিগেশন পাইপলাইন, Zod ভ্যালিডেশন, অডিট লগিং এবং মাল্টি-রোল অ্যাডমিন REST API।',
    color: '#4FC3F7',
  },
  {
    icon: <Shield size={22} />,
    title: 'Security & Auth',
    titleBn: 'নিরাপত্তা ও অথ',
    desc: 'Helmet.js HTTP headers, bcrypt password hashing, HttpOnly JWT cookies, rate limiting, CORS whitelist, and RBAC middleware.',
    descBn: 'Helmet.js HTTP হেডার, bcrypt পাসওয়ার্ড হ্যাশিং, HttpOnly JWT কুকি, রেট লিমিটিং, CORS হোয়াইটলিস্ট এবং RBAC মিডলওয়্যার।',
    color: '#EF4444',
  },
  {
    icon: <Smartphone size={22} />,
    title: 'Bilingual System',
    titleBn: 'দ্বিভাষিক সিস্টেম',
    desc: 'Full Bengali + English i18next integration with persistent language switching, locale-aware formatting, and Hind Siliguri typography.',
    descBn: 'স্থায়ী ভাষা পরিবর্তন, লোকেল-সচেতন ফরম্যাটিং এবং Hind Siliguri টাইপোগ্রাফি সহ সম্পূর্ণ বাংলা + ইংরেজি i18next ইন্টিগ্রেশন।',
    color: '#10B981',
  },
  {
    icon: <Zap size={22} />,
    title: 'Real-time Features',
    titleBn: 'রিয়েল-টাইম ফিচার',
    desc: 'Socket.io live notice broadcasting, admin room events, real-time member counters, and event registration push notifications.',
    descBn: 'Socket.io লাইভ নোটিশ ব্রডকাস্টিং, অ্যাডমিন রুম ইভেন্ট, রিয়েল-টাইম মেম্বার কাউন্টার এবং ইভেন্ট রেজিস্ট্রেশন পুশ নোটিফিকেশন।',
    color: '#8B5CF6',
  },
];

const techBadges = [
  'React 18', 'Vite 5', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose',
  'Socket.io', 'Tailwind CSS', 'JWT', 'Cloudinary', 'Nodemailer',
  'Brevo SMTP', 'Zod', 'Recharts', 'i18next', 'Swiper.js', 'Helmet.js',
  'Multer', 'bcryptjs', 'Lucide React',
];

const socialLinks = [
  {
    icon: <Globe size={17} />,
    label: 'Portfolio',
    href: PORTFOLIO_URL,
    display: 'salahuddin.codes',
    color: 'hover:bg-primary hover:text-white hover:border-primary',
  },
  {
    icon: <Github size={17} />,
    label: 'GitHub',
    href: GITHUB_URL,
    display: `@${GITHUB_USERNAME}`,
    color: 'hover:bg-gray-900 hover:text-white hover:border-gray-900',
  },
  {
    icon: <Twitter size={17} />,
    label: 'Twitter / X',
    href: TWITTER_URL,
    display: `@${GITHUB_USERNAME}`,
    color: 'hover:bg-sky-500 hover:text-white hover:border-sky-500',
  },
  {
    icon: <Linkedin size={17} />,
    label: 'LinkedIn',
    href: LINKEDIN_URL,
    display: `@${GITHUB_USERNAME}`,
    color: 'hover:bg-blue-600 hover:text-white hover:border-blue-600',
  },
  {
    icon: <Mail size={17} />,
    label: 'Email',
    href: `mailto:${EMAIL}`,
    display: EMAIL,
    color: 'hover:bg-secondary hover:text-primary hover:border-secondary',
  },
];

const Developer = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <SEO
        title="Developer — Practon Alumni"
        description="Meet Salah Uddin Kader, the full-stack developer behind the Practon Alumni Association platform."
      />

      <div className="min-h-screen py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* ── Hero Profile Card ── */}
          <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xl">

            {/* Top gradient banner */}
            <div
              className="h-44 w-full relative"
              style={{ background: 'linear-gradient(135deg, #003B73 0%, #0a5fa8 50%, #1a7fd4 100%)' }}
            >
              {/* Decorative circles */}
              <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-white/5 border border-white/10" />
              <div className="absolute top-10 right-20 w-12 h-12 rounded-full bg-white/5 border border-white/10" />
              <div className="absolute -bottom-1 left-0 right-0 h-8 bg-white rounded-t-3xl" />

              {/* Live badge */}
              <span className="absolute top-5 left-6 flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Available for Projects
              </span>
            </div>

            <div className="px-8 pb-10 -mt-16 relative">
              <div className="flex flex-col md:flex-row md:items-end gap-6">

                {/* Avatar */}
                <div className="shrink-0 relative">
                  <img
                    src={imgError ? `https://ui-avatars.com/api/?name=Salah+Uddin&background=003B73&color=fff&size=160` : AVATAR_URL}
                    alt="Salah Uddin Kader"
                    onError={() => setImgError(true)}
                    className="w-36 h-36 rounded-2xl object-cover border-4 border-white shadow-xl"
                  />
                  <span className="absolute -bottom-2 -right-2 bg-secondary text-primary text-[10px] font-extrabold px-2 py-1 rounded-lg shadow uppercase tracking-wide">
                    Dev
                  </span>
                </div>

                {/* Name + role */}
                <div className="flex-grow space-y-2 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-secondary/15 text-secondary text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                      Lead Developer
                    </span>
                    <span className="bg-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      Full Stack
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight leading-tight font-bn">
                    Salah Uddin Kader
                  </h1>
                  <p className="text-gray-500 text-sm font-semibold">
                    Software Architect · MERN Stack · UI/UX Engineer
                  </p>

                  <p className="text-gray-600 text-sm leading-relaxed max-w-xl font-bn pt-1">
                    {isBn
                      ? 'সালাহ উদ্দিন কাদের একজন দক্ষ ফুল-স্ট্যাক ওয়েব ডেভেলপার যিনি প্রাক্তন শিক্ষার্থী পরিষদ ডিজিটাল প্ল্যাটফর্মের সম্পূর্ণ আর্কিটেকচার, ডিজাইন এবং ডেভেলপমেন্ট পরিচালনা করেছেন।'
                      : 'Salah Uddin Kader is the sole architect and developer of the Practon Alumni Association platform — building everything from the real-time Socket.io backend to the bilingual Bengali/English UI design system.'}
                  </p>
                </div>

                {/* Portfolio CTA */}
                <div className="shrink-0 pb-1">
                  <a
                    href={PORTFOLIO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl hover:-translate-y-0.5 text-sm"
                  >
                    <Globe size={16} />
                    View Portfolio
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="mt-8 border-t border-gray-100" />

              {/* Social Links Row */}
              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.label !== 'Email' ? '_blank' : '_self'}
                    rel="noreferrer"
                    title={s.label}
                    className={`inline-flex items-center gap-2 border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${s.color}`}
                  >
                    {s.icon}
                    <span>{s.display}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Skill Bars ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Code2 size={18} />
              </div>
              <h2 className="text-xl font-extrabold text-primary">
                {isBn ? 'প্রযুক্তিগত দক্ষতা' : 'Technical Skills'}
              </h2>
            </div>

            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-semibold text-gray-700">{skill.label}</span>
                    <span className="text-xs font-bold text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%`, background: skill.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Contribution Cards Grid ── */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
                <Server size={18} />
              </div>
              <h2 className="text-xl font-extrabold text-primary">
                {isBn ? 'অবদান ও দায়িত্বসমূহ' : 'Contributions & Responsibilities'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {contributions.map((c) => (
                <div
                  key={c.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 space-y-3"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{ background: c.color }}
                  >
                    {c.icon}
                  </div>
                  <h3 className="font-extrabold text-gray-800 text-base">
                    {isBn ? c.titleBn : c.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-bn">
                    {isBn ? c.descBn : c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tech Stack Badges ── */}
          <div className="bg-gradient-to-br from-primary to-[#0a5fa8] rounded-3xl p-8 shadow-xl">
            <h2 className="text-white font-extrabold text-xl mb-6">
              {isBn ? '⚙️ টেকনোলজি স্ট্যাক' : '⚙️ Technology Stack'}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {techBadges.map((tech) => (
                <span
                  key={tech}
                  className="bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* ── Footer CTA ── */}
          <div className="text-center py-6 space-y-4">
            <p className="text-gray-500 text-sm font-bn">
              {isBn
                ? 'এই প্ল্যাটফর্মটি সম্পূর্ণ ভালোবাসা দিয়ে তৈরি করা হয়েছে।'
                : 'This platform was built with passion for the alumni community.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition shadow-lg text-sm"
              >
                <Globe size={15} /> salahuddin.codes
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition shadow-lg text-sm"
              >
                <Github size={15} /> GitHub
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition shadow-lg text-sm"
              >
                <Mail size={15} /> {isBn ? 'ইমেইল করুন' : 'Send Email'}
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Developer;
