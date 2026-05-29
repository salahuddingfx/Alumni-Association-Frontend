import React, { useEffect, useState } from 'react';
import { useSettings } from '../../context/settings.jsx';
import { useTranslation } from 'react-i18next';

const IntroLoader = () => {
  const { settings, loading } = useSettings();
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [forceOut, setForceOut] = useState(false);

  const [progress, setProgress] = useState(0);
  const [sloganIndex, setSloganIndex] = useState(0);

  const slogans = isBn
    ? ['স্মৃতির আঙিনায়...', 'বাঁধন চিরন্তন...', 'পুনর্মিলনের আনন্দে...', 'প্রস্তুত হচ্ছে...']
    : ['Courtyard of memories...', 'Bonds are eternal...', 'Joy of reunion...', 'Getting ready...'];

  useEffect(() => {
    // Lock background scrolling
    document.body.style.overflow = 'hidden';
    
    // Minimum display time of 1.5 seconds
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1500);

    // Failsafe: force loader to fade out after 3.5 seconds even if settings are slow to load
    const failsafeTimer = setTimeout(() => {
      setForceOut(true);
    }, 3500);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
      clearTimeout(failsafeTimer);
    };
  }, []);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4; // increment randomly
      });
    }, 45);

    // Cycle through status messages/slogans
    const sloganInterval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(sloganInterval);
    };
  }, [slogans.length]);

  useEffect(() => {
    // Only fade out and unmount once the minimum time has elapsed AND settings are loaded, OR if failsafe triggered
    if ((minTimeElapsed && !loading) || forceOut) {
      // Complete progress bar instantly on fade-out
      setProgress(100);
      setFade(true);
      
      const timerVisible = setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = 'unset';
      }, 700); // Wait for transition animation to complete (duration-700)

      return () => clearTimeout(timerVisible);
    }
  }, [minTimeElapsed, loading, forceOut]);

  if (!visible) return null;

  const siteTitle = settings.siteTitleBn || 'প্রাক্তন শিক্ষার্থী পরিষদ';
  const schoolName = isBn ? (settings.schoolNameBn || 'ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়') : (settings.schoolNameEn || 'Dhuapalong Govt. Primary School');

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#030d1a] flex flex-col items-center justify-center transition-all duration-700 ease-in-out overflow-hidden ${
      fade ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
    }`}>
      {/* Aurora Glow Effects in Background */}
      <div className="absolute w-96 h-96 bg-primary/15 rounded-full blur-[100px] top-[10%] left-[10%] animate-float-slow pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] bottom-[15%] right-[10%] animate-float-slow-reverse pointer-events-none"></div>

      {/* Central Glassmorphic Card */}
      <div className="relative flex flex-col items-center max-w-sm w-full mx-4 p-8 rounded-3xl backdrop-blur-md bg-white/[0.02] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6 text-center z-10 animate-in fade-in zoom-in duration-300">
        
        {/* Revolving Orbit Circle Container */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Rotating dashed outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-secondary/40 animate-spin [animation-duration:12s]"></div>
          
          {/* Logo container */}
          <div className="relative w-20 h-20 bg-[#071426] rounded-full overflow-hidden border-2 border-white/20 flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-300">
            <img src="/alumni_logo.png" className="w-full h-full object-cover" alt="Logo" />
          </div>
        </div>

        {/* Branding Info */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-bn tracking-wide">
            {siteTitle}
          </h1>
          <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase max-w-[280px] mx-auto leading-relaxed">
            {schoolName}
          </p>
        </div>

        {/* Fading Slogans */}
        <div className="h-6 flex items-center justify-center">
          <p key={sloganIndex} className="text-xs text-secondary font-bold font-bn tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-300">
            {slogans[sloganIndex]}
          </p>
        </div>

        {/* Premium Progress Bar & Percentage */}
        <div className="w-48 space-y-2">
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold tracking-widest font-mono">
            <span>LOADING</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-secondary rounded-full transition-all duration-150 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IntroLoader;
