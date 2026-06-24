import { PrismaClient } from '../src/generated/prisma/client';
import { createDatabaseAdapter } from '../src/lib/db-adapter';
import bcrypt from 'bcryptjs';
import { existsSync } from 'fs';
import { join } from 'path';
import { properties as staticProperties } from '../src/data/properties';

const prisma = new PrismaClient({ adapter: createDatabaseAdapter() });

// Build the ordered gallery image rows for a property from the curated image
// set in src/data/properties.ts. Local files are kept only if they actually
// exist on disk, so the seed never introduces broken image paths.
function galleryImageData(slug: string, fallbackHero: string, name: string) {
  const data = staticProperties.find((sp) => sp.slug === slug);
  const candidates = data?.gallery.lightbox?.length ? data.gallery.lightbox : [fallbackHero];
  const present = candidates.filter((url) =>
    url.startsWith('/') ? existsSync(join(process.cwd(), url)) : true
  );
  const urls = present.length > 0 ? present : [fallbackHero];
  return urls.map((url, i) => ({
    url,
    thumbUrl: url,
    title: name,
    isHero: i === 0,
    isCover: i === 0,
    sortOrder: i,
  }));
}

// Full premium descriptions come from src/data/properties.ts (the canonical
// content, identical to the original static pages). Falls back to the inline
// summary only if a property is missing from the canonical data.
function descriptionData(slug: string, fallback: string[]) {
  const data = staticProperties.find((sp) => sp.slug === slug);
  const texts = data?.longDescriptions?.length ? data.longDescriptions : fallback;
  return texts.map((text, i) => ({ text, sortOrder: i }));
}

async function main() {
  // Preflight: the seed needs a database connection string.
  if (!process.env.DATABASE_URL) {
    throw new Error('Environment variable not found: DATABASE_URL');
  }

  // Admin user — configured via ADMIN_EMAIL / ADMIN_PASSWORD in .env.
  // We deliberately require an explicit password rather than falling back to a
  // hardcoded default, so a known credential is never seeded into a database.
  const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@kunaay.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      'ADMIN_PASSWORD is not set. Add a strong ADMIN_PASSWORD (and ADMIN_EMAIL) to your .env before seeding the admin user.'
    );
  }
  const password = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password, role: 'admin' },
    create: { email: adminEmail, password, name: 'Admin', role: 'admin' },
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
    const images = galleryImageData(p.slug, p.heroImage, p.name);
    const descriptions = descriptionData(p.slug, p.descriptions);
    const existing = await prisma.property.findUnique({
      where: { slug: p.slug },
      include: { images: true },
    });

    if (existing) {
      // Restore the canonical gallery and descriptions for the demo
      // properties: this re-syncs the full image set (removing any stray or
      // test images added through the admin) and replaces truncated
      // descriptions with the complete originals. Properties you add yourself
      // (other slugs) are never touched.
      await prisma.propertyImage.deleteMany({ where: { propertyId: existing.id } });
      await prisma.propertyImage.createMany({
        data: images.map((img) => ({ ...img, propertyId: existing.id })),
      });
      await prisma.propertyDescription.deleteMany({ where: { propertyId: existing.id } });
      await prisma.propertyDescription.createMany({
        data: descriptions.map((d) => ({ ...d, propertyId: existing.id })),
      });
      console.log(`Restored ${p.slug}: ${images.length} images, ${descriptions.length} description paragraphs`);
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
          create: images,
        },
        highlights: {
          create: p.highlights.map((h, i) => ({ icon: h.icon, label: h.label, sortOrder: i })),
        },
        descriptions: {
          create: descriptions,
        },
        features: {
          create: p.features.map((text, i) => ({ text, sortOrder: i })),
        },
        relatedTo: {
          create: p.relatedProperties,
        },
      },
    });
    console.log(`Created ${p.slug}: ${images.length} images, ${descriptions.length} description paragraphs`);
  }

  console.log(`Seed complete. Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e: unknown) => {
    const msg = e instanceof Error ? e.message : String(e);
    const code = (e as { code?: string })?.code;
    const line = '\n──────────────────────────────────────────────\n';

    if (msg.includes('Environment variable not found: DATABASE_URL') || !process.env.DATABASE_URL) {
      console.error(`${line}[seed] DATABASE_URL is not set.${line}` +
        'Create your local env file, then re-run:\n\n' +
        '  cp .env.example .env\n' +
        '  npx prisma migrate deploy\n' +
        '  npx prisma db seed\n\n' +
        '(.env must contain DATABASE_URL, e.g. DATABASE_URL="file:./dev.db")\n');
    } else if (code === 'P2021' || code === 'P1014' || /does not exist|no such table/i.test(msg)) {
      console.error(`${line}[seed] The database tables do not exist yet.${line}` +
        'Create them first, then re-run the seed:\n\n' +
        '  npx prisma migrate deploy\n' +
        '  npx prisma db seed\n');
    } else if (code === 'P1001' || /can't reach database server/i.test(msg)) {
      console.error(`${line}[seed] Cannot reach the database.${line}` +
        'Check that DATABASE_URL in .env is correct and the database is running.\n');
    } else {
      console.error(e);
    }
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
