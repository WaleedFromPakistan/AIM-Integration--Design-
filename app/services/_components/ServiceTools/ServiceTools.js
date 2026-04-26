"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SectionHeader from "@/app/components/SectionHeader";

/**
 * Brand metadata for known tools — used to render a swatch/vendor line
 * so each tile reads like a real logo wall, not just text.
 * Falls back to gold swatch + "Industry standard" for unknown names.
 */
const TOOL_LOOKUP = {
  autocad:                  { brand: "AutoCAD",         vendor: "Autodesk",       swatch: "#E03A3E" },
  revit:                    { brand: "Revit",           vendor: "Autodesk",       swatch: "#0696D7" },
  "revit mep":              { brand: "Revit MEP",       vendor: "Autodesk",       swatch: "#0696D7" },
  "autodesk revit":         { brand: "Revit",           vendor: "Autodesk",       swatch: "#0696D7" },
  "3ds max":                { brand: "3DS Max",         vendor: "Autodesk",       swatch: "#36BFFA" },
  "3d max":                 { brand: "3DS Max",         vendor: "Autodesk",       swatch: "#36BFFA" },
  navisworks:               { brand: "Navisworks",      vendor: "Autodesk",       swatch: "#FFB400" },
  "autodesk navisworks":    { brand: "Navisworks",      vendor: "Autodesk",       swatch: "#FFB400" },
  sketchup:                 { brand: "SketchUp",        vendor: "Trimble",        swatch: "#005F9E" },
  lumion:                   { brand: "Lumion",          vendor: "Act-3D",         swatch: "#FF6B00" },
  "lumion / enscape":       { brand: "Lumion + Enscape",vendor: "Visualization",  swatch: "#FF6B00" },
  enscape:                  { brand: "Enscape",         vendor: "Chaos",          swatch: "#7DD3FC" },
  "v-ray":                  { brand: "V-Ray",           vendor: "Chaos",          swatch: "#0EA5E9" },
  "bim 360 / acc":          { brand: "BIM 360 / ACC",   vendor: "Autodesk",       swatch: "#0696D7" },
  "bim 360":                { brand: "BIM 360",         vendor: "Autodesk",       swatch: "#0696D7" },
  dynamo:                   { brand: "Dynamo",          vendor: "Autodesk",       swatch: "#5B5FE3" },
  solibri:                  { brand: "Solibri",         vendor: "Nemetschek",     swatch: "#22C55E" },
  "autoquotes (aq)":        { brand: "AutoQuotes",      vendor: "AQ",             swatch: "#F59E0B" },
  "adobe creative suite":   { brand: "Adobe CC",        vendor: "Adobe",          swatch: "#FF0000" },
  "cobie + ifc":            { brand: "COBie + IFC",     vendor: "buildingSMART",  swatch: "#10B981" },
  "ada + ibc code analysis":{ brand: "ADA + IBC",       vendor: "Code review",    swatch: "#94A3B8" },
};

function lookupTool(name) {
  if (!name) return null;
  return TOOL_LOOKUP[name.toLowerCase().trim()] ?? null;
}

function ToolBadge({ item }) {
  const meta = lookupTool(item.name);
  const brand = meta?.brand ?? item.name;
  const vendor = meta?.vendor ?? "Industry standard";
  const swatch = meta?.swatch ?? "#CB9F79";

  return (
    <div className="aim-svc-tool" title={item.description || brand}>
      <span
        className="aim-svc-tool-swatch"
        aria-hidden
        style={{ background: swatch }}
      />
      <div className="aim-svc-tool-text">
        <span className="aim-svc-tool-brand">{brand}</span>
        <span className="aim-svc-tool-vendor">{vendor}</span>
      </div>
    </div>
  );
}

export default function ServiceTools({ data }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  // Duplicate items so the marquee loops seamlessly
  const items = data?.items ?? [];
  const doubled = useMemo(() => [...items, ...items], [items]);

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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!items.length) return null;
  const { eyebrow, title, subtitle } = data;

  return (
    <section
      ref={ref}
      className={`aim-section aim-svc-tools ${inView ? "is-inview" : ""}`}
      id="service-tools"
    >
      <div className="aim-container">
        <SectionHeader
          data={{
            eyebrow: eyebrow || "Our toolkit",
            title: title || "Tools we use",
            subtitle,
          }}
        />
      </div>

      {/* Full-bleed marquee (right-to-left infinite scroll) */}
      <div className="aim-svc-tools-marquee" aria-label="Tools we use">
        <div className="aim-svc-tools-marquee-track">
          {doubled.map((item, i) => (
            <ToolBadge key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
