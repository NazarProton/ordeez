import Image from 'next/image';
import DCI from '../../../public/DCI.png';
import TGC from '../../../public/TGC.png';
import CENTAURI from '../../../public/centaurilogo.png';
import MIRAIDAO from '../../../public/miraidao.png';
import NewHighlightedText from '../NewHighlightedText';
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperInstance } from 'swiper/types';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

const Sponsors = () => {
  const swiperRef = useRef<SwiperInstance | null>(null);

  const sponsors = [
    { src: TGC, alt: 'TGC' },
    // { src: CENTAURI, alt: 'CENTAURI' },
    { src: DCI, alt: 'DCI' },
    { src: MIRAIDAO, alt: 'MIRAIDAO' },
    { src: TGC, alt: 'TGC' },
    // { src: CENTAURI, alt: 'CENTAURI' },
    { src: DCI, alt: 'DCI' },
    { src: MIRAIDAO, alt: 'MIRAIDAO' },
  ];

  return (
    <div className="relative z-[1] select-none flex flex-col items-center mt-16 w-full h-fit">
      <div className="flex min-w-full justify-center">
        <NewHighlightedText>
          <p className="z-[2] font-pressStart leading-[44px] pc820:leading-[64px] text-[32px] pc820:text-[40px] text-center">
            BACKED
          </p>
        </NewHighlightedText>
      </div>
      <p className="mb-16 font-normal mt-2 pc820:mt-4 font-vt323 text-grayNew text-xl tracking-[.05em]">
        and trusted by
      </p>

      <div
        className="flex justify-center"
        style={{ width: '100%', overflow: 'hidden' }}
      >
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={4}
          spaceBetween={32}
          modules={[Autoplay]}
          className="mySwiper"
          loop
          autoplay={{
            delay: 1100,
            disableOnInteraction: false,
          }}
          speed={2500}
          allowTouchMove={false} // Disable swiping
          breakpoints={{
            1025: {
              slidesPerView: 3,
            },
            740: {
              slidesPerView: 3,
            },
            600: {
              slidesPerView: 3,
            },
            200: {
              slidesPerView: 2,
            },
          }}
          style={{ width: '100%', backgroundColor: 'transparent' }}
        >
          {sponsors.map((sponsor, index) => (
            <SwiperSlide
              key={index}
              className={`!flex !justify-center !items-center !bg-transparent`}
            >
              <div
                className={`flex h-32 w-32 justify-center items-center select-none`}
              >
                <Image
                  className="grayscale size-full"
                  src={sponsor.src}
                  alt={sponsor.alt}
                  layout="fill"
                  objectFit="contain"
                  draggable="false" // Prevent dragging
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Sponsors;
