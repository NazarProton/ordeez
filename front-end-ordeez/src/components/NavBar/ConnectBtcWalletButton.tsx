import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import WalletImage from '../../../public/wallet.svg';
import ConnectBtcWalletModal from './ConnectBtcWalletModal';
import { CurrentUserContext, ICurrentUser } from '@/context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const ConnectBtcWalletButton = ({ isBurger }: { isBurger: boolean }) => {
  const pathName = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
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

  useEffect(() => {
    if (currentUser.btcWallet) {
      setDropdownVisible(false);
    }
  }, [currentUser.btcWallet]);

  return (
    <div className="relative">
      <div
        onClick={() => {
          if (!currentUser.ordinalsWallet) {
            setCurrentUser({
              ...currentUser,
              isConnectWalletModalVisible: true,
            });
          }
          toggleDropdown();
        }}
        onMouseEnter={() => setDropdownVisible(true)}
        className={`${
          currentUser.ordinalsWallet ? 'bg-maize' : 'bg-rose'
        } hover:bg-whiteNew flex justify-center items-center gap-2 w-[192px]  h-12 cursor-pointer`}
      >
        <Image src={WalletImage} className="mt-[0.5px]" alt="WalletImage" />
        <p className="flex justify-center items-center font-vt323v2 text-black text-nowrap">
          {currentUser.ordinalsWallet
            ? `${currentUser.ordinalsWallet
                .slice(0, 4)
                .toUpperCase()}...${currentUser.ordinalsWallet
                .slice(-4)
                .toUpperCase()}`
            : 'CONNECT WALLET'}
        </p>
      </div>
      {currentUser.ordinalsWallet && (
        <div
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
          className={`${
            isDropdownVisible ? 'flex' : 'hidden'
          } absolute z-[5] -top-[15px] justify-between items-center flex-col bg-black min-w-[224px] -left-4 outline outline-1 outline-onyxNew`}
        >
          <div
            onClick={() => {
              if (!currentUser.ordinalsWallet) {
                setCurrentUser({
                  ...currentUser,
                  isConnectWalletModalVisible: true,
                });
              }
              toggleDropdown();
            }}
            onMouseEnter={() => setDropdownVisible(true)}
            className={`${
              currentUser.ordinalsWallet ? 'bg-maize ' : 'bg-rose'
            }  hover:bg-whiteNew flex mt-[15px] justify-center items-center gap-2 w-[192px] min-h-12 cursor-pointer`}
          >
            <p className="flex justify-center gap-2 items-center font-vt323v2 text-black text-nowrap">
              <Image
                src={WalletImage}
                className="mt-[0.5px]"
                alt="WalletImage"
              />
              {currentUser.ordinalsWallet
                ? `${currentUser.ordinalsWallet
                    .slice(0, 4)
                    .toUpperCase()}...${currentUser.ordinalsWallet
                    .slice(-4)
                    .toUpperCase()}`
                : 'CONNECT WALLET'}
            </p>
          </div>
          <Link
            href={'/profile/inscriptions'}
            onClick={toggleDropdown}
            className={`text-center font-vt323v4 w-full py-2  pt-5 -mt-[1px]  ${
              pathName?.includes('profile')
                ? 'text-maize'
                : 'text-grayNew hover:text-whiteNew'
            }`}
          >
            PROFILE
          </Link>
          <button
            onClick={handleLogout}
            className="bg-black py-2 mb-4 font-vt323v4 w-full text-grayNew hover:text-whiteNew"
          >
            LOG OUT
          </button>
        </div>
      )}
      <ConnectBtcWalletModal />
    </div>
  );
};

export default ConnectBtcWalletButton;
