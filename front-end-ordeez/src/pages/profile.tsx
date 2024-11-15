'use client'; // This is a client component
import NewHighlightedText from '@/components/NewHighlightedText';
import NftList from '@/components/Profile/NftList';
import PageUnderDevelopment from '@/components/PUDevelopment';
import { CurrentUserContext } from '@/context';
import '@/styles/globals.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

export default function Profile({ children }: { children: ReactNode }) {
  const { currentUser } = useContext(CurrentUserContext);
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      if (!currentUser.btcWallet) {
        router.push('/');
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.btcWallet]);
  return (
    <>
      {/* <Head>
        <title>Ordeez</title>
        <meta name="description" content="Ordeez.io" />
      </Head> */}

      <main className="flex flex-col items-center w-full min-h-[calc(100dvh-112px-217px-128px)] mb-32 min-w-[360px] max-w-[1510px]">
        <>
          <div className="px-4 pc820:px-8 flex flex-col w-full items-start">
            <NewHighlightedText>
              <p className="mb-16 font-pressStart text-[32px] text-center pc820:text-[40px] leading-[64px]">
                PROFILE
              </p>
            </NewHighlightedText>
          </div>
          <NftList>{children}</NftList>
        </>
      </main>
    </>
  );
}
