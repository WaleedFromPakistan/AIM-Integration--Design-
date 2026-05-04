"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function ProjectCallout({ data }) {
  const reduce = useReducedMotion();
  if (!data) return null;

  return (
    <section className="aim-pcl">
      <div className="aim-container">
        <motion.div
          className="aim-pcl-card"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="aim-pcl-corner aim-pcl-corner-tl" aria-hidden />
          <span className="aim-pcl-corner aim-pcl-corner-tr" aria-hidden />
          <span className="aim-pcl-corner aim-pcl-corner-bl" aria-hidden />
          <span className="aim-pcl-corner aim-pcl-corner-br" aria-hidden />

          {data.title ? <h3 className="aim-heading aim-pcl-title">{data.title}</h3> : null}
          {data.body ? <p className="aim-pcl-body">{data.body}</p> : null}

          <div className="aim-pcl-actions">
            {data.primaryCta ? (
              <Link href={data.primaryCta.href} className="aim-pcl-btn aim-pcl-btn-primary">
                {data.primaryCta.label}
              </Link>
            ) : null}
            {data.secondaryCta ? (
              <Link href={data.secondaryCta.href} className="aim-pcl-btn aim-pcl-btn-secondary">
                {data.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
