import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import Loader from '../Loader';

const Step1 = ({ setStep }: { setStep: Dispatch<SetStateAction<number>> }) => {
  const [isShowLoader, setIsShowLoader] = useState(false);
  const { disconnect } = useDisconnect();
  const { open: openModal } = useWeb3Modal();
  const { open } = useWeb3ModalState();
  const { address } = useAccount();

  function changeConnection() {
    setIsShowLoader(true);

    setTimeout(() => {
      if (address) {
        disconnect();
        setIsShowLoader(false);
      } else {
        openModal();
      }
    }, 500);
  }
  useEffect(() => {
    if (!open) {
      setIsShowLoader(false);
    }
  }, [open]);

  return (
    <>
      <div className="flex justify-center items-center h-[170px] font-vt323 text-xl tracking-[0.05em]">
        <p className="px-8 w-full text-center text-grayNew">
          <span className="text-whiteNew">
            Connect an EVM-compatible wallet{' '}
          </span>
          from which you intend to create derivatives of your NFTs. Currently, derivatives creation is only available on the
          <span className="text-whiteNew"> Ethereum network.</span>
        </p>
      </div>
      {isShowLoader ? (
        <div className="p-[20.5px]">
          <Loader isSmall />
        </div>
      ) : (
        <button
          onClick={changeConnection}
          className="py-[22.5px] w-full font-vt323v2 text-center text-grayNew hover:text-whiteNew"
        >
          {address ? 'DISCONNECT' : 'SELECT WALLET'}
        </button>
      )}
    </>
  );
};

export default Step1;
