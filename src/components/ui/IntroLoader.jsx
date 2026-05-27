import React, { useEffect, useState } from 'react';

const IntroLoader = () => {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Fade out starts at 1.5s
    const timerFade = setTimeout(() => {
      setFade(true);
    }, 1500);

    // Completely unmounts at 2.1s
    const timerVisible = setTimeout(() => {
      setVisible(false);
    }, 2100);

    return () => {
      clearTimeout(timerFade);
      clearTimeout(timerVisible);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#071426] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
      fade ? 'opacity-0 translate-y-[-100vh] pointer-events-none' : 'opacity-100 translate-y-0'
    }`}>
      <div className="relative flex flex-col items-center space-y-6">
        {/* Pulsing Logo Circle */}
        <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#003B73] to-[#F9A826] rounded-full shadow-[0_0_50px_rgba(249,168,38,0.25)] animate-pulse border-4 border-white/10">
          <span className="text-white text-4xl font-extrabold font-bn select-none transform transition-transform hover:scale-110">
            প
          </span>
          <div className="absolute inset-0 rounded-full border-2 border-[#F9A826]/30 animate-ping duration-1000"></div>
        </div>

        {/* Pulsing Text info */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-white font-bn tracking-wider animate-fadeIn">
            প্রাক্তন শিক্ষার্থী পরিষদ
          </h1>
          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
            Dhuapalong Govt. Primary School
          </p>
        </div>

        {/* Premium progress bar loader */}
        <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-[#003B73] via-[#F9A826] to-[#003B73] rounded-full animate-loadingBar"></div>
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
