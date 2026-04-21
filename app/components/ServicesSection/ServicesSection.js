"use client";

import Image from "next/image";
import SectionHeader from "../SectionHeader";

function ServiceCard({ item, index }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article className="aim-service-card" tabIndex={0}>
      {item.image ? (
        <Image
          src={item.image}
          alt={item.imageAlt || item.title}
          fill
          className="object-cover aim-service-card-img"
          sizes="(max-width: 767px) 80vw, (max-width: 1023px) 50vw, 45vw"
        />
      ) : null}
      <div className="aim-service-card-scrim" aria-hidden />
      <div className="aim-service-card-copy">
        <span className="aim-service-card-index">{num}</span>
        <h3 className="aim-service-card-title">{item.title}</h3>
        <div className="aim-service-card-desc-wrap">
          <p className="aim-service-card-desc">{item.description}</p>
        </div>
      </div>
    </article>
  );
}

export default function ServicesSection({ data }) {
  if (!data?.items?.length) return null;

  const { id, eyebrow, title, subtitle, items } = data;
  const header = { eyebrow, title, subtitle };

  return (
    <section className="aim-section aim-section-alt" id={id}>
      <div className="aim-container">
        <SectionHeader data={header} />
      </div>

      {/* Mobile: horizontal swipe rail with hidden right edge */}
      <div className="aim-services-rail" role="list">
        {items.map((item, index) => (
          <div key={item.id} role="listitem" className="aim-services-rail-item">
            <ServiceCard item={item} index={index} />
          </div>
        ))}
      </div>

      {/* Desktop: 2x2 grid with hover lift + slide-in description */}
      <div className="aim-container">
        <div className="aim-services-grid" role="list">
          {items.map((item, index) => (
            <div key={item.id} role="listitem" className="aim-services-grid-cell">
              <ServiceCard item={item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
