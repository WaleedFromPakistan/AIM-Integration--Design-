"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import StatCounter from "./StatCounter";

export default function AboutSection({ data }) {
  const [inView, setInView] = useState(false);
  const [startCounters, setStartCounters] = useState(false);
  const sectionRef = useRef(null);
  const {
    id,
    eyebrow,
    title,
    body,
    stats,
    imageUrl,
    imageAlt,
  } = data ?? {};
  const titleParts = useMemo(() => {
    if (!title) return { lead: "", accent: "" };
    const chunks = title.split("—");
    if (chunks.length < 2) return { lead: title, accent: "" };
    return {
      lead: chunks[0].trim(),
      accent: chunks.slice(1).join("—").trim(),
    };
  }, [title]);

  useEffect(() => {
    if (!data) return;
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setInView(true);
        setStartCounters(true);
        observer.disconnect();
      },
      {
        root: null,
        threshold: 0.24,
        rootMargin: "0px 0px -10% 0px",
      },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [data]);

  if (!data) return null;

  return (
    <section
      ref={sectionRef}
      className={`aim-section aim-about-section ${inView ? "is-inview" : ""}`}
      id={id}
    >
      <div className="aim-container aim-about-grid">
        <div className="aim-about-content">
          {eyebrow ? <p className="aim-eyebrow aim-about-eyebrow">{eyebrow}</p> : null}
          {title ? (
            <h2 className="aim-heading aim-about-title">
              {titleParts.lead}
              {titleParts.accent ? (
                <>
                  {" "}
                  <span className="aim-about-title-accent">—{titleParts.accent}</span>
                </>
              ) : null}
            </h2>
          ) : null}
          <div className="aim-about-line" aria-hidden>
            <span />
          </div>
          {body?.map((paragraph, index) => (
            <p key={`about-body-${index}`} className="aim-about-body">
              {paragraph}
            </p>
          ))}
          {stats?.length ? (
            <div className="aim-stats">
              {stats.map((s) => (
                <div key={s.label} className="aim-stat">
                  <strong>
                    <StatCounter value={s.value} start={startCounters} />
                  </strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {imageUrl ? (
          <div className="aim-about-image">
            <Image
              src={imageUrl}
              alt={imageAlt || ""}
              width={900}
              height={700}
              className="aim-about-image-el"
              sizes="(max-width: 960px) 100vw, 45vw"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
