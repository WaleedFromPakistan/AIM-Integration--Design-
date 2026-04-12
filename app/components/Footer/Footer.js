import Link from "next/link";

export default function Footer({ data, site }) {
  if (!data) return null;

  const year = new Date().getFullYear();
  const copyright = (data.copyright || "").replace("{year}", String(year));

  return (
    <footer className="aim-footer">
      <div className="aim-container aim-footer-grid">
        <div>
          <p className="aim-heading text-lg font-semibold">
            {site?.companyName ?? "Aim Integrated Design"}
          </p>
          {data.tagline ? (
            <p className="mt-2 text-sm text-[color:var(--color-text-muted)] max-w-xs">
              {data.tagline}
            </p>
          ) : null}
        </div>
        {data.columns?.map((col) => (
          <div key={col.title}>
            <p className="text-xs uppercase tracking-widest text-[color:var(--color-gold)] mb-3">
              {col.title}
            </p>
            {col.links?.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="aim-container mt-10 pt-6 border-t border-[color:var(--color-border)] flex flex-col sm:flex-row gap-3 justify-between text-sm text-[color:var(--color-text-muted)]">
        <span>{copyright}</span>
        <div className="flex gap-4">
          {site?.social?.linkedin ? (
            <a href={site.social.linkedin} rel="noreferrer" target="_blank">
              LinkedIn
            </a>
          ) : null}
          {site?.social?.instagram ? (
            <a href={site.social.instagram} rel="noreferrer" target="_blank">
              Instagram
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
