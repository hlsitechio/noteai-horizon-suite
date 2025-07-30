import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDynamicSEO } from '@/hooks/useDynamicSEO';

interface DynamicSEOOptimizerProps {
  pagePath: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackKeywords?: string[];
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  structuredData?: any;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  faqData?: Array<{
    question: string;
    answer: string;
  }>;
}

const DynamicSEOOptimizer: React.FC<DynamicSEOOptimizerProps> = ({
  pagePath,
  fallbackTitle,
  fallbackDescription,
  fallbackKeywords,
  ogImage = '/api/placeholder/1200/630',
  ogType = 'website',
  noIndex = false,
  structuredData,
  breadcrumbs,
  faqData
}) => {
  const seoData = useDynamicSEO(pagePath);
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const siteName = 'Online Note AI';
  
  // Use dynamic data with fallbacks
  const title = seoData.title || fallbackTitle || 'Online Note AI - Smart Note-Taking with AI';
  const description = seoData.description || fallbackDescription || 'Transform your productivity with AI-powered note-taking.';
  const keywords = seoData.keywords || fallbackKeywords || ['ai notes', 'smart note taking', 'productivity'];
  const canonicalUrl = seoData.canonicalUrl || currentUrl;

  // Generate structured data
  const generateStructuredData = () => {
    const schemas: any[] = [];

    // Base organization schema
    const organization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName,
      "url": "https://onlinenote.ai",
      "logo": "/logo.png",
      "description": description,
    };
    schemas.push(organization);

    // Software Application schema
    const softwareApp = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": siteName,
      "description": description,
      "url": "https://onlinenote.ai",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "2547"
      }
    };
    schemas.push(softwareApp);

    // Breadcrumbs schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": breadcrumb.name,
          "item": breadcrumb.url
        }))
      };
      schemas.push(breadcrumbList);
    }

    // FAQ schema
    if (faqData && faqData.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
      schemas.push(faqSchema);
    }

    return structuredData || schemas;
  };

  const finalStructuredData = generateStructuredData();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={seoData.ogTitle || title} />
      <meta property="og:description" content={seoData.ogDescription || description} />
      <meta property="og:image" content={seoData.ogImage || ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.ogTitle || title} />
      <meta name="twitter:description" content={seoData.ogDescription || description} />
      <meta name="twitter:image" content={seoData.ogImage || ogImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content={siteName} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      
      {/* Structured Data */}
      {Array.isArray(finalStructuredData) 
        ? finalStructuredData.map((schema, index) => (
            <script key={index} type="application/ld+json">
              {JSON.stringify(schema)}
            </script>
          ))
        : (
            <script type="application/ld+json">
              {JSON.stringify(finalStructuredData)}
            </script>
          )
      }
      
      {/* Technical Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      
    </Helmet>
  );
};

export default DynamicSEOOptimizer;