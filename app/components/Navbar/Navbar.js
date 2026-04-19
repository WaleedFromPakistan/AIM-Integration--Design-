"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../ThemeProvider";

const HOME_NAV_SCROLL_PX = 72;

export default function Navbar({ data, variant }) {
  const { resolvedTheme } = useTheme();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [homeScrolled, setHomeScrolled] = useState(false);
  const [activeNavId, setActiveNavId] = useState("home");
  const closeTimer = useRef(null);
  const dialogRef = useRef(null);

  const isHome = variant === "home";
  const transparentTop = isHome && !homeScrolled;

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

  const closeMobileMenu = useCallback(() => {
    const d = dialogRef.current;
    if (!d?.open) {
      setMenuOpen(false);
      return;
    }
    const panel = d.querySelector(".aim-nav-dialog-panel");
    const desktop = window.matchMedia("(min-width: 1280px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (desktop || reduceMotion || !panel) {
      panel?.classList.remove("is-closing");
      d.close();
      setMenuOpen(false);
      return;
    }
    panel.classList.add("is-closing");
    const finish = () => {
      panel.classList.remove("is-closing");
      if (d.open) d.close();
      setMenuOpen(false);
    };
    panel.addEventListener("animationend", finish, { once: true });
    window.setTimeout(() => {
      if (panel.classList.contains("is-closing") && d.open) finish();
    }, 450);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onCancel = (e) => {
      e.preventDefault();
      closeMobileMenu();
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [closeMobileMenu]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onMq = (e) => {
      if (!e.matches) return;
      const d = dialogRef.current;
      d?.querySelector(".aim-nav-dialog-panel")?.classList.remove("is-closing");
      d?.close();
      setMenuOpen(false);
    };
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  const openMobileMenu = useCallback(() => {
    const d = dialogRef.current;
    const panel = d?.querySelector(".aim-nav-dialog-panel");
    panel?.classList.remove("is-closing");
    setMenuOpen(true);
    d?.showModal();
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      setHomeScrolled(window.scrollY >= HOME_NAV_SCROLL_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;
    const hero = document.querySelector(".aim-hero");
    const targets = [];
    if (hero) {
      hero.dataset.navSection = "home";
      targets.push(hero);
    }
    for (const id of ["about", "services", "projects", "contact"]) {
      const el = document.getElementById(id);
      if (el) {
        el.dataset.navSection = id;
        targets.push(el);
      }
    }
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const next = hit[0]?.target?.getAttribute("data-nav-section");
        if (next) setActiveNavId(next);
      },
      {
        root: null,
        rootMargin: "-42% 0px -42% 0px",
        threshold: [0, 0.05, 0.15, 0.35, 0.55, 0.75, 1],
      },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [isHome]);

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

  const aimPart = brandWordmark?.bold ?? "AIM";
  const condensedPart =
    brandWordmark?.condensed ??
    brandWordmark?.regular?.trim().toUpperCase() ??
    "INTEGRATED DESIGNS";

  const navClass = [
    "aim-nav",
    isHome ? "aim-nav--home" : "",
    transparentTop ? "aim-nav--transparent" : "",
    isHome && homeScrolled ? "aim-nav--home-solid" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const navLogoSrc =
    transparentTop || resolvedTheme === "dark"
      ? "/logo/bg-transparent.png"
      : logoUrl;

  return (
    <header className={navClass}>
      <div className="aim-container aim-nav-inner">
        <Link
          href="/"
          className="aim-nav-brand"
          aria-label={brandName || "AIM Integrated Designs home"}
        >
          {navLogoSrc ? (
            <Image
              src={navLogoSrc}
              alt={logoAlt || brandName}
              width={112}
              height={112}
              className="aim-nav-logo object-contain"
              priority
            />
          ) : null}
          <span className="aim-brand-wordmark">
            <span className="aim-brand-aim">{aimPart}</span>
            <span className="aim-brand-condensed">{condensedPart}</span>
          </span>
        </Link>

        <nav className="aim-nav-links" aria-label="Primary">
          {links?.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className={`aim-nav-link${activeNavId === l.id ? " is-active" : ""}`}
            >
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
              className={`aim-nav-link aim-nav-link-button${
                servicesOpen || activeNavId === "services" ? " is-active" : ""
              }`}
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
