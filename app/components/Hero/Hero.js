"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Carosel from "../carosel/carosel";

export default function Hero({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data) return null;

  const {
    videoUrl,
    posterUrl,
    posterAlt,
    eyebrow: fallbackEyebrow,
    title: fallbackTitle,
    subtitle: fallbackSubtitle,
    primaryCta,
    secondaryCta,
    carousel,
  } = data;

  const slides = carousel?.slides ?? [];
  const hasCarousel = slides.length > 0;

  const activeSlide = useMemo(() => {
    if (!hasCarousel) return null;
    const i = Math.min(Math.max(0, activeIndex), slides.length - 1);
    return slides[i];
  }, [hasCarousel, slides, activeIndex]);

  const eyebrow = activeSlide?.eyebrow ?? fallbackEyebrow;
  const title = activeSlide?.title ?? fallbackTitle;
  const subtitle = activeSlide?.description ?? fallbackSubtitle;

  return (
    <section className="aim-hero" aria-label="Introduction">
      <div className="aim-hero-media" aria-hidden>
        {hasCarousel ? (
          <>
            <Carosel
              slides={slides}
              autoplayMs={carousel.autoplayMs}
              transitionMs={carousel.transitionMs}
              onActiveIndexChange={setActiveIndex}
            />
            <div className="aim-hero-carousel-scrim" />
          </>
        ) : videoUrl ? (
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
        {!hasCarousel ? <div className="aim-hero-overlay" /> : null}
      </div>

      <div className="aim-hero-content aim-container">
        <div
          className="aim-hero-copy"
          key={hasCarousel ? `${activeSlide?.id ?? activeIndex}` : "static"}
        >
          {eyebrow ? (
            <p className="aim-hero-eyebrow aim-eyebrow">{eyebrow}</p>
          ) : null}
          <h1 className="aim-hero-title aim-heading font-semibold">{title}</h1>
          {subtitle ? <p className="aim-hero-subtitle">{subtitle}</p> : null}
        </div>
        <div className="aim-hero-ctas">
          {primaryCta?.href ? (
            <Link href={primaryCta.href} className="aim-btn aim-btn-primary">
              {primaryCta.label}
            </Link>
          ) : null}
          {secondaryCta?.href ? (
            <Link
              href={secondaryCta.href}
              className="aim-btn aim-btn-ghost aim-hero-cta-secondary"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
