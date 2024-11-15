import { Dispatch, SetStateAction, useContext } from 'react';
import {
  AddressPurpose,
  BitcoinNetworkType,
  GetAddressOptions,
  getAddress,
} from 'sats-connect';
import closeButton from '../../../public/close.svg';
import WalletIconWhite from '../../../public/walletWhite.svg';
import XverseIcon from '../../../public/xverseDiv.png';
import Image from 'next/image';
import { CurrentUserContext } from '@/context';

const ConnectBtcWalletModal = () => {
  let isMainnet = process.env.IS_MAINNET === 'true';
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const getAddressOptions: GetAddressOptions = {
    payload: {
      purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
      message: 'Address for receiving Ordinals and payments',
      network: {
        type: isMainnet
          ? BitcoinNetworkType.Mainnet
          : BitcoinNetworkType.Testnet,
      },
    },
    onFinish: (response: any) => {
      const address = response.addresses[0].address;
      const ordinalsPublicKey = response.addresses[0].publicKey;
      const addressBtc = response.addresses[1].address;
      const paymentPublicKey = response.addresses[1].publicKey;
      localStorage.setItem('ordinalsPublicKey', ordinalsPublicKey);
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('walletAddressBtc', addressBtc);
      localStorage.setItem('paymentPublicKey', paymentPublicKey);
      localStorage.setItem('btcWalletForInscription', address);

      setCurrentUser({
        ...currentUser,
        ordinalsWallet: address,
        btcWallet: addressBtc,
        publicKey: ordinalsPublicKey,
        paymentPublicKey: paymentPublicKey,
        btcWalletForInscription: address,
        isConnectWalletModalVisible: false,
      });
    },
    onCancel: () => {},
  };
  function onClose() {
    setCurrentUser({
      ...currentUser,
      isConnectWalletModalVisible: false,
    });
  }

  const getConnectionBTCWallet = async () => {
    await getAddress(getAddressOptions);
  };

  return (
    <div
      onClick={(event) => {
        event?.stopPropagation();
        onClose();
      }}
      id="default-modal"
      // tabIndex={-1}
      aria-hidden="true"
      className={`${
        currentUser.isConnectWalletModalVisible ? 'flex' : 'hidden'
      } overflow-y-auto overflow-x-hidden fixed inset-0 z-50 backdrop-blur-sm justify-center items-center w-full md:inset-0 h-screen max-h-full`}
    >
      <div
        onClick={(event) => {
          event?.stopPropagation();
        }}
        className="relative border-onyxNew border min-w-[358px]"
      >
        <div className="relative bg-black h-fit overflow-hidden">
          {/* <FuzzyOverlay zindex={50} /> */}
          <div className="flex justify-between items-center border-onyxNew mb-6 p-4 border-b">
            <div className="flex justify-between items-center gap-2 w-full">
              <Image src={WalletIconWhite} alt="WalletIcon" />
              <h3 className="font-vt323 text-whiteNew text-xl tracking-[0.05em]">
                CONNECT WALLET
              </h3>
              <button
                onClick={onClose}
                type="button"
                className="justify-center items-center bg-transparent opacity-80 hover:opacity-100 rounded-lg w-fit h-6 text-sm"
                data-modal-hide="default-modal"
              >
                <Image
                  className="w-[14px] h-[14px]"
                  src={closeButton}
                  alt="CloseButton"
                />
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={getConnectionBTCWallet}
              data-modal-hide="default-modal"
              type="button"
              className="flex items-center gap-4 hover:bg-whiteNew hover:bg-opacity-10 mx-4 mb-4 px-4 py-3 w-full font-vt323 text-whiteNew text-xl tracking-[0.05em]"
            >
              <Image
                width={32}
                className="object-cover "
                src={XverseIcon}
                alt="CloseButton"
              />
              XVERSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectBtcWalletModal;
