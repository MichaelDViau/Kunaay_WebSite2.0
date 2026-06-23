import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { getSalePropertiesDB } from '@/lib/property-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Properties for Sale',
  description:
    'Explore Ku Náay Real Estate\'s curated portfolio of luxury properties for sale in Tulum, Playa del Carmen, and across the Riviera Maya.',
  openGraph: {
    title: 'Properties for Sale — Ku Náay Real Estate',
    description:
      'Explore Ku Náay Real Estate\'s curated portfolio of luxury properties for sale across the Riviera Maya.',
    url: 'https://www.kunaay.com/sales',
  },
};

export default async function SalesPage() {
  const sales = await getSalePropertiesDB();
  return (
    <>
      <PageHero
        title="Sales"
        backgroundImage="/assets/img/photos/sales/casachukum/full/casackm3.webp"
      />
      <section className="intro">
        <h2 className="section-title">Curated Residences &amp; Estates for Sale</h2>
        <p className="section-desc">
          Explore an exclusive portfolio of distinguished residences and investment opportunities
          across the Riviera Maya. Carefully selected for exceptional quality, prime locations, and
          strong investment potential, our collection includes exclusive listings and finely crafted
          homes built to the highest standards. From beachfront estates to architecturally significant
          residences, each property reflects timeless design, superior craftsmanship, and lasting value
          in the region&apos;s most coveted destinations.
        </p>
        <div className="intro-divider" />
      </section>
      <PropertyGrid properties={sales} showHeader={false} />
    </>
  );
}
