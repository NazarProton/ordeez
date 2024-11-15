'use client'; // This is a client component
import { useContext, useEffect, useState } from 'react';
import '@/styles/globals.css';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import { CurrentUserContext } from '@/context';
import Step2 from '@/components/Migration/Step2';
import Step1 from '@/components/Migration/Step1';
import Step3 from '@/components/Migration/Step3';
import NavButton from '@/components/Migration/NavButton';
import Step4 from '@/components/Migration/Step4';
import Step5 from '@/components/Migration/Step5';
import { BrowserView, MobileView } from 'react-device-detect';
import SpeechBubble from '../SpeechBubble';
import NewHighlightedText from '../NewHighlightedText';
import { Nft } from '@/utils/types';

export default function MigrationPage() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [step, setStep] = useState<number>(1);
  const { address, chainId } = useAccount();
  const [inputError, setInputError] = useState(false);
  const [selectedNftsToInscribe, setSelectedNftsToInscribe] = useState<Nft[]>(
    []
  );
  const [sizeOfAllElements, setSizeOfAllElements] = useState(0);
  const [contentTypeSize, setContentTypeSize] = useState(0);

  useEffect(() => {
    if (!address || chainId != 1) {
      localStorage.removeItem('btcWalletForInscription');
      setCurrentUser({ ...currentUser, btcWalletForInscription: '' });
      setStep(1);
    } else if (!!address) {
      setStep(2);
    }
    setCurrentUser({
      ...currentUser,
      userNfts: null,
      marketplaceNfts: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chainId]);

  return (
    <>
      {/* <Head>
        <title>Ordeez</title>
        <meta name="description" content="Ordeez.io" />
      </Head> */}
      <MobileView className="mb-32 w-full">
        <main className="flex flex-col w-full items-center min-h-[calc(100dvh-96px-128px)] px-4 pc820:px-8 ">
          <div className="flex justify-start flex-col w-full items-left">
            <NewHighlightedText>
              <p className="mb-16 font-pressStart text-[32px] text-left pc820:text-[40px] leading-[64px]">
                CREATION
              </p>
            </NewHighlightedText>
          </div>
          <div className="h-[calc(100vh-96px-128px)] pc820:h-[calc(100vh-112px-128px)]">
            <SpeechBubble />
          </div>
        </main>
      </MobileView>
      <BrowserView className="min-h-[calc(100dvh-96px-217px-128px)] pc820:min-h-[calc(100dvh-112px-217px-128px)] max-w-[1510px] mb-32 w-full">
        <main className="flex flex-col  items-center h-[calc(100vh-112px)] min-h-[750px] px-4 pc820:px-8 w-full">
          <div className="flex justify-start w-full flex-col items-start">
            <NewHighlightedText>
              <p className="mb-16 font-pressStart text-left text-[32px] pc820:text-[40px] leading-[64px]">
                CREATION
              </p>
            </NewHighlightedText>
          </div>
          <div className="bg-black min-w-[756px] max-w-[756px] h-fit scale-50 pc450:scale-[.65] pc600:scale-[.85] pc700:scale-90 pc770:scale-100">
            <div className="border-[1px] border-onyxNew min-w-full">
              <div className="flex">
                <NavButton
                  setStep={setStep}
                  step={step}
                  number={1}
                  disabled={step === 5}
                />
                <NavButton
                  setStep={setStep}
                  step={step}
                  number={2}
                  disabled={!address || chainId != 1 || step === 5}
                  inputError={inputError}
                />
                <NavButton
                  setStep={setStep}
                  step={step}
                  number={3}
                  disabled={
                    !address ||
                    !currentUser.btcWalletForInscription ||
                    step === 5 ||
                    step === 2 ||
                    step === 1
                  }
                />
                <NavButton
                  setStep={setStep}
                  step={step}
                  number={4}
                  disabled={
                    !address ||
                    !currentUser.btcWalletForInscription ||
                    step !== 4
                  }
                />
                <NavButton
                  setStep={setStep}
                  step={step}
                  number={5}
                  disabled={true}
                />
              </div>
              <div className="w-full h-full">
                {step === 1 ? (
                  <Step1 setStep={setStep} />
                ) : step === 2 ? (
                  <Step2 setStep={setStep} setInputError={setInputError} />
                ) : step === 3 ? (
                  <Step3
                    setStep={setStep}
                    setSelectedNftsToInscribe={setSelectedNftsToInscribe}
                    setSizeOfAllElements={setSizeOfAllElements}
                    setContentTypeSize={setContentTypeSize}
                  />
                ) : step === 4 ? (
                  <Step4
                    setStep={setStep}
                    selectedNftsToInscribe={selectedNftsToInscribe}
                    sizeOfAllElements={sizeOfAllElements}
                    contentTypeSize={contentTypeSize}
                  />
                ) : step === 5 ? (
                  <Step5 setStep={setStep} />
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </main>
      </BrowserView>
    </>
  );
}
