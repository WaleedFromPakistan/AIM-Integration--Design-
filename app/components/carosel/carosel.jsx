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
            {slide.image ? (
              <Image
                src={slide.image}
                alt={slide.imageAlt || ""}
                fill
                className="object-cover aim-carousel-slide-img"
                sizes="100vw"
                priority={slide.id === slides[0]?.id}
              />
            ) : null}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
