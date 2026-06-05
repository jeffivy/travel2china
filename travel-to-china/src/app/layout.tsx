import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/layout/SessionProvider';
import { AnalyticsProvider } from '@/components/layout/AnalyticsProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://travel-to-china.vercel.app'),
  openGraph: {
    title: 'Travel to China — Your Ultimate China Travel Guide',
    description: 'Comprehensive travel guide for China.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
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
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col font-sans`}>
        <SessionProvider>
          <AnalyticsProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AnalyticsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
