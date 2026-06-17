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
