import { Dispatch, SetStateAction, useContext } from 'react';
import Ticks from '../svgComponents/Ticks';
import { useAccount } from 'wagmi';
import { CurrentUserContext } from '@/context';

const NavButton = ({
  step,
  setStep,
  number,
  disabled,
  inputError,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  number: number;
  disabled: boolean;
  inputError?: boolean;
}) => {
  const { address } = useAccount();
  const { currentUser } = useContext(CurrentUserContext);
  function shoudShowTicks() {
    let ticks = false;
    if (number === 1) {
      ticks = !!address;
    } else if (number === 2 && !inputError) {
      ticks = !!currentUser.btcWalletForInscription && !!address;
    } else if (number === 3) {
      ticks = step > number ? true : false;
    } else if (number === 4) {
      ticks = step > number ? true : false;
    } else if (number === 5) {
      ticks = step === number ? true : false;
    }
    return ticks;
  }

  return (
    <button
      onClick={() => setStep(number)}
      disabled={disabled || step === 5}
      className={`${
        shoudShowTicks() ? 'py-[13.5px]' : 'py-[17px]'
      } group w-1/4 flex justify-center items-center gap-2 border-b-[1px] disabled:cursor-not-allowed   ${
        step >= number ? 'border-b-maize' : 'border-b-onyxNew'
      }  font-vt323v2 ${
        step === number
          ? 'text-maize'
          : 'text-grayNew hover:text-whiteNew disabled:text-onyxNew'
      }`}
    >
      {shoudShowTicks() ? (
        <div
          className={`w-6 h-6 mt-0.5 ${
            step === number
              ? ''
              : step === 5
              ? 'opacity-40'
              : 'opacity-60 group-hover:opacity-100'
          }`}
        >
          <Ticks color={`${step === number ? '#FFF05A' : '#E2DADB'}`} />
        </div>
      ) : (
        ''
      )}
      <p className="-mb-1">
        {number === 1
          ? 'CONNECT'
          : number === 2
          ? 'SPECIFY'
          : number === 3
          ? 'SELECT'
          : number === 4
          ? 'SIGN'
          : 'VERIFY'}
      </p>
    </button>
  );
};

export default NavButton;
