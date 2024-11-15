import Image from 'next/image';
import { forwardRef, useState } from 'react';
import flag from '../../../public/flag.svg';
import { Nft } from '@/utils/types';

interface INftListItemsProps {
  el: Nft;
  index: number;
  listOfHashesForChoosedNfts: string[];
  changeCheckedState: (nftUniquehash: string, el: Nft) => void;
  isMigrated: boolean;
  nftUniquehash: string;
}

const NftListItem = forwardRef<HTMLLIElement, INftListItemsProps>(
  (
    {
      el,
      index,
      listOfHashesForChoosedNfts,
      changeCheckedState,
      isMigrated,
      nftUniquehash,
    },
    ref
  ) => {
    const [isImageLoaded, setIsImageLoaded] = useState(true);
    function getCollectionName() {
      return el.contract.openSeaMetadata.collectionName
        ? el.contract.openSeaMetadata.collectionName
        : el.collection?.name
        ? el.collection?.name
        : el.contract?.name;
    }
    function getTokenName() {
      return el.name
        ? el.name
        : el.raw.metadata.name
        ? el.raw.metadata.name
        : `${el.contract?.symbol} #${el.tokenId}`;
    }
    const tokenName = getTokenName();
    const collectionName = getCollectionName();

    return (
      <li
        ref={ref}
        className={`${isImageLoaded ? 'block' : 'hidden'} min-w-full h-16 `}
        key={index}
      >
        <button
          disabled={
            (listOfHashesForChoosedNfts.length === 10 &&
              !listOfHashesForChoosedNfts.includes(nftUniquehash)) ||
            isMigrated
          }
          onClick={() => changeCheckedState(nftUniquehash, el)}
          className={`group flex h-16 py-2 gap-1 px-8 font-vt323 text-xl tracking-[0.05em] min-w-full cursor-pointer 
                 hover:bg-whiteNew hover:bg-opacity-10 disabled:text-onyxNew disabled:cursor-default
                  ${
                    listOfHashesForChoosedNfts.includes(nftUniquehash)
                      ? 'hover:text-maize text-maize'
                      : 'hover:text-whiteNew'
                  }`}
        >
          <div className="flex items-center gap-4 w-10/12">
            <div className="min-w-12 min-h-12">
              {el.image.contentType?.includes('svg') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  width="100"
                  height="100"
                  loading="lazy"
                  className="w-12 h-12"
                  src={el.image.cachedUrl ? el.image.cachedUrl : ''}
                  alt="nftImage"
                  onError={() => setIsImageLoaded(false)}
                />
              ) : (
                <Image
                  width={100}
                  height={100}
                  loading="lazy"
                  className="w-12 h-12"
                  src={el.image.cachedUrl ? el.image.cachedUrl : ''}
                  alt="nftImage"
                  onError={() => setIsImageLoaded(false)}
                />
              )}
            </div>
            <div className="flex gap-5 w-full">
              <span
                title={collectionName}
                className="flex-1 min-w-1/2 max-w-[235px] text-ellipsis text-start truncate"
              >
                {collectionName}
              </span>
              <span
                title={`${tokenName} ${
                  tokenName === collectionName ? `#${el.tokenId}` : ''
                }`}
                className="flex-1 min-w-1/2 max-w-[235px] text-ellipsis text-start truncate"
              >
                {tokenName}{' '}
                {tokenName === collectionName ? `#${el.tokenId}` : ''}
              </span>
            </div>
          </div>
          <div className="flex justify-end items-center py-2 w-2/12 h-full">
            {isMigrated ? (
              <div className="bottom-2 flex justify-end items-center gap-4">
                {/* <span className="text-onyxNew">migrated</span> */}
                <Image
                  className="max-w-[18px] h-[18px]"
                  src={flag}
                  alt="flag"
                />
              </div>
            ) : (
              <input
                disabled={
                  listOfHashesForChoosedNfts.length === 10 &&
                  !listOfHashesForChoosedNfts.includes(nftUniquehash)
                }
                readOnly
                checked={listOfHashesForChoosedNfts.includes(nftUniquehash)}
                className={`appearance-none cursor-pointer color-whiteNew w-[18px] h-[18px]  group-hover:bg-transparent group-hover:border-whiteNew group-hover:checked:border-maize  border-2 border-grayNew checked:border-maize chekedCheckbox disabled:border-onyxNew disabled:cursor-not-allowed disabled:group-hover:border-onyxNew`}
                type="checkbox"
              />
            )}
          </div>
        </button>
      </li>
    );
  }
);
NftListItem.displayName = 'NftListItemMigrate';

export default NftListItem;
