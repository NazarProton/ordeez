import { IFeeData } from '@/components/Migration/Step4';
import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { backBaseUrl } from '@/configs';

export async function getBalanceBtc(
  setUserBalance: Dispatch<SetStateAction<number | null>>,
  userWalletAddress: string
) {
  try {
    const { data } = await axios.get(
      `${backBaseUrl}/api/indexer/${userWalletAddress}/balance`
    );
    setUserBalance(data.data.btcPendingSatoshi + data.data.btcSatoshi);
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
  }
}
