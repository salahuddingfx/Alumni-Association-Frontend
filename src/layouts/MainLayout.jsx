import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Heart } from 'lucide-react';

const MainLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    i18n.changeLanguage(currentLang === 'bn' ? 'en' : 'bn');
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
    <div className="min-h-screen flex flex-col font-english bg-slate-50">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 glass-panel shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-secondary shadow-md">
                প
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary font-bn tracking-wide">প্রাক্তন পরিষদ</span>
                <span className="text-xs text-gray-500 font-medium">Practon Alumni Association</span>
              </div>
            </Link>

            {/* Desktop Navbar */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary border-b-2 border-secondary font-bold'
                        : 'text-gray-600 hover:text-primary hover:bg-slate-100'
                    }`
                  }
                >
                  {t(`nav.${item.labelKey}`)}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-semibold rounded-full border border-gray-300 transition"
              >
                <Globe size={14} className="text-primary" />
                <span>{i18n.language === 'bn' ? 'English' : 'বাংলা'}</span>
              </button>

              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="bg-primary text-white hover:bg-primary-dark px-4 py-1.5 rounded-full font-semibold text-sm transition shadow-md"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="border border-primary text-primary hover:bg-primary hover:text-white px-4 py-1.5 rounded-full font-semibold text-sm transition"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 text-gray-700 text-xs font-bold rounded-full border border-gray-300 transition"
              >
                <Globe size={12} />
                <span>{i18n.language === 'bn' ? 'EN' : 'বাংলা'}</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-primary focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg absolute w-full left-0 transition-all duration-300 ease-in-out">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-md text-base font-semibold ${
                      isActive ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700 hover:bg-slate-100'
                    }`
                  }
                >
                  {t(`nav.${item.labelKey}`)}
                </NavLink>
              ))}
              <div className="pt-4 pb-2 border-t border-gray-200 flex flex-col px-3 space-y-2">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block bg-primary text-white py-2 rounded-full font-bold text-center"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block border border-primary text-primary py-2 rounded-full font-semibold text-center hover:bg-primary hover:text-white"
                  >
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Premium Footer with Wave Dividers */}
      <footer className="bg-dark text-white relative mt-20 pt-10">
        {/* Animated wave separator placeholder/SVG */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none transform -translate-y-full">
          <svg className="relative block w-full h-[30px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,90.35,26.85,160.85,45,228.87,63.7,321.39,56.44Z" className="fill-dark"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* About Widget */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  প
                </div>
                <span className="text-xl font-bold font-bn tracking-wide">প্রাক্তন পরিষদ</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-bn">
                ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠানের প্রাক্তন শিক্ষার্থীদের একটি সংযোগ ও উন্নয়নের সেতু বন্ধন।
              </p>
              {/* Social Media Links */}
              <div className="flex space-x-3 pt-2">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163c-.272-.997-1.057-1.782-2.054-2.054C19.63 3.5 12 3.5 12 3.5s-7.63 0-9.444.609c-1.004.272-1.782 1.057-2.054 2.054C0 7.978 0 12 0 12s0 4.022.556 5.837c.272.997 1.057 1.782 2.054 2.054C4.37 20.5 12 20.5 12 20.5s7.63 0 9.444-.609c1.004-.272 1.782-1.057 2.054-2.054C24 16.022 24 12 24 12s0-4.022-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
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
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Information</h3>
              <ul className="space-y-2 text-sm text-gray-400">
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
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Policies</h3>
              <ul className="space-y-2 text-sm text-gray-400">
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
            <div className="space-y-4">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Contact Info</h3>
              <p className="text-sm text-gray-400">Email: info@practonalumni.org</p>
              <p className="text-sm text-gray-400">Phone: +880 1234 567890</p>
              <div className="pt-2">
                <input
                  type="email"
                  placeholder="Enter email for Newsletter"
                  className="w-full bg-slate-800 text-white border border-slate-700 px-3 py-2 rounded text-sm focus:outline-none focus:border-secondary"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Practon Alumni Association. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
