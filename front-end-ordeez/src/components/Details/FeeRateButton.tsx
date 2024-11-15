import { Dispatch, SetStateAction } from 'react';
import { IFeeData } from '../Migration/Step4';

export enum FeeRate {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

interface IFeeRateButton {
  selectedFeeRate: FeeRate;
  setSelectedFeeRate: Dispatch<SetStateAction<FeeRate>>;
  feeData: IFeeData;
  feeVariant: FeeRate;
}

const FeeRateButton = ({
  selectedFeeRate,
  setSelectedFeeRate,
  feeData,
  feeVariant,
}: IFeeRateButton) => {
  const feeDataVariant =
    feeVariant === 'LOW'
      ? feeData.hourFee
      : feeVariant === 'MEDIUM'
      ? feeData.halfHourFee
      : feeData.fastestFee;
  return (
    <button
      className={`border p-2 w-1/3 ${
        selectedFeeRate === feeVariant
          ? 'border-maize text-maize'
          : 'border-onyxNew text-grayNew hover:text-whiteNew hover:border-whiteNew'
      }`}
      onClick={() => setSelectedFeeRate(feeVariant)}
    >
      <p className="font-vt323v4">{feeVariant}</p>
      <p className="font-vt323v3">{feeDataVariant} sats/vByte</p>
    </button>
  );
};

export default FeeRateButton;
