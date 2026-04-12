import Image from "next/image";
import SectionHeader from "../SectionHeader";

export default function AboutSection({ data }) {
  if (!data) return null;

  const { id, eyebrow, title, body, stats, imageUrl, imageAlt } = data;

  const header = { eyebrow, title };

  return (
    <section className="aim-section" id={id}>
      <div className="aim-container aim-about-grid">
        <div>
          <SectionHeader data={{ ...header, subtitle: null }} />
          {body?.map((paragraph, index) => (
            <p
              key={`about-body-${index}`}
              className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-muted)]"
            >
              {paragraph}
            </p>
          ))}
          {stats?.length ? (
            <div className="aim-stats">
              {stats.map((s) => (
                <div key={s.label} className="aim-stat">
                  <strong>{s.value}</strong>
                  <span className="text-xs text-[color:var(--color-text-muted)]">
                    {s.label}
                  </span>
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
              className="w-full h-auto object-cover"
              sizes="(max-width: 960px) 100vw, 45vw"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
