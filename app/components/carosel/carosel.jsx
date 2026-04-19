"use client";

import Image from "next/image";
import { useCallback } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./style.css";

export default function Carosel({
  slides,
  autoplayMs,
  transitionMs,
  onActiveIndexChange,
}) {
  const handleSlideChange = useCallback(
    (swiper) => {
      onActiveIndexChange?.(swiper.realIndex);
    },
    [onActiveIndexChange],
  );

  if (!slides?.length) return null;

  return (
    <div className="aim-carousel-hero-mount">
      <Swiper
        className="aim-carousel-swiper"
        modules={[Autoplay]}
        loop
        speed={transitionMs}
        autoplay={{
          delay: autoplayMs,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        slidesPerView={1}
        allowTouchMove
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => onActiveIndexChange?.(swiper.realIndex)}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="aim-carousel-slide">
            {/* Desktop image — landscape, hidden on mobile */}
            {slide.image ? (
              <Image
                src={slide.image}
                alt={slide.imageAlt || ""}
                fill
                className="object-cover aim-carousel-slide-img aim-carousel-img-desktop"
                sizes="(max-width: 768px) 1px, 100vw"
                priority={slide.id === slides[0]?.id}
              />
            ) : null}
            {/* Mobile image — portrait, hidden on desktop */}
            {slide.mobileImage ? (
              <Image
                src={slide.mobileImage}
                alt={slide.mobileImageAlt || slide.imageAlt || ""}
                fill
                className="object-cover aim-carousel-slide-img aim-carousel-img-mobile"
                sizes="(max-width: 768px) 100vw, 1px"
                priority={slide.id === slides[0]?.id}
              />
            ) : null}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
