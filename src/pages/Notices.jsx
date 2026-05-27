import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { Megaphone, Pin, X, Calendar, AlertTriangle } from 'lucide-react';
import NoticeSkeleton from '../components/ui/NoticeSkeleton.jsx';

const Notices = () => {
  const { i18n } = useTranslation();
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const isBn = i18n.language === 'bn';

  useEffect(() => {
    setLoading(true);
    api.get('/notices')
      .then(res => {
        if (res.data.success) {
          setNotices(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching notices:', err))
      .finally(() => setLoading(false));
  }, []);

  const displayNotices = notices.length > 0 ? notices : [
    {
      _id: '1',
      title: { en: 'Annual General Meeting 2026', bn: 'বার্ষিক সাধারণ সভা ২০২৬' },
      content: { en: 'All registered alumni are invited to attend the AGM on Dec 20, 2026. Important elections for executive committee seats will be held. Food and refreshments will be provided.', bn: 'সকল নিবন্ধিত সদস্যদের ২০ ডিসেম্বর ২০২৬ তারিখে বার্ষিক সাধারণ সভায় উপস্থিত থাকার অনুরোধ করা হলো। কার্যনির্বাহী কমিটির সদস্য নির্বাচনে ভোট প্রদানের নিয়মাবলী নির্ধারণ করা হবে।' },
      priority: 'high',
      isSticky: true,
      publishDate: '2026-05-20'
    },
    {
      _id: '2',
      title: { en: 'Alumni Membership Fees Update', bn: 'সদস্যপদ ফি সংক্রান্ত বিজ্ঞপ্তি' },
      content: { en: 'Please renew your annual membership to keep profile features active and secure voting rights for the upcoming committee changes.', bn: 'আপনার সদস্যপদ নবায়ন করুন এবং সদস্য সেবা সচল রাখুন। বিস্তারিত বিবরণ আমাদের ব্যাংক অ্যাকাউন্টে জমা দেওয়ার রশিদ সহ প্রেরন করুন।' },
      priority: 'medium',
      isSticky: false,
      publishDate: '2026-05-18'
    }
  ];

  return (
    <div className="py-16 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary font-bn">
          {isBn ? 'নোটিশ বোর্ড' : 'Notice Board'}
        </h1>
        <p className="mt-4 text-gray-600">
          {isBn ? 'পরিষদ এবং শিক্ষাপ্রতিষ্ঠানের সকল গুরুত্বপূর্ণ নোটিশ ও ঘোষণা।' : 'All important notices, files, and circulars of the association.'}
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <NoticeSkeleton key={i} />)
        ) : displayNotices.length > 0 ? (
          displayNotices.map((notice) => (
            <div key={notice._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative flex flex-col justify-between hover:shadow-md transition">
              {notice.isSticky && (
                <span className="absolute top-4 right-4 text-secondary flex items-center space-x-1 text-xs font-bold uppercase">
                  <Pin size={14} className="transform rotate-45" />
                  <span>Featured</span>
                </span>
              )}
              <div>
                <div className="flex items-center space-x-2.5 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${
                    notice.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {notice.priority}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(notice.publishDate).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-primary font-bn">
                  {isBn ? notice.title.bn : notice.title.en}
                </h3>
                <p className="mt-3 text-gray-600 font-bn text-sm line-clamp-2">
                  {isBn ? notice.content.bn : notice.content.en}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedNotice(notice)}
                  className="text-secondary hover:text-primary text-sm font-bold flex items-center space-x-1"
                >
                  <span>{isBn ? 'বিস্তারিত দেখুন' : 'Read Notice Detail'} &rarr;</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 font-bn">
            {isBn ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No notices found.'}
          </div>
        )}
      </div>

      {/* Notice Detail Preview Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Megaphone size={20} className="text-secondary" />
                <span className="font-bold text-sm uppercase tracking-wider">{isBn ? 'নোটিশ বিবরণী' : 'Notice Details'}</span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div>
                <div className="flex items-center space-x-2.5 mb-2 text-xs">
                  <span className={`px-2 py-0.5 font-bold rounded-full uppercase ${
                    selectedNotice.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedNotice.priority} {isBn ? 'গুরুত্বপূর্ণ' : 'Priority'}
                  </span>
                  <span className="text-gray-500 flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{new Date(selectedNotice.publishDate).toLocaleDateString()}</span>
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-primary font-bn leading-tight">
                  {isBn ? selectedNotice.title.bn : selectedNotice.title.en}
                </h2>
              </div>

              <div className="text-gray-700 font-bn text-base leading-relaxed whitespace-pre-line border-t border-gray-150 pt-4">
                {isBn ? selectedNotice.content.bn : selectedNotice.content.en}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2 rounded-lg text-sm transition"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
