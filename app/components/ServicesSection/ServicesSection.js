"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SectionHeader from "../SectionHeader";

function ServicePanel({
  item,
  index,
  isExpanded,
  tabbable,
  onPanelFocus,
  onPanelBlur,
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`aim-service-panel ${isExpanded ? "is-expanded" : ""}`}
      tabIndex={tabbable ? 0 : -1}
      onFocus={tabbable ? onPanelFocus : undefined}
      onBlur={tabbable ? onPanelBlur : undefined}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.imageAlt || item.title}
          fill
          className="object-cover aim-service-panel-img"
          sizes="(max-width: 1023px) 100vw, 25vw"
        />
      ) : null}
      <div className="aim-service-panel-scrim" aria-hidden />
      <div className="aim-service-panel-copy">
        <span className="aim-service-panel-index">{num}</span>
        <h3 className="aim-service-panel-title">{item.title}</h3>
        <p className="aim-service-panel-desc">{item.description}</p>
      </div>
    </article>
  );
}

export default function ServicesSection({ data }) {
  const [expandedId, setExpandedId] = useState(null);
  const servicesSwiperRef = useRef(null);

  if (!data?.items?.length) return null;

  const { id, eyebrow, title, subtitle, items } = data;
  const header = { eyebrow, title, subtitle };

  const blurIfLeaving = (e) => {
    const next = e.relatedTarget;
    if (!next || !e.currentTarget.contains(next)) {
      setExpandedId(null);
    }
  };

  return (
    <section className="aim-section aim-section-alt" id={id}>
      <div className="aim-container">
        <SectionHeader data={header} />
      </div>

      <div className="aim-services-bleed">
        <div className="aim-services-bleed-inner">
          <div className="aim-services-grid-desktop" role="list">
            {items.map((item, index) => (
              <div
                key={item.id}
                role="listitem"
                className={`aim-services-grid-cell ${expandedId === item.id ? "is-expanded" : ""}`}
                onMouseEnter={() => setExpandedId(item.id)}
                onMouseLeave={() => setExpandedId(null)}
              >
                <ServicePanel
                  item={item}
                  index={index}
                  isExpanded={expandedId === item.id}
                  tabbable
                  onPanelFocus={() => setExpandedId(item.id)}
                  onPanelBlur={blurIfLeaving}
                />
              </div>
            ))}
          </div>

          <div className="aim-services-swiper-host">
            <div className="aim-services-swiper-wrap">
              <button
                type="button"
                className="aim-services-nav-btn aim-services-nav-prev"
                aria-label="Previous service"
                onClick={() => servicesSwiperRef.current?.slidePrev()}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 18l-6-6 6-6"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="aim-services-nav-btn aim-services-nav-next"
                aria-label="Next service"
                onClick={() => servicesSwiperRef.current?.slideNext()}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 18l6-6-6-6"
                  />
                </svg>
              </button>
              <Swiper
                modules={[Pagination]}
                slidesPerView={1}
                spaceBetween={16}
                speed={450}
                pagination={{ clickable: true }}
                onSwiper={(swiper) => {
                  servicesSwiperRef.current = swiper;
                }}
                breakpoints={{
                  520: { slidesPerView: 2, spaceBetween: 16 },
                  768: { slidesPerView: 2, spaceBetween: 16 },
                }}
                className="aim-services-swiper"
              >
                {items.map((item, index) => (
                  <SwiperSlide key={item.id} className="!h-auto">
                    <ServicePanel
                      item={item}
                      index={index}
                      isExpanded={false}
                      tabbable={false}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
