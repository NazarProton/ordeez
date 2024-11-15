'use client'; // This is a client component
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import Loader from '../Loader';
import Background from './Background';
import { CurrentUserContext } from '@/context';
import Image from 'next/image';
import Footer from '../Main/Footer';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  children: ReactNode;
  is404?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ children, is404 }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const pathName = usePathname();

  useEffect(() => {
    setDataLoaded(false);

    const walletAddress = localStorage.getItem('walletAddress');
    const walletAddressBtc = localStorage.getItem('walletAddressBtc');
    const btcWalletForInscription = localStorage.getItem(
      'btcWalletForInscription'
    );
    const ordinalsPublicKey = localStorage.getItem('ordinalsPublicKey');
    const paymentPublicKey = localStorage.getItem('paymentPublicKey');

    setCurrentUser({
      ...currentUser,
      ordinalsWallet: walletAddress || '',
      btcWalletForInscription: btcWalletForInscription || '',
      btcWallet: walletAddressBtc || '',
      publicKey: ordinalsPublicKey || '',
      paymentPublicKey: paymentPublicKey || '',
    });
    setTimeout(() => {
      setDataLoaded(true);
    }, 1000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (is404) return <>{children}</>;

  return (
    <div id="navBar" className="relative w-screen min-w-[360px] min-h-screen ">
      <div className="relative w-screen h-fit overflow-hidden">
        <Background />
        {dataLoaded ? (
          <>{children}</>
        ) : (
          <div className="relative flex flex-col justify-center items-center bg-black w-full min-h-screen">
            <Image
              width={128}
              height={128}
              src="/dinoloader.gif"
              alt="loader"
            />
          </div>
        )}
      </div>
      {dataLoaded && <Footer />}
    </div>
  );
};

export default Navbar;
