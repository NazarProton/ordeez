import { ReactNode, useEffect, useState } from 'react';

const HighlightedText = ({
  variant,
  children,
  extraText,
}: {
  variant?: number;
  children: ReactNode;
  extraText?: string;
}) => {
  const [offset, setOffset] = useState(-100);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prevOffset) => (prevOffset < 200 ? prevOffset + 4 : -100));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-start pc820:items-center w-full font-bold text-lg text-whiteNew overflow-y-visible">
      <div className="absolute inset-0 w-full h-full">
        <div
          className="z-[5] absolute inset-0 flex flex-col bg-transparent w-full h-full"
          style={{
            clipPath: `polygon(
                        ${offset + 30}% 0%, 
                        ${offset + 45}% 0%, 
                        ${offset + 15}% 100%, 
                        ${offset}% 100%
                    )`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {children}
        </div>
      </div>
      <div className="w-full text-[48px] text-grayNew">{children}</div>
      {extraText && (
        <div
          className={`${
            variant === 2
              ? 'top-[242px]'
              : variant === 3
              ? 'top-[145px]'
              : 'top-[308px]'
          }
          absolute w-[309px] ${
            variant === 2
              ? 'left-[81px]'
              : 'pc450:left-[81px] left-5 pc390:left-10 pc450:right-auto'
          }  text-xl font-normal font-vt323 text-grayNew tracking-[.05em]`}
        >
          {extraText}
        </div>
      )}
    </div>
  );
};

export default HighlightedText;
