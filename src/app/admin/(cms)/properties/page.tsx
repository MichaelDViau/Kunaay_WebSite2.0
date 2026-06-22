import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeletePropertyButton from './DeletePropertyButton';
import DuplicatePropertyButton from './DuplicatePropertyButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Properties' };

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { displayOrder: 'asc' },
    include: { images: { where: { isHero: true }, take: 1 } },
  });

  return (
    <div className="a-page">
      <div className="a-page-header">
        <div>
          <h1 className="a-page-title">Properties</h1>
          <p className="a-page-sub">{properties.length} properties in your portfolio</p>
        </div>
        <Link href="/admin/properties/new" className="btn-a btn-primary-a">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Property
        </Link>
      </div>

      <table className="a-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Status</th>
            <th>Location</th>
            <th>Beds/Baths</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => {
            const hero = p.images[0];
            return (
              <tr key={p.id}>
                <td>
                  <div className="a-table-prop">
                    {hero ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={hero.thumbUrl || hero.url} alt="" className="a-table-thumb" />
                    ) : (
                      <div className="a-table-thumb-placeholder" />
                    )}
                    <div>
                      <div className="a-table-name">{p.name}</div>
                      <div className="a-table-slug">{p.slug}</div>
                    </div>
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
                <td className="a-table-muted">{p.bedrooms}bd / {p.bathrooms}ba</td>
                <td>
                  <div className="a-table-actions">
                    <Link href={`/admin/properties/${p.id}/edit`} className="btn-a btn-ghost-a" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                      Edit
                    </Link>
                    <DuplicatePropertyButton id={p.id} />
                    <DeletePropertyButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
