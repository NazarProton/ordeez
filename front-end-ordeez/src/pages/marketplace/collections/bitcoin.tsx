import Loader from '@/components/Loader';
import { CollectionsContext, FiltersContext, Item } from '@/context';
import axios from 'axios';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Marketplace from '../../marketplace';
import SpeechBubble from '@/components/SpeechBubble';
import LoaderWithText from '@/components/LoaderWithText';
import Link from 'next/link';
import Image from 'next/image';
import Arrow from '@/components/svgComponents/Arrow';
import { getCollections } from '@/services/getCollections';
import { formatNumber } from '@/services/formatNumber';
import { getFloorPrice } from '@/services/getFloorPrice';

const BitcoinCollections = () => {
  const { CollectionsState, setCollectionsState } =
    useContext(CollectionsContext);
  const { filtersState, setFiltersState } = useContext(FiltersContext);
  const [isLoading, setIsLoading] = useState(false);
  const [getNextDataLoader, setGetNextDataLoader] = useState(false);
  const [tableFiltersState, setTableFiltersState] = useState<
    'VolumeAsc' | 'VolumeDesc' | 'FloorPriceAsc' | 'FloorPriceDesc'
  >('VolumeDesc');
  const [price, setPrice] = useState(0);
  const filtersStateRef = useRef(filtersState);

  // Ensure the ref always has the latest filtersState
  useEffect(() => {
    filtersStateRef.current = filtersState;
  }, [filtersState]);

  // Use the latest state from the ref when making API calls
  const getCollectionsInfinity = useCallback(
    (isFirstLoad: boolean) => {
      console.log(filtersStateRef.current);
      getCollections(
        CollectionsState,
        setCollectionsState,
        filtersStateRef.current,
        setFiltersState,
        isFirstLoad,
        setGetNextDataLoader,
        setIsLoading
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [CollectionsState, setFiltersState]
  );

  useEffect(() => {
    getCollectionsInfinity(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersState]);

  useEffect(() => {
    axios('https://mempool.space/api/v1/prices').then((res) => {
      setPrice(res.data.USD / 1e8);
    });
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastOrderElementRef = useCallback(
    (node: HTMLAnchorElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          CollectionsState.last_page >= CollectionsState.page
        ) {
          getCollectionsInfinity(false);
        }
      });
      if (node) observer.current.observe(node);
    },
    [
      isLoading,
      CollectionsState.last_page,
      CollectionsState.page,
      getCollectionsInfinity,
    ]
  );

  useEffect(() => {
    if (
      tableFiltersState !== 'FloorPriceAsc' &&
      tableFiltersState !== 'FloorPriceDesc'
    ) {
      setFiltersState((prev) => ({
        ...prev,
        volumeDirection: tableFiltersState,
        floorPriceFilter: null,
      }));
    } else {
      setFiltersState((prev) => ({
        ...prev,
        floorPriceFilter:
          tableFiltersState === 'FloorPriceAsc'
            ? 'asc'
            : tableFiltersState === 'FloorPriceDesc'
            ? 'desc'
            : null,
      }));
    }
  }, [tableFiltersState, setFiltersState]);

  return (
    <Marketplace>
      {isLoading ? (
        <div className="h-[calc(100vh-96px-173px-64px)] pc820:h-[calc(100vh-112px-173px-64px)]">
          <LoaderWithText isLoading={isLoading} />
        </div>
      ) : !CollectionsState.items.length ? (
        <div className="h-[calc(100vh-96px-173px-64px)] pc820:h-[calc(100vh-112px-173px-64px)]">
          <SpeechBubble />
        </div>
      ) : (
        <>
          <div className={`w-full h-fit`}>
            <div className="w-full h-fit overflow-scroll default-scrollbar-main">
              <div className="relative min-w-[1024px] max-w-[1510px] overscroll-x-none">
                <div className="flex gap-4 select-none mb-8 border-b border-onyxNew text-grayNew font-vt323v4 pb-8 mx-4 pc820:mx-8">
                  <span className="w-4/12">NAME</span>
                  <div
                    onClick={() =>
                      setTableFiltersState((prev) =>
                        prev === 'FloorPriceDesc'
                          ? 'FloorPriceAsc'
                          : 'FloorPriceDesc'
                      )
                    }
                    className="flex justify-end gap-2 w-2/12 cursor-pointer flex-nowrap hover:text-whiteNew"
                  >
                    FLOOR PRICE
                    <div className="flex flex-col h-fit py-1.5 gap-1 justify-center items-center">
                      <Arrow active={tableFiltersState === 'FloorPriceAsc'} />
                      <div className="rotate-180">
                        <Arrow
                          active={tableFiltersState === 'FloorPriceDesc'}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      setTableFiltersState((prev) =>
                        prev === 'VolumeDesc' ? 'VolumeAsc' : 'VolumeDesc'
                      )
                    }
                    className="flex justify-end gap-2 w-2/12 cursor-pointer flex-nowrap hover:text-whiteNew"
                  >
                    VOLUME
                    <div className="flex flex-col h-fit py-1.5 gap-1 justify-center items-center">
                      <Arrow active={tableFiltersState === 'VolumeAsc'} />
                      <div className="rotate-180">
                        <Arrow active={tableFiltersState === 'VolumeDesc'} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 w-2/12 flex-nowrap">
                    LISTED
                  </div>
                  <div className="flex justify-end gap-2 w-2/12 flex-nowrap  ">
                    HOLDERS
                  </div>
                </div>
                <div className="max-h-[60dvh] overflow-scroll min-w-[1024px] max-w-[1510px] h-fit default-scrollbar-main">
                  {CollectionsState.items.map((collection, index) => {
                    const minFloorPrice = getFloorPrice(collection);
                    const priceChange =
                      collection.price_change[
                        filtersState.dateFilter === '24H'
                          ? 'd1'
                          : filtersState.dateFilter === '7D'
                          ? 'd7'
                          : filtersState.dateFilter === '30D'
                          ? 'd30'
                          : 'd180'
                      ];
                    const volume =
                      collection.volume[
                        filtersState.dateFilter === '24H'
                          ? 'vol_1d_in_btc'
                          : filtersState.dateFilter === '7D'
                          ? 'vol_7d_in_btc'
                          : filtersState.dateFilter === '30D'
                          ? 'vol_30d_in_btc'
                          : 'vol_total_in_btc'
                      ];

                    const floorPriceInBtc = (Number(minFloorPrice) / 100000000)
                      .toFixed(8)
                      .replace(/\.?0+$/, '');
                    let floorPriceInUsd;
                    if (minFloorPrice) {
                      floorPriceInUsd = formatNumber(
                        Math.round(price * minFloorPrice * 100) / 100
                      );
                    }

                    const volumeInBtc = Number(volume)
                      .toFixed(8)
                      .replace(/\.?0+$/, '');
                    let VolumeInUsd;
                    if (volume) {
                      VolumeInUsd = formatNumber(
                        Math.round(price * 1e8 * volume * 100) / 100
                      );
                    }
                    return (
                      <Link
                        ref={
                          index === CollectionsState.items.length - 1 &&
                          CollectionsState.items.length > 20
                            ? lastOrderElementRef
                            : null
                        }
                        key={index}
                        href={`bitcoin/${collection.slug}`}
                      >
                        <div className="flex w-full gap-4 py-4 px-4 pc820:px-8 text-whiteNew hover:bg-whiteNew hover:bg-opacity-10 font-vt323v4">
                          <div className="flex w-4/12 h-[64px] items-center gap-4 object-cover">
                            <Image
                              src={
                                collection.inscription_icon_id.startsWith(
                                  'https'
                                )
                                  ? collection.inscription_icon_id
                                  : `https://ordinals.com/content/${collection.inscription_icon_id}`
                              }
                              width={64}
                              height={64}
                              alt={'image'}
                              className="object-cover max-w-16 max-h-16 overflow-hidden size-full pixelated"
                            />
                            <span>{collection.collection_name}</span>
                          </div>
                          <div className="flex justify-end items-center h-[64px] truncate w-2/12">
                            {minFloorPrice && minFloorPrice > 0 ? (
                              <div>
                                <span className="flex justify-end gap-1 -mr-[2px] flex-nowrap">
                                  {filtersState.priorityPriceView === 'BTC'
                                    ? floorPriceInBtc
                                    : `$${floorPriceInUsd}`}{' '}
                                  {filtersState.priorityPriceView === 'BTC' && (
                                    <Image
                                      width={24}
                                      height={24}
                                      src="/bitcoin.svg"
                                      alt="bitcoinImage"
                                    />
                                  )}
                                </span>
                                <p className="flex justify-end text-onyxNew">
                                  <span
                                    className={` ${
                                      priceChange && priceChange > 0
                                        ? 'text-greenNew'
                                        : priceChange && priceChange < 0
                                        ? 'text-rose'
                                        : 'text-onyxNew'
                                    }`}
                                  >{`(${
                                    priceChange && priceChange !== 0
                                      ? priceChange && priceChange > 0
                                        ? `+${priceChange.toFixed(2)}`
                                        : priceChange.toFixed(2)
                                      : '0.00'
                                  }%)`}</span>
                                </p>
                              </div>
                            ) : (
                              <div className="min-w-fit text-whiteNew h-full flex justify-center items-center">
                                —
                              </div>
                            )}
                          </div>
                          <div className="flex items-center h-[64px] justify-end text-whiteNew truncate w-2/12">
                            {volume ? (
                              <div>
                                <span className="flex justify-end gap-1 -mr-[2px] flex-nowrap">
                                  {filtersState.priorityPriceView === 'BTC'
                                    ? volumeInBtc
                                    : `$${VolumeInUsd}`}{' '}
                                  {filtersState.priorityPriceView === 'BTC' && (
                                    <Image
                                      width={24}
                                      height={24}
                                      src="/bitcoin.svg"
                                      alt="bitcoinImage"
                                    />
                                  )}
                                </span>
                              </div>
                            ) : (
                              <div className="min-w-fit text-whiteNew h-full flex justify-center items-center">
                                —
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 h-[64px] justify-end text-whiteNew truncate w-2/12">
                            {collection.listed_cnt_all}
                            <span className="text-onyxNew">/</span>
                            <span className="text-onyxNew">
                              {collection.supply}
                            </span>
                          </div>
                          <div className="flex gap-1 items-center h-[64px] justify-end truncate w-2/12">
                            {collection.owners}
                            <span className="text-onyxNew">{`(${
                              Math.round(
                                (collection.owners /
                                  Number(collection.supply)) *
                                  100 *
                                  100
                              ) / 100
                            }%)`}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  {getNextDataLoader && (
                    <div className="flex flex-col justify-center py-4 items-center w-full h-fit">
                      <Loader isSmall={true} dataLoaded={!getNextDataLoader} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Marketplace>
  );
};

export default BitcoinCollections;
