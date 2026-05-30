import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useSettings } from '../context/settings.jsx';
import api from '../api/api.js';

const Contact = () => {
  const { i18n } = useTranslation();
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isBn = i18n.language === 'bn';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/contact', {
        name,
        email,
        subject,
        message,
      });

      if (res.data.success) {
        setSuccess(isBn ? 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Your message has been successfully sent!');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setError(res.data.message || (isBn ? 'বার্তা পাঠানো ব্যর্থ হয়েছে।' : 'Failed to send message.'));
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        (isBn ? 'সার্ভার সংযোগে সমস্যা হয়েছে।' : 'An error occurred while connecting to the server.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-primary font-bn">
          {isBn ? 'যোগাযোগ করুন' : 'Contact Us'}
        </h1>
        <p className="mt-4 text-gray-600">
          {isBn ? 'যেকোনো জিজ্ঞাসা অথবা তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।' : 'Get in touch with us for any queries, membership details, or corporate partnerships.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-primary font-bn mb-6 flex items-center space-x-2">
            <Send className="text-secondary" size={20} />
            <span>{isBn ? 'বার্তা পাঠান' : 'Send Message'}</span>
          </h3>

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-sm font-semibold">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-slate-50 border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:border-primary text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-slate-50 border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:border-primary text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Topic"
                className="w-full bg-slate-50 border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:border-primary text-sm"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
              <textarea
                rows={5}
                placeholder="Message Details..."
                className="w-full bg-slate-50 border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:border-primary text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg shadow-md transition disabled:opacity-50"
            >
              {loading ? (isBn ? 'পাঠানো হচ্ছে...' : 'Sending Message...') : (isBn ? 'বার্তা পাঠান' : 'Send Message')}
            </button>
          </form>
        </div>

        {/* Contact Details & Map */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="bg-slate-100 p-8 rounded-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-primary font-bn mb-6">আমাদের ঠিকানা</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MapPin className="text-secondary shrink-0" size={20} />
                <span className="font-bn">{isBn ? settings.addressBn : settings.addressEn}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Phone className="text-secondary shrink-0" size={20} />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail className="text-secondary shrink-0" size={20} />
                <span>{settings.email}</span>
              </div>
            </div>

            {/* Official Emails */}
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-2">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Official Emails</span>
              <p className="text-sm text-gray-700">General Info: <span className="font-semibold text-primary">{settings.email}</span></p>
              <p className="text-sm text-gray-700">Administrator: <span className="font-semibold text-primary">admin@{settings.email.split('@')[1] || 'practonalumni.org'}</span></p>
              <p className="text-sm text-gray-700">Support / Help: <span className="font-semibold text-primary">support@{settings.email.split('@')[1] || 'practonalumni.org'}</span></p>
            </div>
          </div>

          {/* Simple Map Placeholder */}
          <div className="h-48 bg-slate-200 rounded-2xl overflow-hidden border border-gray-300 relative flex items-center justify-center">
            <MapPin size={32} className="text-primary animate-bounce" />
            <span className="text-xs text-gray-500 font-bold uppercase ml-2">Google Map Integration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
