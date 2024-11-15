import { Item } from '@/context';

export function getFloorPrice(collection: Item): number | null {
  const floorPrices: (number | null)[] = [
    collection.floor_price_okx,
    collection.floor_price_gammaio,
    collection.floor_price_magiceden,
    collection.floor_price_ordinalsmarket,
    collection.floor_price_ordinalswallet,
  ];

  const validFloorPrices: number[] = floorPrices.filter(
    (price): price is number => typeof price === 'number' && price > 0
  );

  return validFloorPrices.length > 0 ? Math.min(...validFloorPrices) : null;
}
