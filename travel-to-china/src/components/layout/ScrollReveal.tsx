'use client';

import { useEffect, useRef, useState } from 'react';

type AnimationStyle = 'fade-in' | 'slide-up' | 'slide-right' | 'scale-in' | 'steady' | 'gentle' | 'lively';

interface ScrollRevealProps {
  children: React.ReactNode;
  style?: AnimationStyle;
  delay?: number;
  threshold?: number;
  className?: string;
}

const styleMap: Record<AnimationStyle, string> = {
  'fade-in': 'animate-fade-in',
  'slide-up': 'animate-slide-up',
  'slide-right': 'animate-slide-right',
  'scale-in': 'animate-scale-in',
  'steady': 'animate-steady',
  'gentle': 'animate-gentle',
  'lively': 'animate-lively',
};

export default function ScrollReveal({
  children,
  style = 'fade-in',
  delay = 0,
  threshold = 0.1,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  // Only render as div to keep ref typing simple.
  // For semantic HTML, wrap content in the desired tag inside ScrollReveal.
  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? styleMap[style] : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * Returns the appropriate animation style for a Chinese region.
 * Use this to apply region-specific motion character.
 */
export function getRegionAnimation(region?: string): AnimationStyle {
  if (!region) return 'fade-in';

  const regionLower = region.toLowerCase();
  // North: Beijing, Xi'an — steady, dignified
  if (regionLower.includes('north') || regionLower.includes('beijing') || regionLower.includes('tianjin')) {
    return 'steady';
  }
  // South / Jiangnan: Shanghai, Hangzhou, Suzhou, Nanjing — gentle, fluid
  if (regionLower.includes('south') || regionLower.includes('east') ||
      regionLower.includes('shanghai') || regionLower.includes('hangzhou') ||
      regionLower.includes('suzhou') || regionLower.includes('nanjing') ||
      regionLower.includes('jiangsu') || regionLower.includes('zhejiang')) {
    return 'gentle';
  }
  // Southwest / Sichuan: Chengdu, Chongqing, Kunming — lively, spirited
  if (regionLower.includes('southwest') || regionLower.includes('west') ||
      regionLower.includes('chengdu') || regionLower.includes('chongqing') ||
      regionLower.includes('kunming') || regionLower.includes('sichuan')) {
    return 'lively';
  }
  // Default: elegant fade-in
  return 'fade-in';
}
