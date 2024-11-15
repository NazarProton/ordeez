import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import Image from 'next/image';
import { MarketplaceNftProps } from '@/utils/types';
import NewHighlightedText from '../NewHighlightedText';
import Link from 'next/link';
import { CollectionInfo, CurrentUserContext } from '@/context';
import { getBalanceBtc } from '@/services/getBalanceBtc';
import { convertTimestampToDate } from '@/services/datePrettier';
import { buyNft } from '@/services/buyNft';
import Loader from '../Loader';
import axios from 'axios';
import { getTransactionFee } from '@/services/getTransactionFee';
import { IFeeData } from '../Migration/Step4';
// import DetailsList from './DetailsList';
import { backBaseUrl } from '@/configs';
import { UserBalanceStatusType } from '../Profile/NftModalsForSale';
import FeeRateButton, { FeeRate } from '../Details/FeeRateButton';
import DetailsList from '../Details/DetailsList';
import CollectionDetailFilter from './CollectionDetailFilters';
import { getFloorPrice } from '@/services/getFloorPrice';
import { formatNumber } from '@/services/formatNumber';

const CollectionDetailsPage = ({
  listedOnly,
  setListedOnly,
  collection,
  activeTab,
  setActiveTab,
}: {
  listedOnly: boolean;
  setListedOnly: Dispatch<SetStateAction<boolean>>;
  collection: CollectionInfo;
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
}) => {
  const link = `https://staging.ordeez.io/inscriptions/42c096bc722def4ead2af4488a039bef6dbca13df737ff0ff257fadea0493a94i0`;
  const [price, setPrice] = useState(0);

  const [copied, setCopied] = useState<string | null>(null);
  const [isShownTransactionLoader, setisShownTransactionLoader] =
    useState(false);

  const handleCopy = (e: React.MouseEvent, value: string | number | null) => {
    e.preventDefault();
    if (value) {
      navigator.clipboard.writeText(value.toString());
      setCopied(value.toString());
      setTimeout(() => setCopied(null), 2000);
    }
  };

  useEffect(() => {
    axios('https://mempool.space/api/v1/prices').then((res) => {
      setPrice(res.data.USD / 1e8);
    });
  }, []);

  const minFloorPrice = getFloorPrice(collection.collection_info);
  let floorPriceInUsd;
  if (minFloorPrice) {
    floorPriceInUsd = formatNumber(
      Math.round(price * minFloorPrice * 100) / 100
    );
  }
  let totalVolumeInUsd = formatNumber(
    Math.round(price * collection.sale_info.all_volume * 1e8 * 100) / 100
  );

  return (
    <div className="text-white w-full">
      <div className="w-fit max-w-full">
        <NewHighlightedText isDetails>
          <h1 className="font-pressStart max-w-full text-[2rem] pc820:text-[2.5rem] truncate leading-[4rem] mb-4">
            {collection.collection_info.collection_name.toUpperCase()}
          </h1>
        </NewHighlightedText>
      </div>
      <div className="flex max-w-full gap-4 justify-start items-center">
        {collection.collection_info.discord_link && (
          <Link
            target="_blank"
            href={collection.collection_info.discord_link}
            className="text-grayNew hover:text-whiteNew truncate font-vt323v2"
          >
            {'>> Discord'}
          </Link>
        )}
        {collection.collection_info.twitter_link && (
          <Link
            target="_blank"
            href={collection.collection_info.twitter_link}
            className="text-grayNew hover:text-whiteNew truncate font-vt323v2"
          >
            {'>> Twitter'}
          </Link>
        )}
        <div className="relative flex min-w-fit h-fit">
          <div
            onClick={(e) => handleCopy(e, link)}
            className="text-whiteNew cursor-pointer opacity-80 hover:opacity-100 flex gap-2 font-vt323v2"
          >
            <Image
              width={24}
              height={24}
              src="/timeline.svg"
              alt={'timeline'}
            />
            Share
          </div>
          {copied === link && (
            <span className="absolute -top-6 left-0 right-0 bg-maize text-black font-vt323v3 px-4">
              COPIED
            </span>
          )}
        </div>
      </div>
      <div className="relative gap-8 mb-16 pc820:gap-8 flex max-w-full items-center mt-16 flex-wrap pc820:flex-nowrap">
        <div
          className={`w-full flex justify-center items-center pc820:w-fit bg-transparent`}
        >
          <div className="relative flex justify-center items-center min-w-[20.5rem] max-h-[20.5rem] max-w-[20.5rem] min-h-[20.5rem] pc820:min-h-[auto] w-full overflow-hidden pc820:min-w-[19.25rem] pc820:max-w-[19.25rem] pc820:aspect-square object-cover">
            <div className="group relative text-grayNew hover:text-whiteNew font-vt323v2 w-full min-w-[20.5rem] max-h-[20.5rem] max-w-[20.5rem] min-h-[20.5rem] pc820:min-h-[auto] pc820:min-w-[19.25rem] pc820:max-w-[19.25rem] pc820:aspect-square flex justify-center items-center">
              <Image
                src={
                  collection.collection_info.inscription_icon_id.startsWith(
                    'https'
                  )
                    ? collection.collection_info.inscription_icon_id
                    : `https://ordinals.com/content/${collection.collection_info.inscription_icon_id}`
                }
                width={328}
                height={328}
                quality={100}
                alt={'image'}
                className="object-cover max-w-[328px] max-h-[328px] overflow-hidden size-full pixelated"
              />
            </div>
          </div>
        </div>
        <div className="w-full flex gap-8 justify-center items-center flex-col">
          <div className="w-full pc450:w-3/4 font-vt323v4 text-onyxNew">
            <p className="text-whiteNew text-center pc820:text-left w-full">{`“`}</p>
            <p className="text-center pc820:text-left">
              {collection.collection_info.description}
            </p>
          </div>
          <div className="grid w-full pc450:w-3/4 grid-cols-3 gap-4 text-center">
            {[
              { value: `$${floorPriceInUsd}`, label: 'floor price' },
              { value: `$${totalVolumeInUsd}`, label: 'total volume' },
              {
                value: formatNumber(collection.sale_info.total_sales),
                label: 'total sales',
              },
              {
                value: formatNumber(collection.collection_info.listed_cnt_all),
                label: 'listed',
              },
              {
                value: formatNumber(collection.collection_info.holder_count),
                label: 'holders',
              },
              {
                value: collection.collection_info.supply,
                label: 'total supply',
              },
            ].map((item, index) => (
              <div key={index}>
                <p className="font-vt323v4 text-center pc820:text-left text-whiteNew">
                  {item.value}
                </p>
                <p className="font-vt323v3 text-center pc820:text-left text-onyxNew">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CollectionDetailFilter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        listedOnly={listedOnly}
        setListedOnly={setListedOnly}
      />
    </div>
  );
};

export default CollectionDetailsPage;
