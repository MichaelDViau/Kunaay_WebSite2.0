'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeletePropertyButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.error ?? 'Failed to delete property.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      className="btn-a btn-danger-a"
      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
      onClick={handleDelete}
      disabled={deleting}
    >
      {deleting ? '…' : 'Delete'}
    </button>
  );
}
