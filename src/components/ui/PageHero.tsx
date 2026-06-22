interface PageHeroProps {
  label: string;
  title: string;
  backgroundImage: string;
  minHeight?: string;
  height?: string;
}

export default function PageHero({
  label,
  title,
  backgroundImage,
  minHeight,
  height,
}: PageHeroProps) {
  return (
    <div className="page-hero" style={{ minHeight, height }}>
      <div className="page-hero-bg" style={{ backgroundImage: `url('${backgroundImage}')` }} />
      <div className="page-hero-overlay" />
      <div className="page-hero-content">
        <span className="section-label">{label}</span>
        <h1>{title}</h1>
      </div>
    </div>
  );
}
