import Image from 'next/image';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import WalletImage from '../../../public/wallet.svg';
import ConnectBtcWalletModal from './ConnectBtcWalletModal';
import { CurrentUserContext } from '@/context';
import closeButton from '../../../public/close.svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useRouter } from 'next/navigation';
import NewHighlightedText from '../NewHighlightedText';

const MenuBurger = ({
  setIsBurgerMenuVisible,
  isBurgerMenuVisible,
}: {
  setIsBurgerMenuVisible: Dispatch<SetStateAction<boolean>>;
  isBurgerMenuVisible: boolean;
}) => {
  const pathName = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  useState(false);

  const toggleDropdown = () => {
    setTimeout(() => {
      setIsBurgerMenuVisible(!isBurgerMenuVisible);
    }, 200);
  };

  const handleLogout = () => {
    if (
      !pathName?.includes('creation') &&
      !pathName?.includes('marketplace') &&
      !pathName?.includes('inscriptions')
    ) {
      router.push('/');
    }
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('btcWalletForInscription');
    localStorage.removeItem('walletAddressBtc');
    localStorage.removeItem('ordinalsPublicKey');
    localStorage.removeItem('paymentPublicKey');
    setCurrentUser({
      ...currentUser,
      ordinalsWallet: '',
      lastTransactionId: '',
      btcWallet: '',
      publicKey: '',
      paymentPublicKey: '',
      btcWalletForInscription: '',
    });
  };

  return (
    <>
      {isBurgerMenuVisible && (
        <div
          className={`fixed pc820:hidden w-full min-h-dvh opacity-100 bg-black flex flex-col z-40`}
        >
          {/* <FuzzyOverlay zindex={1} minus /> */}

          <div className="flex justify-between px-4 py-8">
            <Logo isBurger setIsBurgerMenuVisible={setIsBurgerMenuVisible} />
            <div
              onClick={() => setIsBurgerMenuVisible(false)}
              className={`flex justify-center h-[32px] w-[22px] items-center cursor-pointer`}
            >
              <Image
                width={32}
                className="w-[16px] h-[16px] opacity-80 hover:opacity-100"
                src={closeButton}
                alt="close button"
              />
            </div>
          </div>
          <div className="flex flex-col flex-grow justify-between h-full">
            <div className="flex flex-col justify-center items-center">
              <Link
                href={'/creation'}
                onClick={toggleDropdown}
                className={`h-12 w-full font-vt323v4 flex justify-center items-center ${
                  pathName === '/creation'
                    ? 'text-maize'
                    : 'text-grayNew hover:text-whiteNew'
                }`}
              >
                CREATION
              </Link>
              <Link
                href={'/marketplace/collections/bitcoin'}
                onClick={toggleDropdown}
                className={`h-12 w-full font-vt323v4 flex justify-center items-center ${
                  pathName === '/marketplace/collections/bitcoin' ||
                  pathName === '/marketplace/listings'
                    ? 'text-maize'
                    : 'text-grayNew hover:text-whiteNew'
                }`}
              >
                MARKETPLACE
              </Link>
              {/* <Link
                href={'/launchpad'}
                onClick={toggleDropdown}
                className={`h-12 w-full font-vt232 flex justify-center items-center ${
                  pathName === '/launchpad'
                    ? 'text-maize'
                    : 'text-grayNew hover:text-whiteNew'
                }`}
              >
                LAUNCHPAD
              </Link> */}
            </div>
            {currentUser.ordinalsWallet && (
              <div className="flex flex-col justify-center items-center">
                <Link
                  href={'/profile/inscriptions'}
                  onClick={toggleDropdown}
                  className={`h-12 w-full font-vt323v4 flex justify-center items-center ${
                    pathName === '/profile/inscriptions'
                      ? 'text-maize'
                      : 'text-grayNew hover:text-whiteNew'
                  }`}
                >
                  PROFILE
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex justify-center items-center mb-4 w-full h-12 font-vt323v4 text-grayNew hover:text-whiteNew"
                >
                  LOG OUT
                </button>
              </div>
            )}
          </div>
          <div
            onClick={() =>
              !currentUser.ordinalsWallet
                ? setCurrentUser({
                    ...currentUser,
                    isConnectWalletModalVisible: true,
                  })
                : ''
            }
            className={`${currentUser.ordinalsWallet ? 'bg-maize' : 'bg-rose'} 
                hover:bg-whiteNew flex justify-center items-center gap-2 px-2 w-full h-12 py-4 relative cursor-pointer`}
          >
            <Image src={WalletImage} className="mt-[0.5px]" alt="WalletImage" />
            <p className="font-vt323v2 text-black text-nowrap">
              {currentUser.ordinalsWallet
                ? `${currentUser.ordinalsWallet
                    .slice(0, 4)
                    .toUpperCase()}...${currentUser.ordinalsWallet
                    .slice(-4)
                    .toUpperCase()}`
                : 'CONNECT WALLET'}
            </p>
          </div>
        </div>
      )}
      <ConnectBtcWalletModal />
    </>
  );
};

export default MenuBurger;
