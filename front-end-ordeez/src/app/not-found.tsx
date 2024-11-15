'use client';
import Image from 'next/image';
import Chpik from '../../public/cry.png';
import NavbarButtons from '@/components/NavBar/NavbarButtons';
import NewHighlightedText from '@/components/NewHighlightedText';

const Custom404 = () => {
  return (
    <>
      {/* <Head>
        <title>Ordeez</title>
        <meta name="description" content="Ordeez.io" />
      </Head> */}
      <NavbarButtons is404>
        <main className="flex flex-col items-center px-4 pc820:px-8 max-w-[1510px] w-full min-h-[calc(100dvh-112px-217px-128px)] mb-32">
          <div className="flex flex-col w-full justify-center items-center">
            <div className="flex w-full flex-col items-start">
              <NewHighlightedText>
                <p className="mb-16 font-pressStart text-[32px] text-center pc820:text-[40px] leading-[64px]">
                  404
                </p>
              </NewHighlightedText>
            </div>
            <div className="h-[calc(100vh-96px-128px)] pc820:h-[calc(100vh-112px-128px)]">
              <div
                style={{
                  animation: 'levitate 3s infinite ease-in-out',
                }}
                className="flex flex-col items-center h-[40vh]"
              >
                <div className="relative bg-maize mx-auto my-4 mb-8 p-4 w-full max-w-[328px] font-vt323v2 text-[14px] text-center pc450:text-auto">
                  Sorry, the page you are looking for does not exist.
                  <div className="-bottom-2 left-1/2 absolute border-maize border-x-8 border-x-transparent border-t-8 w-0 h-0 transform -translate-x-1/2"></div>
                </div>
                <Image
                  src={Chpik}
                  height={128}
                  width={128}
                  className="mt-[0.5px] pb-4"
                  alt="Chpik cat"
                />
              </div>
            </div>
          </div>
        </main>
      </NavbarButtons>
    </>
  );
};

export default Custom404;
