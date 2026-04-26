"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SectionHeader from "../SectionHeader";

function ProjectCard({ item, index, inView }) {
  const delay = Math.min(index * 0.1, 0.4);

  return (
    <article
      className="aim-fp-card"
      style={{
        transitionDelay: inView ? `${delay}s` : "0s",
      }}
    >
      <div className="aim-fp-card-image-wrap">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.imageAlt || item.title}
            width={800}
            height={600}
            className="aim-fp-card-img"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
        ) : null}
        <div className="aim-fp-card-overlay">
          <span className="aim-fp-card-category">{item.category}</span>
        </div>
      </div>
      <div className="aim-fp-card-body">
        <div className="aim-fp-card-meta">
          <span>{item.location}</span>
          <span className="aim-fp-card-dot" aria-hidden />
          <span>{item.year}</span>
        </div>
        <h3 className="aim-heading aim-fp-card-title">{item.title}</h3>
        <p className="aim-fp-card-desc">{item.description}</p>
        <p className="aim-fp-card-scope">
          <strong>Scope:</strong> {item.scope}
        </p>
      </div>
    </article>
  );
}

/**
 * Props:
 *   - data:           the section data (eyebrow, title, items, categories…)
 *   - defaultFilter:  initial category to filter by (e.g. "Kitchen Design")
 *                     If set, items are pre-filtered on first render.
 *   - hideFilter:     if true, the category tab UI is hidden entirely
 *                     (used by service detail pages where the page itself
 *                     scopes the category).
 */
export default function FeaturedProjects({ data, defaultFilter = "All", hideFilter = false }) {
  const [activeCategory, setActiveCategory] = useState(defaultFilter);
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
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!data?.items?.length) return null;

  const { id, eyebrow, title, subtitle, categories, items } = data;
  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((p) => p.category === activeCategory);

  return (
    <section
      ref={sectionRef}
      className={`aim-section aim-section-alt aim-fp-section ${inView ? "is-inview" : ""}`}
      id={id}
    >
      <div className="aim-container">
        <SectionHeader data={{ eyebrow, title, subtitle }} />

        {categories?.length && !hideFilter ? (
          <div className="aim-fp-filters" role="tablist" aria-label="Filter projects by category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={`aim-fp-filter-btn ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : null}

        <div className="aim-fp-grid" role="tabpanel">
          {filtered.map((item, index) => (
            <ProjectCard
              key={item.id}
              item={item}
              index={index}
              inView={inView}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="aim-fp-empty">No projects in this category yet.</p>
        ) : null}
      </div>
    </section>
  );
}
