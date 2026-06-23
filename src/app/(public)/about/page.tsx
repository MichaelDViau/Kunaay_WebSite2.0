import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet Ku Náay Real Estate — your trusted local partner for luxury vacation rentals and property sales across the Riviera Maya, Playa del Carmen and Tulum.',
  openGraph: {
    title: 'About Us — Ku Náay Real Estate',
    description:
      'Meet Ku Náay Real Estate — your trusted local partner for luxury vacation rentals and property sales across the Riviera Maya.',
    url: 'https://www.kunaay.com/about',
    images: [{ url: 'https://expertvagabond.com/wp-content/uploads/cancun-things-to-do-guide.jpg' }],
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About Us"
        title="A Commitment to Excellence"
        backgroundImage="/assets/img/aboutcancun.jpg"
      />

      <div className="about-section animate-in">
        <div className="about-text">
          <span className="section-label">Since 2010</span>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 400, marginBottom: '1rem' }}>
            Our Market Expertise
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.8 }}>
            With more than a decade of specialized experience in the Riviera Maya real estate market, Ku Náay offers
            a level of local expertise and market insight that few can match. Our deep understanding of the region&#8217;s
            most desirable communities, from the emerging opportunities of Puerto Morelos to the prestigious enclaves
            of Playacar, allows us to guide clients with confidence through every stage of the buying, selling, and
            investment process.
          </p>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.8 }}>
            Built on strong relationships with leading developers, architects, legal professionals, and industry
            experts throughout the Riviera Maya, we provide access to exceptional opportunities both on and off the
            market. Whether acquiring a luxury residence, securing a high-value investment property, or expanding a
            real estate portfolio, our clients benefit from personalized guidance, complete transparency, and a
            steadfast commitment to protecting and maximizing their long-term interests.
          </p>
        </div>
        <div className="about-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/ourmarketexcover.jpg" alt="Team working together" />
        </div>
      </div>

      <div className="about-section reverse animate-in">
        <div className="about-text">
          <span className="section-label">Philosophy</span>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 400, marginBottom: '1rem' }}>
            A Commitment to Our Clients
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.8 }}>
            At Ku Náay, we understand that every real estate journey is unique. Whether purchasing a luxury residence,
            selling a valuable asset, or making a strategic investment, our approach begins with understanding your
            goals, priorities, and vision. We believe exceptional service is built on trust, discretion, and lasting
            relationships, not transaction volume.
          </p>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.8 }}>
            From the initial consultation through the successful completion of your transaction, you will benefit from
            personalized guidance and a dedicated point of contact every step of the way. Our team is committed to
            delivering a seamless experience defined by transparency, responsiveness, and attention to detail. By
            combining local expertise with a client-focused approach, we help our clients make informed decisions with
            confidence while achieving results that align with their long-term objectives.
          </p>
        </div>
        <div className="about-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/aboutcancun.jpg" alt="Luxury Villa in Riviera Maya" />
        </div>
      </div>

      <section className="about-values">
        <span className="section-label">What Drives Us</span>
        <h2 className="section-title">A Vision for Excellence</h2>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          Our vision is to redefine luxury living in the Riviera Maya through exceptional properties, personalized
          service, and an unwavering commitment to excellence. Whether through exclusive vacation rentals,
          distinguished residences, or carefully curated experiences, we strive to deliver a level of quality,
          comfort, and authenticity that exceeds expectations.
        </p>
        <p className="section-desc" style={{ margin: '1.5rem auto 0' }}>
          Every property and service within our portfolio is thoughtfully selected to reflect the beauty, character,
          and lifestyle that make the Riviera Maya one of the world&#8217;s most desirable destinations. Our goal is
          to create lasting value, meaningful connections, and exceptional experiences for every client we serve.
        </p>
        <div className="values-grid">
          {[
            {
              title: 'Luxury',
              desc: 'Carefully curated properties distinguished by exceptional craftsmanship, refined design, breathtaking views, and premium amenities that elevate every experience.',
            },
            {
              title: 'Exclusivity',
              desc: 'We believe true luxury begins with exclusivity. Our carefully curated portfolio offers access to exceptional properties, distinguished locations, and rare opportunities unavailable to the broader market.',
            },
            {
              title: 'Dedication',
              desc: 'Our team anticipates every detail of your journey, delivering a thoughtful and seamless experience that combines comfort, refinement, and genuine care at every stage of your stay.',
            },
          ].map(({ title, desc }) => (
            <div key={title} className="value-card animate-in">
              <div className="value-icon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ color: 'var(--gold)' }}>
                  <use href="#i-star" />
                </svg>
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '5rem 3rem' }}>
        <span className="section-label">Ready to Explore?</span>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>Start Your Riviera Maya Journey</h2>
        <Link href="/rentals" className="btn-primary" style={{ marginRight: '1rem' }}>Browse Rentals</Link>
        <Link href="/contact" className="btn-outline">Contact Us</Link>
      </section>
    </>
  );
}
