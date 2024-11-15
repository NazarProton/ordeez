import React, { RefObject, useEffect, useState } from 'react';
import Pacman from '../../../public/packman.svg';
import Image from 'next/image';

export const DotsList = ({ countOfDots }: { countOfDots: number }) => {
  return Array.from({ length: countOfDots }).map((_, index) => (
    <div key={index} className="bg-onyxNew w-1 h-1" />
  ));
};

const PacmanDots = ({
  mainRef,
  pacman,
  divided,
}: {
  mainRef: RefObject<HTMLElement>;
  pacman?: boolean;
  divided?: boolean;
}) => {
  const [numberOfDots, setNumberOfDots] = useState(33);

  useEffect(() => {
    const updateDots = () => {
      if (mainRef.current) {
        const mainWidth = mainRef.current.offsetWidth;
        const newBlockWidth =
          (mainWidth - 64) *
          (!divided ? (mainWidth > 1023 ? 0.75 : 0.5) : 0.74);

        const baseDots = 5;
        const pixelPerElem = 20;

        const newNumberOfDots = Math.floor(
          newBlockWidth / pixelPerElem / (divided ? 2 : 1)
        );
        setNumberOfDots(
          newNumberOfDots <= baseDots ? baseDots : newNumberOfDots
        );
      }
    };

    window.addEventListener('resize', updateDots);
    updateDots();

    return () => window.removeEventListener('resize', updateDots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`flex ${
        divided
          ? 'justify-center items-center pc768:justify-end '
          : 'justify-center items-center'
      } -mt-[76px] w-full`}
    >
      <div
        className={`flex flex-col justify-end items-end gap-4 mt-[76px] ${
          divided
            ? 'pc768:min-w-[calc(32.22%+16.11%+16px)] w-[12.5%]'
            : 'w-[12.5%]'
        } `}
      >
        <DotsList countOfDots={4} />
      </div>
      <div className={`-ml-1 hidden mt-4 w-fit h-1 pc768:flex`}>
        {Array.from({ length: numberOfDots }).map((_, index) => (
          <div key={index} className="bg-onyxNew mr-4 w-1 h-1" />
        ))}
      </div>
      <div
        className={`relative flex flex-col items-start gap-4 mb-[44px] -ml-1 pc768:ml-0 ${
          divided ? 'w-[12.5%] pc768:min-w-[16.11%]' : 'w-[12.5%]'
        }`}
      >
        {pacman && (
          <Image
            src={Pacman}
            alt="pacman"
            className="-top-8 -left-2.5 absolute min-w-6 min-h-6"
          />
        )}
        <DotsList countOfDots={4} />
      </div>
    </div>
  );
};

export default PacmanDots;
