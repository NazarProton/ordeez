import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { backBaseUrl } from '@/configs';
import { MarketplaceNftProps } from '@/utils/types';

export const nftListMocked: MarketplaceNftProps[] = [
  {
    bis_url:
      'https://bestinslot.xyz/ordinals/inscription/2F42c096bc722def4ead2af4488a039bef6dbca13df737ff0ff257fadea0493a94i0',
    bitmap_number: 1,
    byte_size: 2048,
    collection_floor_price: 0.5,
    collection_name: 'CryptoPunks',
    collection_slug: 'cryptopunks',
    content_url:
      'https://bis-ord-content.fra1.cdn.digitaloceanspaces.com/ordinals/d82812444ba148a7565a3ef7ff14b2e49946a188dcda3ac55f25c78516f13aa4i0',
    delegate: null,
    gammaio_price: 2.5,
    genesis_fee: null,
    genesis_height: '123456',
    genesis_ts: 1610000000,
    inscription_id:
      'd82812444ba148a7565a3ef7ff14b2e49946a188dcda3ac55f25c78516f13aa4i0',
    inscription_name: 'First Edition',
    inscription_number: 101,
    last_sale_price: 3.0,
    last_transfer_block_height: 123456,
    magiceden_price: null,
    media_length: null,
    metadata: null,
    migrated: false,
    mime_type: 'image/jpeg',
    min_price: null,
    nostr_price: null,
    odynals_price: null,
    okx_price: null,
    ordinalsmarket_price: null,
    ordinalswallet_price: null,
    ordswap_price: null,
    output_value: null,
    owner_wallet_addr: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    parent_ids: ['pid1', 'pid2'],
    price: '50000000',
    render_url: 'null',
    pending: false,
    satpoint: '50000',
    slug: 'cryptopunks-101',
    unisat_price: null,
    utxo: 'utxo1',
    wallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    chain_id: 1,
    collection_address: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    token_id: '100',
  },
  {
    bis_url:
      'https://bestinslot.xyz/ordinals/inscription/2F42c096bc722def4ead2af4488a039bef6dbca13df737ff0ff257fadea0493a94i0',
    bitmap_number: 2,
    byte_size: 4096,
    collection_floor_price: 0.8,
    collection_name: 'Bored Ape Yacht Club',
    collection_slug: 'bored-ape-yacht-club',
    content_url:
      'https://bis-ord-content.fra1.cdn.digitaloceanspaces.com/ordinals/d82812444ba148a7565a3ef7ff14b2e49946a188dcda3ac55f25c78516f13aa4i0',
    delegate: null,
    gammaio_price: 3.0,
    genesis_fee: null,
    genesis_height: '123457',
    genesis_ts: 1610000100,
    inscription_id:
      'd82812444ba148a7565a3ef7ff14b2e49946a188dcda3ac55f25c78516f13aa4i0',
    inscription_name: 'Second Edition',
    inscription_number: 102,
    last_sale_price: 5.0,
    last_transfer_block_height: 123457,
    magiceden_price: null,
    media_length: null,
    metadata: null,
    migrated: true,
    mime_type: 'image/png',
    min_price: null,
    nostr_price: null,
    odynals_price: null,
    okx_price: null,
    ordinalsmarket_price: null,
    ordinalswallet_price: null,
    ordswap_price: null,
    output_value: null,
    owner_wallet_addr: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    parent_ids: ['pid3', 'pid4'],
    price: '400000000',
    render_url: 'null',
    pending: false,
    satpoint: '100000',
    slug: 'bored-ape-102',
    unisat_price: null,
    utxo: 'utxo2',
    wallet: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    chain_id: 1,
    collection_address: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    token_id: '100',
  },
  {
    bis_url:
      'https://bestinslot.xyz/ordinals/inscription/69c3ed6ef3dd41f94468fb4de057a43fedf7fa8b98a62eb11f61a2eff545f038i0',
    bitmap_number: 2,
    byte_size: 4096,
    collection_floor_price: 0.8,
    collection_name: 'Bored Ape Yacht Club',
    collection_slug: 'bored-ape-yacht-club',
    content_url:
      'https://bis-ord-content.fra1.cdn.digitaloceanspaces.com/ordinals/d82812444ba148a7565a3ef7ff14b2e49946a188dcda3ac55f25c78516f13aa4i0',
    delegate: null,
    gammaio_price: 3.0,
    genesis_fee: null,
    genesis_height: '123457',
    genesis_ts: 1610000100,
    inscription_id:
      'd82812444ba148a7565a3ef7ff14b2e49946a188dcda3ac55f25c78516f13aa4i0',
    inscription_name: 'Second Edition',
    inscription_number: 102,
    last_sale_price: 5.0,
    last_transfer_block_height: 123457,
    magiceden_price: null,
    media_length: null,
    metadata: null,
    migrated: false,
    mime_type: 'image/png',
    min_price: null,
    nostr_price: null,
    odynals_price: null,
    okx_price: null,
    ordinalsmarket_price: null,
    ordinalswallet_price: null,
    ordswap_price: null,
    output_value: null,
    owner_wallet_addr: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    parent_ids: ['pid3', 'pid4'],
    price: '150000000',
    render_url: 'null',
    pending: false,
    satpoint: '100000',
    slug: 'bored-ape-102',
    unisat_price: null,
    utxo: 'utxo2',
    wallet: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    chain_id: 1,
    collection_address: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    token_id: '100',
  },
  {
    bis_url:
      'https://bestinslot.xyz/ordinals/inscription/69c3ed6ef3dd41f94468fb4de057a43fedf7fa8b98a62eb11f61a2eff545f038i0',
    bitmap_number: 2,
    byte_size: 4096,
    collection_floor_price: 0.8,
    collection_name: 'Bored Ape Yacht Club',
    collection_slug: 'bored-ape-yacht-club',
    content_url:
      'https://bis-ord-content.fra1.cdn.digitaloceanspaces.com/ordinals/d82812444ba148a7565a3ef7ff14b2e49946a188dcda3ac55f25c78516f13aa4i0',
    delegate: null,
    gammaio_price: 4.0,
    genesis_fee: null,
    genesis_height: '123457',
    genesis_ts: 1610000100,
    inscription_id:
      'd82812444ba148a7565a3ef7ff14b2e49946a188dcda3ac55f25c78516f13aa4i0',
    inscription_name: 'Second Edition',
    inscription_number: 102,
    last_sale_price: 5.0,
    last_transfer_block_height: 123457,
    magiceden_price: null,
    media_length: null,
    metadata: null,
    migrated: true,
    mime_type: 'image/png',
    min_price: null,
    nostr_price: null,
    odynals_price: null,
    okx_price: null,
    pending: false,
    ordinalsmarket_price: null,
    ordinalswallet_price: null,
    ordswap_price: null,
    output_value: null,
    owner_wallet_addr: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    parent_ids: ['pid3', 'pid4'],
    price: '200000000',
    render_url: 'null',
    satpoint: '100000',
    slug: 'bored-ape-102',
    unisat_price: null,
    utxo: 'utxo2',
    wallet: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    chain_id: 1,
    collection_address: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    token_id: '100',
  },
];

