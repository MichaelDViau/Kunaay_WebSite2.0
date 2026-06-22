'use client';

import { useRouter } from 'next/navigation';

export default function DuplicatePropertyButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDuplicate = async () => {
    const res = await fetch(`/api/admin/properties/${id}/duplicate`, { method: 'POST' });
    if (res.ok) router.refresh();
  };

  return (
    <button className="btn-a btn-ghost-a" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={handleDuplicate}>
      Duplicate
    </button>
  );
}
