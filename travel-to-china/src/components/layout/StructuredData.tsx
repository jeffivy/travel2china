export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Travel to China',
    url: 'https://travels2china.com',
    logo: 'https://travels2china.com/images/china-overview.jpg',
    description:
      'Your comprehensive travel guide to China — discover cities, food, culture, visa information, and practical tips.',
    email: 'contact@travels2china.com',
    sameAs: ['https://github.com/jeffivy/travel2china'],
    knowsAbout: [
      'China Travel Guide',
      'Chinese Cities',
      'Chinese Food Culture',
      'China Visa Policy',
      'Chinese Ethnic Groups',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://travels2china.com',
    name: 'Travel to China',
    description:
      'Comprehensive travel guide for China — discover cities, food, culture, visa information, and practical tips for your journey.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://travels2china.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}


export function ArticleSchema({
  title, description, image, datePublished, author, url
}: {
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  author?: string;
  url?: string;
}) {
  const safeImage = image?.startsWith('http') ? image : `https://travels2china.com${image || ''}`;
  const safeDescription = (description || '').substring(0, 300);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: safeDescription,
    ...(safeImage && { image: [safeImage] }),
    ...(datePublished && { datePublished: datePublished }),
    ...(author && { author: { "@type": "Person", name: author } }),
    ...(url && { url: url, mainEntityOfPage: url }),
    publisher: {
      "@type": "Organization",
      name: "Travel to China",
      logo: { "@type": "ImageObject", url: "https://travels2china.com/images/china-overview.jpg" },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function TouristAttractionSchema({
  name, description, image, url, addressLocality, addressRegion, addressCountry
}: {
  name: string;
  description: string;
  image?: string;
  url?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
}) {
  const safeImage = image?.startsWith('http') ? image : `https://travels2china.com${image || ''}`;
  const safeDescription = (description || '').substring(0, 300);
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: name || '',
    description: safeDescription,
    ...(safeImage && { image: [safeImage] }),
    ...(url && { url: url }),
    ...(addressLocality && {
      address: {
        "@type": "PostalAddress",
        ...(addressLocality && { addressLocality }),
        ...(addressRegion && { addressRegion }),
        ...(addressCountry && { addressCountry }),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ItemListSchema({
  items, itemType
}: {
  items: { name: string; url: string; description?: string }[];
  itemType?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": itemType || "Thing",
        name: item.name,
        ...(item.url && { url: item.url }),
        ...(item.description && { description: item.description }),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