const NftRow = ({ activeButton }: { activeButton: number }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [nftList, setNftList] = useState<MarketplaceNftProps[] | null>(null);

  const getNftList = useCallback(() => {
    axios
      .get(
        `${backBaseUrl}/api/latest/${
          activeButton === 1
            ? 'migrations'
            : activeButton === 2
            ? 'listings'
            : 'sales'
        }`
      )
      .then(({ data }) => {
        setNftList(data.data.length ? [...data.data] : nftListMocked);
        setIsLoading(data.data.length ? false : false);
      })
      .catch((err) => {
        setNftList(nftListMocked);
        setIsLoading(false);
        console.log(err.message);
      });
  }, [activeButton]);

  useEffect(() => {
    setIsLoading(true);
    getNftList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setNftList(nftListMocked);
    setIsLoading(true);
    getNftList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeButton]);

  return (
    <div className="flex gap-4 mt-16 pb-4 w-full overflow-auto default-scrollbar-main">
      {nftList &&
        nftList.map((el, index) => (
          <div
            key={index}
            className={`group relative border-[1px] ${
              isLoading
                ? 'border-onyxNew'
                : el.migrated
                ? 'border-rose'
                : 'border-onyxNew'
            }  p-4 w-1/5 min-w-[228px] h-[334px] bg-black`}
          >
            <div
              className={`-right-[1px] -bottom-[1px] z-[2] absolute ${
                isLoading
                  ? 'border-onyxNew'
                  : el.migrated
                  ? 'border-rose'
                  : 'border-onyxNew'
              } bg-black border-t border-l w-2 h-1`}
            ></div>
            <div
              className={`-right-[1px] -bottom-[1px] z-[2] absolute ${
                isLoading
                  ? 'border-onyxNew'
                  : el.migrated
                  ? 'border-rose'
                  : 'border-onyxNew'
              } bg-black border-t border-l w-1 h-2`}
            ></div>
            <div
              className={`right-[2px] -bottom-[1px] z-[2] absolute bg-black border-t border-black border-l w-0.5 h-[3px]`}
            ></div>
            {!isLoading ? (
              <Image
                width={300}
                height={300}
                src={`https://ordinals.com/content/${el.inscription_id}`}
                alt="FileIcon"
                className={`h-[184px]  object-cover`}
              />
            ) : (
              <div className="bg-onyxNew h-[184px] animate-pulse"></div>
            )}
            <div className="flex flex-col justify-between w-full h-[calc(100%-184px)]">
              {!isLoading ? (
                <div className="w-full h-fit">
                  <p className="mt-4 font-vt323 text-[16px] text-grayNew leading-[140%] tracking-[0.05em]">
                    {el.collection_name}
                  </p>
                  <p
                    className={`font-vt323 text-[20px] leading-[140%] tracking-[.05em] ${
                      isLoading
                        ? 'border-onyxNew'
                        : el.migrated
                        ? 'text-rose'
                        : 'text-whiteNew'
                    } `}
                  >
                    {el.inscription_name}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-4 w-full">
                  <div className="bg-onyxNew w-full h-4 animate-pulse"></div>
                  <div className="bg-onyxNew w-full h-5 animate-pulse"></div>
                </div>
              )}
              {activeButton === 2 && (
                <div className="flex justify-between">
                  {!isLoading ? (
                    <>
                      <div className="font-vt323 text-whiteNew leading-[22.4px] tracking-[.05em]">
                        {el.price
                          ? `${(Number(el.price) / 100000000)
                              .toFixed(8)
                              .replace(/\.?0+$/, '')} BTC`
                          : 'NOT LISTED'}
                      </div>

                      <Link
                        href={'/marketplace/listings'}
                        className="flex gap-1 font-vt323 text-grayNew hover:text-whiteNew leading-[22.4px] tracking-[.05em] group/item"
                      >
                        <span className="group-hover/item:block hidden">
                          {'>'}
                        </span>{' '}
                        BUY
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center items-center w-24 h-[22.39px]">
                        <div className="bg-onyxNew w-24 h-3 animate-pulse"></div>
                      </div>
                      <div className="flex justify-center items-center w-8 h-[22.39px]">
                        <div className="bg-onyxNew w-8 h-3 animate-pulse"></div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default NftRow;
