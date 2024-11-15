import Link from 'next/link';
import Logo from './Logo';
import { usePathname } from 'next/navigation';
import ConnectBtcWalletButton from './ConnectBtcWalletButton';
import { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import MenuBurger from './MenuBurger';
import Image from 'next/image';
import Menu from '../../../public/menu.svg';
import { isBrowser } from 'react-device-detect';
import { useRouter } from 'next/router';
import MarketplaceWrapper from '../Marketplace/MarketplaceWrapper';
import { notReadyToProd } from '@/pages/_app';

const NavbarButtons = ({
  children,
  is404,
}: {
  children: ReactNode;
  is404?: boolean;
}) => {
  const pathName = usePathname();

  const router = useRouter();
  const route = router;
  const [isBurgerMenuVisible, setIsBurgerMenuVisible] = useState(false);
  // const [isPageLoaded, setIsPageLoaded] = useState(false);
  // const [scrollPosition, setScrollPosition] = useState(0);
  // const [lastPathname, setLastPathname] = useState('');

  // const isDynamicRoute = (pathname: string) => {
  //   // Перевіряємо наявність динамічних сегментів у шляху
  //   const dynamicSegments = ['[id]', '[slug]'];
  //   return dynamicSegments.some((segment) => pathname.includes(segment));
  // };

  // useEffect(() => {
  //   const handleRouteChangeStart = (url: string) => {
  //     console.log(url);
  //     if (
  //       lastPathname.includes('marketplace') ||
  //       (lastPathname.includes('profile') && !isDynamicRoute(lastPathname))
  //     ) {
  //       setScrollPosition(window.scrollY);
  //     }
  //   };

  //   const handleRouteChangeComplete = (url: string) => {
  //     if (
  //       (url.includes('marketplace') || url.includes('profile')) &&
  //       !isDynamicRoute(url)
  //     ) {
  //       window.scrollTo(0, scrollPosition);
  //     } else {
  //       window.scrollTo(0, 0); // Прокрутка на початок для інших сторінок
  //     }
  //     setLastPathname(url);
  //   };

  //   router.events.on('routeChangeStart', handleRouteChangeStart);
  //   router.events.on('routeChangeComplete', handleRouteChangeComplete);
  //   router.events.on('routeChangeError', handleRouteChangeComplete);

  //   return () => {
  //     router.events.off('routeChangeStart', handleRouteChangeStart);
  //     router.events.off('routeChangeComplete', handleRouteChangeComplete);
  //     router.events.off('routeChangeError', handleRouteChangeComplete);
  //   };
  // }, [lastPathname, router.events, scrollPosition]);

  // useEffect(() => {
  //   if (isDynamicRoute(lastPathname)) {
  //     window.scrollTo(0, 0);
  //   }
  // }, [lastPathname]);

  // useEffect(() => {
  //   setLastPathname(router.pathname);
  // }, [router.pathname]);
  return (
    <Navbar is404={is404}>
      <MenuBurger
        isBurgerMenuVisible={isBurgerMenuVisible}
        setIsBurgerMenuVisible={setIsBurgerMenuVisible}
      />
      <div
        className={`flex flex-col ${
          pathName === '/creation' && isBrowser ? ' w-full' : ''
        } max-w-full items-center `}
      >
        <header className="z-10 px-4 pc820:px-8 py-8 w-full max-w-[1510px] text-whiteNew">
          {/* <ScrollToTopButton /> */}
          <div className="flex justify-between">
            <Logo />
            <div className="pc820:flex gap-4 flex-nowrap hidden bg-transparent">
              <div className="flex">
                <Link
                  href={'/creation'}
                  className={`font-vt323v4 flex justify-center items-center px-4 ${
                    pathName === '/creation'
                      ? 'text-maize'
                      : 'text-grayNew hover:text-whiteNew'
                  }`}
                >
                  CREATION
                </Link>
                <Link
                  href={'/marketplace/collections/bitcoin'}
                  className={`font-vt323v4 flex justify-center items-center px-4 ${
                    pathName === '/marketplace/collections/bitcoin' ||
                    pathName === '/marketplace/listings'
                      ? 'text-maize'
                      : 'text-grayNew hover:text-whiteNew'
                  }`}
                >
                  MARKETPLACE
                </Link>
              </div>
              <ConnectBtcWalletButton isBurger={false} />
            </div>
            <div
              onClick={() => setIsBurgerMenuVisible(true)}
              className={`flex justify-center h-8 items-center gap-2 pc820:hidden cursor-pointer`}
            >
              <Image
                className="opacity-80 hover:opacity-100"
                src={Menu}
                alt="Menu burger"
              />
            </div>
          </div>
        </header>
        {(pathName === '/marketplace/listings' ||
          pathName === '/marketplace/collections/bitcoin' ||
          pathName === '/marketplace/collections/ethereum') &&
        !notReadyToProd ? (
          <MarketplaceWrapper>{children}</MarketplaceWrapper>
        ) : (
          children
        )}
      </div>
    </Navbar>
  );
};

export default NavbarButtons;
