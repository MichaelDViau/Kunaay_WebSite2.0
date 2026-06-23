import { prisma } from '@/lib/prisma';
import { databaseSetupMessage, isDatabaseConfigurationError } from '@/lib/db-status';
import PropertyForm from '@/components/admin/PropertyForm';

export const metadata = { title: 'New Property' };

export default async function NewPropertyPage() {
  let amenities: Awaited<ReturnType<typeof prisma.amenity.findMany>> = [];
  let databaseWarning = '';

  try {
    amenities = await prisma.amenity.findMany({ orderBy: { name: 'asc' } });
  } catch (error) {
    if (!isDatabaseConfigurationError(error)) throw error;
    databaseWarning = databaseSetupMessage();
  }

  return (
    <div className="a-page">
      <div className="a-page-header">
        <div>
          <h1 className="a-page-title">New Property</h1>
          <p className="a-page-sub">Fill in the details below and save to create the property.</p>
        </div>
      </div>
      {databaseWarning ? <p className="a-alert">{databaseWarning}</p> : null}
      <PropertyForm amenities={amenities} />
    </div>
  );
}
