import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { MarketplaceNftProps } from '@/utils/types';
import NewHighlightedText from '../NewHighlightedText';
import Link from 'next/link';
import { CurrentUserContext } from '@/context';
import { getBalanceBtc } from '@/services/getBalanceBtc';
import { convertTimestampToDate } from '@/services/datePrettier';
import { buyNft } from '@/services/buyNft';
import Loader from '../Loader';
import axios from 'axios';
import { getTransactionFee } from '@/services/getTransactionFee';
import { IFeeData } from '../Migration/Step4';
import FeeRateButton, { FeeRate } from './FeeRateButton';
import DetailsList from './DetailsList';
import { backBaseUrl } from '@/configs';
import { UserBalanceStatusType } from '../Profile/NftModalsForSale';

const NftDetailsPage = ({ nft }: { nft: MarketplaceNftProps }) => {
  const link = `https://staging.ordeez.io/inscriptions/${nft.inscription_id}`;
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate>(
    FeeRate.MEDIUM
  );
  const [copied, setCopied] = useState<string | null>(null);
  const [userBalanceStatus, setUserBalanceStatus] =
    useState<UserBalanceStatusType>('CONFIRM');
  const [feeData, setFeeData] = useState<IFeeData>({});
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
    getTransactionFee(setFeeData, null, false);
    // if (currentUser.btcWallet) {
    //   getBalanceBtc(setUserBalance, currentUser.btcWallet);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // useEffect(() => {
  //   if (currentUser.btcWallet) {
  //     getBalanceBtc(setUserBalance, currentUser.btcWallet);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentUser.btcWallet]);

  function changeData() {
    nft.pending = true;
  }

  useEffect(() => {
    setUserBalanceStatus('CONFIRM');
  }, [currentUser.btcWallet]);

  function buyNftHandler() {
    const selectedFee =
      selectedFeeRate === 'LOW' ? 1 : selectedFeeRate === 'MEDIUM' ? 2 : 3;
    buyNft(
      nft,
      setisShownTransactionLoader,
      currentUser,
      setCurrentUser,
      selectedFee,
      changeData,
      setUserBalanceStatus
    );
  }

  return (
    <div className="text-white w-full">
      <div className="w-fit max-w-full">
        <NewHighlightedText isMigrated={nft.migrated} isDetails>
          <h1 className="font-pressStart max-w-full text-[2rem] pc820:text-[2.5rem] truncate leading-[4rem] mb-4">
            {nft.inscription_name.toUpperCase()}
          </h1>
        </NewHighlightedText>
      </div>
      <div className="flex max-w-full justify-start items-center">
        <div className="text-grayNew truncate font-vt323v2 mr-4">
          {nft.collection_name.toUpperCase()}
        </div>
        <div className="relative min-w-fit h-fit">
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
      <div className="relative gap-8 pc820:gap-8 flex max-w-full items-center mt-16 flex-wrap pc820:flex-nowrap">
        <div
          className={`w-full flex justify-center items-center pc820:w-fit bg-black`}
        >
          <div className="relative flex justify-center items-center min-w-[20.5rem] max-h-[20.5rem] max-w-[20.5rem] min-h-[20.5rem] pc820:min-h-[auto] w-full overflow-hidden pc820:min-w-[19.25rem] pc820:max-w-[19.25rem] pc820:aspect-square object-cover">
            <Link
              target="_blank"
              href={`https://ordinals.com/content/${nft.inscription_id}`}
              className="group relative text-grayNew hover:text-whiteNew font-vt323v2 w-full min-w-[20.5rem] max-h-[20.5rem] max-w-[20.5rem] min-h-[20.5rem] pc820:min-h-[auto] pc820:min-w-[19.25rem] pc820:max-w-[19.25rem] pc820:aspect-square flex justify-center items-center"
            >
              {nft.mime_type.includes('html') ||
              nft.mime_type.includes('model/gltf+json') ? (
                <iframe
                  title="html-content"
                  sandbox="allow-scripts"
                  src={`https://ordinals.com/preview/${nft.inscription_id}`}
                  width="210"
                  height="218"
                  className="absolute pc820:inset-0 z-1 border-0 min-w-[20.5rem] min-h-[20.5rem] pc820:min-w-full pc820:min-h-full pc820:aspect-square overflow-hidden object-cover"
                />
              ) : (
                <Image
                  width={328}
                  height={328}
                  quality={100}
                  className="min-w-full min-h-full pc820:aspect-square object-cover pixelated"
                  src={`https://ordinals.com/content/${nft.inscription_id}`}
                  alt="nftImg-b"
                  priority
                />
              )}
              {/* <div className="absolute inset-0 bg-gradient-to-b from-[#00000000] z-[5] to-black opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              <span className="absolute bottom-0 mb-4 text-whiteNew opacity-0 z-[5] group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
                VIEW MEDIA
              </span> */}
            </Link>
          </div>
        </div>
        <div className="h-full flex w-full min-w-0 justify-center items-center">
          <div className="w-full pc820:w-full flex justify-center pc1100:w-[90%] min-w-0 h-full">
            <DetailsList
              nft={nft}
              copied={copied}
              handleCopy={handleCopy}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
      {nft.price && nft.wallet !== currentUser.ordinalsWallet && (
        <div className="relative bg-black w-full mt-16">
          <p className="font-vt323v4 flex justify-between text-whiteNew">
            <span>Price:</span>
            <span>
              {(Number(nft.price) / 100000000)
                .toFixed(8)
                .toString()
                .replace(',', '.')
                .replace(/\.?0+$/, '')}{' '}
              BTC
            </span>
          </p>
          <p>
            <span className="font-vt323v4 text-whiteNew">
              Set the fee rate:
            </span>
          </p>
          <div className="flex gap-2 pc390:gap-4 mt-8">
            <FeeRateButton
              selectedFeeRate={selectedFeeRate}
              setSelectedFeeRate={setSelectedFeeRate}
              feeData={feeData}
              feeVariant={FeeRate.LOW}
            />
            <FeeRateButton
              selectedFeeRate={selectedFeeRate}
              setSelectedFeeRate={setSelectedFeeRate}
              feeData={feeData}
              feeVariant={FeeRate.MEDIUM}
            />
            <FeeRateButton
              selectedFeeRate={selectedFeeRate}
              setSelectedFeeRate={setSelectedFeeRate}
              feeData={feeData}
              feeVariant={FeeRate.HIGH}
            />
          </div>
          <button
            disabled={
              (!currentUser.btcWallet
                ? false
                : userBalanceStatus !== 'CONFIRM') || isShownTransactionLoader
            }
            onClick={() => {
              if (nft.pending) {
                return null;
              } else if (!currentUser.btcWallet) {
                setCurrentUser({
                  ...currentUser,
                  isConnectWalletModalVisible: true,
                });
              } else {
                buyNftHandler();
              }
            }}
            className={`${
              nft.pending
                ? 'bg-greenNew cursor-not-allowed'
                : ` ${
                    userBalanceStatus !== 'CONFIRM'
                      ? 'bg-rose'
                      : 'bg-maize hover:bg-whiteNew disabled:hover:bg-maize'
                  } `
            } disabled:cursor-not-allowed   flex justify-center items-center  font-vt323v4 text-black ${
              isShownTransactionLoader ? 'p-3.5' : 'p-4'
            } mt-8 w-full `}
          >
            {nft.pending ? (
              <div className=" flex">
                PENDING
                <div className={`dot-typing`}></div>
              </div>
            ) : isShownTransactionLoader ? (
              <Loader
                inverse
                isSmall={true}
                dataLoaded={!isShownTransactionLoader}
              />
            ) : !currentUser.btcWallet ? (
              'CONNECT WALLET'
            ) : userBalanceStatus === 'CONFIRM' ? (
              'BUY'
            ) : (
              userBalanceStatus
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default NftDetailsPage;
