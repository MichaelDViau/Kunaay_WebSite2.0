import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0C0C0C', color: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '24px' }}>
        <div>
          <div style={{ fontSize: '5rem', fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>404</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '16px 0 8px' }}>Page Not Found</h1>
          <p style={{ color: '#9A9589', marginBottom: '32px' }}>The page you are looking for does not exist or has been moved.</p>
          <Link href="/" style={{ display: 'inline-block', padding: '10px 24px', background: '#C9A84C', color: '#0A0A0A', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
