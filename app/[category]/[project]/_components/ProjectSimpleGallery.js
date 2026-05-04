"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function ProjectSimpleGallery({ data }) {
  const reduce = useReducedMotion();
  if (!data?.items?.length) return null;

  return (
    <section className="aim-psg" aria-label={data.title || "Project gallery"}>
      <div className="aim-container">
        {data.title ? (
          <header className="aim-psg-head">
            <h2 className="aim-heading aim-psg-title">{data.title}</h2>
            {data.subtitle ? <p className="aim-psg-subtitle">{data.subtitle}</p> : null}
          </header>
        ) : null}

        <ul className="aim-psg-grid">
          {data.items.map((item, i) => (
            <motion.li
              key={item.id || `g-${i}`}
              className="aim-psg-item"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.04 * i }}
            >
              <figure className="aim-psg-figure">
                <div className="aim-psg-frame">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || "Project image"}
                    fill
                    sizes="(max-width: 639px) 100vw, 33vw"
                    className="aim-psg-img"
                  />
                </div>
              </figure>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
