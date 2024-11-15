import Image from 'next/image';
import Link from 'next/link';
import React, { forwardRef, SetStateAction, useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import NftModalsForSale from './NftModalsForSale';
import { IFeeData } from '../Migration/Step4';
import { MarketplaceNftProps } from '@/utils/types';
import { CurrentUserContext } from '@/context';
import ConnectBtcWalletModal from '../NavBar/ConnectBtcWalletModal';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

interface NftListItemProps {
  el: MarketplaceNftProps;
  feeData: IFeeData;
}

const NftListItem = forwardRef<HTMLDivElement, NftListItemProps>(
  ({ el, feeData }, ref) => {
    const pathName = usePathname();
    const router = useRouter();

    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [isImageLoaded, setIsImageLoaded] = useState(true);
    const [isListed, setIsListed] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState<null | number>(null);

    const handleModalVisibility = (
      modalId: number | null,
      event?: React.MouseEvent
    ) => {
      if (event) event.stopPropagation();
      setIsModalVisible(isModalVisible === modalId ? null : modalId);
    };

    function deleteOnFail(inscription_id: string) {
      const rigthFieldName = pathName?.includes('marketplace')
        ? 'marketplaceNfts'
        : 'userNfts';
      const newNftArray = currentUser[rigthFieldName]?.filter(
        (element) => el.inscription_id !== element.inscription_id
      );
      if (newNftArray) {
        setCurrentUser({
          ...currentUser,
          [rigthFieldName]: newNftArray,
        });
      }
    }

    const UserWalletCheck = el.owner_wallet_addr
      ? el.owner_wallet_addr
      : el.wallet
      ? el.wallet
      : null;

    return (
      <>
        <div
          onClick={() => router.push(`${'/inscriptions/'}${el.inscription_id}`)}
          ref={ref}
          className={`group ${
            isImageLoaded ? 'flex' : 'hidden'
          } relative pc500:min-w-[228px] pc500:min-h-[334px] hover:border-grayNew h-fit w-full bg-black border ${
            el.migrated ? 'border-rose' : 'border-onyxNew '
          }  pc500:flex-col p-4 gap-4 cursor-pointer`}
        >
          <div
            className={`-right-[1px] group-hover:border-grayNew -bottom-[1px] z-[2] absolute ${
              el.migrated ? 'border-rose' : 'border-onyxNew'
            } bg-black border-t border-l w-2 h-1`}
          ></div>
          <div
            className={`-right-[1px] group-hover:border-grayNew  -bottom-[1px] z-[2] absolute ${
              el.migrated ? 'border-rose' : 'border-onyxNew'
            } bg-black border-t border-l w-1 h-2`}
          ></div>
          <div className="right-[2px] -bottom-[1px] z-[2] absolute bg-black border-t border-black border-l w-0.5 h-[3px]"></div>
          <div className="relative bg-black min-w-4/12 pc500:w-full overflow-hidden min-w-32 max-h-[128px] pc500:max-h-none aspect-square object-cover">
            <Image
              width={250}
              height={184}
              quality={100}
              className="min-w-[128px] pc500:min-w-full aspect-square object-cover pixelated"
              src={
                el.mime_type.includes('html') ||
                el.mime_type.includes('model/gltf+json')
                  ? el.render_url
                  : `https://ordinals.com/content/${el.inscription_id}`
              }
              alt="nftImage"
              priority
              onError={() => {
                deleteOnFail(el.inscription_id);
              }}
            />
          </div>
          <div className="flex flex-col justify-between w-full pc500:w-auto pc500:h-1/3 min-h-32 overflow-hidden">
            <div className="flex flex-col justify-start">
              <span className="font-vt323 text-[16px] text-ellipsis text-grayNew text-nowrap truncate leading-[140%] tracking-[0.05em]">
                {el.collection_name ? el.collection_name : 'Collection Name'}
              </span>
              <span
                className={`font-vt323 tracking-[0.05em] text-ellipsis truncate text-nowrap ${
                  el.migrated ? 'text-rose' : 'text-whiteNew'
                } leading-[140%] text-[20px]`}
              >
                {el.inscription_name ? el.inscription_name : 'Inscription Name'}
              </span>
            </div>
            <div className="flex flex-col h-fit">
              {(pathName?.includes('inscriptions')
                ? !!el.price && !el.pending
                : UserWalletCheck &&
                  UserWalletCheck === currentUser.ordinalsWallet &&
                  !el.pending) && (
                <span
                  onClick={(e) => {
                    handleModalVisibility(2, e);
                  }}
                  className="group/item h-fit gap-1 flex justify-end text-grayNew hover:text-whiteNew cursor-pointer left-0 bottom-[80%] z-[4] w-full text-right font-vt323 leading-[22.4px] tracking-[.05em]"
                >
                  <span className="group-hover/item:block group-hover:block hidden">
                    {'>'}
                  </span>
                  <span>CHANGE PRICE</span>
                </span>
              )}
              <div className="flex justify-between">
                <span
                  onClick={() => setIsListed(!isListed)}
                  className={`text-nowrap font-vt323 text-grayNew leading-[22.4px] tracking-[.05em] ${
                    el.price ? 'text-whiteNew' : 'text-onyxNew'
                  }`}
                >
                  {el.price
                    ? `${(Number(el.price) / 100000000)
                        .toFixed(8)
                        .replace(/\.?0+$/, '')} BTC`
                    : 'NOT LISTED'}
                </span>
                {el.pending && el.price ? (
                  <div className="text-greenNew flex font-vt323 leading-[22.4px] tracking-[.05em]">
                    PENDING
                    <div className={`dot-typing w-[21.5px]`}></div>
                  </div>
                ) : (
                    pathName?.includes('inscriptions')
                      ? false
                      : UserWalletCheck &&
                        UserWalletCheck !== currentUser.ordinalsWallet &&
                        el.price
                  ) ? (
                  <span
                    onClick={(e) =>
                      currentUser.ordinalsWallet && currentUser.btcWallet
                        ? handleModalVisibility(3, e)
                        : setCurrentUser(() => {
                            if (e) e.stopPropagation();
                            return {
                              ...currentUser,
                              isConnectWalletModalVisible: true,
                            };
                          })
                    }
                    className="group/item flex gap-1 z-[5] text-grayNew hover:text-whiteNew cursor-pointer font-vt323 leading-[22.4px] tracking-[.05em]"
                  >
                    <span className="group-hover/item:block group-hover:block hidden">
                      {'>'}
                    </span>
                    <span>BUY</span>
                  </span>
                ) : (
                  UserWalletCheck &&
                  UserWalletCheck === currentUser.ordinalsWallet && (
                    <span
                      onClick={(e) => {
                        el.price
                          ? handleModalVisibility(4, e)
                          : handleModalVisibility(1, e);
                      }}
                      className="group/item z-[5] flex gap-1 text-grayNew hover:text-whiteNew cursor-pointer font-vt323 leading-[22.4px] tracking-[.05em]"
                    >
                      <span className="group-hover/item:block group-hover:block hidden">
                        {'>'}
                      </span>
                      {el.price ? 'UNLIST' : 'LIST'}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {[1, 2, 3, 4].map((modalId) => {
          return (
            <NftModalsForSale
              key={modalId}
              isModalVisible={isModalVisible === modalId}
              setIsModalVisible={(visible) =>
                handleModalVisibility(visible ? modalId : null)
              }
              el={el}
              modalVariant={modalId}
              feeData={feeData}
            />
          );
        })}
      </>
    );
  }
);

NftListItem.displayName = 'NftListItem';

export default React.memo(NftListItem);
