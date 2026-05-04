"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Schematic floor-plan SVG that draws as the user scrolls. The shape is a
 * stylized representation of the systemic-convergence layout — replace the
 * <path> data with the real CAD-derived geometry when available.
 */
function FloorPlanSchematic({ progress }) {
  const draw = useTransform(progress, [0, 1], [0, 1]);

  return (
    <svg
      viewBox="0 0 600 400"
      className="aim-pb-schematic"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="aim-pb-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,87,255,0.12)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="600" height="400" fill="url(#aim-pb-grid)" />

      <motion.path
        d="M 30 30 L 570 30 L 570 370 L 30 370 Z"
        fill="none"
        stroke="#0057FF"
        strokeWidth="1.5"
        style={{ pathLength: draw }}
      />
      <motion.path
        d="M 30 130 L 240 130 L 240 30"
        fill="none"
        stroke="#C5A059"
        strokeWidth="1.2"
        style={{ pathLength: draw }}
      />
      <motion.path
        d="M 240 130 L 240 370"
        fill="none"
        stroke="rgba(242,240,235,0.55)"
        strokeWidth="1"
        strokeDasharray="4 4"
        style={{ pathLength: draw }}
      />
      <motion.path
        d="M 240 250 L 570 250"
        fill="none"
        stroke="rgba(242,240,235,0.55)"
        strokeWidth="1"
        strokeDasharray="4 4"
        style={{ pathLength: draw }}
      />
      <motion.path
        d="M 360 250 L 360 370"
        fill="none"
        stroke="#0057FF"
        strokeWidth="1.2"
        style={{ pathLength: draw }}
      />
      <motion.path
        d="M 360 30 L 360 130 L 460 130 L 460 250"
        fill="none"
        stroke="#C5A059"
        strokeWidth="1.2"
        style={{ pathLength: draw }}
      />
    </svg>
  );
}

export default function ProjectBento({ data }) {
  const containerRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 30%"],
  });

  if (!data) return null;
  const { floorPlan, section } = data;

  return (
    <section className="aim-pb" ref={containerRef}>
      <div className="aim-container">
        <header className="aim-pb-head">
          {data.eyebrow ? <span className="aim-pb-eyebrow">{data.eyebrow}</span> : null}
          {data.title ? <h2 className="aim-heading aim-pb-title">{data.title}</h2> : null}
          {data.subtitle ? <p className="aim-pb-subtitle">{data.subtitle}</p> : null}
        </header>

        <div className="aim-pb-grid">
          {/* Large cell — Floor plan */}
          {floorPlan ? (
            <motion.div
              className="aim-pb-cell aim-pb-cell-large"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="aim-pb-cell-head">
                <span className="aim-pb-cell-tag">FP-01</span>
                <h3 className="aim-pb-cell-title">{floorPlan.title}</h3>
              </div>
              <div className="aim-pb-floorplan">
                {floorPlan.imageUrl ? (
                  <Image
                    src={floorPlan.imageUrl}
                    alt={floorPlan.imageAlt}
                    width={1600}
                    height={1100}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="aim-pb-floorplan-img"
                  />
                ) : null}
                <div className="aim-pb-floorplan-overlay">
                  <FloorPlanSchematic progress={scrollYProgress} />
                </div>
                {floorPlan.annotations?.map((a) => (
                  <span
                    key={a.id}
                    className="aim-pb-annot"
                    style={{ left: `${a.x}%`, top: `${a.y}%` }}
                  >
                    <span className="aim-pb-annot-dot" aria-hidden />
                    <span className="aim-pb-annot-label">{a.label}</span>
                  </span>
                ))}
              </div>
              {floorPlan.caption ? (
                <p className="aim-pb-caption">{floorPlan.caption}</p>
              ) : null}
            </motion.div>
          ) : null}

          {/* Side cell — MEP elevation */}
          {section ? (
            <motion.div
              className="aim-pb-cell aim-pb-cell-side"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div className="aim-pb-cell-head">
                <span className="aim-pb-cell-tag">SE-04</span>
                <h3 className="aim-pb-cell-title">{section.title}</h3>
              </div>
              <div className="aim-pb-section">
                {section.imageUrl ? (
                  <Image
                    src={section.imageUrl}
                    alt={section.imageAlt}
                    width={900}
                    height={1300}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="aim-pb-section-img"
                  />
                ) : null}
                <span className="aim-pb-datum-line" aria-hidden />
                <span className="aim-pb-datum-label" aria-hidden>1200mm DATUM</span>
                {section.isolators?.map((iso) => (
                  <span
                    key={iso.id}
                    className="aim-pb-iso"
                    style={{ top: `${iso.y}%` }}
                    title={iso.label}
                  >
                    <span className="aim-pb-iso-pulse" aria-hidden />
                    <span className="aim-pb-iso-dot" aria-hidden />
                    <span className="aim-pb-iso-label">{iso.label}</span>
                  </span>
                ))}
              </div>
              {section.caption ? (
                <p className="aim-pb-caption">{section.caption}</p>
              ) : null}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
