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

    // Extract UTM params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');

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
        utmSource,
        utmMedium,
        utmCampaign,
      }),
    }).catch(() => {});

    // Track time on page
    const startTime = Date.now();

    const handleLeave = () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      // sendBeacon must include userAgent — the server's bot filter treats a
      // missing UA as a bot and silently drops the event. Use a Blob so the
      // Content-Type is application/json (a plain string is sent as text/plain).
      const payload = new Blob(
        [
          JSON.stringify({
            pagePath: pathname,
            visitorId,
            sessionId,
            eventType: 'leave',
            duration,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
          }),
        ],
        { type: 'application/json' }
      );
      navigator.sendBeacon('/api/stats/pageview', payload);
    };

    window.addEventListener('beforeunload', handleLeave);
    return () => {
      handleLeave();
      window.removeEventListener('beforeunload', handleLeave);
    };
  }, [pathname]);

  return <>{children}</>;
}
