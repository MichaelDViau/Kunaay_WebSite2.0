import type { Metadata } from 'next';
import HeroSlider from '@/components/home/HeroSlider';
import PropertyGrid from '@/components/properties/PropertyGrid';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { properties } from '@/data/properties';

export const metadata: Metadata = {
  title: 'Ku Náay Real Estate — Riviera Maya',
  description:
    'Ku Náay Real Estate — luxury vacation rentals and property sales in the Riviera Maya, Playa del Carmen and Tulum.',
  openGraph: {
    title: 'Ku Náay Real Estate — Riviera Maya Luxury Villas',
    description:
      'Ku Náay Real Estate — luxury vacation rentals and property sales in the Riviera Maya, Playa del Carmen and Tulum.',
    url: 'https://www.kunaay.com/',
    images: [{ url: 'https://i.ibb.co/2386rxRj/Casa-Violetta-019-1.jpg' }],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSlider />

      <section className="intro">
        <span className="section-label">Our Collection</span>
        <h2 className="section-title">A Portfolio Defined by Excellence</h2>
        <p className="section-desc">
          Discover a carefully curated collection of luxury vacation homes, private residences, and exceptional
          investment opportunities across the Riviera Maya, selected for their distinctive character, refined
          craftsmanship, and enduring value.
        </p>
        <div className="intro-divider" />
      </section>

      <PropertyGrid properties={properties} />

      <TestimonialsSection />
    </>
  );
}
