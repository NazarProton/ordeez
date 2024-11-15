import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import LoaderWithText from '../LoaderWithText';
import Activities from '../Details/Activities';
import CollectionDetailsPage from './CollectionDetailsPage';
import NftListItem from '../Profile/NftListItem';
import { v4 as uuidv4 } from 'uuid';
import { IFeeData } from '../Migration/Step4';
import { getTransactionFee } from '@/services/getTransactionFee';
import { MarketplaceNftProps, NftActivity } from '@/utils/types';
import { CollectionInfo, FiltersContext, ListSortVariant } from '@/context';
import { backBaseUrl } from '@/configs';
import Loader from '../Loader';
import SpeechBubble from '../SpeechBubble';

const CollectionPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { filtersState, setFiltersState } = useContext(FiltersContext);
  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo | null>(
    null
  );
  const [collectionItems, setCollectionItems] = useState<
    MarketplaceNftProps[] | null
  >(null);
  const [activity, setActivity] = useState<NftActivity[] | null>(null);
  const [feeData, setFeeData] = useState<IFeeData>({});
  const [activeTab, setActiveTab] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [listedOnly, setListedOnly] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const listedOnlyRef = useRef(listedOnly);

  useEffect(() => {
    listedOnlyRef.current = listedOnly;
  }, [listedOnly]);

  const fetchCollectionDetails = async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backBaseUrl}/api/collection/${slug}`);
      const nftData = data.data;
      setCollectionInfo(nftData ? nftData : null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      setIsLoading(false);
    }
  };

  const fetchItems = async (isFirstLoad = false) => {
    if (isLoading) return; // блокувати додаткові запити, якщо завантаження триває
    const sortFilter =
      filtersState.listFiltersDetails[0] === ListSortVariant.RECENTLY_LISTED
        ? 'recent'
        : filtersState.listFiltersDetails[0] ===
          ListSortVariant.PRICE_HIGH_TO_LOW
        ? 'highPrice'
        : 'lowPrice';
    if (!slug) return;

    const rightLink = !listedOnlyRef.current
      ? `${backBaseUrl}/api/collection/items?slug=${slug}&page=${
          isFirstLoad ? 1 : page
        }`
      : `${backBaseUrl}/api/collection/listed-items?page=${
          isFirstLoad ? 1 : page
        }${
          filtersState.listFiltersDetails[0] !==
          ListSortVariant.PRICE_LOW_TO_HIGH
            ? `&sort=${sortFilter}`
            : ''
        }&slug=${slug}${
          filtersState.inputSearchItems
            ? `&search=${filtersState.inputSearchItems}`
            : ''
        }`;

    try {
      setIsLoading(true);
      const { data } = await axios.get(rightLink);
      setPage((prev) => (isFirstLoad ? 2 : prev + 1));
      const itemsData = data.data;
      setCollectionItems((prevItems) =>
        prevItems
          ? !isFirstLoad
            ? [...prevItems, ...itemsData]
            : itemsData
          : itemsData
      );
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(true);

    // setFiltersState((prev) => ({ ...prev, inputSearchItems: '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, filtersState, listedOnly]);

  useEffect(() => {
    setFiltersState((prev) => ({ ...prev, inputSearchItems: '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listedOnly]);

  useEffect(() => {
    fetchCollectionDetails();
    getTransactionFee(setFeeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastOrderElementRef = (node: HTMLDivElement) => {
    if (router.isFallback) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchItems(false);
      }
    });
    if (node) observer.current.observe(node);
  };

  if (router.isFallback || !collectionItems || !collectionInfo) {
    return <LoaderWithText isBig isLoading />;
  }

  return (
    <div className="w-full h-fit gap-8 flex flex-col justify-center min-h-[calc(100dvh-112px-217px-128px)] mb-32 max-w-[1510px]">
      <div className="px-4 pc820:px-8">
        {collectionInfo && (
          <CollectionDetailsPage
            collection={collectionInfo}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            listedOnly={listedOnly}
            setListedOnly={setListedOnly}
          />
        )}
      </div>

      {activity && activeTab === 2 && (
        <div>
          <Activities activity={activity} />
        </div>
      )}

      {isLoading ? (
        <div className="h-[calc(100vh-96px-173px-64px)] pc820:h-[calc(100vh-112px-173px-64px)]">
          <LoaderWithText isLoading={isLoading} />
        </div>
      ) : collectionItems && !collectionItems.length ? (
        <div className="h-[calc(100vh-96px-173px-64px)] pc820:h-[calc(100vh-112px-173px-64px)]">
          <SpeechBubble />
        </div>
      ) : (
        activeTab === 1 && (
          <>
            <div className="px-4 pc820:px-8 mt-8 grid gap-4 grid-cols-1 pc500:grid-cols-2 pc740:grid-cols-3 pc1024:grid-cols-4 pc1265:grid-cols-5 pc1510:grid-cols-6">
              {collectionItems &&
                collectionItems.map((el, index) => (
                  <NftListItem
                    ref={
                      index === collectionItems.length - 1 &&
                      collectionItems.length % 25 === 0
                        ? lastOrderElementRef
                        : null
                    }
                    key={uuidv4()}
                    el={el}
                    feeData={feeData}
                  />
                ))}
            </div>
            {isLoading && (
              <div className="flex flex-col justify-center mt-8 items-center w-full h-fit">
                <Loader isSmall={true} dataLoaded={!isLoading} />
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default CollectionPage;
