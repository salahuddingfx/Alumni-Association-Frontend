import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Github, Linkedin, Code, User, Award } from 'lucide-react';

const Developer = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <div className="py-16 px-6 max-w-4xl mx-auto">
      {/* Premium Profile Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl flex flex-col md:flex-row items-center p-8 md:p-12 space-y-8 md:space-y-0 md:space-x-12 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
        
        {/* Avatar Placeholder */}
        <div className="w-40 h-40 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border-4 border-secondary shadow-lg shrink-0">
          <User size={64} />
        </div>

        {/* Developer Bio */}
        <div className="flex-grow space-y-4 text-center md:text-left">
          <div>
            <span className="bg-secondary/15 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Lead Developer
            </span>
            <h1 className="text-3xl font-extrabold text-primary font-bn mt-2">
              Salah Uddin Kader
            </h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">Full Stack Developer & Software Architect</p>
          </div>

          <p className="text-gray-600 font-bn leading-relaxed text-sm">
            {isBn
              ? 'সালাহ উদ্দিন কাদের একজন দক্ষ ওয়েব ডেভেলপার যিনি "প্রাক্তন পরিষদ" প্লাটফর্মের ডিজাইন ও ডেভেলপমেন্টের সম্পূর্ণ দায়িত্ব দক্ষতার সাথে পরিচালনা করেছেন।'
              : 'Salah Uddin Kader is the chief architect and developer of the Practon Alumni Association platform, specializing in modern MERN stacks, sockets, and scalable software engines.'}
          </p>

          {/* Social connections */}
          <div className="pt-2 flex justify-center md:justify-start space-x-3 text-gray-400">
            <a href="mailto:salahuddinkader@example.com" className="hover:text-primary transition-colors p-2 bg-slate-50 hover:bg-slate-100 rounded-full border border-gray-200">
              <Mail size={18} />
            </a>
            <a href="https://github.com" className="hover:text-primary transition-colors p-2 bg-slate-50 hover:bg-slate-100 rounded-full border border-gray-200">
              <Github size={18} />
            </a>
            <a href="https://linkedin.com" className="hover:text-primary transition-colors p-2 bg-slate-50 hover:bg-slate-100 rounded-full border border-gray-200">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Tech Contributions Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-gray-150 space-y-3">
          <div className="flex items-center space-x-2 text-primary">
            <Code size={20} className="text-secondary" />
            <h3 className="font-bold text-lg">Platform Architecture</h3>
          </div>
          <p className="text-sm text-gray-600 font-bn">
            {isBn
              ? 'নিরাপদ রিয়েল-টাইম সকেট সার্ভিস, ডাটাবেজ ক্যাশিং ইঞ্জিন এবং রানিং কনফিগারেশন এর সম্পূর্ণ স্ট্রাকচার গঠন।'
              : 'Secured MERN architecture setup with live notification pipelines, cookie configurations, and custom Banglish transliteration.'}
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-gray-150 space-y-3">
          <div className="flex items-center space-x-2 text-primary">
            <Award size={20} className="text-secondary" />
            <h3 className="font-bold text-lg">UI Excellence</h3>
          </div>
          <p className="text-sm text-gray-600 font-bn">
            {isBn
              ? 'গতিশীল ওয়েভ লেআউটস এবং আধুনিক এনিমেশন থিম ব্যবহারের মাধ্যমে প্রিমিয়াম ইউজার এক্সপেরিয়েন্স প্রদান।'
              : 'Institutional brand design system mapping elegant curves, wave transitions, responsive forms, and beautiful dark modes.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Developer;
