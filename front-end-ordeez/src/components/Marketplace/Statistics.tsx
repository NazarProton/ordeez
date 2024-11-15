import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { backBaseUrl } from '@/configs';
import { CollectionsContext, FiltersContext } from '@/context';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Додайте цей імпорт

import { Autoplay } from 'swiper/modules';
import { Swiper as SwiperInstance } from 'swiper/types';
import { formatNumber } from '@/services/formatNumber';

const Statistics = () => {
  const { CollectionsState } = useContext(CollectionsContext);
  const { filtersState } = useContext(FiltersContext);

  const [Statistic, setStatistic] = useState<number[] | null>(null);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (
      CollectionsState.total &&
      CollectionsState.volume.total &&
      CollectionsState.volume.holders
    ) {
      setStatistic([
        CollectionsState.total,
        CollectionsState.volume.listings,
        CollectionsState.volume.total,
        CollectionsState.volume.holders,
      ]);
    }
  }, [CollectionsState]);

  useEffect(() => {
    axios('https://mempool.space/api/v1/prices').then((res) => {
      setPrice(res.data.USD / 1e8);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="hidden pc820:flex gap-4 mb-8 min-h-[50px] w-full">
        {Statistic &&
          Statistic.map((value, index) => (
            <div key={index} className=" w-full md:w-1/2 lg:w-1/4">
              <div className="flex flex-col justify-between rounded-lg h-full">
                <p className="font-vt323v4 flex items-center text-whiteNew">
                  {index === 2
                    ? filtersState.priorityPriceView === 'BTC'
                      ? formatNumber(value)
                      : `$${formatNumber(
                          Math.round(price * 1e8 * value * 100) / 100
                        )}`
                    : formatNumber(value)}
                  {filtersState.priorityPriceView === 'BTC' && index === 2 && (
                    <Image
                      width={24}
                      height={24}
                      className="max-w-6 max-h-6"
                      src="/bitcoin.svg"
                      alt="bitcoinImage"
                    />
                  )}
                </p>
                <p className="font-normal font-vt323v4 text-grayNew">
                  {index === 0
                    ? 'total collections'
                    : index === 1
                    ? 'total listings'
                    : index === 2
                    ? 'total volume'
                    : 'total holders'}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className="pc820:hidden flex gap-4 mb-8 min-h-[50px] w-full">
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <Swiper
            slidesPerView={6}
            spaceBetween={16}
            modules={[Autoplay]}
            className="mySwiper"
            loop
            autoplay={{
              delay: 2500,
              disableOnInteraction: true,
            }}
            speed={2500}
            breakpoints={{
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
            {Statistic &&
              Statistic.map((value, index) => (
                <SwiperSlide className="!bg-transparent" key={index}>
                  <div key={index} className="w-full">
                    <div className="flex flex-col justify-between rounded-lg h-full">
                      <p className="font-vt323v4 flex text-whiteNew items-center">
                        {index === 2
                          ? filtersState.priorityPriceView === 'BTC'
                            ? formatNumber(value)
                            : `$${formatNumber(
                                Math.round(price * 1e8 * value * 100) / 100
                              )}`
                          : formatNumber(value)}
                        {filtersState.priorityPriceView === 'BTC' &&
                          index === 2 && (
                            <Image
                              width={24}
                              height={24}
                              className="max-w-6 max-h-6"
                              src="/bitcoin.svg"
                              alt="bitcoinImage"
                            />
                          )}
                      </p>
                      <p className="font-normal text-left font-vt323v4 text-grayNew">
                        {index === 0
                          ? 'total collections'
                          : index === 1
                          ? 'total listings'
                          : index === 2
                          ? 'total volume'
                          : 'total holders'}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Statistics;
