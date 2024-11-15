import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import closeButton from '../../../public/close.svg';
import FileIcon from '../../../public/file-flash.svg';
import FilePlus from '../../../public/file-plus.svg';
import FileMinus from '../../../public/file-minus.svg';
import shoppingBag from '../../../public/shopping-bag.svg';
import Image from 'next/image';
import { IFeeData } from '../Migration/Step4';
import axios from 'axios';
import { CurrentUserContext } from '@/context';
import { BitcoinNetworkType, signTransaction } from 'sats-connect';
import Loader from '../Loader';
import { MarketplaceNftProps } from '@/utils/types';
import { usePathname } from 'next/navigation';
import { backBaseUrl } from '@/configs';
import { getBalanceBtc } from '@/services/getBalanceBtc';
import { buyNft } from '@/services/buyNft';
import { Transaction } from 'bitcoinjs-lib/src/transaction';

interface iModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  el: MarketplaceNftProps;
  modalVariant: number;
  feeData: IFeeData;
}

export type UserBalanceStatusType =
  | 'CONFIRM'
  | 'INSUFFICIENT FUNDS'
  | 'SERVER ERROR';

const NftModalsForSale = ({
  isModalVisible,
  setIsModalVisible,
  el,
  modalVariant,
  feeData,
}: iModalProps) => {
  let isMainnet = process.env.IS_MAINNET === 'true';
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [choosedPriceVariant, setChoosedPriceVariant] = useState(0);
  const [isShownTransactionLoader, setisShownTransactionLoader] =
    useState(false);
  const [error, setError] = useState(false);
  const [inputedValue, setInputedValue] = useState<number | string>(
    el.price
      ? (Number(el.price) / 100000000)
          .toFixed(8)
          .toString()
          .replace(',', '.')
          .replace(/\.?0+$/, '')
      : ''
  );
  const [userBalanceStatus, setUserBalanceStatus] =
    useState<UserBalanceStatusType>('CONFIRM');
  const inputRef = useRef<HTMLInputElement>(null);
  const pathName = usePathname();
  const isMarketplace = pathName?.includes('listing');
  const rigthFieldName = isMarketplace ? 'marketplaceNfts' : 'userNfts';
  const serviceFee = 0.05;

  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalVisible]);

  function validateInput(value: any) {
    const regex =
      /^(?:(?:0\.(?!0+$)\d{1,8}|[1-9]\d{0,3}(?:\.\d{1,8})?|10000(?:\.0{1,8})?))$/;
    return regex.test(value);
  }
  function CloseModal() {
    setIsModalVisible(false);
    setError(false);
    setChoosedPriceVariant(0);
    setisShownTransactionLoader(false);
    setUserBalanceStatus('CONFIRM');
  }

  function putUpForSaleNft(isListing: boolean = false) {
    try {
      setisShownTransactionLoader(true);
      axios
        .post(
          `${backBaseUrl}/api/marketplace/${
            isListing ? 'list-for-sale' : 'update-listing'
          }`,
          {
            id: el.inscription_id,
            price: Math.round(Number(inputedValue) * 100000000),
            sellerPaymentAddress: currentUser.btcWallet,
            sellerOrdinalPublicKey: currentUser.publicKey,
          }
        )
        .then(({ data }) => {
          const sellerInput = {
            address: currentUser.ordinalsWallet,
            signingIndexes: [0],
            sigHash:
              Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
          };
          const payload = {
            network: {
              type: isMainnet
                ? BitcoinNetworkType.Mainnet
                : BitcoinNetworkType.Testnet,
            },
            message: 'Sign Seller Transaction',
            psbtBase64: data.data.psbtBase64,
            broadcast: false,
            inputsToSign: [sellerInput],
          };

          try {
            signTransaction({
              payload,
              onFinish: (response) => {
                try {
                  axios.post(
                    `${backBaseUrl}/api/marketplace/${
                      isListing ? 'save-listing' : 'confirm-update-listing'
                    }`,
                    {
                      id: el.inscription_id,
                      psbtBase64: response.psbtBase64,
                      listingPrice: Math.round(
                        Number(inputedValue) * 100000000
                      ),
                    }
                  );
                  const nftsArray = pathName?.includes('listing')
                    ? currentUser.marketplaceNfts
                    : currentUser.userNfts;

                  const newNftArray = nftsArray?.map((element) => ({
                    ...el,
                    price:
                      el.inscription_number === element.inscription_number
                        ? (Number(inputedValue) * 100000000).toString()
                        : el.price,
                  }));
                  if (newNftArray) {
                    const rigthFieldName = isMarketplace
                      ? 'marketplaceNfts'
                      : 'userNfts';
                    setCurrentUser({
                      ...currentUser,
                      [rigthFieldName]: newNftArray,
                    });
                  }
                  CloseModal();
                } catch (error) {
                  axios.post(
                    `${backBaseUrl}/api/marketplace/revert-pending-status`,
                    {
                      id: el.inscription_id,
                    }
                  );
                  console.log(error);
                }
              },
              onCancel: () => {
                setisShownTransactionLoader(false);
                axios.post(
                  `${backBaseUrl}/api/marketplace/revert-pending-status`,
                  {
                    id: el.inscription_id,
                  }
                );
              },
            });
          } catch (error) {
            setisShownTransactionLoader(false);
            axios.post(`${backBaseUrl}/api/marketplace/revert-pending-status`, {
              id: el.inscription_id,
            });
            console.log(error);
          }
        });
    } catch (error) {
      console.log(error);
      axios.post(`${backBaseUrl}/api/marketplace/revert-pending-status`, {
        id: el.inscription_id,
      });
      CloseModal();
    }
  }

  function changeData(isBuying: boolean) {
    if (pathName?.includes('listing')) {
      const filteredData: any = currentUser.marketplaceNfts
        ?.map((element) => {
          if (el.inscription_id !== element.inscription_id) {
            return el;
          } else {
            if (isBuying) {
              return {
                ...el,
                pending: true,
              };
            }
          }
        })
        .filter((element) => element !== undefined);
      return filteredData;
    } else {
      const changedData: any = currentUser.userNfts
        ? currentUser.userNfts.map((element) => {
            if (element.inscription_id !== el.inscription_id) {
              return el;
            } else {
              return {
                ...el,
                price: null,
              };
            }
          })
        : [];

      return changedData;
    }
  }

  function unlist() {
    try {
      setisShownTransactionLoader(true);
      axios
        .post(`${backBaseUrl}/api/marketplace/delete-listing`, {
          id: el.inscription_id,
          sellerOrdinalAddress: currentUser.ordinalsWallet,
          sellerOrdinalPublicKey: currentUser.publicKey,
        })
        .then(({ data }) => {
          const inputs = [
            {
              address: currentUser.ordinalsWallet,
              signingIndexes: [0],
              sigHash:
                Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY,
            },
          ];

          // Create the payload for signing the seller transaction
          const payload = {
            network: {
              type: isMainnet
                ? BitcoinNetworkType.Mainnet
                : BitcoinNetworkType.Testnet,
            },
            message: 'Sign Transfer Transaction',
            psbtBase64: data.data.psbtBase64,
            broadcast: false,
            inputsToSign: inputs,
          };
          try {
            signTransaction({
              payload,
              onFinish: async (response: any) => {
                axios
                  .post(
                    `${backBaseUrl}/api/marketplace/confirm-delete-listing`,
                    {
                      id: el.inscription_id,
                      psbtBase64: response.psbtBase64,
                    }
                  )
                  .then(() => {
                    const newNftArray = changeData(false);
                    if (newNftArray) {
                      setCurrentUser({
                        ...currentUser,
                        [rigthFieldName]: newNftArray,
                      });
                    }
                  });
                CloseModal();
              },
              onCancel: () => {
                setisShownTransactionLoader(false);
                console.log('Transaction canceled');
              },
            });
          } catch (error) {
            setisShownTransactionLoader(false);
            console.error(error);
          }
        });
    } catch (error) {
      console.log(error);
      CloseModal();
    }
  }

  function buyNftHandler() {
    buyNft(
      el,
      setisShownTransactionLoader,
      currentUser,
      setCurrentUser,
      choosedPriceVariant,
      changeData,
      setUserBalanceStatus,
      rigthFieldName,
      CloseModal
    );
  }

  // useEffect(() => {
  //   if (modalVariant === 3 && isModalVisible) {
  //     getBalanceBtc(setuserBalanceStatus, currentUser.btcWallet);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isModalVisible]);

  return (
    <div
      // onClick={CloseModal}
      id="default-modal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        isModalVisible ? 'flex' : 'hidden'
      } overflow-y-scroll overflow-x-hidden fixed min-h-fit top-0 right-0 left-0 bottom-0 z-50 backdrop-blur-lg justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full`}
    >
      <div className="h-fit">
        <div
          onClick={(event) => {
            event?.stopPropagation();
          }}
          className="relative bg-black w-[360px] h-fit"
        >
          <div className="relative border-onyxNew bg-dark border h-fit overflow-hidden">
            {/* <FuzzyOverlay zindex={50} /> */}
            <div className="relative flex justify-between items-center border-onyxNew p-4 border-b">
              <div className="flex justify-between items-center gap-2 w-full">
                <Image
                  src={
                    modalVariant === 1
                      ? FilePlus
                      : modalVariant === 2
                      ? FileIcon
                      : modalVariant === 3
                      ? shoppingBag
                      : FileMinus
                  }
                  alt="FileIcon"
                />
                <h3 className="font-vt323 text-whiteNew text-xl leading-[22.4px] tracking-[.05em]">
                  {modalVariant === 1
                    ? 'LIST'
                    : modalVariant === 2
                    ? 'CHANGE PRICE'
                    : modalVariant === 3
                    ? 'BUY'
                    : 'UNLIST'}
                </h3>
                <button
                  onClick={CloseModal}
                  type="button"
                  className="justify-center items-center bg-transparent opacity-80 hover:opacity-100 rounded-lg w-fit h-6 text-sm"
                  data-modal-hide="default-modal"
                >
                  <Image
                    className="w-[14px] h-[14px]"
                    src={closeButton}
                    alt="CloseButton"
                  />
                </button>
              </div>
            </div>
            <div className="flex flex-col max-h-[55dvh] overflow-x-hidden overflow-y-scroll changeScrollModal">
              <div
                data-modal-hide="default-modal"
                className={`mx-4 ${
                  modalVariant === 4 ? 'mb-8' : 'mb-4'
                }  mt-8 flex gap-4 items-center  text-whiteNew`}
              >
                <div className="relative min-h-16 min-w-16 aspect-square">
                  <Image
                    width={64}
                    height={64}
                    className="min-w-16 min-h-16 max-h-16 object-cover"
                    src={
                      el.mime_type.includes('html') ||
                      el.mime_type.includes('model/gltf+json')
                        ? el.render_url
                        : `https://ordinals.com/content/${el.inscription_id}`
                    }
                    alt="itemImage "
                  />
                </div>
                <div className="flex flex-col justify-start w-9/12">
                  <span className="font-vt323 text-ellipsis text-[16px] text-grayNew text-nowrap truncate leading-[22.4px] tracking-[.05em]">
                    {' '}
                    {el.collection_name
                      ? el.collection_name
                      : 'Collection Name'}
                  </span>
                  <span
                    className={`text-ellipsis truncate text-[20px] text-nowrap ${
                      el.migrated ? 'text-rose' : 'text-whiteNew'
                    } font-vt323  leading-[22.4px] tracking-[.05em]`}
                  >
                    {el.inscription_name
                      ? el.inscription_name
                      : 'Inscription Name'}
                  </span>
                </div>
              </div>
              {(modalVariant === 1 || modalVariant === 2) && (
                <>
                  <span className="p-4 pb-0 font-vt323 text-nowrap text-whiteNew leading-[22.4px] tracking-[.05em]">
                    Set the price:
                  </span>
                  <div className="relative flex mb-4 h-fit">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputedValue}
                      onChange={(e) => {
                        e.preventDefault();
                        const { value } = e.target;
                        const validate = validateInput(value);
                        const regex = /^[0-9]*\.?[0-9]*$/;
                        if (regex.test(value)) {
                          setError(
                            Number(value) < 0.00000001 ? true : !validate
                          );
                          setInputedValue(value);
                        }
                      }}
                      className={` ml-4 rounded-none mr-4 w-[328px] h-16 font-vt323  leading-[22.4px] tracking-[.05em] bg-transparent border-b ${
                        false
                          ? 'border-rose opacity-80 focus:opacity-100'
                          : 'border-onyxNew focus:border-grayNew'
                      } text-whiteNew text-left focus:outline-none`}
                    />
                    <span className="top-[22px] right-4 absolute font-vt323 text-whiteNew leading-[22.4px] tracking-[.05em]">
                      BTC
                    </span>
                  </div>
                </>
              )}
              {modalVariant === 3 && (
                <>
                  <span className="p-4 pb-0 font-vt323 text-nowrap text-whiteNew leading-[22.4px] tracking-[.05em]">
                    Set the fee rate:
                  </span>
                  <div className="flex gap-2 mx-4 py-2">
                    <div
                      onClick={() => setChoosedPriceVariant(1)}
                      className={`w-[104px] h-[88px] border p-2 flex flex-col justify-center cursor-pointer ${
                        choosedPriceVariant === 1
                          ? 'border-maize text-maize'
                          : 'border-onyxNew hover:border-whiteNew text-grayNew hover:text-whiteNew'
                      }`}
                    >
                      <span className="h-1/3 font-vt323 text-center leading-[22.4px] tracking-[.05em]">
                        LOW
                      </span>
                      <span className="h-1/3 font-vt323 text-center leading-[22.4px] tracking-[.05em]">
                        {' '}
                        {feeData.hourFee ? Math.floor(feeData.hourFee) : ''}
                      </span>
                      <span className="h-1/3 font-vt323 text-center leading-[22.4px] tracking-[.05em]">
                        sats/vByte
                      </span>
                    </div>
                    <div
                      onClick={() => setChoosedPriceVariant(2)}
                      className={`w-[104px] h-[88px] border p-2 flex flex-col cursor-pointer ${
                        choosedPriceVariant === 2
                          ? 'border-maize text-maize'
                          : ' border-onyxNew hover:border-whiteNew text-grayNew hover:text-whiteNew'
                      }`}
                    >
                      <span className="font-vt323 text-center leading-[22.4px] tracking-[.05em]">
                        MEDIUM
                      </span>
                      <span className="font-vt323 text-center leading-[22.4px] tracking-[.05em]">
                        {' '}
                        {feeData.halfHourFee
                          ? Math.floor(feeData.halfHourFee)
                          : ''}
                      </span>
                      <span className="font-vt323 text-center leading-[22.4px] tracking-[.05em]">
                        sats/vByte
                      </span>
                    </div>
                    <div
                      onClick={() => setChoosedPriceVariant(3)}
                      className={`w-[104px] h-[88px] border p-2 flex flex-col cursor-pointer ${
                        choosedPriceVariant === 3
                          ? 'border-maize text-maize'
                          : ' border-onyxNew hover:border-whiteNew text-grayNew hover:text-whiteNew'
                      }`}
                    >
                      <span className="font-vt323 text-center leading-[22.4px] tracking-[.05em]">
                        HIGH
                      </span>
                      <span className="font-vt323 text-center leading-[22.4px] tracking-[.05em]">
                        {feeData.fastestFee
                          ? Math.floor(feeData.fastestFee)
                          : ''}
                      </span>
                      <span className="font-vt323 text-center leading-[22.4px] tracking-[.05em]">
                        sats/vByte
                      </span>
                    </div>
                  </div>
                </>
              )}
              {modalVariant !== 4 && (
                <>
                  {modalVariant !== 3 && (
                    <>
                      <span className="mt-8 px-4 font-vt323 text-nowrap text-whiteNew leading-[22.4px] tracking-[.05em]">
                        Service fee:
                      </span>
                      <div className="flex justify-between px-4 font-vt323 text-whiteNew leading-[22.4px] tracking-[.05em]">
                        <span>
                          {error || (!el.price && !inputedValue)
                            ? 0
                            : (
                                Number(
                                  inputedValue
                                    ? inputedValue
                                    : Number(el.price) / 100000000
                                ) * serviceFee
                              )
                                .toFixed(8)
                                .replace(/\.?0+$/, '')}
                        </span>
                        <span>BTC</span>
                      </div>
                    </>
                  )}
                  <span className="mt-4 px-4 font-vt323 text-nowrap text-whiteNew leading-[22.4px] tracking-[.05em]">
                    {modalVariant === 3 ? 'You will pay:' : 'You will receive:'}
                  </span>
                  <div className="flex justify-between mb-8 px-4 font-vt323 text-whiteNew leading-[22.4px] tracking-[.05em]">
                    <span>
                      {modalVariant === 3
                        ? (Number(el.price) / 100000000)
                            .toFixed(8)
                            .replace(/\.?0+$/, '')
                        : error || (!el.price && !inputedValue)
                        ? 0
                        : (
                            Number(
                              inputedValue
                                ? inputedValue
                                : Number(el.price) / 100000000
                            ) -
                            Number(
                              inputedValue
                                ? inputedValue
                                : Number(el.price) / 100000000
                            ) *
                              serviceFee
                          )
                            .toFixed(8)
                            .replace(/\.?0+$/, '')}
                    </span>
                    <span>BTC</span>
                  </div>
                </>
              )}
            </div>
            {isShownTransactionLoader ||
            (!userBalanceStatus && modalVariant === 3) ? (
              <div className="flex flex-col justify-center items-center w-full h-[60.89px] font-vt323 text-whiteNew leading-[22.4px] tracking-[.05em]">
                <Loader
                  isSmall={true}
                  dataLoaded={
                    modalVariant === 3
                      ? userBalanceStatus
                        ? !isShownTransactionLoader
                        : !!userBalanceStatus
                      : !isShownTransactionLoader
                  }
                />
              </div>
            ) : (
              <>
                <button
                  disabled={
                    modalVariant === 3 && userBalanceStatus
                      ? choosedPriceVariant === 0 ||
                        userBalanceStatus !== 'CONFIRM'
                      : modalVariant === 4
                      ? error
                      : inputedValue === '' ||
                        Number(el.price) ===
                          Math.round(Number(inputedValue) * 100000000) ||
                        error
                  }
                  onClick={() =>
                    modalVariant === 1
                      ? putUpForSaleNft(!el.price)
                      : modalVariant === 2
                      ? putUpForSaleNft()
                      : modalVariant === 4
                      ? unlist()
                      : buyNftHandler()
                  }
                  className={`w-full font-vt323v2  leading-[22.4px] tracking-[.05em] text-center 
                  text-grayNew hover:text-whiteNew border-t border-onyxNew ${
                    error ||
                    userBalanceStatus === 'INSUFFICIENT FUNDS' ||
                    userBalanceStatus === 'SERVER ERROR'
                      ? 'disabled:text-rose'
                      : 'disabled:text-onyxNew'
                  } disabled:cursor-not-allowed py-4`}
                >
                  {error ? 'INCORRECT PRICE' : userBalanceStatus}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftModalsForSale;
