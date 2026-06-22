'use client';

import { useEffect } from 'react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Admin Error]', error);
  }, [error]);

  return (
    <div className="a-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--a-red)' }}>⚠</div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Something went wrong</h1>
      <p style={{ color: 'var(--a-text-2)', marginBottom: '24px', maxWidth: 400 }}>
        An unexpected error occurred in the admin panel. Your data is safe.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          className="btn-a btn-primary-a"
          onClick={reset}
        >
          Try Again
        </button>
        <a href="/admin" className="btn-a btn-ghost-a">
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
