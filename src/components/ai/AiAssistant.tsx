'use client';

import { useState, useRef, useEffect } from 'react';

interface PropertyCard {
  slug: string;
  name: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  guests?: number | null;
  price?: string | null;
  image: string;
}

interface ChatResponse {
  answer: string;
  properties: PropertyCard[];
}

const EXAMPLES = [
  'What rentals are available?',
  'Best beaches near Playa del Carmen?',
  'Properties with private pool?',
  'Family activities nearby?',
];

export default function AiAssistant() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (response || error) {
      responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [response, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setResponse(null);
    setExpanded(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json() as ChatResponse & { error?: string };

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
      } else {
        setResponse(data);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setResponse(null);
    setError(null);
    setExpanded(false);
  };

  const pickExample = (q: string) => {
    setQuestion(q);
    setExpanded(true);
    inputRef.current?.focus();
  };

  return (
    <section className="ai-section">
      <div className="ai-inner">

        {/* Header */}
        <div className="ai-header">
          <div className="ai-badge-row">
            <span className="ai-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0 14.5c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.23 7.23 0 0 1-6 3.22z"/>
              </svg>
              AI
            </span>
          </div>
          <h2 className="ai-title">Ku Náay AI Assistant</h2>
          <p className="ai-subtitle">
            Ask about our properties, local beaches, restaurants, or activities in the Riviera Maya
          </p>
        </div>

        {/* Search form */}
        <form className="ai-form" onSubmit={handleSubmit} noValidate>
          <div className={`ai-bar${expanded ? ' ai-bar--open' : ''}`}>
            <svg className="ai-bar-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="ai-bar-input"
              placeholder="Ask anything about Riviera Maya stays or properties…"
              value={question}
              onChange={(e) => { setQuestion(e.target.value); if (e.target.value) setExpanded(true); }}
              maxLength={500}
              disabled={loading}
              aria-label="Ask Ku Náay AI"
            />
            {question && (
              <button type="button" className="ai-clear" onClick={handleReset} aria-label="Clear question">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="ai-send"
              disabled={loading || !question.trim()}
              aria-label="Send question"
            >
              {loading ? (
                <span className="ai-dots" aria-label="Loading"><span/><span/><span/></span>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m22 2-7 20-4-9-9-4 20-7z"/>
                  <path d="M22 2 11 13"/>
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Example chips */}
        {!expanded && (
          <div className="ai-chips" aria-label="Example questions">
            {EXAMPLES.map((q) => (
              <button key={q} type="button" className="ai-chip" onClick={() => pickExample(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="ai-response" ref={responseRef}>
            <div className="ai-thinking">
              <span className="ai-dots"><span/><span/><span/></span>
              <span>Thinking…</span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="ai-response" ref={responseRef}>
            <div className="ai-error-msg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6M9 9l6 6"/>
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Answer */}
        {!loading && response && (
          <div className="ai-response" ref={responseRef}>
            <div className="ai-answer">
              <div className="ai-answer-avatar" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0 14.5c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.23 7.23 0 0 1-6 3.22z"/>
                </svg>
              </div>
              <p className="ai-answer-text">{response.answer}</p>
            </div>

            {response.properties.length > 0 && (
              <div className="ai-cards">
                <p className="ai-cards-label">Recommended Properties</p>
                <div className="ai-cards-grid">
                  {response.properties.map((p) => (
                    <a key={p.slug} href={`/properties/${p.slug}`} className="ai-card">
                      <div className="ai-card-img">
                        {p.image && (
                          <img src={p.image} alt={p.name} loading="lazy" width={320} height={200} />
                        )}
                        <span className="ai-card-tag">{p.type === 'rental' ? 'Rental' : 'For Sale'}</span>
                      </div>
                      <div className="ai-card-body">
                        <h4 className="ai-card-name">{p.name}</h4>
                        <p className="ai-card-loc">{p.location}</p>
                        <div className="ai-card-meta">
                          <span>{p.bedrooms} bd</span>
                          <span className="ai-dot"/>
                          <span>{p.bathrooms} ba</span>
                          {p.guests != null && (
                            <><span className="ai-dot"/><span>{p.guests} guests</span></>
                          )}
                        </div>
                        {p.price && <p className="ai-card-price">{p.price}</p>}
                        <span className="ai-card-link">View property →</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
