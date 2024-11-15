import Image from 'next/image';
import Switch from '../Switch';
import filter from '../../../public/filter.svg';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { isMobile } from 'react-device-detect';
import CheckBoxItem from './CheckBoxItem';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import Arrow from '../svgComponents/Arrow';
import { AvailableChains, FiltersContext, ListSortVariant } from '@/context';
import { DateFilters } from '@/utils/types';
import SwitchDouble from '../SwitchDouble';

interface TabItem {
  id: number;
  label: string;
  visible: boolean;
  disabled?: boolean;
  href: string;
}

const FiltersBlock = ({
  activeTab,
  setActiveTab,
  setFiltersVisible,
  filtersVisible,
  setChecked,
  checked,
  isMarketplace,
}: {
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
  setFiltersVisible: Dispatch<SetStateAction<boolean>>;
  filtersVisible: boolean;
  setChecked: Dispatch<SetStateAction<number>>;
  checked: number;
  isMarketplace?: boolean;
}) => {
  const { setFiltersState, filtersState } = useContext(FiltersContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const pathName = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isUSDPriority, setISUSDPriority] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectFilter = (filter: ListSortVariant) => {
    setFiltersState((prevFilters) => {
      const newFilters = prevFilters.listFilters.filter((f) => f !== filter);
      newFilters.unshift(filter);
      return { ...prevFilters, listFilters: newFilters };
    });
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setFiltersState({
      ...filtersState,
      inputSearchListings: '',
      inputSearchCollections: '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  const TimeFilter: DateFilters[] = ['24H', '7D', '30D', '180D'];

  const tabItems: TabItem[] = [
    {
      id: 1,
      label: 'INSCRIPTIONS',
      visible: !isMarketplace,
      href: 'inscriptions',
    },
    {
      id: 2,
      label: 'COLLECTIONS',
      visible: !!isMarketplace,
      href: '/marketplace/collections/bitcoin',
    },
    {
      id: 3,
      label: 'LISTINGS',
      visible: !!isMarketplace,
      href: '/marketplace/listings',
    },
    { id: 4, label: 'ORDERS', visible: !isMarketplace, href: 'orders' },
  ];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^\x00-\x7F]/g, '');
    setFiltersState((prevState) => ({
      ...prevState,
      [pathName?.includes('collections')
        ? 'inputSearchCollections'
        : 'inputSearchListings']: e.target.value,
    }));
  };

  function changeChain(params: AvailableChains) {
    setFiltersState((prevState) => ({ ...prevState, ableChains: params }));
  }

  useEffect(() => {
    setFiltersState((prevState) => ({
      ...prevState,
      priorityPriceView: isUSDPriority ? 'USD' : 'BTC',
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUSDPriority]);

  const changeIsOnlyMigrated = () => {
    setFiltersState((prevState) => ({
      ...prevState,
      isOnlyMigrated: !prevState.isOnlyMigrated,
    }));
  };

  useEffect(() => {
    setFiltersState((prevState) => ({
      ...prevState,
      checked: checked,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <div className="select-none">
      {pathName?.includes('marketplace') && (
        <div className="flex w-full flex-row justify-between pb-8 gap-8">
          {pathName?.includes('listings') && (
            <Switch
              stateValue={filtersState.isOnlyMigrated}
              setStateAction={changeIsOnlyMigrated}
              firsthText="DERIVATIVES ONLY"
              activeColor="rose"
            />
          )}
          {pathName?.includes('collections') && (
            <>
              <div className="flex justify-center items-center font-vt323v4 text-grayNew">
                <Image
                  className="mr-2"
                  width={24}
                  height={24}
                  src={'/info-box.svg'}
                  alt="infobox"
                />
                NETWORK:
                <button
                  className="ml-4 mr-2"
                  onClick={() => changeChain('BTC')}
                >
                  <Image
                    width={24}
                    height={24}
                    src={'/bitcoinImage.svg'}
                    alt="bitcoinImage"
                    className={`${
                      filtersState.ableChains === 'BTC'
                        ? ''
                        : 'grayscale opacity-80 hover:opacity-100'
                    } `}
                  />
                </button>
                <button onClick={() => changeChain('ETH')} className="">
                  <Image
                    width={24}
                    height={24}
                    src={'/ethereum.svg'}
                    alt="ethereum"
                    className={`${
                      filtersState.ableChains === 'ETH'
                        ? ''
                        : 'grayscale opacity-80 hover:opacity-100'
                    } `}
                  />
                </button>
              </div>
              <div className="flex justify-center items-center font-vt323v4 text-whiteNew">
                <SwitchDouble
                  stateValue={isUSDPriority}
                  setStateAction={setISUSDPriority}
                  firsthText="BTC"
                  secondText="USD"
                />
              </div>
            </>
          )}
        </div>
      )}
      <div
        className={`flex flex-col transition-all duration-300 ${
          pathName?.includes('marketplace')
            ? `${
                pathName?.includes('collections') ||
                pathName?.includes('listings')
                  ? 'pc850:flex-row pc850:items-center pc850:justify-between'
                  : 'pc820:flex-row pc820:items-center pc820:justify-between'
              } ${
                filtersVisible
                  ? 'gap-8'
                  : `gap-0 ${
                      pathName?.includes('collections') ||
                      pathName?.includes('listings')
                        ? 'pc850:gap-8'
                        : 'pc820:gap-8'
                    }`
              }`
            : `${
                pathName?.includes('collections') ||
                pathName?.includes('listings')
                  ? 'pc850:flex-row pc850:items-center pc850:justify-between pc850:px-8'
                  : 'pc820:flex-row pc820:items-center pc820:justify-between pc820:px-8'
              }  px-4 pc900:gap-8`
        } w-full`}
      >
        <div className="flex justify-start items-center">
          {tabItems
            .filter((item) => item.visible)
            .map(({ id, label, disabled, href }) => (
              <button
                disabled={disabled}
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  return router.push(`${href}`);
                }}
                className={`${
                  pathName?.includes(href)
                    ? 'text-maize border border-maize bg-black'
                    : 'text-grayNew hover:text-whiteNew border border-transparent'
                } py-2 cursor-pointer font-vt323v4 text-grayNew disabled:text-onyxNew disabled:cursor-not-allowed px-4`}
              >
                {label}
              </button>
            ))}
          {!pathName?.includes('orders') && (
            <div
              className={`flex justify-end items-center ${
                pathName?.includes('collections') ||
                pathName?.includes('listings')
                  ? 'pc850:hidden'
                  : 'pc820:hidden'
              } w-full min-w-fit pc450:min-w-[37px]`}
            >
              <Image
                onClick={() => setFiltersVisible(!filtersVisible)}
                src={filter}
                alt="filter"
                className={`cursor-pointer ${
                  filtersVisible ? 'opacity-100' : 'opacity-80'
                } hover:opacity-100`}
              />
            </div>
          )}
        </div>
        {pathName?.includes('inscriptions') && (
          <div
            className={`filter-container ${
              filtersVisible || pathName?.includes('listings')
                ? 'open'
                : pathName?.includes('collections')
                ? 'hidden'
                : 'closed'
            } ${
              pathName?.includes('listings')
                ? 'flex-col pc450:flex-row gap-4 pc450:items-center'
                : ` ${
                    pathName?.includes('collections')
                      ? 'flex-col pc850:flex-row pc850:items-center gap-4'
                      : 'flex-col pc550:flex-row pc550:items-center gap-0 pc550:gap-4 pc550:justify-between'
                  }`
            } items-start text-grayNew leading-[22.4px] tracking-[.05em] flex `}
          >
            <Switch
              stateValue={filtersState.isOnlyMigrated}
              setStateAction={changeIsOnlyMigrated}
              firsthText="DERIVATIVES ONLY"
              activeColor="rose"
            />
            {!isMarketplace && (
              <div
                className={`flex ${
                  pathName?.includes('collections') ||
                  pathName?.includes('listings')
                    ? 'flex-col pc850:flex-row pc850:items-center'
                    : 'flex-row items-center'
                } select-none mt-8 pc820:mt-0  gap-2 cursor-pointer`}
              >
                <CheckBoxItem
                  id={1}
                  checked={checked}
                  setChecked={setChecked}
                  label="ALL"
                />
                <CheckBoxItem
                  id={2}
                  checked={checked}
                  setChecked={setChecked}
                  label="LISTED"
                />
                <CheckBoxItem
                  id={3}
                  checked={checked}
                  setChecked={setChecked}
                  label="NOT LISTED"
                />
              </div>
            )}
          </div>
        )}
        {pathName?.includes('marketplace') && (
          <div
            className={`${
              pathName?.includes('collections')
                ? 'filter-containerV3'
                : 'filter-containerV2'
            }  overflow-visible w-full ${
              filtersVisible
                ? 'open'
                : `closed -z-50 ${
                    pathName?.includes('collections') ||
                    pathName?.includes('listings')
                      ? 'pc850:z-10'
                      : 'pc820:z-10'
                  }`
            } ${
              pathName?.includes('marketplace')
                ? `flex-col pc550:flex-row  pc450:items-center`
                : `flex-col ${
                    pathName?.includes('collections') ||
                    pathName?.includes('listings')
                      ? 'pc850:flex-row pc850:items-center'
                      : 'pc820:flex-row pc820:items-center'
                  } `
            } justify-center items-start gap-8 text-grayNew leading-[22.4px] tracking-[.05em] flex `}
          >
            {pathName?.includes('marketplace') && (
              <div className="group border gap-2  items-center flex border-onyxNew px-4 min-h-full w-full focus-within:border-whiteNew">
                <Image
                  width={24}
                  height={24}
                  src={'/zoomIn.svg'}
                  className="group-focus-within:opacity-100 opacity-80"
                  alt="zoomImage"
                />
                <input
                  ref={inputRef}
                  className="focus:outline-none font-vt323v4 placeholder:text-grayNew w-full focus:placeholder:text-transparent text-whiteNew py-2 bg-transparent"
                  placeholder={`Search ${
                    pathName.includes('collections')
                      ? 'collections'
                      : 'listings'
                  }...`}
                  onInput={handleInput}
                />
              </div>
            )}
            {pathName?.includes('listings') && (
              <div
                ref={dropdownRef}
                className="group relative min-h-[45px] select-none min-w-full pc550:min-w-[226px] block"
              >
                <div
                  className="w-full whitespace-nowrap  min-h-[45px] justify-end font-vt323v4 px-2 min-w-[226px]  flex items-center cursor-pointer"
                  onClick={toggleDropdown}
                ></div>
                <div
                  onClick={toggleDropdown}
                  className={`absolute left-0 -top-[0px] right-0 w-full  text-white shadow-lg z-10 ${
                    isOpen
                      ? 'h-fit border border-onyxNew bg-black'
                      : 'h-[44px] overflow-hidden border border-transparent'
                  }`}
                >
                  {filtersState.listFilters.map((filter, index) => (
                    <div
                      key={filter}
                      className={`py-2 px-4 cursor-pointer font-vt323v4 whitespace-nowrap text-grayNew hover:text-whiteNew ${
                        index === 0
                          ? `flex items-center justify-between ${
                              isOpen ? 'text-whiteNew' : 'text-grayNew'
                            }`
                          : 'block text-grayNew hover:text-whiteNew '
                      } ${isOpen ? 'hover:bg-grayBorder' : ''}`}
                      onClick={() => index !== 0 && selectFilter(filter)}
                    >
                      {filter}
                      {index === 0 && (
                        <div
                          className={`ml-2 flex opacity-80 group-hover:opacity-100 flex-col transition-transform ${
                            isOpen ? '' : 'rotate-180'
                          } h-fit py-1.5 gap-1 justify-center items-center`}
                        >
                          <Arrow />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {pathName?.includes('collections') && (
              <div className="group min-w-full pc550:min-w-[226px] flex">
                {TimeFilter.map((filter, index) => {
                  return (
                    <div
                      onClick={() =>
                        setFiltersState((prev) => {
                          if (prev.dateFilter === filter) {
                            return prev;
                          }

                          return {
                            ...prev,
                            dateFilter: filter,
                          };
                        })
                      }
                      key={index}
                      className={`w-1/4 flex justify-center items-center cursor-pointer px-4 py-2 font-vt323v4 border ${
                        filtersState.dateFilter === filter
                          ? 'text-maize border-maize bg-black'
                          : 'text-grayNew hover:text-whiteNew border-transparent'
                      }`}
                    >
                      {filter}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltersBlock;
