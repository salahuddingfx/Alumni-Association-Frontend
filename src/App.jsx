import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Committee from './pages/Committee.jsx';
import Members from './pages/Members.jsx';
import Events from './pages/Events.jsx';
import Notices from './pages/Notices.jsx';
import Gallery from './pages/Gallery.jsx';
import Donation from './pages/Donation.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Developer from './pages/Developer.jsx';
import Policies from './pages/Policies.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import Blog from './pages/Blog.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

const App = () => {
  return (
    <MainLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/committee" element={<Committee />} />
        <Route path="/members" element={<Members />} />
        <Route path="/events" element={<Events />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/privacy-policy" element={<Policies />} />
        <Route path="/terms-conditions" element={<Policies />} />
        <Route path="/refund-policy" element={<Policies />} />
        <Route path="/cookie-policy" element={<Policies />} />
        <Route path="*" element={
          <div className="py-20 text-center">
            <h1 className="text-4xl font-bold text-primary">404 - Not Found</h1>
            <p className="mt-2 text-gray-500">The page you are looking for does not exist.</p>
          </div>
        } />
      </Routes>
    </MainLayout>
  );
};

export default App;
