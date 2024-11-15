import Loader from '@/components/Loader';
import { IFeeData } from '@/components/Migration/Step4';
import NftListItem from '@/components/Profile/NftListItem';
import { CurrentUserContext, FiltersContext, IFiltesrContext } from '@/context';
import axios from 'axios';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Profile from '../profile';
import SpeechBubble from '@/components/SpeechBubble';
import { v4 as uuidv4 } from 'uuid';
import { getTransactionFee } from '@/services/getTransactionFee';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import LoaderWithText from '@/components/LoaderWithText';
import { backBaseUrl } from '@/configs';
import { MarketplaceNftProps } from '@/utils/types';

const Inscriptions = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { filtersState } = useContext(FiltersContext);
  const [isLoading, setIsLoading] = useState(true);
  const [pageKey, setPageKey] = useState(0);
  const [feeData, setFeeData] = useState<IFeeData>({});
  const [hasNext, setHasNext] = useState(false);
  const [getNextDataLoader, setGetNextDataLoader] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const getUserNftsRequest = useCallback(() => {
    setGetNextDataLoader(true);
    axios
      .get(
        `${backBaseUrl}/api/inscriptions/${currentUser.ordinalsWallet}/${pageKey}`
      )
      .then(({ data }) => {
        setPageKey(pageKey + 1);
        setHasNext(data.data.hasNext);
        const newNft =
          currentUser.userNfts && pageKey
            ? [...currentUser.userNfts, ...data.data.inscriptions]
            : [...data.data.inscriptions];
        setCurrentUser({
          ...currentUser,
          userNfts: newNft,
          marketplaceNfts: null,
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

  useEffect(() => {
    if (currentUser.btcWallet) {
      getUserNftsRequest();
      getTransactionFee(setFeeData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // if (!currentUser.btcWallet) {
    //   router.push('/');
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.btcWallet]);

  const filterNfts = (
    nfts: MarketplaceNftProps[],
    filtersState: IFiltesrContext
  ) => {
    return nfts.filter((el) => {
      if (filtersState.isOnlyMigrated && !el.migrated) {
        return false;
      }
      console.log(filtersState.checked);
      switch (filtersState.checked) {
        case 1:
          return true;
        case 2:
          return Boolean(el.price);
        case 3:
          return !el.price;
        default:
          return true;
      }
    });
  };

  const filteredNfts =
    currentUser.userNfts && filterNfts(currentUser.userNfts, filtersState);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastOrderElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          getUserNftsRequest();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNext, getUserNftsRequest]
  );

  return (
    <Profile>
      {isLoading ? (
        <div className="h-[calc(100vh-96px-173px-64px)] pc820:h-[calc(100vh-112px-173px-64px)]">
          <LoaderWithText isLoading={isLoading} />
        </div>
      ) : filteredNfts && !filteredNfts.length ? (
        <div className="h-[calc(100vh-96px-173px-64px)] pc820:h-[calc(100vh-112px-173px-64px)]">
          <SpeechBubble />
        </div>
      ) : (
        <>
          <div
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
          </div>
          {getNextDataLoader && (
            <div className="flex flex-col justify-center items-center w-full h-fit">
              <Loader isSmall={true} dataLoaded={!getNextDataLoader} />
            </div>
          )}
        </>
      )}
    </Profile>
  );
};

export default Inscriptions;
