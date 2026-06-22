import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const password = await bcrypt.hash('kunaay2026', 10);
  await prisma.user.upsert({
    where: { email: 'admin@kunaay.com' },
    update: {},
    create: { email: 'admin@kunaay.com', password, name: 'Admin', role: 'admin' },
  });

  // Default amenities
  const amenityNames = [
    'WiFi', 'Air Conditioning', 'Private Pool', 'Full Kitchen', 'Parking',
    'Washer & Dryer', 'Dishwasher', 'Coffee Maker', 'BBQ Grill', 'Ocean View',
    'Beach Access', 'Concierge', 'Private Chef Available', 'Gym', 'Spa',
    'Home Theater', 'Smart TV', 'Baby Crib Available', 'Pet Friendly',
  ];
  for (const name of amenityNames) {
    await prisma.amenity.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Properties
  const props = [
    {
      slug: 'casasecretomaya', name: 'Casa Secreto Maya', type: 'rental', status: 'published',
      badge: 'Rental', location: 'Playacar Phase 1, Playa Del Carmen',
      subtitle: 'Ocean Front, Playacar Phase 1', heroLabel: 'Rental · Playacar Phase 1',
      bedrooms: 4, bathrooms: 5, shortDescription: 'A masterpiece of privacy nestled within lush tropical gardens with direct ocean access. Four refined bedrooms and five baths create an intimate sanctuary for discerning travelers.',
      whatsappUrl: 'https://wa.me/529841681121', displayOrder: 1,
      seoTitle: 'Casa Secreto Maya — Ku Náay Real Estate',
      seoDescription: 'Casa Secreto Maya — a 4-bedroom oceanfront estate in Playacar, Playa del Carmen.',
      seoOgImage: 'https://i.ibb.co/4R1DBhVF/Secreto-maya-25-1.jpg',
      seoCanonical: 'https://www.kunaay.com/properties/casasecretomaya',
      heroImage: '/assets/img/photos/rentals/casasecretomaya/full/secretomayatop.webp',
      highlights: [
        { icon: 'bed', label: '4 Bedrooms' }, { icon: 'bath', label: '5 Bathrooms' },
        { icon: 'waves', label: 'Ocean Front' }, { icon: 'pool', label: 'Private Pool' },
        { icon: 'kitchen', label: 'Full Kitchen' }, { icon: 'parking', label: 'Parking' },
      ],
      descriptions: [
        'Casa Secreto Maya is an exceptional oceanfront retreat where refined luxury meets the natural beauty of the Riviera Maya.',
        'Designed for relaxation, entertaining, and meaningful connection, the interiors offer a seamless balance of scale and intimacy.',
        'Outside, an ocean front facing pool and spacious sun terrace extend effortlessly toward the shoreline.',
        'Each of the four bedrooms has been thoughtfully designed as a private sanctuary.',
        'Enhanced by concierge services, daily housekeeping, and a carefully curated collection of local experiences.',
      ],
      features: [
        'Central Air Conditioning', 'Digital Safe', 'Washer & Dryer', 'Fast WiFi – 160 Mbps',
        'Pool Table', 'Hair Dryer', 'Outdoor Shower', 'Ceiling Fans', 'Private Outdoor Pool',
        'Smoke Alarms', 'Dedicated Workspace', 'Microwave', 'Dishwasher', 'Coffee Maker',
      ],
      relatedProperties: [
        { slug: 'casavioleta', name: 'Casa Violetta', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casavioleta/thumb/casaviolettatop.webp', sortOrder: 0 },
        { slug: 'casaricardo', name: 'Casa Ricardo', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casaricardo/thumb/casaricardotop.webp', sortOrder: 1 },
        { slug: 'casamayette', name: 'Casa Mayette', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casamayette/thumb/casamayettetop.webp', sortOrder: 2 },
      ],
    },
    {
      slug: 'casavioleta', name: 'Casa Violetta', type: 'rental', status: 'published',
      badge: 'Rental', location: 'Playacar Phase 1, Playa Del Carmen',
      subtitle: 'Ocean Front, Playacar Phase 1', heroLabel: 'Rental · Playacar Phase 1',
      bedrooms: 5, bathrooms: 5, shortDescription: 'An extraordinary beachfront estate where architectural elegance meets the Caribbean\'s infinite horizon. Five luxuriously appointed suites deliver a private retreat of rare distinction.',
      whatsappUrl: 'https://wa.me/529841681121', displayOrder: 2,
      seoTitle: 'Casa Violetta — Ku Náay Real Estate',
      seoDescription: 'Casa Violetta — a 5-bedroom beachfront estate in Playacar, Playa del Carmen.',
      seoOgImage: 'https://i.ibb.co/vxVMbJNC/Casa-Violetta-101.jpg',
      seoCanonical: 'https://www.kunaay.com/properties/casavioleta',
      heroImage: '/assets/img/photos/rentals/casavioleta/full/casaviolettatop.webp',
      highlights: [
        { icon: 'bed', label: '5 Bedrooms' }, { icon: 'bath', label: '5 Bathrooms' },
        { icon: 'waves', label: 'Beach Front' }, { icon: 'pool', label: 'Private Pool' },
        { icon: 'kitchen', label: 'Full Kitchen' }, { icon: 'parking', label: 'Parking' },
      ],
      descriptions: [
        'Casa Violetta is an extraordinary beachfront estate that embodies the essence of luxury coastal living in the Riviera Maya.',
        'The architecture masterfully blends authentic Mexican craftsmanship with contemporary sophistication.',
        'At the center of the home, an expansive open-concept living and dining area creates a seamless connection between indoor and outdoor living.',
        'Each of the five bedroom suites offers a private sanctuary of comfort and refinement.',
        'Complementing the residence is a dedicated service team committed to delivering a seamless ownership or guest experience.',
      ],
      features: [
        'Central Air Conditioning', 'Digital Safe', 'Washer & Dryer', 'Fast WiFi – 160 Mbps',
        'Pool Table', 'Hair Dryer', 'Outdoor Shower', 'Ceiling Fans', 'Private Outdoor Pool',
        'Smoke Alarms', 'Dedicated Workspace', 'Microwave', 'Dishwasher', 'Coffee Maker',
      ],
      relatedProperties: [
        { slug: 'casasecretomaya', name: 'Casa Secreto Maya', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casasecretomaya/thumb/casasm33.webp', sortOrder: 0 },
        { slug: 'casamayette', name: 'Casa Mayette', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casamayette/thumb/casamayettetop.webp', sortOrder: 1 },
        { slug: 'casaricardo', name: 'Casa Ricardo', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casaricardo/thumb/casaricardotop.webp', sortOrder: 2 },
      ],
    },
    {
      slug: 'casamayette', name: 'Casa Mayette', type: 'rental', status: 'published',
      badge: 'Rental', location: 'Playacar Phase 1, Playa Del Carmen',
      subtitle: 'Ocean Front, Playacar Phase 1', heroLabel: 'Rental · Playacar Phase 1',
      bedrooms: 4, bathrooms: 4, shortDescription: 'Sophisticated poolside living steps from the pristine shores of Playa del Carmen. Thoughtfully curated interiors blend Mexican artisanship with contemporary comfort.',
      whatsappUrl: 'https://wa.me/529841681121', displayOrder: 3,
      seoTitle: 'Casa Mayette — Ku Náay Real Estate',
      seoDescription: 'Casa Mayette — a 4-bedroom beachfront villa in Playacar, Playa del Carmen.',
      seoOgImage: 'https://i.ibb.co/fV1P7rCT/Casa-Mayette-092.jpg',
      seoCanonical: 'https://www.kunaay.com/properties/casamayette',
      heroImage: '/assets/img/photos/rentals/casamayette/full/casamayettetop.webp',
      highlights: [
        { icon: 'bed', label: '4 Bedrooms' }, { icon: 'bath', label: '4 Bathrooms' },
        { icon: 'waves', label: 'Beach Front' }, { icon: 'pool', label: 'Private Pool' },
        { icon: 'kitchen', label: 'Full Kitchen' }, { icon: 'parking', label: 'Parking' },
      ],
      descriptions: [
        'Casa Mayette is an elegant beachfront retreat that embodies the effortless sophistication of Riviera Maya living.',
        'From the moment you arrive, the home\'s generous proportions and airy interiors create an immediate sense of relaxation.',
        'At the heart of the outdoor experience is a beautifully designed private pool surrounded by mature palm trees.',
        'Each of the four bedrooms has been individually designed to offer comfort, privacy, and understated elegance.',
        'A dedicated housekeeping team ensures the residence is maintained to the highest standards.',
      ],
      features: [
        'Central Air Conditioning', 'Digital Safe', 'Washer & Dryer', 'Fast WiFi – 160 Mbps',
        'Pool Table', 'Hair Dryer', 'Outdoor Shower', 'Ceiling Fans', 'Private Outdoor Pool',
        'Smoke Alarms', 'Dedicated Workspace', 'Microwave', 'Dishwasher', 'Coffee Maker',
      ],
      relatedProperties: [
        { slug: 'casasecretomaya', name: 'Casa Secreto Maya', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casasecretomaya/thumb/secretomayatop.webp', sortOrder: 0 },
        { slug: 'casavioleta', name: 'Casa Violetta', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casavioleta/thumb/casaviolettatop.webp', sortOrder: 1 },
        { slug: 'casaricardo', name: 'Casa Ricardo', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casaricardo/thumb/casaricardotop.webp', sortOrder: 2 },
      ],
    },
    {
      slug: 'casaricardo', name: 'Casa Ricardo', type: 'rental', status: 'published',
      badge: 'Rental', location: 'Playacar Phase 1, Playa Del Carmen',
      subtitle: 'Ocean Front, Playacar Phase 1', heroLabel: 'Rental · Playacar Phase 1',
      bedrooms: 5, bathrooms: 5, shortDescription: 'A landmark residence offering five elegant bedrooms and resort-caliber amenities in a tranquil beachside setting. Ideal for those seeking uncompromising space and style.',
      whatsappUrl: 'https://wa.me/529841681121', displayOrder: 4,
      seoTitle: 'Casa Ricardo — Ku Náay Real Estate',
      seoDescription: 'Casa Ricardo — a 5-bedroom luxury estate in Playacar, Playa del Carmen.',
      seoOgImage: 'https://i.ibb.co/nsXx2d5s/Casa-Ricardo-018.jpg',
      seoCanonical: 'https://www.kunaay.com/properties/casaricardo',
      heroImage: '/assets/img/photos/rentals/casaricardo/full/casaricardotop.webp',
      highlights: [
        { icon: 'bed', label: '5 Bedrooms' }, { icon: 'bath', label: '5 Bathrooms' },
        { icon: 'waves', label: 'Ocean View' }, { icon: 'pool', label: 'Private Pool' },
        { icon: 'kitchen', label: 'Full Kitchen' }, { icon: 'parking', label: 'Parking' },
      ],
      descriptions: [
        'Casa Ricardo is a distinguished luxury estate that embodies refined elegance, exceptional craftsmanship, and sophisticated living.',
        'From the moment of arrival, the property reveals a sense of understated grandeur.',
        'Designed to accommodate both elegant entertaining and private relaxation, the home\'s generous living spaces flow effortlessly.',
        'Outside, the expansive pool offers a private resort-style experience.',
        'Each of the five bedrooms has been individually designed as a private retreat.',
      ],
      features: [
        'Central Air Conditioning', 'Digital Safe', 'Washer & Dryer', 'Fast WiFi – 160 Mbps',
        'Pool Table', 'Hair Dryer', 'Outdoor Shower', 'Ceiling Fans', 'Private Outdoor Pool',
        'Smoke Alarms', 'Dedicated Workspace', 'Microwave', 'Dishwasher', 'Coffee Maker',
      ],
      relatedProperties: [
        { slug: 'casasecretomaya', name: 'Casa Secreto Maya', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casasecretomaya/thumb/secretomayatop.webp', sortOrder: 0 },
        { slug: 'casavioleta', name: 'Casa Violetta', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casavioleta/thumb/casaviolettatop.webp', sortOrder: 1 },
        { slug: 'casamayette', name: 'Casa Mayette', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casamayette/thumb/casamayettetop.webp', sortOrder: 2 },
      ],
    },
    {
      slug: 'casafotoplus', name: 'Casa FotoPlus', type: 'rental', status: 'published',
      badge: 'Rental', location: 'Playacar Phase 1, Playa Del Carmen',
      subtitle: 'Residence Side, Playacar Phase 1', heroLabel: 'Rental · Playacar Phase 1',
      bedrooms: 3, bathrooms: 3, shortDescription: 'A serene three-bedroom villa where lush landscaping and architectural detail create a truly private paradise. Perfect for intimate gatherings or a refined family getaway.',
      whatsappUrl: 'https://wa.me/529841681121', displayOrder: 5,
      seoTitle: 'Casa FotoPlus — Ku Náay Real Estate',
      seoDescription: 'Casa FotoPlus — a 3-bedroom private villa in Playacar, Playa del Carmen.',
      seoOgImage: 'https://i.ibb.co/60cHvKsX/Secreto-maya-74-1.jpg',
      seoCanonical: 'https://www.kunaay.com/properties/casafotoplus',
      heroImage: '/assets/img/photos/rentals/casafotoplus/casafp1.webp',
      highlights: [
        { icon: 'bed', label: '3 Bedrooms' }, { icon: 'bath', label: '3 Bathrooms' },
        { icon: 'coffee', label: 'Tropical Garden' }, { icon: 'pool', label: 'Private Pool' },
        { icon: 'kitchen', label: 'Full Kitchen' }, { icon: 'parking', label: 'Parking' },
      ],
      descriptions: [
        'Casa FotoPlus is a refined private villa that offers a distinctive blend of tranquility, artistry, and contemporary Riviera Maya living.',
        'Named for the curated collection of photographic works displayed throughout the home.',
        'The interiors have been designed with a focus on comfort, craftsmanship, and understated elegance.',
        'At the heart of the outdoor space, a private swimming pool is surrounded by expansive sun terraces.',
        'Accommodating up to six guests, the villa\'s three bedrooms have been individually designed.',
      ],
      features: [
        'Central Air Conditioning', 'Digital Safe', 'Washer & Dryer', 'Fast WiFi – 160 Mbps',
        'Pool Table', 'Hair Dryer', 'Outdoor Shower', 'Ceiling Fans', 'Private Outdoor Pool',
        'Smoke Alarms', 'Dedicated Workspace', 'Microwave', 'Dishwasher', 'Coffee Maker',
      ],
      relatedProperties: [
        { slug: 'casasecretomaya', name: 'Casa Secreto Maya', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casasecretomaya/thumb/casasm33.webp', sortOrder: 0 },
        { slug: 'casavioleta', name: 'Casa Violetta', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casavioleta/thumb/casaviolettatop.webp', sortOrder: 1 },
        { slug: 'casaricardo', name: 'Casa Ricardo', location: 'Playa Del Carmen', image: '/assets/img/photos/rentals/casaricardo/thumb/casaricardotop.webp', sortOrder: 2 },
      ],
    },
    {
      slug: 'casachukum', name: 'Casa Chukum', type: 'sale', status: 'published',
      badge: 'For Sale', location: 'Aldea Zama, Tulum',
      subtitle: 'Aldea Zama, Tulum', heroLabel: 'For Sale · Aldea Zama, Tulum',
      bedrooms: 4, bathrooms: 4, shortDescription: 'A rare acquisition opportunity — a stunning four-bedroom villa built with traditional chukum finish, offering timeless character and exceptional investment potential.',
      whatsappUrl: 'https://wa.me/529841681121', displayOrder: 6,
      seoTitle: 'Casa Chukum — Ku Náay Real Estate',
      seoDescription: 'Casa Chukum — a 4-bedroom villa for sale in Aldea Zama, Tulum.',
      seoOgImage: 'https://i.ibb.co/4R1DBhVF/Secreto-maya-25-1.jpg',
      seoCanonical: 'https://www.kunaay.com/properties/casachukum',
      heroImage: '/assets/img/photos/sales/casachukum/full/casackm12.webp',
      highlights: [
        { icon: 'bed', label: '4 Bedrooms' }, { icon: 'bath', label: '4 Bathrooms' },
        { icon: 'home', label: 'Gated Community' }, { icon: 'pool', label: 'Private Pool' },
        { icon: 'kitchen', label: 'Full Kitchen' }, { icon: 'parking', label: 'Parking' },
      ],
      descriptions: [
        'Casa Chukum is an exceptional architectural residence in Tulum, thoughtfully crafted to honor the natural beauty, heritage, and craftsmanship of the Riviera Maya.',
        'Constructed by one of the Riviera Maya\'s most respected contractors, the residence showcases a level of craftsmanship that is increasingly difficult to find.',
        'The architecture embraces Tulum\'s signature indoor-outdoor lifestyle.',
        'At the heart of the home, the open-concept living and dining areas offer generous proportions.',
        'Each of the four bedroom suites has been conceived as a private retreat.',
      ],
      features: [],
      relatedProperties: [
        { slug: 'casasecretomaya', name: 'Casa Secreto Maya', location: 'Playa Del Carmen', image: 'https://i.ibb.co/sBNn7VP/Secreto-maya-81-1.jpg', sortOrder: 0 },
        { slug: 'casavioleta', name: 'Casa Violetta', location: 'Playa Del Carmen', image: 'https://i.ibb.co/vxVMbJNC/Casa-Violetta-101.jpg', sortOrder: 1 },
        { slug: 'casamayette', name: 'Casa Mayette', location: 'Playa Del Carmen', image: 'https://i.ibb.co/1hD1Z5J/Casa-Mayette-097.jpg', sortOrder: 2 },
      ],
    },
  ];

  for (const p of props) {
    const existing = await prisma.property.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`Skipping ${p.slug} (already exists)`);
      continue;
    }

    await prisma.property.create({
      data: {
        slug: p.slug, name: p.name, type: p.type, status: p.status,
        badge: p.badge, location: p.location, subtitle: p.subtitle,
        heroLabel: p.heroLabel, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
        shortDescription: p.shortDescription, whatsappUrl: p.whatsappUrl,
        displayOrder: p.displayOrder, seoTitle: p.seoTitle,
        seoDescription: p.seoDescription, seoOgImage: p.seoOgImage,
        seoCanonical: p.seoCanonical,
        images: {
          create: [{ url: p.heroImage, thumbUrl: p.heroImage, title: p.name, isHero: true, sortOrder: 0 }],
        },
        highlights: {
          create: p.highlights.map((h, i) => ({ icon: h.icon, label: h.label, sortOrder: i })),
        },
        descriptions: {
          create: p.descriptions.map((text, i) => ({ text, sortOrder: i })),
        },
        features: {
          create: p.features.map((text, i) => ({ text, sortOrder: i })),
        },
        relatedTo: {
          create: p.relatedProperties,
        },
      },
    });
    console.log(`Created ${p.slug}`);
  }

  console.log('Seed complete. Login: admin@kunaay.com / kunaay2026');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
