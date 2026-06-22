export type PropertyType = 'rental' | 'sale';
export type PropertyStatus = 'published' | 'draft';

export interface HighlightItem {
  icon: string; // icon id e.g. 'bed', 'bath', 'waves', 'pool', 'kitchen', 'parking', 'home', 'coffee'
  label: string;
}

export interface GalleryImages {
  /** Three images shown in the property card slider */
  cardThumbs: string[];
  /** Hero image shown in the page-hero and detail gallery (first thumb) */
  heroImage: string;
  /** Grid thumbnails (first 3 shown, 4th opens lightbox) */
  gridThumbs: string[];
  /** Full lightbox image set */
  lightbox: string[];
}

export interface RelatedProperty {
  slug: string;
  name: string;
  location: string;
  image: string;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  type: PropertyType;
  status: PropertyStatus;
  badge: string; // "Rental" | "For Sale"
  location: string;
  subtitle: string; // e.g. "Ocean Front, Playacar Phase 1"
  heroLabel: string; // e.g. "Rental · Playacar Phase 1"
  bedrooms: number;
  bathrooms: number;
  highlights: HighlightItem[];
  shortDescription: string;
  longDescriptions: string[];
  features: string[];
  gallery: GalleryImages;
  bookedDates?: string[]; // ISO "YYYY-MM-DD" strings from the database
  relatedProperties: RelatedProperty[];
  whatsappUrl: string;
  seo: {
    title: string;
    description: string;
    ogImage: string;
    canonical: string;
  };
}

export interface Testimonial {
  id: string;
  stars: number;
  text: string;
  authorName: string;
  authorAvatar: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  whatsappDisplay: string;
  specialty?: string;
}

export interface SiteConfig {
  agents: Agent[];
}
