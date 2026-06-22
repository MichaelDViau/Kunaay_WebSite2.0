import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import PropertyGrid from '@/components/properties/PropertyGrid';
import AiAssistant from '@/components/ai/AiAssistant';
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
      <AiAssistant />
      <PropertyGrid properties={rentals} />
    </>
  );
}
