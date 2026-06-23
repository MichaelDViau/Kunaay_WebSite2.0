/** Inline SVG sprite — shared across all pages */
export default function IconSprite() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }} aria-hidden="true">
      <symbol id="i-arrow-right" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </symbol>
      <symbol id="i-chevron-left" viewBox="0 0 24 24">
        <path d="M15 18l-6-6 6-6" />
      </symbol>
      <symbol id="i-chevron-right" viewBox="0 0 24 24">
        <path d="M9 18l6-6-6-6" />
      </symbol>
      <symbol id="i-pin" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </symbol>
      <symbol id="i-bed" viewBox="0 0 24 24">
        <path d="M2 17V9.5a2 2 0 012-2h5a2 2 0 012 2v2h2v-2a2 2 0 012-2h5a2 2 0 012 2V17" />
        <path d="M2 17h20" />
        <path d="M2 17v2M22 17v2" />
      </symbol>
      <symbol id="i-bath" viewBox="0 0 24 24">
        <path d="M4 12h16" />
        <path d="M4 12V6a2 2 0 012-2h3a2 2 0 012 2v1" />
        <path d="M4 12v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
        <path d="M8 20v1M16 20v1" />
      </symbol>
      <symbol id="i-pool" viewBox="0 0 24 24">
        <path d="M2 18c1 1 2 1.5 4 1.5S8 17 10 17s2 1.5 4 1.5S16 17 18 17s2 1.5 4 1.5" />
        <circle cx="17" cy="7" r="2" />
        <path d="M6 13l2-4 3 2.5 2-3 3 3.5" />
      </symbol>
      <symbol id="i-waves" viewBox="0 0 24 24">
        <path d="M2 8c1 1 2 1.5 4 1.5S8 8 10 8s2 1.5 4 1.5S16 8 18 8s2 1.5 4 1.5" />
        <path d="M2 14c1 1 2 1.5 4 1.5S8 13 10 13s2 1.5 4 1.5S16 13 18 13s2 1.5 4 1.5" />
      </symbol>
      <symbol id="i-kitchen" viewBox="0 0 24 24">
        <path d="M3 3h2l1 5M7 13l-2-8h16l-2 8H7z" />
        <path d="M7 13a5 5 0 0010 0" />
      </symbol>
      <symbol id="i-parking" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 17V7h4a3 3 0 010 6H9" />
      </symbol>
      <symbol id="i-home" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </symbol>
      <symbol id="i-coffee" viewBox="0 0 24 24">
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </symbol>
      <symbol id="i-caret-left" viewBox="0 0 24 24">
        <polyline points="15,18 9,12 15,6" />
      </symbol>
      <symbol id="i-caret-right" viewBox="0 0 24 24">
        <polyline points="9,18 15,12 9,6" />
      </symbol>
      <symbol id="i-close" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </symbol>
      <symbol id="i-mail" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
      </symbol>
      <symbol id="i-chat" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </symbol>
      <symbol id="i-star" viewBox="0 0 24 24">
        <path d="M12 2l2.5 7H22l-6 4.5 2.5 7.5L12 17l-6.5 4 2.5-7.5L2 9h7.5z" />
      </symbol>
    </svg>
  );
}
