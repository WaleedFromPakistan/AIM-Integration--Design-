"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "../SectionHeader";

gsap.registerPlugin(ScrollTrigger);

export default function ReviewsSection({ data }) {
  const rootRef = useRef(null);
  const items = data?.items ?? [];

  const doubled = useMemo(() => [...items, ...items], [items]);

  useLayoutEffect(() => {
    const section = rootRef.current;
    if (!section) return;

    const outer = section.querySelector("[data-reviews-animate]");
    if (!outer) return;

    const ctx = gsap.context(() => {
      gsap.from(outer, {
        opacity: 0,
        y: 28,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [items.length]);

  if (!items.length) return null;

  const { id, eyebrow, title } = data;

  return (
    <section className="aim-section aim-section-alt" id={id} ref={rootRef}>
      <div className="aim-container">
        <SectionHeader data={{ eyebrow, title, subtitle: null }} />
      </div>
      <div className="aim-reviews-marquee-outer" data-reviews-animate>
        <div className="aim-reviews-marquee-wrap">
          <div className="aim-reviews-marquee-track">
            {doubled.map((item, index) => (
              <figure
                key={`${item.id}-${index}`}
                className="aim-review-marquee-card"
              >
                <blockquote className="aim-review-marquee-quote">
                  “{item.quote}”
                </blockquote>
                <figcaption className="aim-review-marquee-cite">
                  <span className="aim-review-marquee-name">{item.name}</span>
                  <span className="aim-review-marquee-role">
                    {" "}
                    — {item.role}, {item.company}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
