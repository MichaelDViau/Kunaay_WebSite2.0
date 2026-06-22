'use client';

import { useState, useRef } from 'react';

interface DbImage {
  id: string;
  url: string;
  thumbUrl: string;
  title: string;
  isHero: boolean;
  isCover: boolean;
  sortOrder: number;
}

interface ImageManagerProps {
  propertyId: string;
  initialImages: DbImage[];
}

export default function ImageManager({ propertyId, initialImages }: ImageManagerProps) {
  const [images, setImages] = useState<DbImage[]>(
    [...initialImages].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const api = (path: string, opts: RequestInit) =>
    fetch(`/api/admin/properties/${propertyId}/images${path}`, opts);

  const upload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('files', f));
    const res = await api('', { method: 'POST', body: fd });
    if (res.ok) {
      const created: DbImage[] = await res.json();
      setImages((prev) => [...prev, ...created].sort((a, b) => a.sortOrder - b.sortOrder));
    }
    setUploading(false);
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    const res = await api(`/${id}`, { method: 'DELETE' });
    if (res.ok) setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const setHero = async (id: string) => {
    const res = await api(`/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isHero: true }),
    });
    if (res.ok) setImages((prev) => prev.map((i) => ({ ...i, isHero: i.id === id })));
  };

  const updateTitle = async (id: string, title: string) => {
    await api(`/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, title } : i)));
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= images.length) return;
    const arr = [...images];
    [arr[index], arr[next]] = [arr[next], arr[index]];
    const reordered = arr.map((img, i) => ({ ...img, sortOrder: i }));
    setImages(reordered);
    await api('', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds: reordered.map((i) => i.id) }),
    });
  };

  return (
    <div>
      <div
        className={`a-img-upload-zone${dragOver ? ' drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
      >
        <div className="a-img-upload-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div className="a-img-upload-text">
          {uploading ? 'Uploading…' : 'Drop images here or click to browse'}
        </div>
        <div className="a-img-upload-sub">WebP, JPEG, PNG · Auto-compressed · Multiple files OK</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => upload(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="a-img-grid">
          {images.map((img, index) => (
            <div key={img.id} className="a-img-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.thumbUrl || img.url} alt={img.title || 'Property image'} />
              <div className="a-img-card-badges">
                {img.isHero && <span className="a-img-badge hero">Hero</span>}
                {img.isCover && <span className="a-img-badge cover">Cover</span>}
              </div>
              <div className="a-img-order-btns">
                <button className="a-img-order-btn" onClick={() => move(index, -1)} title="Move left">↑</button>
                <button className="a-img-order-btn" onClick={() => move(index, 1)} title="Move right">↓</button>
              </div>
              <div className="a-img-card-overlay">
                {!img.isHero && (
                  <button className="btn-a btn-secondary-a" style={{ fontSize: '0.72rem', padding: '4px 10px' }} onClick={() => setHero(img.id)}>
                    Set as Hero
                  </button>
                )}
                <button
                  className="btn-a btn-danger-a"
                  style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                  onClick={() => deleteImage(img.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--a-text-3)' }}>Edit image titles (shown in lightbox)</p>
          {images.map((img) => (
            <div key={img.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.thumbUrl || img.url} alt="" style={{ width: 40, height: 32, objectFit: 'cover', borderRadius: 4 }} />
              <input
                className="a-input"
                defaultValue={img.title}
                placeholder="Image title…"
                onBlur={(e) => updateTitle(img.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
