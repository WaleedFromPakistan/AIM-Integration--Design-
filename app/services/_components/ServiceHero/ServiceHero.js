"use client";

import Image from "next/image";
import Link from "next/link";

export default function ServiceHero({ data }) {
  if (!data) return null;
  const {
    eyebrow,
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    imageUrl,
    imageAlt,
  } = data;

  return (
    <section className="aim-svc-hero" aria-label="Service introduction">
      {imageUrl ? (
        <div className="aim-svc-hero-media" aria-hidden>
          <Image
            src={imageUrl}
            alt={imageAlt || ""}
            fill
            priority
            sizes="100vw"
            className="object-cover aim-svc-hero-img"
          />
        </div>
      ) : null}

      <div className="aim-svc-hero-overlay" aria-hidden />

      <div className="aim-svc-hero-content aim-container">
        <div className="aim-svc-hero-copy">
          {eyebrow ? <p className="aim-svc-hero-eyebrow">{eyebrow}</p> : null}
          {title ? (
            <h1 className="aim-svc-hero-title aim-heading">{title}</h1>
          ) : null}
          {subtitle ? (
            <p className="aim-svc-hero-subtitle">{subtitle}</p>
          ) : null}
        </div>
        <div className="aim-svc-hero-ctas">
          {primaryCta?.href ? (
            <Link href={primaryCta.href} className="aim-btn aim-btn-primary">
              {primaryCta.label}
            </Link>
          ) : null}
          {secondaryCta?.href ? (
            <Link
              href={secondaryCta.href}
              className="aim-btn aim-btn-ghost aim-svc-hero-cta-secondary"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
