import { IFeeData } from '@/components/Migration/Step4';
import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { backBaseUrl } from '@/configs';

export async function getTransactionFee(
  setFeeData: Dispatch<SetStateAction<IFeeData>>,
  setLoading: Dispatch<SetStateAction<boolean>> | null = null,
  isLoading: boolean = false
) {
  const isMainnet = process.env.IS_MAINNET === 'true';

  try {
    const { data } = await axios(
      `${backBaseUrl}/api${isMainnet ? '' : '/testnet'}/fees/recommended`
    );
    setFeeData(data.data);
    if (setLoading) setLoading(isLoading);
  } catch (error) {
    console.error('Failed to fetch transaction fees', error);
  }
}
