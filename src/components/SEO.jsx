import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../utils/image';

const SEO = ({ title, description, image, url, type = 'website' }) => {
  const { i18n } = useTranslation();
  const defaultTitle = i18n.language === 'bn' 
    ? 'প্রাক্তন শিক্ষার্থী পরিষদ — ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়' 
    : 'Practon Alumni Association — Dhuapalong Govt. Primary School';
  
  const defaultDescription = i18n.language === 'bn'
    ? 'ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়ের সকল প্রাক্তন শিক্ষার্থীদের একত্রিত করার ডিজিটাল পোর্টাল।'
    : 'Official digital portal connecting all alumni of Dhuapalong Govt. Primary School.';
  
  const siteUrl = window.location.origin;
  const defaultImage = `${siteUrl}/alumni_logo.png`;

  const metaTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const metaDescription = description || defaultDescription;
  
  let metaImage = defaultImage;
  if (image) {
    metaImage = image.startsWith('http') ? image : getImageUrl(image);
  }

  const metaUrl = url ? `${siteUrl}${url}` : window.location.href;

  return (
    <Helmet>
      {/* General Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content="Practon Alumni Association" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
