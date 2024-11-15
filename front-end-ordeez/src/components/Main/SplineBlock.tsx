import Spline from '@splinetool/react-spline';
import React, { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import Script from 'next/script';

const SplineBlock = () => {
  const splineRef = useRef<HTMLDivElement>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const handleMouseDown = () => {
    setIsGrabbing(true);
  };

  const handleMouseUp = () => {
    setIsGrabbing(false);
  };

  const handleMouseLeave = () => {
    setIsGrabbing(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (splineRef.current) {
        const { clientWidth, clientHeight } = splineRef.current;
        splineRef.current.style.width = `${clientWidth}px`;
        splineRef.current.style.height = `${clientHeight}px`;
      }
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* Preload the Spline scene */}
      <Script id="preload-spline-scene">
        {`
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'fetch';
          link.href = 'https://prod.spline.design/${
            isMobile ? 'idLqdPEAbqZU0iAX' : 'PwGFyohx1DbfM6Ul'
          }/scene.splinecode';
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        `}
      </Script>

      <div
        ref={splineRef}
        className={`${isGrabbing ? 'cursor-grabbing' : 'cursor-grab'}
        left-[0px] right-0 pc820:right-auto  pc820:left-[30%] pc950:left-[46%] 
        pc1024:left-[51%] pc1180:left-[59.5%]

        mb-[250px] pc820:mb-0 

        flex justify-center items-center

        pc950:min-w-[550px] min-w-full max-w-full pc950:max-w-[550px] 
        max-h-[400px] min-h-[400px] pc950:max-h-[500px] pc950:min-h-[500px] 
        absolute overflow-visible z-[5]
        `}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <Spline
          className="z-[5] animate-levitate"
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            minHeight: '100%',
            animation: 'levitate 3s infinite ease-in-out',
          }}
          scene={`https://prod.spline.design/${
            isMobile ? 'idLqdPEAbqZU0iAX' : 'PwGFyohx1DbfM6Ul'
          }/scene.splinecode`}
          renderOnDemand
        />
      </div>
    </>
  );
};

export default SplineBlock;
