import { ReactNode, useEffect, useState } from 'react';

const NewHighlightedText = ({
  isMigrated,
  children,
  isDetails,
}: {
  isMigrated?: boolean;
  variant?: number;
  children: ReactNode;
  isDetails?: boolean;
}) => {
  const [offset, setOffset] = useState(-100);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prevOffset) => (prevOffset < 200 ? prevOffset + 4 : -100));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative flex items-start pc820:items-center ${
        isDetails ? 'w-full' : ' w-fit'
      } font-bold text-lg ${
        isMigrated ? ' text-whiteNew' : 'text-whiteNew'
      } overflow-y-visible`}
    >
      <div className="absolute inset-0 w-full h-fit">
        <div
          className="z-[3] absolute inset-0 flex flex-col bg-transparent w-full h-fit"
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
      <div
        className={`w-full text-[48px] ${
          isMigrated ? 'text-rose' : 'text-grayNew'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default NewHighlightedText;
