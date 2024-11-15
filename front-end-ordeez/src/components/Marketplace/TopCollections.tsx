import React, { memo, useContext, useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { Swiper as SwiperInstance } from 'swiper/types';
import { CollectionsContext } from '@/context';
import Link from 'next/link';


interface StatisticType {
  title: string;
  description: string;
}

const TopCollections: React.FC = memo(() => {
  const { CollectionsState } = useContext(CollectionsContext);

  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <div className="mb-8" style={{ width: '100%', overflow: 'hidden' }}>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={6}
        spaceBetween={16}
        modules={[Autoplay]}
        className="mySwiper"
        loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        speed={2500}
        breakpoints={{
          1510: {
            slidesPerView: 6,
          },
          1265: {
            slidesPerView: 5,
          },
          1025: {
            slidesPerView: 4,
          },
          740: {
            slidesPerView: 3,
          },
          525: {
            slidesPerView: 3,
          },
          200: {
            slidesPerView: 2,
          },
        }}
        style={{ width: '100%' }}
      >
        {CollectionsState.topCollections.map((collection, index) => (
          <SwiperSlide className="!bg-transparent" key={index}>
            <Link
              href={`/marketplace/collections/bitcoin/${collection.slug}`}
              className="flex-shrink-0 group cursor-pointer select-none w-full"
            >
              <div className="flex relative flex-col aspect-square justify-between border-none">
                <Image
                  width={228}
                  height={228}
                  fetchPriority="high"
                  src={
                    collection.inscription_icon_id.startsWith('https')
                      ? collection.inscription_icon_id
                      : `https://ordinals.com/content/${collection.inscription_icon_id}`
                  }
                  alt="nft"
                  className="aspect-square absolute inset-0"
                />
                <div className="absolute inset-0 -left-[1px] -right-[1px] group-hover:top-[50%]  bg-gradient-to-b from-[#00000000] z-[5] to-black opacity-100 group-hover:opacity-80 transition-opacity duration-300"></div>
                <span className="absolute font-vt323v4 bottom-0 w-11/12 mb-2 z-[5] truncate transform text-grayNew group-hover:text-whiteNew transition-all duration-300 left-1/2 translate-x-[-50%]">
                  {collection.collection_name}
                </span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

TopCollections.displayName = 'TopCollections';

export default TopCollections;
