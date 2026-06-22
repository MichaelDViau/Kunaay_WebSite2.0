import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// In-memory rate limiting: 15 requests per 15 minutes per IP
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

async function buildPropertyContext(): Promise<string> {
  const properties = await prisma.property.findMany({
    where: { status: 'published' },
    include: {
      descriptions: { orderBy: { sortOrder: 'asc' }, take: 1 },
      features: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { displayOrder: 'asc' },
  });

  if (properties.length === 0) return 'No properties currently listed.';

  return properties.map((p) => {
    const desc = p.descriptions[0]?.text ?? '';
    const feats = p.features.slice(0, 5).map((f) => f.text).join(', ');
    const guestsStr = p.guests ? `, up to ${p.guests} guests` : '';
    const priceStr = p.price ? `, ${p.price}` : '';
    return `- ${p.name} [slug:${p.slug}] (${p.type}, ${p.location}${guestsStr}${priceStr}, ${p.bedrooms}bd/${p.bathrooms}ba): ${desc}${feats ? ` | Features: ${feats}` : ''}`;
  }).join('\n');
}

const SYSTEM_PROMPT_BASE = `You are Ku Náay AI Assistant, a knowledgeable and friendly vacation and real estate advisor for Ku Náay Real Estate in the Riviera Maya, Mexico.

You ONLY answer questions about:
- Properties listed by Ku Náay (vacation rentals and properties for sale)
- Vacation rentals and travel in Riviera Maya, Playa del Carmen, Tulum, Playacar
- Local beaches, restaurants, activities, and travel tips in the Riviera Maya
- Booking inquiries and property details

You politely decline to answer questions unrelated to travel or real estate in the Riviera Maya.
You NEVER invent or fabricate property details — only recommend properties from the portfolio below.

When recommending a specific property, embed its slug in double brackets like [[property-slug]] so a property card is shown. You may recommend up to 3 properties per response.

Keep responses friendly, concise (2–4 sentences), and professional. If listing properties, be brief.

Ku Náay property portfolio:
`;

type MockEntry = { text: string; slugs: string[] };

function getMockResponse(question: string): MockEntry {
  const q = question.toLowerCase();

  if (/^(hi|hello|hey|hola|bonjour|salut)\b/.test(q)) {
    return {
      text: "Hello! I'm the Ku Náay AI Assistant. I can help you find luxury vacation rentals or investment properties in the Riviera Maya, and answer questions about local beaches, restaurants, and activities. What are you looking for?",
      slugs: [],
    };
  }
  if (/\b(rental|rent|stay|vacation|holiday|week|night)\b/.test(q)) {
    return {
      text: "We offer stunning luxury vacation rentals in the Riviera Maya — oceanfront villas with private pools, fully equipped kitchens, and concierge service. Browse our rental collection below or ask me about specific properties!",
      slugs: [],
    };
  }
  if (/\b(sale|buy|purchase|invest|investment|for sale)\b/.test(q)) {
    return {
      text: "Ku Náay offers an exclusive portfolio of luxury properties for sale across the Riviera Maya — from beachfront villas to private residences in gated communities. Our agents can guide you through every step of the purchase. Would you like to learn more?",
      slugs: [],
    };
  }
  if (/\b(pool|bedroom|bathroom|ocean|view|front)\b/.test(q)) {
    return {
      text: "Many of our properties feature private pools, ocean views, and premium amenities. Each listing page has full details, photos, and an availability calendar. Is there a specific feature or location you're looking for?",
      slugs: [],
    };
  }
  if (/\b(beach|ocean|sea|coast|sand|swim)\b/.test(q)) {
    return {
      text: "The Riviera Maya is home to some of the world's most beautiful beaches — crystalline turquoise water and powdery white sand. Playacar Beach and Playa del Carmen's main beach are top favourites. Several of our properties are steps from the water!",
      slugs: [],
    };
  }
  if (/\b(restaurant|food|eat|dining|cuisine|menu|drink|bar)\b/.test(q)) {
    return {
      text: "Playa del Carmen's 5th Avenue (Quinta Avenida) is lined with world-class restaurants — from fresh seafood and authentic Mexican cuisine to international fare. For the best local experience, try La Cueva del Chango or Babe's Noodles & Bar.",
      slugs: [],
    };
  }
  if (/\b(activit|cenote|tour|ruin|tulum|xcaret|snorkel|dive|zip)\b/.test(q)) {
    return {
      text: "The Riviera Maya has incredible activities: swimming in sacred cenotes, exploring Mayan ruins at Tulum or Chichén Itzá, snorkelling the Mesoamerican Reef, and zip-lining at Xcaret. Our concierge team can arrange all tours for guests staying at our properties.",
      slugs: [],
    };
  }
  if (/\b(price|cost|rate|how much|fee|nightly|weekly)\b/.test(q)) {
    return {
      text: "Rental rates vary by property, season, and duration. For sale prices depend on the listing. For accurate, up-to-date pricing please click the WhatsApp button on any property page — our agents respond quickly!",
      slugs: [],
    };
  }

  return {
    text: "I specialise in Ku Náay's luxury properties and travel in the Riviera Maya. Ask me about vacation rentals, properties for sale, local beaches, restaurants, or activities in Playa del Carmen, Tulum, and Playacar — I'm happy to help!",
    slugs: [],
  };
}

function parseSlugMarkers(text: string): { cleanText: string; slugs: string[] } {
  const slugs: string[] = [];
  const cleanText = text.replace(/\[\[([a-z0-9-]+)\]\]/g, (_, slug) => {
    if (!slugs.includes(slug)) slugs.push(slug);
    return '';
  }).replace(/ {2,}/g, ' ').trim();
  return { cleanText, slugs };
}

type DbPropertyCard = {
  slug: string;
  name: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  guests: number | null;
  price: string;
  images: { url: string }[];
};

function toCard(p: DbPropertyCard) {
  return {
    slug: p.slug,
    name: p.name,
    location: p.location,
    type: p.type,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    guests: p.guests,
    price: p.price || null,
    image: p.images[0]?.url ?? '',
  };
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes before asking again.' },
      { status: 429 }
    );
  }

  let question: string;
  try {
    const body = await req.json() as { question?: unknown };
    question = typeof body.question === 'string' ? body.question.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!question) {
    return NextResponse.json({ error: 'Please enter a question.' }, { status: 400 });
  }
  if (question.length > 500) {
    return NextResponse.json({ error: 'Question is too long (max 500 characters).' }, { status: 400 });
  }

  const apiKey = process.env.AI_API_KEY;

  // Mock mode — no API key configured
  if (!apiKey) {
    const mock = getMockResponse(question);
    const cards = mock.slugs.length > 0
      ? await prisma.property.findMany({
          where: { slug: { in: mock.slugs }, status: 'published' },
          include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
        })
      : [];

    return NextResponse.json({ answer: mock.text, properties: cards.map(toCard) });
  }

  // Live AI mode
  const propertyContext = await buildPropertyContext();
  const model = process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001';

  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 512,
        system: SYSTEM_PROMPT_BASE + propertyContext,
        messages: [{ role: 'user', content: question }],
      }),
    });

    if (!aiRes.ok) {
      const errBody = await aiRes.json().catch(() => ({})) as { error?: { message?: string } };
      console.error('[AI chat] Anthropic error:', errBody);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }

    const data = await aiRes.json() as { content: { type: string; text: string }[] };
    const rawAnswer = data.content?.find((c) => c.type === 'text')?.text ?? '';

    const { cleanText, slugs } = parseSlugMarkers(rawAnswer);

    const cards = slugs.length > 0
      ? await prisma.property.findMany({
          where: { slug: { in: slugs }, status: 'published' },
          include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
        })
      : [];

    return NextResponse.json({ answer: cleanText, properties: cards.map(toCard) });
  } catch (err) {
    console.error('[AI chat] Error:', err);
    return NextResponse.json(
      { error: 'AI service unavailable. Please try again later.' },
      { status: 503 }
    );
  }
}
