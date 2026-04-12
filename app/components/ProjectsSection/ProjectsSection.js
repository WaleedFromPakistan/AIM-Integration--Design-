"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "../SectionHeader";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection({ data }) {
  const rootRef = useRef(null);
  const items = data?.items ?? [];

  useLayoutEffect(() => {
    const section = rootRef.current;
    if (!section || !items.length) return;

    const pin = section.querySelector("[data-projects-pin]");
    const viewport = section.querySelector("[data-projects-viewport]");
    const track = section.querySelector("[data-project-track]");
    if (!pin || !viewport || !track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      viewport.style.overflowX = "auto";
      return;
    }

    const maxScroll = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    const ctx = gsap.context(() => {
      const ms = maxScroll();
      if (ms <= 0) return;

      gsap.to(track, {
        x: () => -maxScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "center center",
          end: () => `+=${maxScroll()}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    const ro = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    ro.observe(viewport);
    ro.observe(track);

    return () => {
      ro.disconnect();
      ctx.revert();
    };
  }, [items.length]);

  if (!items.length) return null;

  const { id, eyebrow, title, subtitle } = data;

  return (
    <section className="aim-section aim-projects-section" id={id} ref={rootRef}>
      <div className="aim-container aim-projects-header-wrap">
        <SectionHeader data={{ eyebrow, title, subtitle }} />
      </div>
      <div className="aim-projects-pin" data-projects-pin>
        <div className="aim-projects-viewport" data-projects-viewport>
          <div className="aim-projects-track" data-project-track>
            {items.map((item) => (
              <article
                key={item.id}
                data-project-card
                className="aim-project-card aim-project-card-slide"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.imageAlt || item.title}
                    width={800}
                    height={600}
                    className="aim-project-slide-img"
                    sizes="(max-width: 480px) 88vw, 400px"
                  />
                ) : null}
                <div className="aim-project-meta">
                  <p className="aim-project-meta-label">
                    {item.category} · {item.year}
                  </p>
                  <h3 className="aim-heading aim-project-meta-title">
                    {item.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
