"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Navbar({ data }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef(null);
  const dialogRef = useRef(null);

  const openServices = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }, []);

  const scheduleCloseServices = useCallback(() => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 140);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => setMenuOpen(false);
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onMq = (e) => {
      if (e.matches) dialogRef.current?.close();
    };
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  const openMobileMenu = () => {
    setMenuOpen(true);
    dialogRef.current?.showModal();
  };

  const closeMobileMenu = () => {
    dialogRef.current?.close();
    setMenuOpen(false);
  };

  if (!data) return null;

  const {
    brandName,
    brandWordmark,
    logoUrl,
    logoAlt,
    links,
    servicesMenu,
    cta,
  } = data;

  const bold = brandWordmark?.bold ?? "AIM";
  const regular = brandWordmark?.regular ?? " Design";

  return (
    <header className="aim-nav">
      <div className="aim-container aim-nav-inner">
        <Link href="/" className="aim-nav-brand">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={logoAlt || brandName}
              width={48}
              height={48}
              className="aim-nav-logo object-cover"
              priority
            />
          ) : null}
          <span className="aim-brand-wordmark">
            <span className="aim-brand-bold">{bold}</span>
            <span className="aim-brand-regular">{regular}</span>
          </span>
        </Link>

        <nav className="aim-nav-links" aria-label="Primary">
          {links?.map((l) => (
            <Link key={l.id} href={l.href} className="aim-nav-link">
              {l.label}
            </Link>
          ))}

          <div
            className="aim-nav-services-wrap"
            onMouseEnter={openServices}
            onMouseLeave={scheduleCloseServices}
          >
            <button
              type="button"
              className="aim-nav-link aim-nav-link-button"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              {servicesMenu?.label ?? "Services"}
            </button>
            <div
              className={`aim-services-panel ${servicesOpen ? "is-open" : ""}`}
              role="region"
              aria-label="Services overview"
            >
              {servicesMenu?.intro ? (
                <p className="aim-services-intro">{servicesMenu.intro}</p>
              ) : null}
              <div className="aim-services-grid">
                {servicesMenu?.items?.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="aim-service-tile"
                    onFocus={openServices}
                  >
                    <h4>{item.title}</h4>
                    <p>{item.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="aim-nav-actions">
          {cta?.href ? (
            <Link href={cta.href} className="aim-btn aim-btn-primary aim-nav-cta">
              {cta.label}
            </Link>
          ) : null}
          <button
            type="button"
            className="aim-nav-burger"
            aria-expanded={menuOpen}
            aria-controls="aim-nav-dialog"
            aria-label="Open menu"
            onClick={openMobileMenu}
          >
            <span className="aim-nav-burger-bar" />
            <span className="aim-nav-burger-bar" />
            <span className="aim-nav-burger-bar" />
          </button>
        </div>
      </div>

      <dialog id="aim-nav-dialog" ref={dialogRef} className="aim-nav-dialog">
        <div className="aim-nav-dialog-panel">
          <div className="aim-nav-dialog-head">
            <p className="aim-nav-dialog-title">Menu</p>
            <button
              type="button"
              className="aim-nav-dialog-close"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            >
              ×
            </button>
          </div>
          <nav className="aim-nav-dialog-nav" aria-label="Mobile primary">
            {links?.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                className="aim-nav-dialog-link"
                onClick={closeMobileMenu}
              >
                {l.label}
              </Link>
            ))}
            <p className="aim-nav-dialog-section">{servicesMenu?.label ?? "Services"}</p>
            {servicesMenu?.items?.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="aim-nav-dialog-link aim-nav-dialog-sublink"
                onClick={closeMobileMenu}
              >
                {item.title}
              </Link>
            ))}
            {cta?.href ? (
              <Link
                href={cta.href}
                className="aim-btn aim-btn-primary aim-nav-dialog-cta"
                onClick={closeMobileMenu}
              >
                {cta.label}
              </Link>
            ) : null}
          </nav>
        </div>
      </dialog>
    </header>
  );
}
