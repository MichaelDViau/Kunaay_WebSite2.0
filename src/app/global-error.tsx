'use client';

import { useEffect } from 'react';

// Global error boundary: it replaces the root layout when an unrecoverable
// error is thrown, so it must render its own <html>/<body>. Styling is inlined
// on purpose because the normal stylesheet/layout may be unavailable here.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0C0C0C', color: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '24px' }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 8px' }}>Something went wrong</h1>
          <p style={{ color: '#9A9589', marginBottom: '32px' }}>An unexpected error occurred. Please try again.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{ padding: '10px 24px', background: '#C9A84C', color: '#0A0A0A', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Try Again
            </button>
            {/* Hard navigation (not next/link) so a corrupted app state is fully reset. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 24px', background: 'transparent', color: '#9A9589', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
