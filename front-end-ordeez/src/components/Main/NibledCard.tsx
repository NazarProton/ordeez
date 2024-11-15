import React, { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

const NibbledCard = ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showBg, setShowBg] = useState(isMobile ? false : true);
  const [isLoading, setIsLoading] = useState(true);

  const handleMouseOver = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }

    setShowBg(false);
  };

  const handleMouseOut = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }

    setShowBg(true);
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setShowBg(true);
            if (isMobile) {
              videoElement.play();
            }
          } else {
            setShowBg(false);
            videoElement.pause();
          }
        },
        {
          threshold: 0.5,
        }
      );

      observer.observe(videoElement);

      return () => {
        observer.unobserve(videoElement);
      };
    }
  }, []);

  return (
    <div className="w-full pc820:w-1/3 ">
      <div
        className={`relative z-[4] w-full min-h-fit ${
          isMobile ? '' : 'hover:scale-[1.01] pc820:hover:scale-[1.025]'
        } transition-all delay-[50ms]`}
      >
        <div className="top-[0px] left-[0px] z-[3] absolute border-onyxNew bg-black border-r border-b w-2 h-1"></div>
        <div className="top-[0px] left-[0px] z-[3] absolute border-onyxNew bg-black border-r border-b w-1 h-2"></div>
        <div className="top-[0px] left-[0px] z-[3] absolute bg-black border-r border-b border-black w-1 h-[3px]"></div>
        <div className="right-[0px] bottom-[0px] z-[3] absolute border-onyxNew bg-black border-t border-l w-2 h-1"></div>
        <div className="right-[0px] bottom-[0px] z-[3] absolute border-onyxNew bg-black border-t border-l w-1 h-2"></div>
        <div className="right-[0px] bottom-[0px] z-[3] absolute bg-black border-t border-black border-l w-1 h-[3px]"></div>
        <div
          className={`relative flex justify-center items-center border-onyxNew mb-8 border w-full min-h-[230px] min-w-[228px] overflow-hidden overflow-x-hidden`}
        >
          <div
            className={`absolute z-5 inset-0 animate-pulse ${
              isLoading ? '' : 'hidden'
            } bg-onyxNew opacity-80`}
          ></div>
          <video
            ref={videoRef}
            width="100%"
            height="100%"
            loop
            muted
            controls={false}
            preload="auto"
            playsInline
            onCanPlayThrough={() => {
              setIsLoading(false);
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            className={`no-controls ${
              isMobile
                ? showBg
                  ? 'grayscale-0'
                  : 'grayscale'
                : 'grayscale hover:grayscale-0'
            }`}
          >
            <source
              src={
                name === 'CREATION'
                  ? 'migration-feature.mp4'
                  : name === 'LISTING'
                  ? 'listing.mp4'
                  : 'trading.mp4'
              }
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <p className="mb-4 w-full font-vt323 text-grayNew text-xl tracking-[.05em]">
        {name}
      </p>
      <p className="font-vt323 text-grayNew text-xl tracking-[.05em]">
        {description}
      </p>
    </div>
  );
};

export default NibbledCard;
