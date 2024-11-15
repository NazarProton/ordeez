import { useRouter } from 'next/router';
import { useContext, useEffect, useState, useCallback } from 'react';
import { CurrentUserContext } from '@/context';
import NftDetailsPage from '@/components/Details/NftDetailsPage';
import axios from 'axios';
import { backBaseUrl } from '@/configs';
import Loader from '../Loader';
import { NftActivity, MarketplaceNftProps } from '@/utils/types';
import Activities from './Activities';
import LoaderWithText from '../LoaderWithText';

const NftPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [nft, setNft] = useState<MarketplaceNftProps | null>(null);
  const [activity, setActivity] = useState<NftActivity[] | null>(null);

  const fetchNftData = useCallback(async () => {
    if (!id) return;

    try {
      const { data } = await axios.get(`${backBaseUrl}/api/inscriptions/${id}`);
      const nftData = data.data.inscription;
      const activity = data.data.activity;
      setNft(nftData ? nftData : null);
      setActivity(activity ? activity : null);
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      //fetchNftData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchNftData();
  }, [fetchNftData]);

  if (router.isFallback || !nft || !activity) {
    return <LoaderWithText isBig isLoading />;
  }

  return (
    <div className="w-full h-fit flex flex-col justify-center min-h-[calc(100dvh-112px-217px-128px)] mb-32 max-w-[1510px] ">
      <div className="px-4 pc820:px-8">
        <NftDetailsPage nft={nft} />
      </div>
      <Activities activity={activity} />
    </div>
  );
};

export default NftPage;
