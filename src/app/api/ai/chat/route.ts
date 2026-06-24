import { NextRequest, NextResponse } from 'next/server';
import { getAllProperties } from '@/lib/property-service';
import { rateLimit } from '@/lib/rate-limit';
import type { Property } from '@/data/types';

// In-memory rate limiting: 15 requests per 15 minutes per IP
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_OPENROUTER_MODEL = 'google/gemma-3-27b-it:free';

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    'unknown'
  );
}

function checkRateLimit(ip: string): boolean {
  return rateLimit('ai-chat', ip, RATE_LIMIT, RATE_WINDOW_MS).allowed;
}

function isAllowedQuestion(question: string): boolean {
  return /\b(hi|hello|hey|hola|kunaay|ku náay|casa|property|properties|home|homes|house|houses|condo|apartment|villa|villas|rental|rentals|sale|buy|invest|booking|book|available|availability|recommend|suggest|stay|bedroom|bathroom|guest|guests|family|families|kid|kids|children|amenit|wifi|wi-fi|kitchen|pool|beach|beachfront|ocean|oceanfront|view|garden|terrace|concierge|chef|golf|restaurant|food|dining|activity|activities|tour|cenote|xcaret|aldea|zama|airport|cancun|playa|tulum|riviera maya|playacar|cozumel|akumal|isla mujeres|transport|shuttle|taxi|snorkel|dive|ruins|chichen|cob[aá]|price|cost|rate|nightly|weekly|monthly)\b/i.test(question);
}

async function getPublishedProperties(): Promise<Property[]> {
  return getAllProperties();
}

async function buildPropertyContext(): Promise<string> {
  const properties = await getPublishedProperties();

  if (properties.length === 0) return 'No properties currently listed.';

  return properties.map((p) => {
    const desc = p.longDescriptions[0] ?? p.shortDescription;
    const feats = p.features.slice(0, 8).join(', ');
    const guestsStr = p.guests ? `, up to ${p.guests} guests` : '';
    const priceStr = p.price ? `, ${p.price}` : '';
    return `- ${p.name} [slug:${p.slug}] (${p.type}, ${p.location}${guestsStr}${priceStr}, ${p.bedrooms}bd/${p.bathrooms}ba): ${desc}${feats ? ` | Features: ${feats}` : ''}`;
  }).join('\n');
}

const SYSTEM_PROMPT_BASE = `You are Ku Náay AI Assistant, a knowledgeable and friendly vacation and real estate advisor for Ku Náay Real Estate in the Riviera Maya, Mexico.

You ONLY answer questions about:
- Properties listed by Ku Náay (vacation rentals and properties for sale)
- Information visible on the current Ku Náay website/listing pages
- Restaurants, beaches, activities, tours, and travel tips around Riviera Maya, Cancun, Playa del Carmen, Playacar, and Tulum
- Cancun airport, Tulum airport, transfers, and travel logistics for guests visiting the Riviera Maya
- Booking inquiries and property details

Politely decline unrelated questions. Do not answer unrelated coding, finance, politics, medical, or general trivia questions.
NEVER invent or fabricate Ku Náay property details — only recommend properties from the portfolio below.
When recommending a specific property, embed its slug in double brackets like [[property-slug]] so a property card is shown. You may recommend up to 3 properties per response.
Keep responses friendly, concise (2–4 sentences), and professional. If listing properties, be brief.

Ku Náay property portfolio:
`;

type MockEntry = { text: string; slugs: string[] };

