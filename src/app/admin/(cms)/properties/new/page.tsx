import { prisma } from '@/lib/prisma';
import PropertyForm from '@/components/admin/PropertyForm';

export const metadata = { title: 'New Property' };

export default async function NewPropertyPage() {
  const amenities = await prisma.amenity.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="a-page">
      <div className="a-page-header">
        <div>
          <h1 className="a-page-title">New Property</h1>
          <p className="a-page-sub">Fill in the details below and save to create the property.</p>
        </div>
      </div>
      <PropertyForm amenities={amenities} />
    </div>
  );
}
