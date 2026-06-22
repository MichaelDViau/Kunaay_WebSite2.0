'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Highlight { icon: string; label: string; }
interface RelatedProp { slug: string; name: string; location: string; image: string; }
interface Amenity { id: string; name: string; icon: string; }

interface PropertyFormProps {
  propertyId?: string;
  amenities: Amenity[];
  initialData?: {
    slug: string; name: string; type: string; status: string; badge: string;
    location: string; subtitle: string; heroLabel: string; price: string;
    bedrooms: number; bathrooms: number; guests: number | null; squareFeet: number | null;
    shortDescription: string; whatsappUrl: string; displayOrder: number;
    seoTitle: string; seoDescription: string; seoOgImage: string; seoCanonical: string;
    descriptions: string[];
    highlights: Highlight[];
    features: string[];
    selectedAmenityIds: string[];
    relatedProperties: RelatedProp[];
  };
}

const TABS = ['Basic Info', 'Descriptions', 'Details', 'Amenities', 'Related', 'SEO'];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '').replace(/^-+|-+$/g, '');
}

export default function PropertyForm({ propertyId, amenities, initialData }: PropertyFormProps) {
  const router = useRouter();
  const isEdit = !!propertyId;
  const [tab, setTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Basic Info
  const [name, setName] = useState(initialData?.name ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [slugManual, setSlugManual] = useState(isEdit);
  const [type, setType] = useState(initialData?.type ?? 'rental');
  const [status, setStatus] = useState(initialData?.status ?? 'draft');
  const [badge, setBadge] = useState(initialData?.badge ?? 'Rental');
  const [location, setLocation] = useState(initialData?.location ?? '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? '');
  const [heroLabel, setHeroLabel] = useState(initialData?.heroLabel ?? '');
  const [price, setPrice] = useState(initialData?.price ?? '');
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms ?? 1);
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms ?? 1);
  const [guests, setGuests] = useState(initialData?.guests ?? '');
  const [sqft, setSqft] = useState(initialData?.squareFeet ?? '');
  const [whatsappUrl, setWhatsappUrl] = useState(initialData?.whatsappUrl ?? '');
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder ?? 0);

  // Descriptions
  const [shortDesc, setShortDesc] = useState(initialData?.shortDescription ?? '');
  const [longDescs, setLongDescs] = useState<string[]>(initialData?.descriptions ?? ['']);

  // Details
  const [highlights, setHighlights] = useState<Highlight[]>(
    initialData?.highlights ?? [{ icon: '', label: '' }]
  );
  const [features, setFeatures] = useState<string[]>(initialData?.features ?? ['']);

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(
    new Set(initialData?.selectedAmenityIds ?? [])
  );
  const [newAmenityName, setNewAmenityName] = useState('');
  const [localAmenities, setLocalAmenities] = useState<Amenity[]>(amenities);

  // Related
  const [related, setRelated] = useState<RelatedProp[]>(
    initialData?.relatedProperties ?? []
  );

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle ?? '');
  const [seoDesc, setSeoDesc] = useState(initialData?.seoDescription ?? '');
  const [seoOg, setSeoOg] = useState(initialData?.seoOgImage ?? '');
  const [seoCanonical, setSeoCanonical] = useState(initialData?.seoCanonical ?? '');

  const handleNameChange = useCallback((v: string) => {
    setName(v);
    if (!slugManual) setSlug(slugify(v));
  }, [slugManual]);

  const addAmenity = async () => {
    const trimmed = newAmenityName.trim();
    if (!trimmed) return;
    const res = await fetch('/api/admin/amenities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    });
    if (res.ok) {
      const a: Amenity = await res.json();
      setLocalAmenities((prev) => [...prev, a].sort((x, y) => x.name.localeCompare(y.name)));
      setSelectedAmenities((prev) => new Set([...prev, a.id]));
      setNewAmenityName('');
    }
  };

  const buildPayload = () => ({
    slug, name, type, status, badge, location, subtitle, heroLabel, price,
    bedrooms: Number(bedrooms), bathrooms: Number(bathrooms),
    guests: guests !== '' ? Number(guests) : null,
    squareFeet: sqft !== '' ? Number(sqft) : null,
    shortDescription: shortDesc, whatsappUrl,
    displayOrder: Number(displayOrder),
    seoTitle, seoDescription: seoDesc, seoOgImage: seoOg, seoCanonical,
    descriptions: longDescs.filter(Boolean).map((text, i) => ({ text, sortOrder: i })),
    highlights: highlights.filter((h) => h.label).map((h, i) => ({ ...h, sortOrder: i })),
    features: features.filter(Boolean).map((text, i) => ({ text, sortOrder: i })),
    amenityIds: [...selectedAmenities],
    relatedProperties: related.map((r, i) => ({ ...r, sortOrder: i })),
  });

  const handleSubmit = async () => {
    if (!name.trim() || !slug.trim()) { setError('Name and slug are required.'); return; }
    setError(''); setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/properties/${propertyId}`
        : '/api/admin/properties';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? 'Save failed.');
      } else {
        const saved = await res.json();
        router.push(`/admin/properties/${saved.id}/edit`);
        router.refresh();
      }
    } catch {
      setError('Network error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="a-form">
      {error && <div className="a-alert-error">{error}</div>}

      <div className="a-tabs">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`a-tab${tab === i ? ' active' : ''}`}
            onClick={() => setTab(i)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab 0 — Basic Info */}
      {tab === 0 && (
        <div className="a-tab-panel">
          <div className="a-form-row">
            <div className="a-form-group">
              <label className="a-label">Property Name *</label>
              <input className="a-input" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Casa Violetta" />
            </div>
            <div className="a-form-group">
              <label className="a-label">Slug *</label>
              <input
                className="a-input"
                value={slug}
                onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }}
                placeholder="e.g. casavioleta"
              />
            </div>
          </div>

          <div className="a-form-row">
            <div className="a-form-group">
              <label className="a-label">Type</label>
              <div className="a-toggle-group">
                <button type="button" className={`a-toggle${type === 'rental' ? ' active' : ''}`} onClick={() => setType('rental')}>Rental</button>
                <button type="button" className={`a-toggle${type === 'sale' ? ' active' : ''}`} onClick={() => setType('sale')}>For Sale</button>
              </div>
            </div>
            <div className="a-form-group">
              <label className="a-label">Status</label>
              <div className="a-toggle-group">
                <button type="button" className={`a-toggle${status === 'published' ? ' active' : ''}`} onClick={() => setStatus('published')}>Published</button>
                <button type="button" className={`a-toggle${status === 'draft' ? ' active' : ''}`} onClick={() => setStatus('draft')}>Draft</button>
              </div>
            </div>
            <div className="a-form-group">
              <label className="a-label">Badge</label>
              <input className="a-input" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. Rental" />
            </div>
          </div>

          <div className="a-form-group">
            <label className="a-label">Location</label>
            <input className="a-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Playacar Phase 1, Playa Del Carmen" />
          </div>

          <div className="a-form-row">
            <div className="a-form-group">
              <label className="a-label">Subtitle</label>
              <input className="a-input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. Ocean Front, Playacar Phase 1" />
            </div>
            <div className="a-form-group">
              <label className="a-label">Hero Label</label>
              <input className="a-input" value={heroLabel} onChange={(e) => setHeroLabel(e.target.value)} placeholder="e.g. Rental · Playacar Phase 1" />
            </div>
          </div>

          <div className="a-form-row">
            <div className="a-form-group">
              <label className="a-label">Price / Rate</label>
              <input className="a-input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. $1,200/night" />
            </div>
            <div className="a-form-group">
              <label className="a-label">Bedrooms</label>
              <input className="a-input" type="number" min={0} value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} />
            </div>
            <div className="a-form-group">
              <label className="a-label">Bathrooms</label>
              <input className="a-input" type="number" min={0} value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} />
            </div>
          </div>

          <div className="a-form-row">
            <div className="a-form-group">
              <label className="a-label">Guests</label>
              <input className="a-input" type="number" min={0} value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Optional" />
            </div>
            <div className="a-form-group">
              <label className="a-label">Sq Ft</label>
              <input className="a-input" type="number" min={0} value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="Optional" />
            </div>
            <div className="a-form-group">
              <label className="a-label">Display Order</label>
              <input className="a-input" type="number" min={0} value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
            </div>
          </div>

          <div className="a-form-group">
            <label className="a-label">WhatsApp URL</label>
            <input className="a-input" value={whatsappUrl} onChange={(e) => setWhatsappUrl(e.target.value)} placeholder="https://wa.me/52..." />
          </div>
        </div>
      )}

      {/* Tab 1 — Descriptions */}
      {tab === 1 && (
        <div className="a-tab-panel">
          <div className="a-form-group">
            <label className="a-label">Short Description *</label>
            <textarea className="a-textarea" rows={3} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="One or two sentences shown on listing cards…" />
          </div>

          <div className="a-form-group">
            <label className="a-label">Long Description Paragraphs</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {longDescs.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <textarea
                    className="a-textarea"
                    rows={3}
                    value={d}
                    onChange={(e) => setLongDescs((prev) => prev.map((x, j) => j === i ? e.target.value : x))}
                    placeholder={`Paragraph ${i + 1}…`}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn-a btn-danger-a" style={{ alignSelf: 'flex-start', padding: '6px 10px', fontSize: '0.8rem' }}
                    onClick={() => setLongDescs((prev) => prev.filter((_, j) => j !== i))}>✕</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn-a btn-secondary-a" style={{ marginTop: 8 }}
              onClick={() => setLongDescs((prev) => [...prev, ''])}>+ Add Paragraph</button>
          </div>
        </div>
      )}

      {/* Tab 2 — Details */}
      {tab === 2 && (
        <div className="a-tab-panel">
          <div className="a-form-group">
            <label className="a-label">Highlights (icon + label)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <input className="a-input" value={h.icon} style={{ width: 120, flex: 'none' }}
                    onChange={(e) => setHighlights((prev) => prev.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))}
                    placeholder="Icon (bed, bath…)" />
                  <input className="a-input" value={h.label} style={{ flex: 1 }}
                    onChange={(e) => setHighlights((prev) => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                    placeholder="Label (4 Bedrooms…)" />
                  <button type="button" className="btn-a btn-danger-a" style={{ padding: '6px 10px', fontSize: '0.8rem', flex: 'none' }}
                    onClick={() => setHighlights((prev) => prev.filter((_, j) => j !== i))}>✕</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn-a btn-secondary-a" style={{ marginTop: 8 }}
              onClick={() => setHighlights((prev) => [...prev, { icon: '', label: '' }])}>+ Add Highlight</button>
          </div>

          <div className="a-form-group" style={{ marginTop: 24 }}>
            <label className="a-label">Features / Amenities List</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <input className="a-input" value={f} style={{ flex: 1 }}
                    onChange={(e) => setFeatures((prev) => prev.map((x, j) => j === i ? e.target.value : x))}
                    placeholder="e.g. Central Air Conditioning" />
                  <button type="button" className="btn-a btn-danger-a" style={{ padding: '6px 10px', fontSize: '0.8rem', flex: 'none' }}
                    onClick={() => setFeatures((prev) => prev.filter((_, j) => j !== i))}>✕</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn-a btn-secondary-a" style={{ marginTop: 8 }}
              onClick={() => setFeatures((prev) => [...prev, ''])}>+ Add Feature</button>
          </div>
        </div>
      )}

      {/* Tab 3 — Amenities */}
      {tab === 3 && (
        <div className="a-tab-panel">
          <div className="a-amenities-grid">
            {localAmenities.map((a) => (
              <label key={a.id} className={`a-amenity-chip${selectedAmenities.has(a.id) ? ' selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedAmenities.has(a.id)}
                  onChange={(e) => {
                    setSelectedAmenities((prev) => {
                      const s = new Set(prev);
                      if (e.target.checked) s.add(a.id); else s.delete(a.id);
                      return s;
                    });
                  }}
                  style={{ display: 'none' }}
                />
                {a.name}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <input
              className="a-input"
              value={newAmenityName}
              onChange={(e) => setNewAmenityName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addAmenity()}
              placeholder="Add custom amenity…"
              style={{ flex: 1 }}
            />
            <button type="button" className="btn-a btn-secondary-a" onClick={addAmenity}>Add</button>
          </div>
        </div>
      )}

      {/* Tab 4 — Related Properties */}
      {tab === 4 && (
        <div className="a-tab-panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {related.map((r, i) => (
              <div key={i} className="a-related-row">
                <div className="a-form-row" style={{ flex: 1, gap: 8 }}>
                  <input className="a-input" value={r.slug} placeholder="slug"
                    onChange={(e) => setRelated((prev) => prev.map((x, j) => j === i ? { ...x, slug: e.target.value } : x))} />
                  <input className="a-input" value={r.name} placeholder="Name"
                    onChange={(e) => setRelated((prev) => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                  <input className="a-input" value={r.location} placeholder="Location"
                    onChange={(e) => setRelated((prev) => prev.map((x, j) => j === i ? { ...x, location: e.target.value } : x))} />
                  <input className="a-input" value={r.image} placeholder="Image URL or /assets/…"
                    onChange={(e) => setRelated((prev) => prev.map((x, j) => j === i ? { ...x, image: e.target.value } : x))} />
                </div>
                <button type="button" className="btn-a btn-danger-a" style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                  onClick={() => setRelated((prev) => prev.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn-a btn-secondary-a" style={{ marginTop: 12 }}
            onClick={() => setRelated((prev) => [...prev, { slug: '', name: '', location: '', image: '' }])}>+ Add Related Property</button>
        </div>
      )}

      {/* Tab 5 — SEO */}
      {tab === 5 && (
        <div className="a-tab-panel">
          <div className="a-form-group">
            <label className="a-label">SEO Title</label>
            <input className="a-input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Casa X — Ku Náay Real Estate" />
          </div>
          <div className="a-form-group">
            <label className="a-label">SEO Description</label>
            <textarea className="a-textarea" rows={3} value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} placeholder="Meta description (160 chars)…" />
          </div>
          <div className="a-form-group">
            <label className="a-label">OG Image URL</label>
            <input className="a-input" value={seoOg} onChange={(e) => setSeoOg(e.target.value)} placeholder="https://…" />
          </div>
          <div className="a-form-group">
            <label className="a-label">Canonical URL</label>
            <input className="a-input" value={seoCanonical} onChange={(e) => setSeoCanonical(e.target.value)} placeholder="https://www.kunaay.com/properties/…" />
          </div>
        </div>
      )}

      <div className="a-form-actions">
        <button type="button" className="btn-a btn-ghost-a" onClick={() => router.back()}>Cancel</button>
        <button type="button" className="btn-a btn-primary-a" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Property'}
        </button>
      </div>
    </div>
  );
}