function getMockResponse(question: string): MockEntry {
  const q = question.toLowerCase();

  if (!isAllowedQuestion(question)) {
    return {
      text: "I can only help with Ku Náay properties, restaurants, beaches, airports, activities, and travel around the Riviera Maya, Cancun, Playa del Carmen, and Tulum. Please ask me about one of those topics.",
      slugs: [],
    };
  }
  if (/^(hi|hello|hey|hola|bonjour|salut)\b/.test(q)) {
    return {
      text: "Hello! I'm the Ku Náay AI Assistant. I can help you find luxury vacation rentals or investment properties in the Riviera Maya, plus restaurants, beaches, airports, and activities nearby. What are you looking for?",
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
      text: "The Riviera Maya is known for turquoise water and white-sand beaches. Playacar Beach and Playa del Carmen's main beach are favorites, and several Ku Náay properties are steps from the water.",
      slugs: [],
    };
  }
  if (/\b(airport|transfer|shuttle|taxi|cancun|tulum)\b/.test(q)) {
    return {
      text: "Cancun International Airport and Tulum International Airport both serve the Riviera Maya. Private transfers are usually the most comfortable option for villa guests, and our concierge team can help coordinate airport transportation.",
      slugs: [],
    };
  }
  if (/\b(restaurant|food|eat|dining|cuisine|menu|drink|bar)\b/.test(q)) {
    return {
      text: "Playa del Carmen's Quinta Avenida has many restaurants, from seafood and authentic Mexican cuisine to international dining. For a local feel, ask our concierge for current recommendations near your villa and preferred style of food.",
      slugs: [],
    };
  }
  if (/\b(activit|cenote|tour|ruin|xcaret|snorkel|dive|zip)\b/.test(q)) {
    return {
      text: "The Riviera Maya has excellent activities: cenotes, Tulum ruins, snorkeling, diving, beach clubs, and parks like Xcaret. Our concierge team can arrange guest experiences based on where you are staying.",
      slugs: [],
    };
  }
  if (/\b(price|cost|rate|how much|fee|nightly|weekly)\b/.test(q)) {
    return {
      text: "Rental rates vary by property, season, and duration. For sale prices depend on the listing. For accurate, up-to-date pricing please use the WhatsApp button on any property page and our agents will help.",
      slugs: [],
    };
  }

  return {
    text: "I specialise in Ku Náay's luxury properties and travel in the Riviera Maya. Ask me about rentals, properties for sale, restaurants, airports, beaches, or activities in Playa del Carmen, Cancun, Tulum, and Playacar.",
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

function toCard(p: Property) {
  return {
    slug: p.slug,
    name: p.name,
    location: p.location,
    type: p.type,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    guests: p.guests,
    price: p.price || null,
    image: p.gallery.cardThumbs[0] ?? p.gallery.heroImage ?? '',
  };
}

async function cardsForSlugs(slugs: string[]) {
  if (slugs.length === 0) return [];
  const properties = await getPublishedProperties();
  const slugSet = new Set(slugs);
  return properties.filter((p) => slugSet.has(p.slug)).slice(0, 3).map(toCard);
}

function streamEvent(controller: ReadableStreamDefaultController, payload: unknown) {
  controller.enqueue(`data: ${JSON.stringify(payload)}\n\n`);
}

function streamJsonResponse(stream: ReadableStream) {
  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  });
}

function streamMockResponse(mock: MockEntry) {
  const stream = new ReadableStream({
    async start(controller) {
      streamEvent(controller, { type: 'token', token: mock.text });
      const properties = await cardsForSlugs(mock.slugs);
      streamEvent(controller, { type: 'done', properties });
      controller.close();
    },
  }).pipeThrough(new TextEncoderStream());

  return streamJsonResponse(stream);
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

  if (!isAllowedQuestion(question)) {
    return streamMockResponse(getMockResponse(question));
  }

  const apiKey = process.env.OPENROUTER_API_KEY ?? process.env.AI_API_KEY;

  // Mock mode — no API key configured
  if (!apiKey) {
    return streamMockResponse(getMockResponse(question));
  }

  try {
    const propertyContext = await buildPropertyContext();
    const model = process.env.OPENROUTER_MODEL ?? process.env.AI_MODEL ?? DEFAULT_OPENROUTER_MODEL;

    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
        'http-referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kunaay.com',
        'x-title': 'Ku Náay Real Estate',
      },
      body: JSON.stringify({
        model,
        stream: true,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_BASE + propertyContext },
          { role: 'user', content: question },
        ],
        max_tokens: 512,
        temperature: 0.4,
      }),
    });

    if (!aiRes.ok || !aiRes.body) {
      const errBody = await aiRes.text().catch(() => '');
      console.error('[AI chat] OpenRouter error:', errBody);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = aiRes.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let rawAnswer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const data = trimmed.slice(5).trim();
              if (!data || data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
                const token = parsed.choices?.[0]?.delta?.content ?? '';
                if (!token) continue;
                rawAnswer += token;
                streamEvent(controller, { type: 'token', token });
              } catch {
                // Ignore malformed provider stream chunks.
              }
            }
          }

          const { cleanText, slugs } = parseSlugMarkers(rawAnswer);
          const properties = await cardsForSlugs(slugs);
          streamEvent(controller, { type: 'done', answer: cleanText, properties });
        } catch (error) {
          console.error('[AI chat] Stream error:', error);
          streamEvent(controller, { type: 'error', error: 'AI service unavailable. Please try again later.' });
        } finally {
          controller.close();
        }
      },
    }).pipeThrough(new TextEncoderStream());

    return streamJsonResponse(stream);
  } catch (err) {
    console.error('[AI chat] Error:', err);
    return NextResponse.json(
      { error: 'AI service unavailable. Please try again later.' },
      { status: 503 }
    );
  }
}
