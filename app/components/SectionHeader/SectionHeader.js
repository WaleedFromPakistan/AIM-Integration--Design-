"use client";

export default function SectionHeader({ data }) {
  if (!data) return null;
  const { eyebrow, title, subtitle } = data;
  return (
    <header className="aim-section-header">
      {eyebrow ? <p className="aim-eyebrow">{eyebrow}</p> : null}
      {title ? (
        <h2 className="aim-heading text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <p className="mt-3 text-lg md:text-xl text-[color:var(--color-text-muted)] max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      ) : null}
      <div className="aim-gold-line mt-5" aria-hidden />
    </header>
  );
}
