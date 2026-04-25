"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "../SectionHeader";

function MissionCard({ item, index, inView }) {
  // Stagger each card by 0.12s
  const delay = inView ? `${index * 0.12}s` : "0s";

  return (
    <article
      className="aim-mission-card"
      style={{ transitionDelay: delay }}
    >
      <div className="aim-mission-card-num" aria-hidden>
        {item.number}
      </div>
      <div className="aim-mission-card-body">
        <h3 className="aim-mission-card-title">{item.title}</h3>
        <p className="aim-mission-card-desc">{item.description}</p>
      </div>
    </article>
  );
}

export default function MissionSection({ data }) {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!data?.items?.length) return null;

  const { id, eyebrow, title, subtitle, items } = data;

  return (
    <section
      ref={sectionRef}
      className={`aim-section aim-mission-section ${inView ? "is-inview" : ""}`}
      id={id}
    >
      <div className="aim-container">
        <SectionHeader data={{ eyebrow, title, subtitle }} />
        <div className="aim-mission-grid" role="list">
          {items.map((item, index) => (
            <div
              key={item.id}
              role="listitem"
              className="aim-mission-grid-cell"
            >
              <MissionCard item={item} index={index} inView={inView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
