'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DuplicatePropertyButton({ id }: { id: string }) {
  const router = useRouter();
  const [duplicating, setDuplicating] = useState(false);

  const handleDuplicate = async () => {
    setDuplicating(true);
    try {
      const res = await fetch(`/api/admin/properties/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.error ?? 'Failed to duplicate property.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setDuplicating(false);
    }
  };

  return (
    <button
      className="btn-a btn-ghost-a"
      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
      onClick={handleDuplicate}
      disabled={duplicating}
    >
      {duplicating ? '…' : 'Duplicate'}
    </button>
  );
}
