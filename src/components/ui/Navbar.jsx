import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import { useSettings } from '../../context/settings.jsx';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isBn = i18n.language === 'bn';
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
    <header className="sticky top-0 z-50 glass-panel shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-secondary shadow-md">
              প
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary font-bn tracking-wide">
                {isBn ? settings.siteTitleBn : settings.siteTitleEn}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {isBn ? settings.schoolNameBn : settings.schoolNameEn}
              </span>
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
  );
};

export default Navbar;
