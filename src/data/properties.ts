import type { Property } from './types';

export const properties: Property[] = [
  {
    id: 'casasecretomaya',
    slug: 'casasecretomaya',
    name: 'Casa Secreto Maya',
    type: 'rental',
    status: 'available',
    badge: 'Rental',
    location: 'Playacar Phase 1, Playa Del Carmen',
    subtitle: 'Ocean Front, Playacar Phase 1',
    heroLabel: 'Rental · Playacar Phase 1',
    bedrooms: 4,
    bathrooms: 5,
    highlights: [
      { icon: 'bed', label: '4 Bedrooms' },
      { icon: 'bath', label: '5 Bathrooms' },
      { icon: 'waves', label: 'Ocean Front' },
      { icon: 'pool', label: 'Private Pool' },
      { icon: 'kitchen', label: 'Full Kitchen' },
      { icon: 'parking', label: 'Parking' },
    ],
    shortDescription:
      'A masterpiece of privacy nestled within lush tropical gardens with direct ocean access. Four refined bedrooms and five baths create an intimate sanctuary for discerning travelers.',
    longDescriptions: [
      'Casa Secreto Maya is an exceptional oceanfront retreat where refined luxury meets the natural beauty of the Riviera Maya. Surrounded by lush tropical gardens and framed by the gentle waters of the Caribbean, this distinguished four-bedroom, five-bathroom residence enjoys a coveted beachfront setting with uninterrupted ocean views from the pool terrace, upper-level lounge, and every elegantly appointed guest suite.',
      'Designed for relaxation, entertaining, and meaningful connection, the interiors offer a seamless balance of scale and intimacy. The expansive open-concept living area serves as the heart of the home, providing an inviting setting for both family gatherings and elegant social occasions. The fully equipped gourmet kitchen features custom cabinetry, premium finishes, and every detail needed to inspire memorable culinary experiences, whether preparing a private meal or enjoying the services of an available private chef.',
      'Outside, a ocean front facing pool and spacious sun terrace extend effortlessly toward the shoreline, creating a breathtaking setting where the horizon becomes part of everyday living. Here, indoor and outdoor spaces merge naturally, allowing residents and guests to experience the beauty of the Caribbean at every moment.',
      'Each of the four bedrooms has been thoughtfully designed as a private sanctuary, combining understated elegance with the relaxed comfort of coastal living. The primary suite occupies the home\'s premier oceanfront position and features a private balcony, a generous walk-in closet, and a luxurious ensuite bathroom complete with a soaking tub overlooking the sea. Three additional guest suites, each with a private ensuite bathroom and access to beautifully landscaped garden terraces, provide an exceptional level of comfort and privacy.',
      'Enhanced by concierge services, daily housekeeping, and a carefully curated collection of local experiences, Casa Secreto Maya offers more than a residence. It offers an elevated lifestyle immersed in the beauty, culture, and tranquility of the Riviera Maya.',
    ],
    features: [
      'Central Air Conditioning', 'Digital Safe', 'Washer & Dryer', 'Fast WiFi – 160 Mbps',
      'Pool Table', 'Hair Dryer', 'Outdoor Shower', 'Hangers', 'Iron', 'Walk-in Closets',
      'Ceiling Fans', 'Private Outdoor Pool', 'Smoke Alarms', 'Carbon Monoxide Alarms',
      'Dedicated Workspace', 'Microwave', 'Dishwasher', 'Coffee Maker', 'Blender', 'Toaster',
      'Mosquito Nets',
    ],
    gallery: {
      cardThumbs: [
        '/assets/img/photos/rentals/casasecretomaya/thumb/casasm33.webp',
        'https://i.ibb.co/60cHvKsX/Secreto-maya-74-1.jpg',
        'https://i.ibb.co/vM6HB6g/Secreto-maya-10-1.jpg',
      ],
      heroImage: '/assets/img/photos/rentals/casasecretomaya/full/secretomayatop.webp',
      gridThumbs: [
        '/assets/img/photos/rentals/casasecretomaya/full/secretomayatop.webp',
        '/assets/img/photos/rentals/casasecretomaya/thumb/casasm33.webp',
        '/assets/img/photos/rentals/casasecretomaya/full/casasm2.webp',
        '/assets/img/photos/rentals/casasecretomaya/full/casasm3.webp',
      ],
      lightbox: Array.from({ length: 24 }, (_, i) =>
        i === 0
          ? '/assets/img/photos/rentals/casasecretomaya/full/secretomayatop.webp'
          : `/assets/img/photos/rentals/casasecretomaya/full/casasm${i}.webp`
      ),
    },
    bookedDays: [3, 4, 5, 12, 13, 14, 20, 21, 22],
    relatedProperties: [
      {
        slug: 'casavioleta',
        name: 'Casa Violetta',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casavioleta/thumb/casaviolettatop.webp',
      },
      {
        slug: 'casaricardo',
        name: 'Casa Ricardo',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casaricardo/thumb/casaricardotop.webp',
      },
      {
        slug: 'casamayette',
        name: 'Casa Mayette',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casamayette/thumb/casamayettetop.webp',
      },
    ],
    whatsappUrl: 'https://wa.me/529841681121',
    seo: {
      title: 'Casa Secreto Maya — Ku Náay Real Estate',
      description: 'Casa Secreto Maya — a 4-bedroom oceanfront estate in Playacar, Playa del Carmen. A luxury vacation rental by Ku Náay Real Estate.',
      ogImage: 'https://i.ibb.co/4R1DBhVF/Secreto-maya-25-1.jpg',
      canonical: 'https://www.kunaay.com/properties/casasecretomaya',
    },
  },

  {
    id: 'casavioleta',
    slug: 'casavioleta',
    name: 'Casa Violetta',
    type: 'rental',
    status: 'available',
    badge: 'Rental',
    location: 'Playacar Phase 1, Playa Del Carmen',
    subtitle: 'Ocean Front, Playacar Phase 1',
    heroLabel: 'Rental · Playacar Phase 1',
    bedrooms: 5,
    bathrooms: 5,
    highlights: [
      { icon: 'bed', label: '5 Bedrooms' },
      { icon: 'bath', label: '5 Bathrooms' },
      { icon: 'waves', label: 'Beach Front' },
      { icon: 'pool', label: 'Private Pool' },
      { icon: 'kitchen', label: 'Full Kitchen' },
      { icon: 'parking', label: 'Parking' },
    ],
    shortDescription:
      'An extraordinary beachfront estate where architectural elegance meets the Caribbean\'s infinite horizon. Five luxuriously appointed suites deliver a private retreat of rare distinction.',
    longDescriptions: [
      'Casa Violetta is an extraordinary beachfront estate that embodies the essence of luxury coastal living in the Riviera Maya. Positioned directly along the pristine shores of the Caribbean Sea, this remarkable five-bedroom, five-bathroom residence captures breathtaking ocean views from nearly every space, creating an atmosphere of effortless elegance and tranquility.',
      'The architecture masterfully blends authentic Mexican craftsmanship with contemporary sophistication. Hand-finished stonework, warm terracotta accents, and soaring palapa ceilings reflect the region’s rich heritage, while designer furnishings, premium finishes, and modern amenities deliver the highest standard of comfort and style.',
      'At the center of the home, an expansive open-concept living and dining area creates a seamless connection between indoor and outdoor living. Floor-to-ceiling glass doors open onto a sprawling oceanfront terrace, where an impressive infinity-edge pool appears to merge with the turquoise waters beyond. Designed for both intimate gatherings and elegant entertaining, every space has been thoughtfully curated to embrace the beauty of its surroundings.',
      'Each of the five bedroom suites offers a private sanctuary of comfort and refinement. Featuring king-size accommodations, luxurious ensuite marble bathrooms, and carefully selected artwork inspired by the culture and colors of the Yucatán Peninsula, every room provides a distinctive sense of place. The primary suite occupies its own private wing and features a spacious oceanfront terrace, a deep soaking tub positioned to capture spectacular sunrise views, and an expansive walk-in dressing room designed with both elegance and functionality in mind.',
      'Complementing the residence is a dedicated service team committed to delivering a seamless ownership or guest experience. Daily housekeeping, concierge services, and access to a private chef upon request allow every stay to be tailored to individual preferences. From exclusive cenote adventures and private yacht charters to curated culinary experiences, every detail can be arranged with exceptional care and attention.',
      'Located within a prestigious gated community just minutes from the boutiques, restaurants, and vibrant atmosphere of Playa del Carmen’s renowned Fifth Avenue, Casa Violetta offers a rare balance of privacy and convenience. Whether enjoyed as a luxurious private retreat or held as a premier investment property, this exceptional residence represents one of the Riviera Maya’s most compelling opportunities for beachfront ownership.',
    ],
    features: [
      'Central Air Conditioning', 'Digital Safe', 'Washer & Dryer', 'Fast WiFi – 160 Mbps',
      'Pool Table', 'Hair Dryer', 'Outdoor Shower', 'Hangers', 'Iron', 'Walk-in Closets',
      'Ceiling Fans', 'Private Outdoor Pool', 'Smoke Alarms', 'Carbon Monoxide Alarms',
      'Dedicated Workspace', 'Microwave', 'Dishwasher', 'Coffee Maker', 'Blender', 'Toaster',
      'Mosquito Nets',
    ],
    gallery: {
      cardThumbs: [
        '/assets/img/photos/rentals/casavioleta/thumb/casaviolettatop.webp',
        'https://i.ibb.co/DHv8b7cV/Casa-Violetta-019.jpg',
        'https://i.ibb.co/3ynzCJnK/Casa-Violetta-028.jpg',
      ],
      heroImage: '/assets/img/photos/rentals/casavioleta/full/casaviolettatop.webp',
      gridThumbs: [
        '/assets/img/photos/rentals/casavioleta/full/casaviolettatop.webp',
        '/assets/img/photos/rentals/casavioleta/thumb/casavi1.webp',
        '/assets/img/photos/rentals/casavioleta/thumb/casavi2.webp',
        '/assets/img/photos/rentals/casavioleta/thumb/casavi3.webp',
      ],
      lightbox: [
        '/assets/img/photos/rentals/casavioleta/full/casaviolettatop.webp',
        ...Array.from({ length: 35 }, (_, i) => `/assets/img/photos/rentals/casavioleta/full/casavi${i + 1}.webp`),
      ],
    },
    bookedDays: [3, 4, 5, 12, 13, 14, 20, 21, 22],
    relatedProperties: [
      {
        slug: 'casasecretomaya',
        name: 'Casa Secreto Maya',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casasecretomaya/thumb/secretomayatop.webp',
      },
      {
        slug: 'casamayette',
        name: 'Casa Mayette',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casamayette/thumb/casamayettetop.webp',
      },
      {
        slug: 'casaricardo',
        name: 'Casa Ricardo',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casaricardo/thumb/casaricardotop.webp',
      },
    ],
    whatsappUrl: 'https://wa.me/529841681121',
    seo: {
      title: 'Casa Violetta — Ku Náay Real Estate',
      description: 'Casa Violetta — a 5-bedroom beachfront estate in Playacar, Playa del Carmen. A luxury vacation rental by Ku Náay Real Estate.',
      ogImage: 'https://i.ibb.co/vxVMbJNC/Casa-Violetta-101.jpg',
      canonical: 'https://www.kunaay.com/properties/casavioleta',
    },
  },

  {
    id: 'casamayette',
    slug: 'casamayette',
    name: 'Casa Mayette',
    type: 'rental',
    status: 'available',
    badge: 'Rental',
    location: 'Playacar Phase 1, Playa Del Carmen',
    subtitle: 'Ocean Front, Playacar Phase 1',
    heroLabel: 'Rental · Playacar Phase 1',
    bedrooms: 4,
    bathrooms: 4,
    highlights: [
      { icon: 'bed', label: '4 Bedrooms' },
      { icon: 'bath', label: '4 Bathrooms' },
      { icon: 'waves', label: 'Beach Front' },
      { icon: 'pool', label: 'Private Pool' },
      { icon: 'kitchen', label: 'Full Kitchen' },
      { icon: 'parking', label: 'Parking' },
    ],
    shortDescription:
      'Sophisticated poolside living steps from the pristine shores of Playa del Carmen. Thoughtfully curated interiors blend Mexican artisanship with contemporary comfort.',
    longDescriptions: [
      'Casa Mayette is an elegant beachfront retreat that embodies the effortless sophistication of Riviera Maya living. Set along a coveted stretch of Caribbean coastline, this exceptional four-bedroom, four-bathroom villa has been thoughtfully designed to offer a seamless blend of comfort, style, and coastal serenity.',
      'From the moment you arrive, the home’s generous proportions and airy interiors create an immediate sense of relaxation. High ceilings, natural light, and carefully selected materials including pale stone flooring, hand-finished plaster walls, and native wood accents establish an atmosphere that is both refined and deeply connected to its surroundings. The villa’s flowing layout encourages effortless indoor-outdoor living, with inviting social spaces that open onto terraces and landscaped gardens designed for both sun-filled afternoons and elegant evenings under the stars.',
      'At the heart of the outdoor experience is a beautifully designed private pool surrounded by mature palm trees, expansive sun terraces, and thoughtfully arranged lounge areas. Sliding glass doors connect the open-concept living and dining spaces to the outdoors, allowing the gentle ocean breeze and tropical ambiance to become part of everyday life. The fully equipped gourmet kitchen serves as the centerpiece for memorable gatherings, featuring professional-grade appliances, generous preparation areas, and every convenience needed for both private chefs and passionate home cooks. Morning coffee or breakfast on the terrace, accompanied by the sound of the Caribbean waves, is among the many simple luxuries that define life at Casa Mayette.',
      'Each of the four bedrooms has been individually designed to offer comfort, privacy, and understated elegance. The primary suite enjoys a privileged oceanfront position with direct sea views from its private terrace. Its luxurious ensuite bathroom features a freestanding soaking tub, rain shower, and beautifully crafted artisan tilework that reflects the region’s rich design heritage. Three additional guest bedrooms, each with a private or dedicated bathroom, provide an exceptional level of comfort and privacy for family and guests alike.',
      'A dedicated housekeeping team ensures the residence is maintained to the highest standards, while personalized concierge services can arrange a wide range of bespoke experiences, from private sunset sailing and exclusive dining experiences to guided visits to the ancient wonders of Tulum and Cobá. More than a beachfront villa, Casa Mayette offers an immersive experience defined by authentic luxury, exceptional comfort, and the timeless beauty of the Riviera Maya.',
    ],
    features: [
      'Central Air Conditioning', 'Digital Safe', 'Washer & Dryer', 'Fast WiFi – 160 Mbps',
      'Pool Table', 'Hair Dryer', 'Outdoor Shower', 'Hangers', 'Iron', 'Walk-in Closets',
      'Ceiling Fans', 'Private Outdoor Pool', 'Smoke Alarms', 'Carbon Monoxide Alarms',
      'Dedicated Workspace', 'Microwave', 'Dishwasher', 'Coffee Maker', 'Blender', 'Toaster',
      'Mosquito Nets',
    ],
    gallery: {
      cardThumbs: [
        '/assets/img/photos/rentals/casamayette/thumb/casamy28.webp',
        'https://i.ibb.co/fV1P7rCT/Casa-Mayette-092.jpg',
        'https://i.ibb.co/FkRBxRRQ/Night-Photography-8.jpg',
      ],
      heroImage: '/assets/img/photos/rentals/casamayette/full/casamayettetop.webp',
      gridThumbs: [
        '/assets/img/photos/rentals/casamayette/full/casamayettetop.webp',
        '/assets/img/photos/rentals/casamayette/thumb/casamy28.webp',
        '/assets/img/photos/rentals/casamayette/full/casamy2.webp',
        '/assets/img/photos/rentals/casamayette/full/casamy3.webp',
      ],
      lightbox: [
        '/assets/img/photos/rentals/casamayette/full/casamayettetop.webp',
        ...Array.from({ length: 36 }, (_, i) => `/assets/img/photos/rentals/casamayette/full/casamy${i + 1}.webp`),
      ],
    },
    bookedDays: [3, 4, 5, 12, 13, 14, 20, 21, 22],
    relatedProperties: [
      {
        slug: 'casasecretomaya',
        name: 'Casa Secreto Maya',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casasecretomaya/thumb/secretomayatop.webp',
      },
      {
        slug: 'casavioleta',
        name: 'Casa Violetta',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casavioleta/thumb/casaviolettatop.webp',
      },
      {
        slug: 'casaricardo',
        name: 'Casa Ricardo',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casaricardo/thumb/casaricardotop.webp',
      },
    ],
    whatsappUrl: 'https://wa.me/529841681121',
    seo: {
      title: 'Casa Mayette — Ku Náay Real Estate',
      description: 'Casa Mayette — a 4-bedroom beachfront villa in Playacar, Playa del Carmen. A luxury vacation rental by Ku Náay Real Estate.',
      ogImage: 'https://i.ibb.co/fV1P7rCT/Casa-Mayette-092.jpg',
      canonical: 'https://www.kunaay.com/properties/casamayette',
    },
  },

  {
    id: 'casaricardo',
    slug: 'casaricardo',
    name: 'Casa Ricardo',
    type: 'rental',
    status: 'available',
    badge: 'Rental',
    location: 'Playacar Phase 1, Playa Del Carmen',
    subtitle: 'Ocean Front, Playacar Phase 1',
    heroLabel: 'Rental · Playacar Phase 1',
    bedrooms: 5,
    bathrooms: 5,
    highlights: [
      { icon: 'bed', label: '5 Bedrooms' },
      { icon: 'bath', label: '5 Bathrooms' },
      { icon: 'waves', label: 'Ocean View' },
      { icon: 'pool', label: 'Private Pool' },
      { icon: 'kitchen', label: 'Full Kitchen' },
      { icon: 'parking', label: 'Parking' },
    ],
    shortDescription:
      'A landmark residence offering five elegant bedrooms and resort-caliber amenities in a tranquil beachside setting. Ideal for those seeking uncompromising space and style.',
    longDescriptions: [
      'Casa Ricardo is a distinguished luxury estate that embodies refined elegance, exceptional craftsmanship, and sophisticated living in one of Playa del Carmen’s most prestigious residential communities. This remarkable five-bedroom, five-bathroom residence has been thoughtfully designed to balance architectural presence with everyday comfort, creating a home that feels both impressive and welcoming.',
      'From the moment of arrival, the property reveals a sense of understated grandeur. Expansive entry spaces, soaring ceilings, and a carefully curated palette of natural stone, rich wood finishes, and abundant natural light establish an atmosphere of timeless sophistication. Every detail has been considered to create a seamless connection between contemporary luxury and the beauty of the Riviera Maya.',
      'Designed to accommodate both elegant entertaining and private relaxation, the home’s generous living spaces flow effortlessly from one to another. The dramatic open-concept salon features double-height ceilings and serves as the centerpiece of the residence, complemented by a designer kitchen equipped with professional-grade appliances and a formal dining area designed to host up to twelve guests in comfort and style. Floor-to-ceiling glass walls frame beautiful views of the private pool and lush tropical gardens, creating a serene backdrop for gatherings, celebrations, and everyday living.',
      'Outside, the expansive pool offers a private resort-style experience, complete with a shallow lounging area, premium sun decks, and beautifully landscaped surroundings that invite relaxation throughout the day. The outdoor spaces have been thoughtfully designed to embrace the region’s year-round tropical climate while providing an exceptional setting for both quiet moments and social occasions.',
      'Each of the five bedrooms has been individually designed as a private retreat, combining comfort, elegance, and a strong sense of privacy. The primary suite occupies its own secluded upper-level wing and features a private sitting area, a custom walk-in wardrobe, and a spa-inspired ensuite bathroom appointed with Italian marble, dual vanities, and a luxurious soaking tub. Four additional guest suites, each with a private ensuite bathroom and access to a terrace or garden area, provide the same exceptional standard of comfort and attention to detail found throughout the home.',
      'Additional amenities include secure private parking, a dedicated laundry and utility suite, and access to personalized concierge services capable of arranging everything from private chef experiences and airport transfers to diving adventures and curated local excursions. Offering an extraordinary combination of space, design, privacy, and service, Casa Ricardo represents one of the Riviera Maya’s most exceptional residential opportunities.',
    ],
    features: [
      'Central Air Conditioning', 'Digital Safe', 'Washer & Dryer', 'Fast WiFi – 160 Mbps',
      'Pool Table', 'Hair Dryer', 'Outdoor Shower', 'Hangers', 'Iron', 'Walk-in Closets',
      'Ceiling Fans', 'Private Outdoor Pool', 'Smoke Alarms', 'Carbon Monoxide Alarms',
      'Dedicated Workspace', 'Microwave', 'Dishwasher', 'Coffee Maker', 'Blender', 'Toaster',
      'Mosquito Nets',
    ],
    gallery: {
      cardThumbs: [
        '/assets/img/photos/rentals/casaricardo/thumb/casaricardotop.webp',
        'https://i.ibb.co/nsXx2d5s/Casa-Ricardo-018.jpg',
        'https://i.ibb.co/V0yXGRk0/Casa-Ricardo-090.jpg',
      ],
      heroImage: '/assets/img/photos/rentals/casaricardo/full/casaricardotop.webp',
      gridThumbs: [
        '/assets/img/photos/rentals/casaricardo/full/casaricardotop.webp',
        '/assets/img/photos/rentals/casaricardo/thumb/casaricardotop.webp',
        '/assets/img/photos/rentals/casaricardo/full/casari2.webp',
        '/assets/img/photos/rentals/casaricardo/full/casari3.webp',
      ],
      lightbox: [
        '/assets/img/photos/rentals/casaricardo/full/casaricardotop.webp',
        ...Array.from({ length: 35 }, (_, i) => `/assets/img/photos/rentals/casaricardo/full/casari${i + 1}.webp`),
      ],
    },
    bookedDays: [3, 4, 5, 12, 13, 14, 20, 21, 22],
    relatedProperties: [
      {
        slug: 'casasecretomaya',
        name: 'Casa Secreto Maya',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casasecretomaya/thumb/secretomayatop.webp',
      },
      {
        slug: 'casavioleta',
        name: 'Casa Violetta',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casavioleta/thumb/casaviolettatop.webp',
      },
      {
        slug: 'casamayette',
        name: 'Casa Mayette',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casamayette/thumb/casamayettetop.webp',
      },
    ],
    whatsappUrl: 'https://wa.me/529841681121',
    seo: {
      title: 'Casa Ricardo — Ku Náay Real Estate',
      description: 'Casa Ricardo — a 5-bedroom luxury estate in Playacar, Playa del Carmen. A luxury vacation rental by Ku Náay Real Estate.',
      ogImage: 'https://i.ibb.co/nsXx2d5s/Casa-Ricardo-018.jpg',
      canonical: 'https://www.kunaay.com/properties/casaricardo',
    },
  },

  {
    id: 'casafotoplus',
    slug: 'casafotoplus',
    name: 'Casa FotoPlus',
    type: 'rental',
    status: 'available',
    badge: 'Rental',
    location: 'Playacar Phase 1, Playa Del Carmen',
    subtitle: 'Residence Side, Playacar Phase 1',
    heroLabel: 'Rental · Playacar Phase 1',
    bedrooms: 3,
    bathrooms: 3,
    highlights: [
      { icon: 'bed', label: '3 Bedrooms' },
      { icon: 'bath', label: '3 Bathrooms' },
      { icon: 'coffee', label: 'Tropical Garden' },
      { icon: 'pool', label: 'Private Pool' },
      { icon: 'kitchen', label: 'Full Kitchen' },
      { icon: 'parking', label: 'Parking' },
    ],
    shortDescription:
      'A serene three-bedroom villa where lush landscaping and architectural detail create a truly private paradise. Perfect for intimate gatherings or a refined family getaway.',
    longDescriptions: [
      'Casa FotoPlus is a refined private villa that offers a distinctive blend of tranquility, artistry, and contemporary Riviera Maya living. Nestled within beautifully landscaped tropical gardens in one of Playa del Carmen’s most peaceful residential neighborhoods, this elegant three-bedroom, three-bathroom residence provides a private sanctuary where thoughtful design and natural beauty come together effortlessly.',
      'Named for the curated collection of photographic works displayed throughout the home, Casa FotoPlus celebrates the culture, landscapes, and spirit of the Riviera Maya through the lens of talented local artists. The result is an atmosphere that feels both sophisticated and deeply connected to its surroundings. Towering palms, vibrant bougainvillea, and lush tropical gardens create a sense of privacy and serenity from the moment of arrival, while the gentle scent of tropical blooms and the soft Caribbean light enhance the home’s inviting ambiance.',
      'The interiors have been designed with a focus on comfort, craftsmanship, and understated elegance. Warm-toned plaster walls, locally sourced natural stone flooring, and custom-built furnishings create a timeless aesthetic that feels both luxurious and welcoming. The spacious living and dining areas open seamlessly to the outdoor terrace through folding glass walls, transforming the main level into a true indoor-outdoor living experience. This thoughtful design allows natural light, tropical breezes, and garden views to become an integral part of everyday living.',
      'At the heart of the outdoor space, a private swimming pool is surrounded by expansive sun terraces, premium lounge furnishings, a shaded pergola, and an inviting outdoor dining area designed for relaxed afternoons and memorable evenings. Whether enjoying a quiet morning coffee or entertaining guests beneath the stars, the setting offers an exceptional sense of comfort and privacy.',
      'Accommodating up to six guests, the villa’s three bedrooms have been individually designed to provide a peaceful retreat. The primary suite enjoys beautiful garden views and features a king-size bed, a private dressing area, and a luxurious ensuite bathroom complete with a walk-in rain shower, handcrafted ceramic vanity, and artisan tilework inspired by traditional Mexican design. Two additional guest bedrooms, including one king suite and one twin bedroom, offer the same commitment to comfort, quality, and thoughtful attention to detail.',
      'Daily housekeeping, personalized concierge assistance, and access to a carefully curated collection of local recommendations further enhance the experience. From hidden cenotes and private wellness experiences to exceptional beachfront dining and cultural discoveries, every detail can be tailored to create a truly memorable stay.',
      'Combining privacy, authentic character, and effortless sophistication, Casa FotoPlus offers a unique opportunity to experience the Riviera Maya through a lens of quiet luxury and genuine local connection.',
    ],
    features: [
      'Central Air Conditioning', 'Digital Safe', 'Washer & Dryer', 'Fast WiFi – 160 Mbps',
      'Pool Table', 'Hair Dryer', 'Outdoor Shower', 'Hangers', 'Iron', 'Walk-in Closets',
      'Ceiling Fans', 'Private Outdoor Pool', 'Smoke Alarms', 'Carbon Monoxide Alarms',
      'Dedicated Workspace', 'Microwave', 'Dishwasher', 'Coffee Maker', 'Blender', 'Toaster',
      'Mosquito Nets',
    ],
    gallery: {
      cardThumbs: [
        '/assets/img/photos/rentals/casafotoplus/fotoplusslidercover.webp',
        '/assets/img/photos/rentals/casafotoplus/casafp2.webp',
        '/assets/img/photos/rentals/casafotoplus/casafp3.webp',
      ],
      heroImage: '/assets/img/photos/rentals/casafotoplus/casafp1.webp',
      gridThumbs: [
        '/assets/img/photos/rentals/casafotoplus/casafp1.webp',
        '/assets/img/photos/rentals/casafotoplus/casafp2.webp',
        '/assets/img/photos/rentals/casafotoplus/casafp3.webp',
        '/assets/img/photos/rentals/casafotoplus/casafp4.webp',
      ],
      lightbox: Array.from({ length: 20 }, (_, i) => `/assets/img/photos/rentals/casafotoplus/casafp${i + 1}.webp`),
    },
    bookedDays: [3, 4, 5, 12, 13, 14, 20, 21, 22],
    relatedProperties: [
      {
        slug: 'casasecretomaya',
        name: 'Casa Secreto Maya',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casasecretomaya/thumb/casasm33.webp',
      },
      {
        slug: 'casavioleta',
        name: 'Casa Violetta',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casavioleta/thumb/casaviolettatop.webp',
      },
      {
        slug: 'casaricardo',
        name: 'Casa Ricardo',
        location: 'Playa Del Carmen',
        image: '/assets/img/photos/rentals/casaricardo/thumb/casaricardotop.webp',
      },
    ],
    whatsappUrl: 'https://wa.me/529841681121',
    seo: {
      title: 'Casa FotoPlus — Ku Náay Real Estate',
      description: 'Casa FotoPlus — a 3-bedroom private villa in Playacar, Playa del Carmen. A luxury vacation rental by Ku Náay Real Estate.',
      ogImage: 'https://i.ibb.co/60cHvKsX/Secreto-maya-74-1.jpg',
      canonical: 'https://www.kunaay.com/properties/casafotoplus',
    },
  },

  {
    id: 'casachukum',
    slug: 'casachukum',
    name: 'Casa Chukum',
    type: 'sale',
    status: 'available',
    badge: 'For Sale',
    location: 'Aldea Zama, Tulum',
    subtitle: 'Aldea Zama, Tulum',
    heroLabel: 'For Sale · Aldea Zama, Tulum',
    bedrooms: 4,
    bathrooms: 4,
    highlights: [
      { icon: 'bed', label: '4 Bedrooms' },
      { icon: 'bath', label: '4 Bathrooms' },
      { icon: 'home', label: 'Gated Community' },
      { icon: 'pool', label: 'Private Pool' },
      { icon: 'kitchen', label: 'Full Kitchen' },
      { icon: 'parking', label: 'Parking' },
    ],
    shortDescription:
      'A rare acquisition opportunity — a stunning four-bedroom villa built with traditional chukum finish, offering timeless character and exceptional investment potential.',
    longDescriptions: [
      'Casa Chukum is an exceptional architectural residence in Tulum, thoughtfully crafted to honor the natural beauty, heritage, and craftsmanship of the Riviera Maya. Located within one of Tulum’s most desirable private communities, this four-bedroom, four-bathroom villa represents a rare opportunity to acquire a home built with authenticity, quality, and enduring value at its core.',
      'Constructed by one of the Riviera Maya’s most respected contractors, the residence showcases a level of craftsmanship that is increasingly difficult to find in today’s market. Throughout the home, genuine local hardwoods, natural stone, and traditional chukum finishes have been carefully selected to create a timeless aesthetic that feels deeply connected to the region. Inspired by the ancient chukum tree native to the Yucatán Peninsula, the villa incorporates this celebrated Mayan plaster technique, valued for its beauty, durability, and ability to complement the tropical climate.',
      'The architecture embraces Tulum’s signature indoor-outdoor lifestyle, creating a seamless relationship between the living spaces and the surrounding tropical environment. Expansive floor-to-ceiling glass doors open onto a private garden and resort-style pool terrace, filling the interiors with natural light and creating an atmosphere of effortless sophistication.',
      'At the heart of the home, the open-concept living and dining areas offer generous proportions designed for both everyday living and elegant entertaining. The gourmet kitchen features premium appliances, custom cabinetry, and carefully considered details that combine functionality with refined design.',
      'Each of the four bedroom suites has been conceived as a private retreat, offering exceptional comfort, privacy, and craftsmanship. The primary suite overlooks the lush garden and pool area and includes a spa-inspired ensuite bathroom appointed with a soaking tub, walk-in rainfall shower, handcrafted finishes, and custom wood detailing. Three additional guest suites provide the same commitment to quality and design, each featuring its own private bathroom and thoughtfully curated materials.',
      'Beyond its architectural appeal, Casa Chukum offers the security and convenience of a prestigious gated community while remaining just minutes from Tulum’s renowned beaches, world-class dining, boutique shopping, beach clubs, and cultural attractions. The combination of superior construction, authentic local materials, and an exceptional location makes this residence equally attractive as a primary home, luxury vacation property, or long-term investment.',
      'More than a home, Casa Chukum is a lasting expression of Tulum’s architectural identity, where traditional craftsmanship, natural beauty, and modern luxury come together in one remarkable property.',
    ],
    features: [],
    gallery: {
      cardThumbs: [
        '/assets/img/photos/sales/casachukum/thumb/casackm12.webp',
        '/assets/img/photos/sales/casachukum/thumb/casackm1.webp',
        '/assets/img/photos/sales/casachukum/thumb/casackm2.webp',
      ],
      heroImage: '/assets/img/photos/sales/casachukum/full/casackm12.webp',
      gridThumbs: [
        '/assets/img/photos/sales/casachukum/full/casackm12.webp',
        '/assets/img/photos/sales/casachukum/thumb/casackm1.webp',
        '/assets/img/photos/sales/casachukum/thumb/casackm2.webp',
        '/assets/img/photos/sales/casachukum/full/casackm1.webp',
      ],
      lightbox: [
        '/assets/img/photos/sales/casachukum/full/casackm12.webp',
        ...Array.from({ length: 11 }, (_, i) => `/assets/img/photos/sales/casachukum/full/casackm${i + 1}.webp`),
        ...Array.from({ length: 19 }, (_, i) => `/assets/img/photos/sales/casachukum/full/casackm${i + 13}.webp`),
      ],
    },
    bookedDays: [],
    relatedProperties: [
      {
        slug: 'casasecretomaya',
        name: 'Casa Secreto Maya',
        location: 'Playa Del Carmen',
        image: 'https://i.ibb.co/sBNn7VP/Secreto-maya-81-1.jpg',
      },
      {
        slug: 'casavioleta',
        name: 'Casa Violetta',
        location: 'Playa Del Carmen',
        image: 'https://i.ibb.co/vxVMbJNC/Casa-Violetta-101.jpg',
      },
      {
        slug: 'casamayette',
        name: 'Casa Mayette',
        location: 'Playa Del Carmen',
        image: 'https://i.ibb.co/1hD1Z5J/Casa-Mayette-097.jpg',
      },
    ],
    whatsappUrl: 'https://wa.me/529841681121',
    seo: {
      title: 'Casa Chukum — Ku Náay Real Estate',
      description: 'Casa Chukum — a 4-bedroom villa for sale in Aldea Zama, Tulum. A prestigious property listing by Ku Náay Real Estate.',
      ogImage: 'https://i.ibb.co/4R1DBhVF/Secreto-maya-25-1.jpg',
      canonical: 'https://www.kunaay.com/properties/casachukum',
    },
  },
];

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getRentalProperties(): Property[] {
  return properties.filter((p) => p.type === 'rental');
}

export function getSaleProperties(): Property[] {
  return properties.filter((p) => p.type === 'sale');
}
