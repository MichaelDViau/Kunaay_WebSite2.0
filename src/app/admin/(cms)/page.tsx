import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard' };

export default async function AdminDashboard() {
  const [total, rentals, sales, published, draft] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { type: 'rental' } }),
    prisma.property.count({ where: { type: 'sale' } }),
    prisma.property.count({ where: { status: 'published' } }),
    prisma.property.count({ where: { status: 'draft' } }),
  ]);

  const recentProperties = await prisma.property.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { images: { where: { isHero: true }, take: 1 } },
  });

  const stats = [
    { label: 'Total Properties', value: total, color: 'var(--a-gold)' },
    { label: 'Rental Properties', value: rentals, color: 'var(--a-text)' },
    { label: 'For Sale', value: sales, color: 'var(--a-text)' },
    { label: 'Published', value: published, color: 'var(--a-green)' },
    { label: 'Draft', value: draft, color: 'var(--a-amber)' },
  ];

  return (
    <div className="a-page">
      <div className="a-page-header">
        <div>
          <h1 className="a-page-title">Dashboard</h1>
          <p className="a-page-sub">Welcome back. Here&apos;s a summary of your portfolio.</p>
        </div>
        <Link href="/admin/properties/new" className="btn-a btn-primary-a">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Property
        </Link>
      </div>

      <div className="a-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="a-stat">
            <div className="a-stat-label">{s.label}</div>
            <div className="a-stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="a-section">
        <div className="a-section-header">
          <h2 className="a-section-title">Recently Updated</h2>
          <Link href="/admin/properties" className="a-section-link">View all →</Link>
        </div>
        <table className="a-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Status</th>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recentProperties.map((p) => {
              const hero = p.images[0];
              return (
                <tr key={p.id}>
                  <td>
                    <div className="a-table-prop">
                      {hero && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={hero.thumbUrl || hero.url} alt="" className="a-table-thumb" />
                      )}
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`a-badge ${p.type === 'rental' ? 'rental' : 'sale'}`}>
                      {p.type === 'rental' ? 'Rental' : 'For Sale'}
                    </span>
                  </td>
                  <td>
                    <span className={`a-badge ${p.status === 'published' ? 'published' : 'draft'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="a-table-muted">{p.location}</td>
                  <td>
                    <Link href={`/admin/properties/${p.id}/edit`} className="btn-a btn-ghost-a" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
