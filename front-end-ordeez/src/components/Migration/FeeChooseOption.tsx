import { CurrentUserContext } from '@/context';
import axios from 'axios';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAccount } from 'wagmi';

interface IFeeChooseOption {
  variant: string | number;
  satsPerVByte: string | number;
  countOfSatoshi: number;
  trxTime: string | number;
  checked: boolean;
  price: number;
  setChosedFeeOption: Dispatch<SetStateAction<number>>;
  setIsSufficientBalance: Dispatch<SetStateAction<number>>;
  userBalance: number | null;
}

const FeeChooseOption = ({
  variant,
  satsPerVByte,
  countOfSatoshi,
  trxTime,
  checked,
  price,
  setChosedFeeOption,
  setIsSufficientBalance,
  userBalance,
}: IFeeChooseOption) => {
  return (
    <div
      onClick={async () => {
        setChosedFeeOption(
          variant === 'LOW' ? 1 : variant === 'MEDIUM' ? 2 : 3
        );
        if (typeof userBalance === 'number') {
          const userBalanceInSatoshi = userBalance / 100000000;
          const trxPriceInSatoshi = countOfSatoshi / 100000000;
          setIsSufficientBalance(
            userBalanceInSatoshi >= trxPriceInSatoshi ? 1 : 2
          );
        }
      }}
      className={`group w-1/3 cursor-pointer py-4 flex flex-col font-vt323 text-xl tracking-[0.05em] border ${
        checked
          ? 'text-maize hover:text-maize border-maize'
          : 'text-grayNew hover:text-whiteNew border-onyxNew hover:border-whiteNew'
      } justify-between items-center`}
    >
      <div className="flex flex-col justify-center items-center">
        <span className="font-vt323 text-xl tracking-[0.05em]">{variant}</span>
        <span className="font-vt323 text-xl tracking-[0.05em]">
          {satsPerVByte} sats/vByte
        </span>
      </div>
      <span className="flex justify-center items-baseline">
        <span className="font-vt323 text-xl tracking-[0.05em]">~</span>
        <span className="font-vt323 text-2xl tracking-[0.05em]">
          ${Math.floor(price * 100) / 100}
        </span>
      </span>
      <div className="flex flex-col justify-center items-center">
        <span className="font-vt323 text-xl tracking-[0.05em]">
          ~{countOfSatoshi} sats
        </span>
        <span className="font-vt323 text-xl tracking-[0.05em]">{trxTime}</span>
        <input
          checked={checked}
          className="checked:group-hover:bg-maize group-hover:outline-whiteNew checked:group-hover:outline-maize group-hover:bg-whiteNew border-[3px] checked:bg-maize mt-5 border-black rounded-full w-3 h-3 cursor-pointer appearance-none color-whiteNew outline outline-1 outline-grayNew checked:outline-1 checked:outline-maize"
          type="checkbox"
          readOnly
        />
      </div>
    </div>
  );
};

export default FeeChooseOption;
