import { convertTimestampToDate } from '@/services/datePrettier';
import DetailItem from './DetailItem';
import { ICurrentUser } from '@/context';
import { MarketplaceNftProps } from '@/utils/types';

const DetailsList = ({
  nft,
  copied,
  handleCopy,
  currentUser,
}: {
  nft: MarketplaceNftProps;
  copied: string | null;
  handleCopy: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    value: string | number | null
  ) => void;
  currentUser: ICurrentUser;
}) => {
  let lastIElement = nft.inscription_id.lastIndexOf('i');
  let genesis_ts = nft.inscription_id.slice(0, lastIElement);

  function getRef(lable: string) {
    switch (lable) {
      case 'Inscription ID':
        return `https://ordinals.com/inscription/${nft.inscription_id}`;
      case 'Genesis transaction':
        return `https://mempool.space/tx/${genesis_ts}`;
      case 'Source collection address':
        return `https://etherscan.io/address/${nft.collection_address}`;
      default:
        return '';
    }
  }

  return (
    <div className="grid gap-2 w-fit">
      <DetailItem
        label="Owner"
        value={nft.wallet}
        dashed={true}
        copied={copied}
        handleCopy={handleCopy}
        getRef={getRef}
      />
      <DetailItem
        label="Inscription ID"
        value={nft.inscription_id}
        dashed={true}
        link={true}
        copied={copied}
        handleCopy={handleCopy}
        getRef={getRef}
      />
      <DetailItem
        label="Inscription number"
        value={nft.inscription_number}
        copied={copied}
        handleCopy={handleCopy}
        getRef={getRef}
      />
      <DetailItem
        label="Genesis transaction"
        value={genesis_ts}
        dashed={true}
        link={true}
        copied={copied}
        handleCopy={handleCopy}
        getRef={getRef}
      />
      <DetailItem
        label="Genesis block"
        value={nft.genesis_height}
        copied={copied}
        handleCopy={handleCopy}
        getRef={getRef}
      />
      <DetailItem
        label="Genesis date"
        value={convertTimestampToDate(nft.genesis_ts ? nft.genesis_ts : 0)}
        copied={copied}
        handleCopy={handleCopy}
        getRef={getRef}
      />
      <DetailItem
        label="Content type"
        value={nft.mime_type}
        copied={copied}
        handleCopy={handleCopy}
        getRef={getRef}
      />
      <DetailItem
        label="Output value"
        value={nft.output_value}
        copied={copied}
        handleCopy={handleCopy}
        getRef={getRef}
      />
      {nft.migrated && (
        <>
          <DetailItem
            label="Token ID"
            value={nft.token_id}
            copied={copied}
            handleCopy={handleCopy}
            getRef={getRef}
            rose
          />
          <DetailItem
            label="Source chain"
            value={nft.chain_id === 1 ? 'Ethereum' : 'Other'}
            copied={copied}
            handleCopy={handleCopy}
            getRef={getRef}
            rose
          />
          <DetailItem
            label="Source collection address"
            value={nft.collection_address}
            dashed={true}
            link={true}
            copied={copied}
            handleCopy={handleCopy}
            getRef={getRef}
            rose
          />
        </>
      )}
    </div>
  );
};

export default DetailsList;
