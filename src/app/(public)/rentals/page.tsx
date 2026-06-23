import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { getRentalPropertiesDB } from '@/lib/property-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Vacation Rentals',
  description:
    "Browse Ku Náay's curated collection of oceanfront luxury vacation rentals in Playacar, Playa del Carmen and the Riviera Maya.",
  openGraph: {
    title: 'Vacation Rentals — Ku Náay Real Estate',
    description:
      "Browse Ku Náay's curated collection of oceanfront luxury vacation rentals in Playacar, Playa del Carmen and the Riviera Maya.",
    url: 'https://www.kunaay.com/rentals',
    images: [{ url: 'https://i.ibb.co/60cHvKsX/Secreto-maya-74-1.jpg' }],
  },
};

export default async function RentalsPage() {
  const rentals = await getRentalPropertiesDB();
  return (
    <>
      <PageHero
        label="Vacation Rentals"
        title="Exceptional Stays in the Riviera Maya"
        backgroundImage="/assets/img/photos/rentals/casasecretomaya/full/casasm6.webp"
      />
      <section className="intro">
        <h2 className="section-title">The Riviera Maya&apos;s Most Exclusive Private Villas</h2>
        <p className="section-desc">
          Our portfolio of luxury vacation rentals features breathtaking Caribbean views, exceptional
          craftsmanship, and privileged locations within the prestigious gated community of Playacar
          Phase 1, delivering an unparalleled Riviera Maya retreat for those seeking exceptional
          privacy, comfort, and elegance.
        </p>
        <div className="intro-divider" />
      </section>
      <PropertyGrid properties={rentals} showHeader={false} />
    </>
  );
}
