'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Generate visitor and session IDs
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('visitor_id', visitorId);
    }

    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem('session_id', sessionId);
    }

    // Record page view
    fetch('/api/stats/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pagePath: pathname,
        visitorId,
        sessionId,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});

    // Track time on page
    const startTime = Date.now();

    const handleLeave = () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      navigator.sendBeacon(
        '/api/stats/pageview',
        JSON.stringify({
          pagePath: pathname,
          visitorId,
          sessionId,
          eventType: 'leave',
          duration,
        })
      );
    };

    window.addEventListener('beforeunload', handleLeave);
    return () => {
      handleLeave();
      window.removeEventListener('beforeunload', handleLeave);
    };
  }, [pathname]);

  return <>{children}</>;
}
