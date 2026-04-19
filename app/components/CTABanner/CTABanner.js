"use client";

import { useEffect, useRef, useState } from "react";

export default function CTABanner({ data }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!data) return null;

  const { eyebrow, title, description, primaryCta, secondaryCta } = data;

  return (
    <section
      ref={ref}
      aria-label="Call to action"
      className={`aim-cta-banner ${inView ? "is-inview" : ""}`}
    >
      <div className="aim-cta-banner-bg" aria-hidden />
      <div className="aim-container aim-cta-banner-inner">
        {eyebrow ? <p className="aim-eyebrow aim-cta-banner-eyebrow">{eyebrow}</p> : null}
        {title ? <h2 className="aim-heading aim-cta-banner-title">{title}</h2> : null}
        {description ? <p className="aim-cta-banner-desc">{description}</p> : null}
        <div className="aim-cta-banner-actions">
          {primaryCta ? (
            <a href={primaryCta.href} className="aim-btn aim-btn-primary aim-cta-banner-btn">
              {primaryCta.label}
            </a>
          ) : null}
          {secondaryCta ? (
            <a href={secondaryCta.href} className="aim-btn aim-btn-ghost aim-cta-banner-btn-ghost">
              {secondaryCta.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
