"use client";

import Image from "next/image";
import { useState } from "react";
import SectionHeader from "../SectionHeader";

const CONTACT_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80";

const CONTACT_DETAILS = [
  {
    label: "Email",
    value: "info@aimintegrateddesign.com",
    href: "mailto:info@aimintegrateddesign.com",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <polyline points="3 7 12 13 21 7" />
      </svg>
    ),
  },
  {
    label: "Response time",
    value: "Within one business day",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15.5 14" />
      </svg>
    ),
  },
  {
    label: "Working hours",
    value: "Mon–Fri · 9:00–18:00 PKT",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
      </svg>
    ),
  },
];

export default function ContactSection({ data }) {
  const [status, setStatus] = useState("idle");
  const [values, setValues] = useState({});

  if (!data) return null;

  const { id, eyebrow, title, subtitle, fields, submitLabel, successMessage } =
    data;

  const onChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus("sent");
    window.setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section className="aim-section aim-contact-section" id={id}>
      {/* Decorative background */}
      <div className="aim-contact-bg" aria-hidden />

      <div className="aim-container aim-contact-shell">
        {/* === LEFT — image with overlaid section header === */}
        <div className="aim-contact-left">
          <div className="aim-contact-image">
            <Image
              src={CONTACT_IMAGE}
              alt="Design studio at work"
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 40vw"
            />
            <div className="aim-contact-image-overlay" aria-hidden />
            <div className="aim-contact-image-copy">
              <SectionHeader data={{ eyebrow, title, subtitle }} />
            </div>
          </div>
        </div>

        {/* === RIGHT — form card + contact details === */}
        <div className="aim-contact-right">
          <div className="aim-contact-form-card">
          <div className="aim-contact-form-card-head">
            <h3 className="aim-heading aim-contact-form-card-title">
              Tell us about your project
            </h3>
            <p className="aim-contact-form-card-sub">
              Share a few details — we'll respond with next steps and a timeline.
            </p>
          </div>

          <form className="aim-contact-form" onSubmit={onSubmit} noValidate>
            <div className="aim-contact-form-grid">
              {fields?.map((field) => (
                <div
                  key={field.name}
                  className={`aim-form-field ${field.type === "textarea" ? "aim-form-field--full" : ""}`}
                >
                  <label htmlFor={field.name}>
                    {field.label}
                    {field.required ? <span className="aim-form-required" aria-hidden>*</span> : null}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={values[field.name] ?? ""}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      rows={5}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      value={values[field.name] ?? ""}
                      onChange={(e) => onChange(field.name, e.target.value)}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value || "empty"} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={values[field.name] ?? ""}
                      onChange={(e) => onChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="aim-contact-form-footer">
              <button type="submit" className="aim-btn aim-btn-primary aim-contact-submit">
                {submitLabel}
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              {status === "sent" ? (
                <p className="aim-contact-success" role="status">
                  {successMessage}
                </p>
              ) : null}
            </div>
          </form>
          </div>

          <ul className="aim-contact-details" role="list">
            {CONTACT_DETAILS.map((d) => (
              <li key={d.label} className="aim-contact-detail">
                <span className="aim-contact-detail-icon">{d.icon}</span>
                <div className="aim-contact-detail-text">
                  <span className="aim-contact-detail-label">{d.label}</span>
                  {d.href ? (
                    <a className="aim-contact-detail-value" href={d.href}>
                      {d.value}
                    </a>
                  ) : (
                    <span className="aim-contact-detail-value">{d.value}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
