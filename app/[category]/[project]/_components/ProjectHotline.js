"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function ProjectHotline({ data }) {
  const containerRef = useRef(null);
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 50, y: 50, active: false });
  const [hoveredZone, setHoveredZone] = useState(null);

  const handleMove = (e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y, active: true });

    if (data.zones?.length) {
      let nearest = null;
      let bestDist = Infinity;
      for (const z of data.zones) {
        const d = Math.hypot(z.x - x, z.y - y);
        if (d < bestDist) {
          bestDist = d;
          nearest = z;
        }
      }
      setHoveredZone(bestDist < 22 ? nearest : null);
    }
  };

  const handleLeave = () => {
    setPos((p) => ({ ...p, active: false }));
    setHoveredZone(null);
  };

  if (!data) return null;

  return (
    <section className="aim-poh">
      <div className="aim-container">
        <header className="aim-poh-head">
          {data.eyebrow ? <span className="aim-poh-eyebrow">{data.eyebrow}</span> : null}
          {data.title ? <h2 className="aim-heading aim-poh-title">{data.title}</h2> : null}
          {data.subtitle ? <p className="aim-poh-subtitle">{data.subtitle}</p> : null}
        </header>

        <div
          className={`aim-poh-stage ${pos.active ? "is-active" : ""}`}
          ref={containerRef}
          onMouseMove={reduce ? undefined : handleMove}
          onMouseLeave={reduce ? undefined : handleLeave}
        >
          {data.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt={data.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 1400px"
              className="aim-poh-img"
            />
          ) : null}

          <div className="aim-poh-dim" aria-hidden />
          <div
            className="aim-poh-spot"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
            aria-hidden
          />

          {data.zones?.map((z) => {
            const isActive = hoveredZone?.id === z.id;
            return (
              <motion.button
                key={z.id}
                type="button"
                className={`aim-poh-zone ${isActive ? "is-on" : ""}`}
                style={{ left: `${z.x}%`, top: `${z.y}%` }}
                onFocus={() => setHoveredZone(z)}
                onBlur={() => setHoveredZone(null)}
                onMouseEnter={() => setHoveredZone(z)}
                aria-label={`${z.label} — ${z.detail}`}
                animate={
                  reduce
                    ? undefined
                    : {
                        scale: isActive ? 1.25 : 1,
                      }
                }
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="aim-poh-zone-ring" aria-hidden />
                <span className="aim-poh-zone-dot" aria-hidden />
                <span className="aim-poh-zone-label">{z.shortLabel || z.label}</span>
              </motion.button>
            );
          })}

          {hoveredZone ? (
            <motion.div
              className="aim-poh-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              role="status"
              aria-live="polite"
            >
              <span className="aim-poh-card-tag">{hoveredZone.shortLabel || "ZONE"}</span>
              <h4 className="aim-poh-card-title">{hoveredZone.label}</h4>
              <p className="aim-poh-card-detail">{hoveredZone.detail}</p>
              {hoveredZone.thermal ? (
                <span className="aim-poh-card-thermal">{hoveredZone.thermal}</span>
              ) : null}
            </motion.div>
          ) : null}
        </div>

        <ul className="aim-poh-legend" aria-label="Cooking zones">
          {data.zones?.map((z) => (
            <li
              key={z.id}
              className={hoveredZone?.id === z.id ? "is-on" : ""}
              onMouseEnter={() => setHoveredZone(z)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              <span className="aim-poh-legend-dot" aria-hidden />
              <span className="aim-poh-legend-label">{z.label}</span>
              {z.thermal ? <span className="aim-poh-legend-thermal">{z.thermal}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
