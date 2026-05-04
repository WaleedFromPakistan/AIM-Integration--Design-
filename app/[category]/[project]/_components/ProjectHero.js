"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const charVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.04 * i,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function StaggerHeading({ text, className }) {
  const reduce = useReducedMotion();
  if (reduce || !text) return <span className={className}>{text}</span>;

  const words = text.split(" ");
  let charIndex = 0;
  return (
    <span className={className} aria-label={text}>
      {words.map((word, w) => (
        <span key={`w-${w}`} className="aim-ph-word" aria-hidden>
          {Array.from(word).map((ch) => {
            const i = charIndex++;
            return (
              <motion.span
                key={`${w}-${i}`}
                className="aim-ph-char"
                variants={charVariants}
                custom={i}
                initial="hidden"
                animate="visible"
              >
                {ch}
              </motion.span>
            );
          })}
          {w < words.length - 1 ? <span className="aim-ph-space">&nbsp;</span> : null}
        </span>
      ))}
    </span>
  );
}

export default function ProjectHero({ data }) {
  if (!data) return null;

  return (
    <section className="aim-ph">
      <div className="aim-ph-bg" aria-hidden>
        {data.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={data.imageAlt}
            fill
            priority
            sizes="100vw"
            className="aim-ph-img"
          />
        ) : null}
        <div className="aim-ph-glass" />
        <div className="aim-ph-flare" />
        <div className="aim-ph-grid-overlay" />
      </div>

      <div className="aim-container aim-ph-inner">
        {data.eyebrow ? <span className="aim-ph-eyebrow">{data.eyebrow}</span> : null}

        <h1 className="aim-heading aim-ph-title">
          <StaggerHeading text={data.title} className="aim-ph-title-inner" />
        </h1>

        {data.subtitle ? (
          <motion.p
            className="aim-ph-subtitle"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {data.subtitle}
          </motion.p>
        ) : null}

        {data.stats?.length ? (
          <motion.dl
            className="aim-ph-stats"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {data.stats.map((s) => (
              <div key={s.label} className="aim-ph-stat">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        ) : null}
      </div>
    </section>
  );
}
