import { ReactNode, useContext, useEffect, useState } from 'react';
import NewHighlightedText from '../NewHighlightedText';
import Statistics from './Statistics';
import TopCollections from './TopCollections';
import FiltersBlock from '../Profile/FiltersBlock';
import FooterFilters from './FooterFilters';
import { useRouter } from 'next/router';
import { getCollections } from '@/services/getCollections';
import { CollectionsContext, FiltersContext } from '@/context';
import { usePathname } from 'next/navigation';

const MarketplaceWrapper = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const { filtersState, setFiltersState } = useContext(FiltersContext);
  const { CollectionsState, setCollectionsState } =
    useContext(CollectionsContext);

  const [activeTab, setActiveTab] = useState(2);
  const [checked, setChecked] = useState(1);
  const [isOnlyMigrated, setIsOnlyMigrated] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    if (pathName?.includes('listings')) {
      getCollections(
        CollectionsState,
        setCollectionsState,
        filtersState,
        setFiltersState,
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);
  return (
    <main className="flex flex-col scroll-smooth items-center min-h-[calc(100dvh-112px-217px-128px)] mb-32 w-full min-w-[360px] max-w-[1510px]">
      <div className="pc820:min-h-[calc(100dvh-112px)] w-full gap-8 pc820:gap-16 min-h-[calc(100dvh-96px)] flex flex-col justify-between">
        <div className="px-4 flex flex-col w-full items-start pc820:px-8">
          <NewHighlightedText>
            <div className="w-full flex flex-col pc390:flex-row">
              <p className=" font-pressStart text-[32px] pc390:text-center pc820:text-[40px] leading-[64px]">
                MARKET
              </p>
              <div className="pc390:inline-block font-pressStart text-[32px] pc390:text-center pc820:text-[40px] leading-[64px] min-w-[calc(100vw-32px)] pc390:min-w-fit flex justify-end">
                <span className="pc390:hidden inline-block ">-</span>
                PLACE
              </div>
            </div>
          </NewHighlightedText>
        </div>
        <div className={`pb-8 w-full px-4 pc820:px-8`}>
          <Statistics />
          <TopCollections />
          <FiltersBlock
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setFiltersVisible={setFiltersVisible}
            filtersVisible={filtersVisible}
            setChecked={setChecked}
            checked={checked}
            isMarketplace={true}
          />
        </div>
      </div>
      <div className="flex flex-col w-full gap-16 min-h-fit">{children}</div>
      <FooterFilters
        setIsOnlyMigrated={setIsOnlyMigrated}
        isOnlyMigrated={isOnlyMigrated}
      />
    </main>
  );
};

export default MarketplaceWrapper;
