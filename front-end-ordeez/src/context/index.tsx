'use client';

import React, { ReactNode, createContext, useState } from 'react';
import { config, projectId } from '@/configs';

import { createWeb3Modal } from '@web3modal/wagmi/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { State, WagmiProvider } from 'wagmi';
import { DateFilters, MarketplaceNftProps } from '@/utils/types';

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeVariables: {
    '--w3m-border-radius-master': '0',
    '--w3m-font-family': 'Silkscreen',
    '--w3m-accent': '#E2DADB',
    '--w3m-color-mix': 'black',
    '--w3m-color-mix-strength': 20,
  },
  allWallets: 'HIDE',
  excludeWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    'e7c4d26541a7fd84dbdfa9922d3ad21e936e13a7a0e44385d44f006139e44d3b',
  ],
});

export interface ICurrentUser {
  btcWallet: string;
  ordinalsWallet: string;
  btcWalletForInscription: string;
  lastTransactionId: string;
  publicKey: string;
  paymentPublicKey: string;
  marketplaceNfts: MarketplaceNftProps[] | null;
  userNfts: MarketplaceNftProps[] | null;
  isConnectWalletModalVisible: boolean;
}

const defaultCurrentUser: ICurrentUser = {
  btcWallet: '',
  ordinalsWallet: '',
  btcWalletForInscription: '',
  lastTransactionId: '',
  publicKey: '',
  paymentPublicKey: '',
  marketplaceNfts: null,
  userNfts: null,
  isConnectWalletModalVisible: false,
};

export const CurrentUserContext = createContext<{
  currentUser: ICurrentUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<ICurrentUser>>;
}>({
  currentUser: defaultCurrentUser,
  setCurrentUser: () => {},
});
export type AvailableChains = 'BTC' | 'ETH';
export enum ListSortVariant {
  RECENTLY_LISTED = 'RECENTLY LISTED',
  PRICE_LOW_TO_HIGH = 'PRICE: LOW TO HIGH',
  PRICE_HIGH_TO_LOW = 'PRICE: HIGH TO LOW',
}

export interface IFiltesrContext {
  isOnlyMigrated: boolean;
  checked: number;
  ableChains: 'BTC' | 'ETH';
  priorityPriceView: 'USD' | 'BTC';
  listFilters: ListSortVariant[];
  listFiltersDetails: ListSortVariant[];
  inputSearchCollections: string;
  inputSearchListings: string;
  inputSearchItems: string;
  dateFilter: DateFilters;
  floorPriceFilter: 'asc' | 'desc' | null;
  volumeDirection:
    | 'VolumeAsc'
    | 'VolumeDesc'
    | 'FloorPriceAsc'
    | 'FloorPriceDesc';
}
interface VolumeMetrics {
  '24h': number | null;
  '7d': number | null;
  '30d': number | null;
  total: number | null;
  holders: number | null;
  listings: number;
}

interface Volume extends VolumeMetrics {
  sale_cnt_7d: number | null;
  vol_1d_in_btc: number | null;
  vol_7d_in_btc: number | null;
  vol_30d_in_btc: number | null;
  vol_180d_in_btc: number | null;
  vol_360d_in_btc: number | null;
  vol_total_in_btc: number | null;
}

interface PriceChange {
  d1: number | null;
  d7: number | null;
  d30: number | null;
  d180: number | null;
}
interface CollectionDataChangesInfo {
  last_1_day: number;
  last_7_day: number;
  last_30_day: number;
  all_volume: number;
  total_sales: number;
}

export interface CollectionInfo {
  collection_info: Item;
  sale_info: CollectionDataChangesInfo;
  price_change: PriceChange;
}

export interface Item {
  collection_name: string;
  inscription_icon_id: string;
  icon_media_type: string;
  icon_is_recursive: boolean;
  icon_render_saved: boolean;
  description: string;
  slug: string;
  holder_count: number;
  median_number: number;
  floor_price_magiceden: number;
  listed_cnt_magiceden: number;
  floor_price_ordinalswallet: number | null;
  listed_cnt_ordinalswallet: number;
  floor_price_gammaio: number | null;
  listed_cnt_gammaio: number;
  floor_price_ordinalsmarket: number | null;
  listed_cnt_ordinalsmarket: number;
  floor_price_okx: number | null;
  listed_cnt_okx: number;
  listed_cnt_all: number;
  min_num: number;
  max_num: number;
  supply: string;
  owners: number;
  volume: Volume;
  price_change: PriceChange;
  icon_512: string;
  twitter_link: string;
  website_link: string;
  discord_link: string;
}

export interface ItemsResponse {
  items: Item[];
  topCollections: Item[];
  last_page: number;
  page: number;
  per_page: number | null;
  total: number | null;
  volume: VolumeMetrics;
}
export const defaultCollections: ItemsResponse = {
  items: [],
  topCollections: [],
  last_page: 0,
  page: 0,
  per_page: null,
  total: null,
  volume: {
    '24h': null,
    '7d': null,
    '30d': null,
    total: null,
    holders: null,
    listings: 0,
  },
};

export const defaultCurrentFilters: IFiltesrContext = {
  isOnlyMigrated: false,
  checked: 1,
  ableChains: 'BTC',
  priorityPriceView: 'BTC',
  listFilters: [
    ListSortVariant.RECENTLY_LISTED,
    ListSortVariant.PRICE_LOW_TO_HIGH,
    ListSortVariant.PRICE_HIGH_TO_LOW,
  ],
  listFiltersDetails: [
    ListSortVariant.PRICE_LOW_TO_HIGH,
    ListSortVariant.RECENTLY_LISTED,
    ListSortVariant.PRICE_HIGH_TO_LOW,
  ],
  inputSearchCollections: '',
  inputSearchListings: '',
  inputSearchItems: '',
  dateFilter: '24H',
  floorPriceFilter: null,
  volumeDirection: 'VolumeDesc',
};

export const FiltersContext = createContext<{
  filtersState: IFiltesrContext;
  setFiltersState: React.Dispatch<React.SetStateAction<IFiltesrContext>>;
}>({
  filtersState: defaultCurrentFilters,
  setFiltersState: () => {},
});

export const CollectionsContext = createContext<{
  CollectionsState: ItemsResponse;
  setCollectionsState: React.Dispatch<React.SetStateAction<ItemsResponse>>;
}>({
  CollectionsState: defaultCollections,
  setCollectionsState: () => {},
});

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [currentUser, setCurrentUser] =
    useState<ICurrentUser>(defaultCurrentUser);
  const [filtersState, setFiltersState] = useState<IFiltesrContext>(
    defaultCurrentFilters
  );
  const [CollectionsState, setCollectionsState] =
    useState<ItemsResponse>(defaultCollections);
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <CurrentUserContext.Provider
          value={{
            currentUser,
            setCurrentUser,
          }}
        >
          <CollectionsContext.Provider
            value={{ CollectionsState, setCollectionsState }}
          >
            <FiltersContext.Provider value={{ filtersState, setFiltersState }}>
              {children}
            </FiltersContext.Provider>
          </CollectionsContext.Provider>
        </CurrentUserContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
