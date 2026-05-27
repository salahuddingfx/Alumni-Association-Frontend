import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, FileText, RefreshCw, Cookie } from 'lucide-react';

const Policies = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isBn = i18n.language === 'bn';
  const path = location.pathname;

  const getPolicyContent = () => {
    switch (path) {
      case '/privacy-policy':
        return {
          title: isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy',
          icon: <Shield size={28} className="text-secondary" />,
          content: isBn
            ? `আমরা আপনার গোপনীয়তাকে অত্যন্ত গুরুত্ব সহকারে বিবেচনা করি। আমাদের প্রাক্তন পরিষদ প্ল্যাটফর্ম ব্যবহারের সময় আপনার ব্যক্তিগত তথ্য সুরক্ষায় আমরা প্রতিশ্রুতিবদ্ধ। 
            
            ১. তথ্য সংগ্রহ: আমরা আপনার নাম, ইমেইল, ব্যাচ এবং প্রোফাইল ছবি সংগ্রহ করি যা শুধুমাত্র সদস্য তালিকা প্রদর্শনে ব্যবহৃত হয়।
            ২. তথ্য ব্যবহার: আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের সাথে শেয়ার করা হয় না।
            ৩. নিরাপত্তা: আমরা আপনার তথ্য সুরক্ষায় উন্নত নিরাপত্তা প্রোটোকল ব্যবহার করি।`
            : `We prioritize your privacy. We are committed to protecting your personal information when using the Practon Alumni platform.
            
            1. Information Collection: We collect your name, email, batch, and profile image solely for profile directory listings.
            2. Data Usage: Your personal data is never sold or shared with third-party providers.
            3. Security: We implement modern security standards to safeguard your information.`
        };
      case '/terms-conditions':
        return {
          title: isBn ? 'শর্তাবলী এবং নিয়মাবলী' : 'Terms and Conditions',
          icon: <FileText size={28} className="text-secondary" />,
          content: isBn
            ? `প্রাক্তন পরিষদ প্ল্যাটফর্ম ব্যবহারের ক্ষেত্রে নিম্নোক্ত শর্তাবলী প্রযোজ্য হবে:
            
            ১. একাউন্ট সত্যতা: সকল সদস্যকে অবশ্যই তাদের সঠিক প্রাতিষ্ঠানিক তথ্য প্রদান করতে হবে।
            ২. নৈতিক ব্যবহার: কোনো প্রকার আপত্তিকর মন্তব্য, তথ্য বিকৃতি বা উস্কানিমূলক পোস্ট করা থেকে বিরত থাকতে হবে।
            ৩. নিষেধাজ্ঞা: নির্দেশাবলী অমান্য করলে এডমিন প্যানেল যেকোনো সদস্যের অ্যাকাউন্ট স্থগিত করার অধিকার রাখে।`
            : `By accessing this platform, you agree to the following terms and conditions:
            
            1. Account Authenticity: Members must provide accurate institutional, batch, and contact details.
            2. Responsible Use: Any offensive posts, misinformation, or harassment is strictly prohibited.
            3. Suspensions: The Admin Panel reserves the right to suspend any account violating community guidelines.`
        };
      case '/refund-policy':
        return {
          title: isBn ? 'রিফান্ড ও ফেরত নীতি' : 'Refund Policy',
          icon: <RefreshCw size={28} className="text-secondary" />,
          content: isBn
            ? `আমাদের ইভেন্ট রেজিস্ট্রেশন এবং ডোনেশন সংক্রান্ত রিফান্ড পলিসি নিচে দেওয়া হলো:
            
            ১. ডোনেশন রিফান্ড: প্রদানকৃত অনুদান কোনোভাবেই ফেরতযোগ্য নয়।
            ২. ইভেন্ট ফি রিফান্ড: ইভেন্ট শুরুর কমপক্ষে ৭ দিন আগে অনুরোধ করলে নির্দিষ্ট ফি কেটে রিফান্ড প্রদান করা হতে পারে।
            ৩. পদ্ধতি: যেকোনো রিফান্ড সংক্রান্ত জিজ্ঞাসার জন্য support@practonalumni.org ইমেইলে যোগাযোগ করুন।`
            : `Our refund policy regarding event fees and donations includes:
            
            1. Donations: All voluntary financial donations are non-refundable.
            2. Event Registrations: Event cancellation refunds can be requested up to 7 days before the scheduled date.
            3. Contact: For any refund-related assistance, email support@practonalumni.org.`
        };
      case '/cookie-policy':
      default:
        return {
          title: isBn ? 'কুকি পলিসি' : 'Cookie Policy',
          icon: <Cookie size={28} className="text-secondary" />,
          content: isBn
            ? `আমরা ইউজার এক্সপেরিয়েন্স উন্নত করতে কুকি ব্যবহার করি:
            
            ১. কার্যকারীতা: কুকি আপনার সেশন ধরে রাখতে এবং ভাষা প্রোভাইডার মনে রাখতে সাহায্য করে।
            ২. নিরাপত্তা: এটি আপনার একাউন্ট সেশনের নিরাপত্তা বাড়ায়।`
            : `We use cookies to enhance your browsing experience:
            
            1. Functionality: Cookies help remember your session and language selector settings.
            2. Security: Cookies are used to secure your authenticated requests.`
        };
    }
  };

  const { title, icon, content } = getPolicyContent();

  return (
    <div className="py-16 px-6 max-w-4xl mx-auto">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 pb-6 border-b border-gray-150">
          {icon}
          <h1 className="text-3xl font-extrabold text-primary font-bn">{title}</h1>
        </div>

        <div className="text-gray-700 font-bn text-base leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Policies;
