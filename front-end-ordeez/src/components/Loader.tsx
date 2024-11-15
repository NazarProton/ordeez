import React, { useState, useEffect, useRef } from 'react';

export default function Loader({
  isSmall,
  dataLoaded,
  inverse,
}: {
  isSmall: boolean;
  dataLoaded?: boolean;
  inverse?: boolean;
}) {
  const [blocks, setBlocks] = useState<number[]>([1]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!dataLoaded) {
      intervalRef.current = setInterval(() => {
        setBlocks((prevBlocks) => {
          if (prevBlocks.length >= 12) {
            return [1];
          }
          return [...prevBlocks, 1];
        });
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`${
        isSmall ? 'h-fit' : 'h-[calc(100vh-112px)]'
      } w-full flex justify-center items-center`}
    >
      <div
        className={`flex justify-start items-center gap-1 ${
          inverse ? 'border-black' : 'border-whiteNew'
        } border w-[246px] h-8`}
      >
        {blocks.map((block, index) => (
          <div
            key={index} // Consider a more stable key if items can change
            className={`${inverse ? 'bg-black' : 'bg-whiteNew'} w-4 h-6 ${
              index === 0 ? 'ml-1' : ''
            } ${index === blocks.length - 1 ? 'mr-1' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );
}
