import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { getSaleProperties } from '@/data/properties';

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

export default function SalesPage() {
  const sales = getSaleProperties();
  return (
    <>
      <PageHero
        label="Properties for Sale"
        title="Invest in the Riviera Maya"
        backgroundImage="/assets/img/photos/sales/casachukum/full/casachukumtop.webp"
      />
      <PropertyGrid properties={sales} />
    </>
  );
}
