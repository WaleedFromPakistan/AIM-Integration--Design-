"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SectionHeader from "@/app/components/SectionHeader";

export default function ServiceGallery({ data }) {
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
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!data?.items?.length) return null;
  const { eyebrow, title, subtitle, items } = data;

  return (
    <section
      ref={ref}
      className={`aim-section aim-section-alt aim-svc-gallery ${inView ? "is-inview" : ""}`}
      id="service-gallery"
    >
      <div className="aim-container">
        <SectionHeader data={{ eyebrow, title, subtitle }} />

        <ul className="aim-svc-gallery-grid" role="list">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="aim-svc-gallery-item"
              style={{ transitionDelay: inView ? `${Math.min(index * 0.08, 0.4)}s` : "0s" }}
            >
              <figure className="aim-svc-gallery-figure">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.alt || item.title || ""}
                    fill
                    className="object-cover aim-svc-gallery-img"
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />
                ) : null}
                <figcaption className="aim-svc-gallery-caption">
                  <span className="aim-svc-gallery-caption-title">{item.title}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
