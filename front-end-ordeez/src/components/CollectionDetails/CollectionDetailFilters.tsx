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
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import Arrow from '../svgComponents/Arrow';
import { AvailableChains, FiltersContext, ListSortVariant } from '@/context';
import { DateFilters } from '@/utils/types';
import SwitchDouble from '../SwitchDouble';
import ListView from '../svgComponents/ListView';
import TableView from '../svgComponents/TableView';

interface TabItem {
  id: number;
  label: string;
  visible: boolean;
  disabled?: boolean;
}

const CollectionDetailFilter = ({
  listedOnly,
  setListedOnly,
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
  listedOnly: boolean;
  setListedOnly: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setFiltersState, filtersState } = useContext(FiltersContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const pathName = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectFilter = (filter: ListSortVariant) => {
    setFiltersState((prevFilters) => {
      const newFilters = prevFilters.listFiltersDetails.filter(
        (f) => f !== filter
      );
      newFilters.unshift(filter);
      return { ...prevFilters, listFiltersDetails: newFilters };
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

  const TimeFilter: DateFilters[] = ['24H', '7D', '30D', '180D'];

  const tabItems: TabItem[] = [
    {
      id: 1,
      label: 'ITEMS',
      visible: true,
    },
    {
      id: 2,
      label: 'ACTIVITY',
      visible: true,
      disabled: true,
    },
  ];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^\x00-\x7F]/g, '');
    setFiltersState((prevState) => ({
      ...prevState,
      inputSearchItems: e.target.value,
    }));
  };

  return (
    <div className="select-none">
      <div className="flex w-full flex-row justify-between pb-8 gap-8">
        <Switch
          stateValue={listedOnly}
          setStateAction={setListedOnly}
          firsthText="LISTED ONLY"
          activeColor={'maize'}
        />
      </div>

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
            .map(({ id, label, disabled }) => (
              <button
                disabled={disabled}
                key={id}
                onClick={() => {
                  setActiveTab(id);
                }}
                className={`${
                  activeTab === id
                    ? 'text-maize border border-maize bg-black'
                    : 'text-grayNew hover:text-whiteNew border border-transparent'
                } py-2 cursor-pointer font-vt323v4 text-grayNew disabled:text-onyxNew disabled:cursor-not-allowed px-4`}
              >
                {label}
              </button>
            ))}
          {listedOnly && (
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
        {listedOnly && (
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
            <div className="group border gap-2  items-center flex border-onyxNew px-4 min-h-full w-full focus-within:border-whiteNew">
              <Image
                width={24}
                height={24}
                src={'/zoomIn.svg'}
                className="group-focus-within:opacity-100 opacity-80"
                alt="zoomImage"
              />
              <input
                className="focus:outline-none font-vt323v4 placeholder:text-grayNew w-full focus:placeholder:text-transparent text-whiteNew py-2 bg-transparent"
                placeholder={`Search items...`}
                onInput={handleInput}
              />
            </div>

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
                {filtersState.listFiltersDetails.map((filter, index) => (
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
          </div>
        )}
        {/* <div className="flex">
          <button className="w-[44px] h-[44px] flex justify-center items-center">
            <ListView active={false} />
          </button>
          <button className="w-[44px] h-[44px] flex justify-center items-center">
            <TableView active={true} />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default CollectionDetailFilter;
