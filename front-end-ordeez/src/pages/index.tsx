'use client'; // This is a client component

import '@/styles/globals.css';
import { useContext, useEffect, useRef, useState } from 'react';
import PacmanDots, { DotsList } from '@/components/Main/PacmanDots';
import Statistics from '@/components/Main/Statistics';
import NibbledCard from '@/components/Main/NibledCard';
import Sponsors from '@/components/Main/Sponsors';
import { CurrentUserContext } from '@/context';
import FirsthHeader from '@/components/Main/FirsthHeader';
import SplineBlock from '@/components/Main/SplineBlock';
import NewHighlightedText from '@/components/NewHighlightedText';

export default function Home() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const mainRef = useRef<HTMLElement | null>(null);
  const [activeButton, setActiveButton] = useState(1);

  useEffect(() => {
    setCurrentUser({
      ...currentUser,
      marketplaceNfts: null,
      userNfts: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* <PacmanGame /> */}
      <main
        ref={mainRef}
        className={`relative flex
           flex-col justify-between items-center px-4 pc820:px-8 mb-32 w-full min-w-[360px] max-w-[1024px] pc15e00:max-w-[1510px] min-h-[calc(100dvh-112px-217px-128px)] overflow-visible
           `}
      >
        <div className="relative flex pc820:flex-row flex-col-reverse items-center w-full min-h-[650px] pc820:min-h-[750px]">
          <FirsthHeader />
          <SplineBlock />
        </div>
        <div className="mt-[144px] pc820:mt-0">
          <PacmanDots mainRef={mainRef} pacman />
        </div>
        <Statistics />
        <div className="flex justify-center pc768:justify-start w-full">
          <div className="flex flex-col items-center pc768:items-end gap-4 w-[25.7%] pc768:w-[27.3%] pc820:w-[25.7%] pc1024:w-[12.7%]">
            <DotsList countOfDots={8} />
          </div>
        </div>
        <div className="py-16 flex justify-start flex-col w-full">
          <NewHighlightedText>
            <div className="flex flex-col pb-2 pc820:pb-4 w-full">
              <p className="z-[2] font-pressStart w-full text-[32px] pc820:text-[40px] text-left leading-[44px] pc820:leading-[64px]">
                HOW
              </p>
              <div className="pc510:ms-10 pc600:ms-20 pc510:inline-block font-pressStart text-[32px] pc510:text-center pc820:text-[40px] leading-[64px] min-w-[calc(100vw-32px)] pc510:min-w-fit flex justify-end">
                IT WORKS
              </div>
            </div>
          </NewHighlightedText>
          <p className="font-vt323v4 pc510:ms-10 pc600:ms-20 text-grayNew w-full pc510:w-[391px]">
            in a few words...
          </p>
        </div>
        <div className="flex pc820:flex-row flex-col gap-12 pc820:gap-4 w-full">
          <NibbledCard
            name="CREATION"
            description="Create derivatives of your NFTs on the Bitcoin network to preserve their authenticity and value within the ecosystem."
          />
          <NibbledCard
            name="LISTING"
            description="List your digital artifacts for sale. You can change the price and unlist at any time. It's free."
          />
          <NibbledCard
            name="TRADING"
            description="Trade both derived and non-derived ordinals. Easy-to-use interface and minimal commission."
          />
        </div>
        {/* <div className="mt-[124px]">
              <PacmanDots mainRef={mainRef} />
            </div>
            <HighlightedText
              variant={3}
              extraText="digital artifacts in each category"
            >
              <div className="relative flex pt-16 w-full h-[238px]">
                <p className="top-[4rem] z-[2] absolute font-pressStart text-[40px] text-left leading-[64px] whitespace-nowrap">
                  LATEST
                </p>
              </div>
            </HighlightedText>
            <ButtonBlock
              activeButton={activeButton}
              setActiveButton={setActiveButton}
            />
            <NftRow activeButton={activeButton} /> */}
        <div className="flex mt-16 justify-center w-full">
          <div className="flex flex-col items-center pc768:items-end gap-4 w-fit">
            <DotsList countOfDots={8} />
          </div>
        </div>
        <Sponsors />
      </main>
    </>
  );
}
