import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const SettingsContext = createContext(null);

export const defaultSettings = {
  schoolNameEn: 'Dhuapalong Govt. Primary School',
  schoolNameBn: 'ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়',
  siteTitleEn: 'Practon Alumni Association',
  siteTitleBn: 'প্রাক্তন শিক্ষার্থী পরিষদ',
  email: 'info@practonalumni.org',
  phone: '+880 1234 567890',
  addressEn: 'Dhuapalong, Cox\'s Bazar, Bangladesh',
  addressBn: 'ধোয়াপালং, কক্সবাজার, বাংলাদেশ',
  facebook: 'https://facebook.com',
  linkedin: 'https://linkedin.com',
  youtube: 'https://youtube.com',
  introVideoUrl: 'https://www.youtube.com/embed/9ycVq2kU7L0',
  bkash: '+880 1700 000000',
  nagad: '+880 1800 000000',
  rocket: '+880 1900 000000',
  eventDefaultFee: 1500,
  eventBatchFees: [
    { batches: '2010, 2011, 2012', fee: 1000 },
    { batches: '2013-2015', fee: 1200 },
    { batches: '2016-2020', fee: 800 }
  ],
  digitalFeeType: 'percentage', // 'percentage' or 'fixed'
  digitalFeeValue: 2, // 2%
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/general_settings');
      if (response.data.success && response.data.data) {
        setSettings({
          ...defaultSettings,
          ...response.data.data
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refetch: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
