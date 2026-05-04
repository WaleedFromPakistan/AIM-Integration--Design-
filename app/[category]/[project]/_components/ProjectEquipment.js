"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 24, rotateY: -6 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateY: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function ProjectEquipment({ data }) {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".aim-pe-card");
    const step = card ? card.clientWidth + 24 : 320;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  if (!data?.items?.length) return null;

  return (
    <section className="aim-pe">
      <div className="aim-container">
        <header className="aim-pe-head">
          <div>
            {data.eyebrow ? <span className="aim-pe-eyebrow">{data.eyebrow}</span> : null}
            {data.title ? <h2 className="aim-heading aim-pe-title">{data.title}</h2> : null}
            {data.subtitle ? <p className="aim-pe-subtitle">{data.subtitle}</p> : null}
          </div>

          <div className="aim-pe-controls" aria-label="Equipment carousel controls">
            <button
              type="button"
              className="aim-pe-ctrl"
              onClick={() => scrollBy(-1)}
              aria-label="Previous"
            >
              ←
            </button>
            <button
              type="button"
              className="aim-pe-ctrl"
              onClick={() => scrollBy(1)}
              aria-label="Next"
            >
              →
            </button>
          </div>
        </header>

        <div className="aim-pe-track" ref={trackRef} role="list">
          {data.items.map((item, i) => (
            <motion.article
              key={item.id}
              role="listitem"
              className="aim-pe-card"
              variants={cardVariants}
              custom={i}
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "visible"}
              viewport={{ once: true, amount: 0.4 }}
            >
              <div className="aim-pe-card-head">
                <span className="aim-pe-code">{item.code}</span>
                <span className="aim-pe-vendor">{item.vendor}</span>
              </div>
              <h3 className="aim-pe-name">{item.name}</h3>
              <p className="aim-pe-spec">{item.spec}</p>
              <p className="aim-pe-role">{item.role}</p>
              <div className="aim-pe-card-foot">
                <span aria-hidden />
              </div>
            </motion.article>
          ))}
        </div>

        {data.imageUrl ? (
          <div className="aim-pe-schedule">
            <span className="aim-pe-schedule-tag">SOE — Schedule of Equipment</span>
            <div className="aim-pe-schedule-frame">
              <Image
                src={data.imageUrl}
                alt={data.imageAlt}
                width={2000}
                height={1100}
                sizes="(max-width: 1024px) 100vw, 1400px"
                className="aim-pe-schedule-img"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
