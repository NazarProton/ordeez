import { usePathname } from 'next/navigation';
import React, { Dispatch, SetStateAction } from 'react';

const Switch = ({
  stateValue,
  setStateAction,
  firsthText,
  activeColor,
}: {
  stateValue: boolean;
  setStateAction: Dispatch<SetStateAction<boolean>>;
  firsthText: string;
  activeColor: string;
}) => {
  const pathName = usePathname();

  return (
    <div
      onClick={() => setStateAction((prev) => !prev)}
      className={`group cursor-pointer select-none ${
        pathName?.includes('listings') ? 'mt-0' : 'mt-8 pc820:flex-row-reverse'
      }  pc820:mt-0 text-nowrap font-vt323v4  flex justify-start items-center gap-4 pc820:mb-0  ${
        stateValue
          ? `text-${activeColor} hover:text-whiteNew`
          : 'text-grayNew hover:text-whiteNew'
      }`}
    >
      <div
        className={`w-12 h-7 flex items-center border p-1 cursor-pointer
           border-grayNew bg-transparent group-hover:border-whiteNew transition-colors duration-0`}
      >
        <div
          className={`w-3 h-3 shadow-md ${
            stateValue
              ? `translate-x-[23px] bg-${activeColor}`
              : 'translate-x-1 bg-grayNew group-hover:bg-whiteNew'
          }  transition-transform duration-300 ease-in-out`}
        ></div>
      </div>
      {firsthText}
    </div>
  );
};

export default Switch;
