import Loader from '@/components/Loader';
import { IFeeData } from '@/components/Migration/Step4';
import NftListItem from '@/components/Profile/NftListItem';
import { CurrentUserContext, FiltersContext, IFiltesrContext } from '@/context';
import axios from 'axios';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Marketplace from '../marketplace';
import SpeechBubble from '@/components/SpeechBubble';
import { v4 as uuidv4 } from 'uuid';
import { getTransactionFee } from '@/services/getTransactionFee';
import LoaderWithText from '@/components/LoaderWithText';
import { backBaseUrl } from '@/configs';

const Collections = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { filtersState } = useContext(FiltersContext);
  const [isLoading, setIsLoading] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const [feeData, setFeeData] = useState<IFeeData>({});
  const [hasNext, setHasNext] = useState(false);
  const [getNextDataLoader, setGetNextDataLoader] = useState(false);

  const getUserNftsRequest = useCallback(() => {
    setGetNextDataLoader(true);
    axios
      .get(`${backBaseUrl}/api/marketplace/${pageKey}`)
      .then(({ data }) => {
        setPageKey(pageKey + 1);
        setHasNext(data.data.hasNext);

        const newNft = currentUser.marketplaceNfts
          ? [...currentUser.marketplaceNfts, ...data.data.inscriptions]
          : [...data.data.inscriptions];
        setCurrentUser({
          ...currentUser,
          marketplaceNfts: newNft,
          userNfts: null,
        });
        setIsLoading(false);
        setGetNextDataLoader(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setGetNextDataLoader(false);
        console.log(err.message);
      });
  }, [currentUser, pageKey, setCurrentUser]);

  // const filterNfts = (
  //   nfts: MarketplaceNftProps[],
  //   filtersState: IFiltesrContext
  // ) => {
  //   return nfts.filter((el) => {
  //     if (filtersState.isOnlyMigrated) {
  //       return el.migrated === true;
  //     } else {
  //       return true;
  //     }
  //   });
  // };

  // const filteredNfts = currentUser.marketplaceNfts
  //   ? filterNfts(currentUser.marketplaceNfts, filtersState)
  //   : [];

  // useEffect(() => {
  //   if (!currentUser.marketplaceNfts?.length) {
  //     getUserNftsRequest();
  //   } else {
  //     setIsLoading(false);
  //   }
  //   getTransactionFee(setFeeData);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const observer = useRef<IntersectionObserver | null>(null);
  // const lastOrderElementRef = useCallback(
  //   (node: HTMLDivElement) => {
  //     if (isLoading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasNext) {
  //         getUserNftsRequest();
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   [isLoading, hasNext, getUserNftsRequest]
  // );

  return (
    <Marketplace>
      {isLoading ? (
        <LoaderWithText isLoading={isLoading} />
      ) : (
        //  filteredNfts && !filteredNfts.length ? (
        //   <SpeechBubble />
        // ) : (
        <>
          {/* <div
            className={`px-4 pc820:px-8 grid gap-4 grid-cols-1 pc500:grid-cols-2 pc740:grid-cols-3  pc1024:grid-cols-4 pc1265:grid-cols-5 pc1510:grid-cols-6`}
          >
            {filteredNfts &&
              filteredNfts.map((el, index) => (
                <NftListItem
                  ref={
                    index === filteredNfts.length - 1 && hasNext
                      ? lastOrderElementRef
                      : null
                  }
                  key={uuidv4()}
                  el={el}
                  feeData={feeData}
                />
              ))}
          </div> */}
          {getNextDataLoader && (
            <div className="flex flex-col justify-center items-center w-full h-fit">
              <Loader isSmall={true} dataLoaded={!getNextDataLoader} />
            </div>
          )}
        </>
      )}
    </Marketplace>
  );
};

export default Collections;
