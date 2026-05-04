"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: Math.min(i * 0.08, 0.32),
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/**
 * Industrial Project Card.
 *
 * Props.item shape comes from buildProjectCards(): { href, title, category,
 * location, year, description, imageUrl, imageAlt, ctaLabel }.
 *
 * Visual language: Deep navy / charcoal surface, Blueprint Blue corner ticks,
 * Technical Gold accent line + CTA. Hover scales the image and lifts the card.
 */
export default function ProjectCard({ item, index = 0 }) {
  const reduce = useReducedMotion();
  if (!item) return null;

  return (
    <motion.article
      className="aim-pc-card"
      variants={cardVariants}
      custom={index}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2 }}
    >
      <Link href={item.href} className="aim-pc-link" aria-label={`${item.ctaLabel || "Learn more"} — ${item.title}`}>
        <div className="aim-pc-image-wrap">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.imageAlt || item.title}
              width={1600}
              height={1100}
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 1200px"
              className="aim-pc-image"
              priority={index === 0}
            />
          ) : null}
          <div className="aim-pc-image-overlay" aria-hidden />
          <span className="aim-pc-corner aim-pc-corner-tl" aria-hidden />
          <span className="aim-pc-corner aim-pc-corner-tr" aria-hidden />
          <span className="aim-pc-corner aim-pc-corner-bl" aria-hidden />
          <span className="aim-pc-corner aim-pc-corner-br" aria-hidden />

          <div className="aim-pc-meta-strip">
            <span className="aim-pc-tag">{item.category}</span>
            {item.location ? (
              <>
                <span className="aim-pc-meta-dot" aria-hidden />
                <span className="aim-pc-meta-text">{item.location}</span>
              </>
            ) : null}
            {item.year ? (
              <>
                <span className="aim-pc-meta-dot" aria-hidden />
                <span className="aim-pc-meta-text">{item.year}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="aim-pc-body">
          <span className="aim-pc-rule" aria-hidden />
          <h3 className="aim-heading aim-pc-title">{item.title}</h3>
          <p className="aim-pc-desc">{item.description}</p>

          <div className="aim-pc-foot">
            <span className="aim-pc-spec">PRJ // {item.year || "—"}</span>
            <span className="aim-pc-cta">
              {item.ctaLabel || "Learn More"}
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden
                className="aim-pc-cta-arrow"
              >
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
