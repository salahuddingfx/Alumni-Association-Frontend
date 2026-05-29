import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { useSettings } from '../../context/settings.jsx';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isBn = i18n.language === 'bn';
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterStatus(
        i18n.language === 'bn' 
          ? 'নিবন্ধন সফল হয়েছে!' 
          : 'Subscribed successfully!'
      );
      setEmail('');
      setTimeout(() => setNewsletterStatus(''), 4000);
    }
  };

  const navItems = [
    { path: '/', labelKey: 'home' },
    { path: '/about', labelKey: 'about' },
    { path: '/committee', labelKey: 'committee' },
    { path: '/members', labelKey: 'members' },
    { path: '/notices', labelKey: 'notices' },
    { path: '/events', labelKey: 'events' },
    { path: '/blog', labelKey: 'blog' },
    { path: '/contact', labelKey: 'contact' },
  ];

  return (
    <footer className="bg-dark text-white relative mt-16 pt-12">
      {/* Animated wave separator placeholder/SVG */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none transform -translate-y-[98%] pointer-events-none">
        <svg className="relative block w-full h-[60px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,90.35,26.85,160.85,45,228.87,63.7,321.39,56.44Z" className="fill-dark"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* About Widget */}
          <div className="col-span-2 md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-bold text-lg shrink-0">
                প
              </div>
              <span className="text-xl font-bold font-bn tracking-wide leading-snug">
                {settings?.siteTitleBn || 'প্রাক্তন শিক্ষার্থী পরিষদ'}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-bn">
              ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠানের প্রাক্তন শিক্ষার্থীদের একটি সংযোগ ও উন্নয়নের সেতু বন্ধন।
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-3 pt-2">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
              )}
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163c-.272-.997-1.057-1.782-2.054-2.054C19.63 3.5 12 3.5 12 3.5s-7.63 0-9.444.609c-1.004.272-1.782 1.057-2.054 2.054C0 7.978 0 12 0 12s0 4.022.556 5.837c.272.997 1.057 1.782 2.054 2.054C4.37 20.5 12 20.5 12 20.5s7.63 0 9.444-.609c1.004-.272 1.782-1.057 2.054-2.054C24 16.022 24 12 24 12s0-4.022-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              {navItems.slice(0, 4).map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-secondary transition-colors">
                    {t(`nav.${item.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Pages */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Information</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              {navItems.slice(4).map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-secondary transition-colors">
                    {t(`nav.${item.labelKey}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/developer" className="hover:text-secondary transition-colors font-semibold text-secondary">
                  {t('nav.developer')}
                </Link>
              </li>
              <li>
                <Link to="/donation" className="hover:text-secondary transition-colors">
                  Donation
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-secondary transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies Column */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Policies</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <Link to="/privacy-policy" className="hover:text-secondary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-secondary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-secondary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-secondary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact Info */}
          <div className="col-span-2 md:col-span-1 space-y-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Contact & Newsletter</h3>
            <p className="text-sm text-gray-400">Email: {settings.email}</p>
            <p className="text-sm text-gray-400">Phone: {settings.phone}</p>
            <form onSubmit={handleNewsletterSubmit} className="pt-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for Newsletter"
                  className="w-full bg-slate-800 text-white border border-slate-700 pl-3 pr-10 py-2 rounded text-sm focus:outline-none focus:border-secondary transition-all"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-secondary hover:bg-secondary/90 text-primary font-bold rounded flex items-center justify-center transition-colors"
                  aria-label="Subscribe"
                >
                  <Send size={16} />
                </button>
              </div>
              {newsletterStatus && (
                <p className="text-xs text-secondary mt-1.5 font-medium animate-fadeIn">
                  {newsletterStatus}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {isBn ? settings.schoolNameBn : settings.schoolNameEn}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
