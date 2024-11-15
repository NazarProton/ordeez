import { Dispatch, SetStateAction } from 'react';

interface ButtonBlockProps {
  activeButton: number;
  setActiveButton: Dispatch<SetStateAction<number>>;
}

const ButtonBlock = ({ activeButton, setActiveButton }: ButtonBlockProps) => {
  return (
    <div className="flex w-full">
      <button
        onClick={() => setActiveButton(1)}
        className={`px-4 py-2 font-normal font-vt323  text-grayNew border ${
          activeButton === 1
            ? 'border-maize text-maize bg-black'
            : 'border-transparent hover:text-whiteNew'
        } tracking-[.05em]`}
      >
        DERIVATIVES
      </button>
      <button
        onClick={() => setActiveButton(2)}
        className={`px-4 py-2 font-normal font-vt323  text-grayNew border ${
          activeButton === 2
            ? 'border-maize text-maize bg-black'
            : 'border-transparent hover:text-whiteNew'
        } tracking-[.05em]`}
      >
        LISTINGS
      </button>
      <button
        onClick={() => setActiveButton(3)}
        className={`px-4 py-2 font-normal font-vt323  text-grayNew border ${
          activeButton === 3
            ? 'border-maize text-maize bg-black'
            : 'border-transparent hover:text-whiteNew'
        } tracking-[.05em]`}
      >
        SALES
      </button>
    </div>
  );
};

export default ButtonBlock;
