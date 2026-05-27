import React from 'react';
import Navbar from '../components/ui/Navbar.jsx';
import Footer from '../components/ui/Footer.jsx';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-english bg-slate-50">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
