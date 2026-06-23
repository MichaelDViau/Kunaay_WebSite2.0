'use client';

import React, { useEffect, useRef, type ReactNode } from 'react';

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  tag?: keyof React.JSX.IntrinsicElements;
}

export default function AnimateIn({ children, className = '', tag: Tag = 'div' }: AnimateInProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={`animate-in ${className}`.trim()}>
      {children}
    </Tag>
  );
}
