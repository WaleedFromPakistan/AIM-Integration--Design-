"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Carosel from "../carosel/carosel";

export default function Hero({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    // Stagger the entrance — small delay lets the carousel image render first
    const id = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(id);
  }, []);

  // Parallax-style scroll — desktop only, since mobile uses a stacked card layout
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const media = hero.querySelector(".aim-hero-media");
    if (!media) return;

    const desktopMq = window.matchMedia("(min-width: 768px)");
    if (!desktopMq.matches) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH = hero.offsetHeight;
        if (scrollY < heroH) {
          const ratio = scrollY / heroH;
          media.style.transform = `translateY(${ratio * 60}px) scale(${1 + ratio * 0.05})`;
          media.style.opacity = `${1 - ratio * 0.3}`;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      media.style.transform = "";
      media.style.opacity = "";
    };
  }, []);

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
    <section
      className={`aim-hero ${loaded ? "is-loaded" : ""}`}
      aria-label="Introduction"
      ref={heroRef}
    >
      {/* Background media */}
      <div className="aim-hero-media" aria-hidden>
        {hasCarousel ? (
          <Carosel
            slides={slides}
            autoplayMs={carousel.autoplayMs}
            transitionMs={carousel.transitionMs}
            onActiveIndexChange={setActiveIndex}
          />
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
      </div>

      {/* Multi-layer overlay */}
      <div className="aim-hero-overlay" aria-hidden />
      <div className="aim-hero-grain" aria-hidden />

      {/* Mobile-only foreground card — clean view of the active slide */}
      {activeSlide?.image ? (
        <div className="aim-hero-card-mobile" aria-hidden>
          <Image
            key={activeSlide.id}
            src={activeSlide.image}
            alt={activeSlide.imageAlt || ""}
            fill
            className="object-cover aim-hero-card-mobile-img"
            sizes="(max-width: 768px) 90vw, 1px"
          />
        </div>
      ) : null}

      {/* Content */}
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

      {/* Scroll indicator */}
      <div className="aim-hero-scroll-hint" aria-hidden>
        <span className="aim-hero-scroll-line" />
      </div>
    </section>
  );
}
