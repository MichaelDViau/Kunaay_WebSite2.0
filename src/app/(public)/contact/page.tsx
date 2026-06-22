import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Ku Náay Real Estate about luxury vacation rentals and property sales in the Riviera Maya. Reach our team by email or WhatsApp.',
  openGraph: {
    title: 'Contact — Ku Náay Real Estate',
    description:
      'Contact Ku Náay Real Estate about luxury vacation rentals and property sales in the Riviera Maya.',
    url: 'https://www.kunaay.com/contact',
    images: [{ url: 'https://i.ibb.co/4R1DBhVF/Secreto-maya-25-1.jpg' }],
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        title="Connect With Our Real Estate Advisors"
        backgroundImage="/assets/img/photos/full/aboutbanner.webp"
        minHeight="300px"
        height="40vh"
      />
      <ContactForm />
    </>
  );
}
