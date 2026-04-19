import Link from "next/link";

export default function Footer({ data, site }) {
  if (!data) return null;

  const year = new Date().getFullYear();
  const copyright = (data.copyright || "").replace("{year}", String(year));

  return (
    <footer className="aim-footer">
      <div className="aim-container aim-footer-grid">
        <div>
          <p className="aim-heading aim-footer-company text-lg font-semibold">
            {site?.companyName ?? "AIM Integrated Designs"}
          </p>
          {data.tagline ? (
            <p className="aim-footer-tagline">{data.tagline}</p>
          ) : null}
        </div>
        {data.columns?.map((col) => (
          <div key={col.title}>
            <p className="aim-footer-col-title">{col.title}</p>
            {col.links?.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="aim-container aim-footer-bar">
        <span>{copyright}</span>
        <div className="flex gap-4">
          {site?.social?.linkedin ? (
            <a href={site.social.linkedin} rel="noopener noreferrer" target="_blank" aria-label="AIM Integrated Designs on LinkedIn">
              LinkedIn
            </a>
          ) : null}
          {site?.social?.instagram ? (
            <a href={site.social.instagram} rel="noopener noreferrer" target="_blank" aria-label="AIM Integrated Designs on Instagram">
              Instagram
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
