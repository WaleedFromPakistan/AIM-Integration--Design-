"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "../SectionHeader";

const stepIcons = {
  discover: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
  analyze: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 21H4.6c-.56 0-.84 0-1.054-.109a1 1 0 01-.437-.437C3 20.24 3 19.96 3 19.4V3" />
      <path d="M7 14l4-4 4 4 6-6" />
    </svg>
  ),
  design: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  develop: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  document: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

function ProcessStep({ step, index, isActive, totalSteps }) {
  return (
    <div className={`aim-process-step ${isActive ? "is-active" : ""}`}>
      <div className="aim-process-step-indicator">
        <div className="aim-process-step-number">
          <span className="aim-process-step-icon">
            {stepIcons[step.icon] || stepIcons.discover}
          </span>
        </div>
        {index < totalSteps - 1 ? (
          <div className="aim-process-step-line" aria-hidden />
        ) : null}
      </div>
      <div className="aim-process-step-content">
        <div className="aim-process-step-num">{step.number}</div>
        <h3 className="aim-heading aim-process-step-title">{step.title}</h3>
        <p className="aim-process-step-desc">{step.description}</p>
      </div>
    </div>
  );
}

export default function ProcessSection({ data }) {
  const [inView, setInView] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !data?.steps?.length) return;
    let current = 0;
    const interval = setInterval(() => {
      if (current < data.steps.length) {
        setActiveStep(current);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 180);
    return () => clearInterval(interval);
  }, [inView, data?.steps?.length]);

  if (!data?.steps?.length) return null;

  const { id, eyebrow, title, subtitle, steps } = data;

  return (
    <section
      ref={sectionRef}
      className={`aim-section aim-process-section ${inView ? "is-inview" : ""}`}
      id={id}
    >
      <div className="aim-container">
        <SectionHeader data={{ eyebrow, title, subtitle }} />
        <div className="aim-process-timeline">
          {steps.map((step, index) => (
            <ProcessStep
              key={step.id}
              step={step}
              index={index}
              isActive={index <= activeStep}
              totalSteps={steps.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
