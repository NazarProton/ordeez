import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/services/datePrettier';
import { NftActivity } from '@/utils/types';
import NewHighlightedText from '../NewHighlightedText';
import Arrow from '../svgComponents/Arrow';
import axios from 'axios';
import Link from 'next/link';

const Activities = ({ activity }: { activity: NftActivity[] }) => {
  const [filtersState, setFiltersState] = useState<
    'TimeAsc' | 'TimeDesc' | 'PriceAsc' | 'PriceDesc'
  >('TimeDesc');
  const [price, setPrice] = useState(0);

  const sortedActivity = [...activity].sort((a, b) => {
    const aInvalid = a.sale_price == null || a.sale_price === -1;
    const bInvalid = b.sale_price == null || b.sale_price === -1;

    if (filtersState === 'PriceAsc' && b.sale_price && a.sale_price) {
      if (aInvalid && bInvalid) return 0;
      if (aInvalid) return 1;
      if (bInvalid) return -1;
      return a.sale_price - b.sale_price;
    } else if (filtersState === 'PriceDesc' && b.sale_price && a.sale_price) {
      if (aInvalid && bInvalid) return 0;
      if (aInvalid) return 1;
      if (bInvalid) return -1;
      return b.sale_price - a.sale_price;
    } else if (filtersState === 'TimeAsc') {
      return new Date(a.ts).getTime() - new Date(b.ts).getTime();
    } else if (filtersState === 'TimeDesc') {
      return new Date(b.ts).getTime() - new Date(a.ts).getTime();
    }
    return 0;
  });

  useEffect(() => {
    axios('https://mempool.space/api/v1/prices').then((res) => {
      setPrice(res.data.USD / 1e8);
    });
  }, []);

  return (

    <div className="text-grayNew pt-16 w-full overscroll-x-none">
      <NewHighlightedText>
        <h2 className="font-pressStart px-4 pc820:px-8 text-[32px] pc820:text-[40px] leading-[64px]">
          ACTIVITIES
        </h2>
      </NewHighlightedText>
      <div className="w-full h-fit overflow-scroll default-scrollbar-main">
        <div className="relative pb-8 min-w-[1024px] max-w-[1510px] overscroll-x-none">
          <div className="flex gap-4 select-none mb-8 border-b border-onyxNew text-grayNew font-vt323v4 py-8 mx-4 pc820:mx-8">
            <span className="w-3/12">ACTION</span>
            <div
              onClick={() =>
                setFiltersState((prev) =>
                  prev === 'PriceDesc' ? 'PriceAsc' : 'PriceDesc'
                )
              }
              className="flex justify-end gap-2 w-2/12 cursor-pointer flex-nowrap hover:text-whiteNew"
            >
              PRICE
              <div className="flex flex-col h-fit py-1.5 gap-1 justify-center items-center">
                <Arrow active={filtersState === 'PriceAsc'} />
                <div className="rotate-180">
                  <Arrow active={filtersState === 'PriceDesc'} />
                </div>
              </div>
            </div>
            <span className="w-2/12 text-end">FROM</span>
            <span className="text-end w-2/12">TO</span>
            <div
              onClick={() =>
                setFiltersState((prev) =>
                  prev === 'TimeAsc' ? 'TimeDesc' : 'TimeAsc'
                )
              }
              className="flex justify-end gap-2 w-3/12 flex-nowrap cursor-pointer hover:text-whiteNew"
            >
              DATE
              <div className="flex flex-col h-fit py-1.5 gap-1 justify-center items-center">
                <Arrow active={filtersState === 'TimeAsc'} />
                <div className="rotate-180">
                  <Arrow active={filtersState === 'TimeDesc'} />
                </div>
              </div>
            </div>
          </div>
          {sortedActivity.map((activity, index) => {
            let activityName:
              | 'Creation'
              | 'Transfer'
              | 'Sale'
              | 'Unlisting'
              | 'Listing' = 'Listing';
            if (
              !activity.from_wallet &&
              activity.to_wallet &&
              !activity.sale_price
            ) {
              activityName = 'Creation';
            } else if (
              activity.from_wallet &&
              activity.to_wallet &&
              (!activity.sale_price || activity.sale_price === -1) &&
              activity.from_wallet !== activity.to_wallet
            ) {
              activityName = 'Transfer';
            } else if (activity.sale_price && activity.sale_price > 0) {
              activityName = 'Sale';
            } else if (activity.from_wallet === activity.to_wallet) {
              activityName = 'Unlisting';
            }
            return (
              <Link
                key={index}
                href={`https://mempool.space/tx/${activity.tx_id}`}
                target="_blank"
              >
                <div className="flex w-full gap-4 py-4 px-4 pc820:px-8 text-whiteNew hover:bg-whiteNew hover:bg-opacity-10 font-vt323v4">
                  <div className="flex w-3/12 h-[56px] items-center gap-2">
                    <Image
                      src={`/${
                        activityName === 'Transfer'
                          ? 'arrowRight.svg'
                          : activityName === 'Sale'
                          ? 'reciept.svg'
                          : activityName === 'Creation'
                          ? 'bullsEye.svg'
                          : activityName === 'Unlisting'
                          ? 'file-minus.svg'
                          : 'file-plus.svg'
                      }`}
                      width={24}
                      height={24}
                      alt={'image'}
                    />
                    <span>{activityName}</span>
                  </div>
                  <div className="flex justify-end h-[56px] truncate w-2/12">
                    {activity.sale_price && activity.sale_price > 0 ? (
                      <div>
                        <span className="flex justify-end gap-1 -mr-[2px] flex-nowrap">
                          {(Number(activity.sale_price) / 100000000)
                            .toFixed(8)
                            .replace(/\.?0+$/, '')}{' '}
                          <Image
                            width={24}
                            height={24}
                            src="/bitcoin.svg"
                            alt="bitcoinImage"
                          />
                        </span>
                        <p className="flex justify-end text-onyxNew">
                          ${Math.round(price * activity.sale_price * 100) / 100}
                        </p>
                      </div>
                    ) : (
                      <div className="min-w-fit text-whiteNew h-full flex justify-center items-center">
                        —
                      </div>
                    )}
                  </div>
                  <div className="flex items-center h-[56px] justify-end text-whiteNew truncate w-2/12">
                    {activity.from_wallet ? (
                      `${activity.from_wallet.slice(
                        0,
                        4
                      )}...${activity.from_wallet.slice(-4)}`
                    ) : (
                      <div className="min-w-fit text-whiteNew h-full flex justify-center items-center">
                        —
                      </div>
                    )}
                  </div>
                  <div className="flex items-center h-[56px] justify-end text-whiteNew truncate w-2/12">
                    {activity.to_wallet ? (
                      `${activity.to_wallet.slice(
                        0,
                        4
                      )}...${activity.to_wallet.slice(-4)}`
                    ) : (
                      <div className="min-w-fit text-whiteNew h-full flex justify-center items-center">
                        —
                      </div>
                    )}
                  </div>
                  <div className="flex items-center h-[56px] justify-end truncate w-3/12">
                    {formatDate(activity.ts)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Activities;
