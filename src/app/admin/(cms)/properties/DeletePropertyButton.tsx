'use client';

import { useRouter } from 'next/navigation';

export default function DeletePropertyButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  };

  return (
    <button className="btn-a btn-danger-a" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={handleDelete}>
      Delete
    </button>
  );
}
