import { usePathname } from 'next/navigation';
import React, { Dispatch, SetStateAction } from 'react';

const SwitchDouble = ({
  stateValue,
  setStateAction,
  firsthText,
  secondText,
}: {
  stateValue: boolean;
  setStateAction: Dispatch<SetStateAction<boolean>>;
  firsthText: string;
  secondText?: string;
}) => {
  const pathName = usePathname();

  return (
    <div
      onClick={() => setStateAction((prev) => !prev)}
      className={`group cursor-pointer select-none ${
        pathName?.includes('listing') ? '' : ''
      }  text-nowrap font-vt323v4 flex-row-reverse flex justify-start items-center gap-4 
       `}
    >
      <span
        className={`${
          stateValue ? 'text-maize ' : ' text-grayNew group-hover:text-whiteNew'
        }`}
      >
        {secondText && secondText}
      </span>
      <div
        className={`w-12 h-7 flex items-center border p-1 cursor-pointer
           border-grayNew bg-transparent group-hover:border-whiteNew transition-colors duration-0`}
      >
        <div
          className={`w-3 h-3 shadow-md ${
            stateValue
              ? `translate-x-[23px] ${secondText ? 'bg-maize' : 'bg-rose'}`
              : `translate-x-1 ${
                  secondText ? 'bg-maize' : 'bg-grayNew group-hover:bg-whiteNew'
                } `
          }  transition-transform duration-300 ease-in-out`}
        ></div>
      </div>
      <span
        className={`${
          stateValue ? 'text-grayNew group-hover:text-whiteNew' : 'text-maize '
        }`}
      >
        {firsthText}
      </span>
    </div>
  );
};

export default SwitchDouble;
