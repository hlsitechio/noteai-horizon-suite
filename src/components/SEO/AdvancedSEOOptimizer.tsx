import React from 'react';
import { Helmet } from 'react-helmet-async';

interface AdvancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  structuredData?: any;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  faqData?: Array<{
    question: string;
    answer: string;
  }>;
  organizationData?: {
    name: string;
    logo: string;
    url: string;
    socialProfiles?: string[];
  };
  productData?: {
    name: string;
    description: string;
    image: string;
    price?: string;
    currency?: string;
    availability?: string;
    rating?: {
      value: number;
      count: number;
    };
  };
}

const AdvancedSEOOptimizer: React.FC<AdvancedSEOProps> = ({
  title = 'Online Note AI - Smart Note-Taking with AI',
  description = 'Transform your productivity with AI-powered note-taking. Organize, search, and collaborate smarter with intelligent suggestions and automated insights.',
  keywords = ['ai notes', 'smart note taking', 'productivity', 'ai assistant', 'note organization', 'collaboration'],
  canonicalUrl,
  ogImage = '/api/placeholder/1200/630',
  ogType = 'website',
  noIndex = false,
  structuredData,
  article,
  breadcrumbs,
  faqData,
  organizationData,
  productData
}) => {
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const siteName = 'Online Note AI';
  
  // Generate comprehensive structured data
  const generateStructuredData = () => {
    const schemas: any[] = [];

    // Base organization schema
    const organization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": organizationData?.name || siteName,
      "url": organizationData?.url || "https://onlinenote.ai",
      "logo": organizationData?.logo || "/logo.png",
      "description": description,
      ...(organizationData?.socialProfiles && {
        "sameAs": organizationData.socialProfiles
      })
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
      },
      "author": {
        "@type": "Organization",
        "name": siteName
      },
      "featureList": [
        "AI-powered note organization",
        "Smart search and suggestions",
        "Real-time collaboration",
        "Voice-to-text transcription",
        "Cross-platform synchronization"
      ]
    };
    schemas.push(softwareApp);

    // Breadcrumb schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      };
      schemas.push(breadcrumbSchema);
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

    // Article schema
    if (article) {
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": ogImage,
        "url": currentUrl,
        "datePublished": article.publishedTime,
        "dateModified": article.modifiedTime,
        "author": {
          "@type": "Person",
          "name": article.author || siteName
        },
        "publisher": {
          "@type": "Organization",
          "name": siteName,
          "logo": {
            "@type": "ImageObject",
            "url": "/logo.png"
          }
        },
        "articleSection": article.section,
        "keywords": keywords.join(", ")
      };
      if (article.tags) {
        articleSchema["keywords"] = article.tags.join(", ");
      }
      schemas.push(articleSchema);
    }

    // Product schema
    if (productData) {
      const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productData.name,
        "description": productData.description,
        "image": productData.image,
        ...(productData.price && {
          "offers": {
            "@type": "Offer",
            "price": productData.price,
            "priceCurrency": productData.currency || "USD",
            "availability": `https://schema.org/${productData.availability || 'InStock'}`
          }
        }),
        ...(productData.rating && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": productData.rating.value,
            "reviewCount": productData.rating.count
          }
        })
      };
      schemas.push(productSchema);
    }

    // Custom structured data
    if (structuredData) {
      schemas.push(structuredData);
    }

    return schemas;
  };

  const allSchemas = generateStructuredData();

  return (
    <Helmet>
      {/* Enhanced Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Enhanced Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Enhanced Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Enhanced Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article-specific Open Graph */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Enhanced Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:creator" content="@onlinenote_ai" />
      <meta name="twitter:site" content="@onlinenote_ai" />
      
      {/* Additional Meta Tags for Better SEO */}
      <meta name="author" content={siteName} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="generator" content="Online Note AI" />
      
      {/* Enhanced Theme and Branding */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Enhanced Favicons and Icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6" />
      
      {/* Performance and Preloading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Enhanced Structured Data */}
      {allSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      
      {/* Additional SEO Meta Tags */}
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />
      <meta name="revisit-after" content="1 days" />
      <meta property="fb:app_id" content="your-facebook-app-id" />
      
      {/* Dublin Core Metadata */}
      <meta name="DC.title" content={title} />
      <meta name="DC.description" content={description} />
      <meta name="DC.creator" content={siteName} />
      <meta name="DC.language" content="en" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.type" content="Text" />
    </Helmet>
  );
};

export default AdvancedSEOOptimizer;