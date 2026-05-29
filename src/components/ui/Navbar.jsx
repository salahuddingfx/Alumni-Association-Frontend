import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useSettings } from '../../context/settings.jsx';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isBn = i18n.language === 'bn';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    i18n.changeLanguage(currentLang === 'bn' ? 'en' : 'bn');
  };

  const primaryNavItems = [
    { path: '/', labelKey: 'home' },
    { path: '/about', labelKey: 'about' },
    { path: '/members', labelKey: 'members' },
    { path: '/events', labelKey: 'events' },
    { path: '/contact', labelKey: 'contact' },
  ];

  const secondaryNavItems = [
    { path: '/committee', labelKey: 'committee' },
    { path: '/notices', labelKey: 'notices' },
    { path: '/blog', labelKey: 'blog' },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  return (
    <header className="sticky top-0 z-50 glass-panel shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-secondary shadow-md shrink-0">
              প
            </div>
            <div className="flex flex-col">
              <span className="text-base lg:text-[15px] xl:text-lg font-bold text-primary font-bn tracking-wide whitespace-nowrap">
                {isBn ? settings.siteTitleBn : settings.siteTitleEn}
              </span>
              <span className="text-[10px] xl:text-xs text-gray-500 font-medium whitespace-nowrap">
                {isBn ? settings.schoolNameBn : settings.schoolNameEn}
              </span>
            </div>
          </Link>

          {/* Desktop Navbar */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
            {primaryNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-2 xl:px-3 py-2 rounded-md text-[13px] xl:text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary border-b-2 border-secondary font-bold'
                      : 'text-gray-600 hover:text-primary hover:bg-slate-100'
                  }`
                }
              >
                {t(`nav.${item.labelKey}`)}
              </NavLink>
            ))}

            {/* More Dropdown */}
            <div 
              className="relative animate-in fade-in zoom-in-95 duration-100"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button 
                className={`flex items-center space-x-1 px-2.5 xl:px-3 py-2 rounded-md text-[13px] xl:text-sm font-medium transition-colors focus:outline-none ${
                  secondaryNavItems.some(item => location.pathname === item.path)
                    ? 'text-primary border-b-2 border-secondary font-bold'
                    : 'text-gray-600 hover:text-primary hover:bg-slate-100'
                }`}
              >
                <span>{isBn ? 'আরও' : 'More'}</span>
                <ChevronDown size={14} className={`transform transition-transform duration-200 ${moreOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>

              {moreOpen && (
                <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-250 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {secondaryNavItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMoreOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-primary/5 text-primary font-bold border-l-4 border-secondary'
                            : 'text-gray-700 hover:bg-slate-50 hover:text-primary'
                        }`
                      }
                    >
                      {t(`nav.${item.labelKey}`)}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-semibold rounded-full border border-gray-300 transition shrink-0"
            >
              <Globe size={14} className="text-primary" />
              <span>{i18n.language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-1.5 xl:space-x-2">
                <Link
                  to="/dashboard"
                  className="bg-primary text-white hover:bg-primary-dark px-3 xl:px-4 py-1.5 rounded-full font-semibold text-xs xl:text-sm transition shadow-md whitespace-nowrap"
                >
                  {isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 xl:px-4 py-1.5 rounded-full font-semibold text-xs xl:text-sm transition whitespace-nowrap"
                >
                  {isBn ? 'লগআউট' : 'Log Out'}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 xl:space-x-2">
                <Link
                  to="/login"
                  className="border border-primary text-primary hover:bg-primary hover:text-white px-3 xl:px-4 py-1.5 rounded-full font-semibold text-xs xl:text-sm transition whitespace-nowrap"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-secondary hover:bg-yellow-500 text-white px-3 xl:px-4 py-1.5 rounded-full font-semibold text-xs xl:text-sm transition shadow-sm whitespace-nowrap"
                >
                  {t('nav.register')}
                </Link>
              </div>
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
            {allNavItems.map((item) => (
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
            <div className="pt-3 pb-2 border-t border-gray-200 flex flex-col px-3 space-y-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block bg-primary text-white py-2 rounded-full font-bold text-center text-sm shadow-sm"
                  >
                    {isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full block border border-red-500 text-red-500 py-2 rounded-full font-semibold text-center hover:bg-red-500 hover:text-white text-sm"
                  >
                    {isBn ? 'লগআউট' : 'Log Out'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block border border-primary text-primary py-2 rounded-full font-semibold text-center hover:bg-primary hover:text-white text-sm"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full block bg-secondary text-white py-2 rounded-full font-bold text-center text-sm shadow-sm"
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
