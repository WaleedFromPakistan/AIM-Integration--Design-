"use client";

import { useState } from "react";
import SectionHeader from "../SectionHeader";

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
    <section className="aim-section" id={id}>
      <div className="aim-container aim-contact-grid">
        <div>
          <SectionHeader data={{ eyebrow, title, subtitle }} />
          <p className="mt-4 text-base text-[color:var(--color-text-muted)] max-w-md leading-relaxed">
            Prefer email? Reach us directly from your inbox once you have scoped
            the basics—we respond within one business day.
          </p>
        </div>
        <div>
          <form className="max-w-xl ml-auto" onSubmit={onSubmit}>
            {fields?.map((field) => (
              <div key={field.name} className="aim-form-field">
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(e) => onChange(field.name, e.target.value)}
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
            <button type="submit" className="aim-btn aim-btn-primary mt-2">
              {submitLabel}
            </button>
            {status === "sent" ? (
              <p className="mt-3 text-sm text-[color:var(--color-gold)]">
                {successMessage}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
