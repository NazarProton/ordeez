import { AppProps } from 'next/app';
import '../styles/globals.css';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/configs';
import Web3ModalProvider from '@/context';
import NavbarButtons from '@/components/NavBar/NavbarButtons';
import Head from 'next/head';
import PageUnderDevelopment from '@/components/PUDevelopment';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GoogleAnalytics } from "@next/third-parties/google";

export const notReadyToProd = true;

function MyApp({ Component, pageProps }: AppProps) {
  const initialState = cookieToInitialState(config);
  const route = usePathname();

  const [isInDev, setIsInDev] = useState<{ [key: string]: boolean }>({
    '/': false,
    '/marketplace': notReadyToProd,
    '/inscriptions': notReadyToProd,
    '/marketplace/listings': notReadyToProd,
    '/marketplace/collections/bitcoin': notReadyToProd,
    '/marketplace/collections/ethereum': notReadyToProd,
    '/profile/inscriptions': notReadyToProd,
    '/profile/orders': notReadyToProd,
    '/profile': notReadyToProd,
    '/creation': notReadyToProd,
  });

  useEffect(() => {
    if (route) {
      if (route.includes('inscriptions')) {
        setIsInDev((prev) => ({ ...prev, [route]: notReadyToProd }));
      }

      // Перевірка для динамічних шляхів після /marketplace/collections/bitcoin
      if (/^\/marketplace\/collections\/bitcoin\/.+/.test(route)) {
        setIsInDev((prev) => ({ ...prev, [route]: notReadyToProd }));
      }
      if (/^\/marketplace\/collections\/ethereum\/.+/.test(route)) {
        setIsInDev((prev) => ({ ...prev, [route]: notReadyToProd }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);
  return (
    <Web3ModalProvider initialState={initialState}>
      <NavbarButtons>
        <Head>
          <title>ORDEEZ: the first NFT derivatives creation service</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            property="og:title "
            content="ORDEEZ: the first NFT derivatives creation service"
          ></meta>
          <meta
            property="og:description"
            content="Create derivatives of your NFTs on the Bitcoin network to preserve their authenticity and value within the ecosystem. Trade both derived and non-derived ordinals in an easy and efficient way."
          ></meta>
          <meta
            name="description"
            content="Create derivatives of your NFTs on the Bitcoin network to preserve their authenticity and value within the ecosystem. Trade both derived and non-derived ordinals in an easy and efficient way."
          />
        </Head>

        {route && isInDev[route] ? (
          <PageUnderDevelopment />
        ) : (
          <Component {...pageProps} />
        )}
      </NavbarButtons>
      <GoogleAnalytics gaId="G-ZJB961H6XH"/>
    </Web3ModalProvider>

  );
}

export default MyApp;
