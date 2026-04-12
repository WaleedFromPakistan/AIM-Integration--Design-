"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero({ data }) {
  if (!data) return null;

  const {
    videoUrl,
    posterUrl,
    posterAlt,
    eyebrow,
    title,
    subtitle,
    primaryCta,
    secondaryCta,
  } = data;

  return (
    <section className="aim-hero" aria-label="Introduction">
      <div className="aim-hero-media" aria-hidden>
        {videoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={posterUrl || undefined}
            className="aim-hero-video"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : posterUrl ? (
          <Image
            src={posterUrl}
            alt={posterAlt || ""}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : null}
        <div className="aim-hero-overlay" />
      </div>

      <div className="aim-hero-content aim-container">
        {eyebrow ? (
          <p className="aim-eyebrow !text-[rgba(255,255,255,0.85)]">{eyebrow}</p>
        ) : null}
        <h1 className="aim-hero-title aim-heading font-semibold">{title}</h1>
        {subtitle ? <p className="aim-hero-subtitle">{subtitle}</p> : null}
        <div className="aim-hero-ctas">
          {primaryCta?.href ? (
            <Link href={primaryCta.href} className="aim-btn aim-btn-primary">
              {primaryCta.label}
            </Link>
          ) : null}
          {secondaryCta?.href ? (
            <Link href={secondaryCta.href} className="aim-btn aim-btn-ghost">
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
