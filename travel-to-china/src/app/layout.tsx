import type { Metadata } from 'next';
import { Marcellus, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/layout/SessionProvider';
import { AnalyticsProvider } from '@/components/layout/AnalyticsProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ReadingProgress from '@/components/layout/ReadingProgress';
import { OrganizationSchema, WebsiteSchema } from '@/components/layout/StructuredData';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://travels2china.com';

const displayFont = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Travel to China — Your Ultimate China Travel Guide',
    template: '%s | Travel to China',
  },
  description:
    'Comprehensive travel guide for China — discover cities, food, culture, visa information, and practical tips for your journey.',
  keywords: ['China', 'travel', 'guide', 'tourism', 'Beijing', 'Shanghai', 'Chinese food', 'visa'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://travels2china.com'),
  openGraph: {
    title: 'Travel to China — Your Ultimate China Travel Guide',
    description: 'Comprehensive travel guide for China — discover cities, food, culture, visa information, and practical tips.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Travel to China',
    images: [{ url: '/images/china-overview.jpg', width: 1200, height: 630, alt: 'Travel to China' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel to China — Your Ultimate China Travel Guide',
    description: 'Comprehensive travel guide for China.',
    images: ['/images/china-overview.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <meta name="msvalidate.01" content="1DBB4B6F0741A036542E7D1699709C0B" />
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased min-h-screen flex flex-col font-body`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100]
                     focus:px-4 focus:py-2.5 focus:bg-[var(--primary)] focus:text-white focus:rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]
                     focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <ReadingProgress />
        <SessionProvider>
          <AnalyticsProvider>
            <Navbar />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </AnalyticsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
