/**
 * Renders a JSON-LD <script> tag for structured data (schema.org).
 *
 * The payload is serialised and `<` is escaped so a stray "</script>" inside
 * any string can never break out of the script element (a defensive XSS guard,
 * even though our data is server-controlled).
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
