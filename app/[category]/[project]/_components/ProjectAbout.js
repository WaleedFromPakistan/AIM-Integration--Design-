"use client";

import { motion, useReducedMotion } from "framer-motion";

const blockVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProjectAbout({ data }) {
  const reduce = useReducedMotion();
  if (!data) return null;

  return (
    <section className="aim-pa">
      <div className="aim-container">
        <div className="aim-pa-head">
          {data.eyebrow ? <span className="aim-pa-eyebrow">{data.eyebrow}</span> : null}
          {data.title ? <h2 className="aim-heading aim-pa-title">{data.title}</h2> : null}
          {data.lede ? <p className="aim-pa-lede">{data.lede}</p> : null}
        </div>

        {data.blocks?.length ? (
          <div className="aim-pa-grid">
            {data.blocks.map((b) => (
              <motion.article
                key={b.id}
                className="aim-pa-block"
                variants={blockVariants}
                initial={reduce ? false : "hidden"}
                whileInView={reduce ? undefined : "visible"}
                viewport={{ once: true, amount: 0.3 }}
              >
                <span className="aim-pa-tag">{b.tag}</span>
                <h3 className="aim-heading aim-pa-block-title">{b.title}</h3>
                <p className="aim-pa-block-body">{b.body}</p>
              </motion.article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
