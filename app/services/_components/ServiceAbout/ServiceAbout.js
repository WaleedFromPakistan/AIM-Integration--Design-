"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ServiceAbout({ data, slug }) {
  const [inView, setInView] = useState(false);
  const [catStatus, setCatStatus] = useState("idle"); // idle | loading | available | unavailable | error
  const [catMessage, setCatMessage] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Auto-clear the inline status message after a few seconds
  useEffect(() => {
    if (catStatus !== "unavailable" && catStatus !== "error") return;
    const t = setTimeout(() => {
      setCatStatus("idle");
      setCatMessage("");
    }, 4500);
    return () => clearTimeout(t);
  }, [catStatus]);

  const onCatalogueClick = async () => {
    if (!slug) return;
    setCatStatus("loading");
    setCatMessage("");
    try {
      const res = await fetch(`/api/catalogue/${slug}`, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.available && json.url) {
        setCatStatus("available");
        // Open in new window/tab
        window.open(json.url, "_blank", "noopener,noreferrer");
        setTimeout(() => setCatStatus("idle"), 800);
      } else {
        setCatStatus("unavailable");
        setCatMessage(json.message || "Catalogue not available yet.");
      }
    } catch {
      setCatStatus("error");
      setCatMessage("Could not check catalogue right now. Try again.");
    }
  };

  if (!data) return null;
  const { eyebrow, title, body, highlights, imageUrl, imageAlt } = data;

  return (
    <section
      ref={ref}
      className={`aim-section aim-svc-about ${inView ? "is-inview" : ""}`}
      id="about-service"
    >
      <div className="aim-container aim-svc-about-grid">
        {imageUrl ? (
          <div className="aim-svc-about-image">
            <Image
              src={imageUrl}
              alt={imageAlt || ""}
              width={900}
              height={1100}
              className="aim-svc-about-image-el"
              sizes="(max-width: 1023px) 100vw, 42vw"
            />
          </div>
        ) : null}

        <div className="aim-svc-about-content">
          {eyebrow ? <p className="aim-eyebrow">{eyebrow}</p> : null}
          {title ? (
            <h2 className="aim-heading aim-svc-about-title">{title}</h2>
          ) : null}
          <div className="aim-gold-line mt-5" aria-hidden />
          <div className="aim-svc-about-body">
            {body?.map((p, i) => (
              <p key={`svc-about-${i}`}>{p}</p>
            ))}
          </div>
          {highlights?.length ? (
            <ul className="aim-svc-about-highlights">
              {highlights.map((h) => (
                <li key={h} className="aim-svc-about-highlight">
                  <span className="aim-svc-about-tick" aria-hidden>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {slug ? (
            <div className="aim-svc-catalogue">
              <button
                type="button"
                className="aim-btn aim-btn-primary aim-svc-catalogue-btn"
                onClick={onCatalogueClick}
                disabled={catStatus === "loading"}
                aria-busy={catStatus === "loading"}
              >
                {catStatus === "loading" ? (
                  <>
                    <span className="aim-svc-catalogue-spinner" aria-hidden />
                    Checking…
                  </>
                ) : (
                  <>
                    View our catalogue
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M14 3h7v7" />
                      <path d="M21 3l-9 9" />
                      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                    </svg>
                  </>
                )}
              </button>
              {catStatus === "unavailable" || catStatus === "error" ? (
                <p className="aim-svc-catalogue-note" role="status">
                  {catMessage}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
