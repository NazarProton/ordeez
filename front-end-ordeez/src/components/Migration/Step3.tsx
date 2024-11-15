import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAccount } from 'wagmi';
import { CurrentUserContext } from '@/context';
import NftListItem from './NftListItem';
import Loader from '../Loader';
import { keccak256 } from 'viem';
import axios from 'axios';
import { backBaseUrl } from '@/configs';
import { Nft } from '@/utils/types';

export interface OwnedNftExtended extends Nft {
  exist?: boolean;
}

const Step3 = ({
  setStep,
  setSelectedNftsToInscribe,
  setSizeOfAllElements,
  setContentTypeSize,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setSelectedNftsToInscribe: Dispatch<SetStateAction<Nft[]>>;
  setSizeOfAllElements: Dispatch<SetStateAction<number>>;
  setContentTypeSize: Dispatch<SetStateAction<number>>;
}) => {
  const { chainId, address } = useAccount();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [pageKey, setPageKey] = useState('');
  const listInnerRef = useRef<HTMLUListElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [userNftsData, setUserNftsData] = useState<OwnedNftExtended[] | null>(
    null
  );
  const [listOfHashesForChoosedNfts, setListOfHashesForChoosedNfts] = useState<
    string[]
  >([]);
  const [listOfNftsForInscription, setListOfNftsForInscription] = useState<
    Nft[]
  >([]);

  function changeCheckedState(nftUniquehash: string, nft: Nft) {
    const isAlreadyIncluded =
      listOfHashesForChoosedNfts.includes(nftUniquehash);
    const isAlreadyIncludedInNftsList = listOfNftsForInscription.some((el) => {
      const elementUniquehash = keccak256(
        new TextEncoder().encode(
          `${el.tokenId}${el.contract.address}${chainId}`
        )
      );
      return elementUniquehash === nftUniquehash;
    });

    let updatedListOfOrdinals;
    if (isAlreadyIncluded) {
      updatedListOfOrdinals = listOfHashesForChoosedNfts.filter(
        (elUniqueAdress) => elUniqueAdress !== nftUniquehash
      );
    } else {
      updatedListOfOrdinals = [...listOfHashesForChoosedNfts, nftUniquehash];
    }

    let updatedListOfOfNfts;
    if (isAlreadyIncludedInNftsList) {
      updatedListOfOfNfts = listOfNftsForInscription.filter((el) => {
        const elementUniquehash = keccak256(
          new TextEncoder().encode(
            `${el.tokenId}${el.contract.address}${chainId}`
          )
        );
        return elementUniquehash !== nftUniquehash;
      });
    } else {
      updatedListOfOfNfts = [...listOfNftsForInscription, nft];
    }

    setListOfHashesForChoosedNfts(updatedListOfOrdinals);
    setListOfNftsForInscription(updatedListOfOfNfts);
  }

  function sendDataToDB() {
    setIsLoader(true);
    const newImagesArray = listOfNftsForInscription.map((el, index) => {
      return el.image.cachedUrl;
    });
    setSelectedNftsToInscribe(listOfNftsForInscription);
    axios
      .post(`${backBaseUrl}/api/nft/estimate`, {
        imageUrls: newImagesArray,
      })
      .then(({ data }) => {
        setSizeOfAllElements(data.data.totalSize);
        setContentTypeSize(data.data.contentTypeSize);
        setTimeout(() => {
          setStep(4);
        }, 1000);
      });
  }

  const getUserNftsRequest = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    axios
      .get(
        `${backBaseUrl}/api/nft/list/${chainId}/${'0xc58dAa91c623af8e28a61deFf5a0C733dbC075FC'}/${
          pageKey ? pageKey : 1
        }`
      )
      .then(({ data }) => {
        setPageKey(data.data.pageKey ? data.data.pageKey : '');
        setUserNftsData(
          userNftsData
            ? [...userNftsData, ...data.data.ownerNfts]
            : [...data.data.ownerNfts]
        );
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setIsLoader(false);
        setIsLoading(false);
      });
  }, [isLoading, chainId, pageKey, userNftsData]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastOrderElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pageKey) {
          getUserNftsRequest();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, pageKey, getUserNftsRequest]
  );

  useEffect(() => {
    getUserNftsRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoader ? (
        <div className="min-w-full">
          <div className="flex flex-col justify-center items-center w-full h-[170px] font-vt323 text-whiteNew text-xl tracking-[0.05em]">
            Loading...
          </div>
          <div className="flex flex-col justify-center items-center w-full h-[137px] text-whiteNew">
            <Loader isSmall={true} dataLoaded={!isLoader} />
          </div>
        </div>
      ) : userNftsData && userNftsData.length ? (
        <>
          <div className="flex justify-center items-center h-[170px] font-vt323 text-xl tracking-[0.05em]">
            <p className="px-8 w-full text-center text-grayNew">
              <span className="text-whiteNew">Select the NFT tokens</span> for
              which you want to create derivatives on the Bitcoin network.
            </p>
          </div>
          <ul
            ref={listInnerRef}
            className="flex flex-col border-onyxNew border-y h-80 text-grayNew overflow-hidden overflow-y-auto changeScroll"
          >
            {userNftsData.map((el, index) => {
              const nftUniquehash = keccak256(
                new TextEncoder().encode(
                  `${el.tokenId}${el.contract.address}${chainId}`
                )
              );
              return (
                <NftListItem
                  ref={
                    index === userNftsData.length - 1 && pageKey
                      ? lastOrderElementRef
                      : null
                  }
                  key={index}
                  el={el}
                  index={index}
                  listOfHashesForChoosedNfts={listOfHashesForChoosedNfts}
                  changeCheckedState={changeCheckedState}
                  isMigrated={!!el.exist}
                  nftUniquehash={nftUniquehash}
                />
              );
            })}
            {isLoading && (
              <li
                key={'loader'}
                className="flex justify-center items-center w-full min-h-16 text-maize"
              >
                <Loader isSmall={true} dataLoaded={!isLoading} />
              </li>
            )}
          </ul>
          <div>
            <button
              disabled={!listOfHashesForChoosedNfts.length}
              onClick={sendDataToDB}
              className="py-[22.5px] w-full font-vt323 text-grayNew text-xl hover:text-whiteNew disabled:hover:text-onyxNew disabled:text-onyxNew tracking-[0.05em]"
            >
              CONFIRM
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center w-full h-[170px] font-vt323 text-whiteNew text-xl tracking-[0.05em]">
            <p className="w-11/12 text-center text-grayNew">
              We have not found any NFT tokens that can be derived.
              <span className="text-whiteNew">
                {' '}
                Try connecting another wallet.
              </span>{' '}
            </p>
          </div>
          <button
            onClick={() => setStep(1)}
            className="py-[22.5px] w-full font-vt323 text-grayNew text-xl hover:text-whiteNew disabled:hover:text-onyxNew disabled:text-onyxNew tracking-[0.05em]"
          >
            CONFIRM
          </button>
        </>
      )}
    </>
  );
};

export default Step3;
