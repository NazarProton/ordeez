import { backBaseUrl } from '@/configs';
import { IFiltesrContext, ItemsResponse } from '@/context';
import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';

export const getCollections = (
  CollectionsState: ItemsResponse,
  setCollectionsState: Dispatch<SetStateAction<ItemsResponse>>,
  filtersState: IFiltesrContext,
  setFiltersState: Dispatch<SetStateAction<IFiltesrContext>>,
  isFirstLoad: boolean = false,
  setGetNextDataLoader: Dispatch<SetStateAction<boolean>> | false = false,
  setIsLoading: Dispatch<SetStateAction<boolean>> | false = false
) => {
  if (setGetNextDataLoader) {
    setGetNextDataLoader(true);
  }

  const {
    isOnlyMigrated,
    checked,
    ableChains,
    priorityPriceView,
    listFilters,
    inputSearchCollections,
    dateFilter,
    floorPriceFilter,
    volumeDirection,
  } = filtersState;

  const queryParams = new URLSearchParams({
    page: `${(isFirstLoad ? 0 : CollectionsState.page) + 1}`,
  });

  if (inputSearchCollections)
    queryParams.append('name', inputSearchCollections);
  if (floorPriceFilter) {
    queryParams.append(
      'sort',
      `floor${floorPriceFilter === 'asc' ? '-asc' : ''}`
    );
  } else {
    if (dateFilter)
      queryParams.append(
        'sort',
        `${dateFilter.toLowerCase()}_volume${
          volumeDirection === 'VolumeAsc' ? '-asc' : ''
        }`
      );
  }

  axios
    .get(`${backBaseUrl}/api/collections?${queryParams.toString()}`)
    .then(({ data }) => {
      if (CollectionsState.items.length && !isFirstLoad) {
        setCollectionsState({
          ...data.data,
          items: [...CollectionsState.items, ...data.data.items],
          topCollections: CollectionsState.topCollections,
        });
      } else {
        setCollectionsState({
          ...data.data,
          topCollections:
            !inputSearchCollections &&
            dateFilter === '24H' &&
            volumeDirection === 'VolumeDesc' &&
            CollectionsState.page === 0
              ? data.data.items.slice(0, 11)
              : CollectionsState.topCollections,
        });
      }
      if (setGetNextDataLoader && setIsLoading) {
        setIsLoading(false);
        setGetNextDataLoader(false);
      }
    })
    .catch((err) => {
      if (setGetNextDataLoader && setIsLoading) {
        setGetNextDataLoader(false);
        setIsLoading(false);
      }
      console.log(err.message);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
};
