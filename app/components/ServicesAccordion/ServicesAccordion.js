"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SectionHeader from "../SectionHeader";

const icons = {
  kitchen: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="9" x2="9" y2="21" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="12" cy="6" r="1" fill="currentColor" />
    </svg>
  ),
  bim: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  floor: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="7.5" x2="12" y2="7.5" />
      <line x1="12" y1="16.5" x2="21" y2="16.5" />
    </svg>
  ),
  architecture: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="13" y="9" width="2" height="2" />
    </svg>
  ),
};

function AccordionItem({ item, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className={`aim-accordion-item ${isOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className="aim-accordion-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`acc-panel-${item.id}`}
        id={`acc-btn-${item.id}`}
      >
        <span className="aim-accordion-trigger-left">
          <span className="aim-accordion-icon">
            {icons[item.icon] || icons.architecture}
          </span>
          <span className="aim-accordion-trigger-text">
            <span className="aim-accordion-trigger-title">{item.title}</span>
            <span className="aim-accordion-trigger-summary">{item.summary}</span>
          </span>
        </span>
        <span className="aim-accordion-chevron" aria-hidden>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div
        id={`acc-panel-${item.id}`}
        role="region"
        aria-labelledby={`acc-btn-${item.id}`}
        className="aim-accordion-panel"
        style={{ height }}
      >
        <div ref={contentRef} className="aim-accordion-panel-inner">
          {/* Mobile-only image inside the panel */}
          {item.image ? (
            <div className="aim-accordion-panel-image-mobile">
              <Image
                src={item.image}
                alt={item.imageAlt || item.title}
                width={800}
                height={600}
                className="aim-accordion-panel-img"
                sizes="(max-width: 1023px) 90vw, 1px"
              />
            </div>
          ) : null}
          {item.details?.map((para, i) => (
            <p key={i} className="aim-accordion-detail">{para}</p>
          ))}
          {item.highlights?.length ? (
            <div className="aim-accordion-highlights">
              {item.highlights.map((h, i) => (
                <span key={i} className="aim-accordion-tag">{h}</span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ServicesAccordion({ data }) {
  const [openId, setOpenId] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
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
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Set default image to first item
  useEffect(() => {
    if (data?.items?.length && !activeImage) {
      setActiveImage({
        url: data.items[0].image,
        alt: data.items[0].imageAlt || data.items[0].title,
      });
    }
  }, [data, activeImage]);

  // Update image when accordion opens
  useEffect(() => {
    if (!openId || !data?.items) return;
    const item = data.items.find((i) => i.id === openId);
    if (item?.image) {
      setActiveImage({ url: item.image, alt: item.imageAlt || item.title });
    }
  }, [openId, data]);

  if (!data?.items?.length) return null;

  const { id, eyebrow, title, subtitle, items } = data;

  return (
    <section
      ref={sectionRef}
      className={`aim-section aim-accordion-section ${inView ? "is-inview" : ""}`}
      id={id}
    >
      <div className="aim-container">
        <SectionHeader data={{ eyebrow, title, subtitle }} />
        <div className="aim-accordion-layout">
          {/* Left — sticky showcase image (desktop only) */}
          <div className="aim-accordion-showcase">
            <div className="aim-accordion-showcase-inner">
              {activeImage?.url ? (
                <Image
                  key={activeImage.url}
                  src={activeImage.url}
                  alt={activeImage.alt || ""}
                  width={900}
                  height={700}
                  className="aim-accordion-showcase-img"
                  sizes="(max-width: 1023px) 1px, 42vw"
                />
              ) : null}
              <div className="aim-accordion-showcase-overlay" aria-hidden />
            </div>
          </div>

          {/* Right — accordion list */}
          <div className="aim-accordion-list">
            {items.map((item, index) => (
              <AccordionItem
                key={item.id}
                item={item}
                index={index}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
