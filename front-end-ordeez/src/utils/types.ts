export declare enum OpenSeaSafelistRequestStatus {
  VERIFIED = 'verified',
  APPROVED = 'approved',
  REQUESTED = 'requested',
  NOT_REQUESTED = 'not_requested',
}

export type DateFilters = '24H' | '7D' | '30D' | '180D';

export interface NftActivity {
  block_height: number;
  from_wallet: string | null;
  inscription_id: string;
  marketplace_type: string;
  new_satpoint: string;
  sale_price: number | null;
  to_wallet: string;
  ts: string;
  tx_id: string;
}

export interface OpenSeaCollectionMetadata {
  floorPrice?: number;
  collectionName?: string;
  collectionSlug?: string;
  safelistRequestStatus?: OpenSeaSafelistRequestStatus;
  imageUrl?: string;
  /**
   * @deprecated Use {@link bannerImageUrl} instead.
   */
  imageBannerUrl?: string;
  bannerImageUrl?: string;
  description?: string;
  externalUrl?: string;
  twitterUsername?: string;
  discordUrl?: string;
  lastIngestedAt: string;
}
export interface NftContractForNft {
  isSpam?: boolean;
  address: string;
  tokenType: NftTokenType;
  name?: string;
  symbol?: string;
  totalSupply?: string;
  openSeaMetadata: OpenSeaCollectionMetadata;
  contractDeployer?: string;
  deployedBlockNumber?: number;
}

export type NftTokenType = 'ERC721' | 'ERC1155';

export interface NftImage {
  cachedUrl?: string;
  thumbnailUrl?: string;
  pngUrl?: string;
  contentType?: string;
  size?: number;
  originalUrl?: string;
}

export interface NftRawMetadata {
  [key: string]: any;
}

export type AcquiredAt = string;

export interface BaseNftCollection {
  name: string;
  imageUrl?: string;
}

export interface NftMint {
  price?: string;
  currency?: string;
  timestamp?: string;
}

export interface Nft {
  contract: NftContractForNft;
  tokenId: string;
  tokenType: NftTokenType;
  name?: string;
  description?: string;
  image: NftImage;
  raw: NftRawMetadata;
  tokenUri?: string;
  balance: string;
  timeLastUpdated: string;
  acquiredAt?: AcquiredAt;
  collection?: BaseNftCollection;
  mint?: NftMint;
}

export interface OwnedNft extends Nft {
  balance: string;
}

export interface MarketplaceNftProps {
  bis_url: string;
  bitmap_number: number | null;
  byte_size: number | null;
  collection_floor_price: number | null;
  collection_name: string;
  collection_address: string;
  collection_slug: string | null;
  content_url: string;
  delegate: null;
  gammaio_price: number | null;
  genesis_fee: number | null;
  genesis_height: string;
  genesis_ts: number | null;
  inscription_id: string;
  inscription_name: string;
  inscription_number: number;
  last_sale_price: number | null;
  last_transfer_block_height: number;
  magiceden_price: number | null;
  media_length: number | null;
  metadata: null;
  migrated: boolean;
  mime_type: string;
  min_price: number | null;
  nostr_price: number | null;
  odynals_price: number | null;
  okx_price: number | null;
  ordinalsmarket_price: number | null;
  ordinalswallet_price: number | null;
  ordswap_price: number | null;
  output_value: number | null;
  owner_wallet_addr: string;
  parent_ids: string[];
  price: string;
  pending: boolean;
  token_id: string;
  chain_id: number;
  render_url: string;
  satpoint: string;
  slug: string | null;
  unisat_price: number | null;
  utxo: string;
  wallet: string;
}
