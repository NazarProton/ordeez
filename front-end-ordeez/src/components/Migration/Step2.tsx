import { CurrentUserContext } from '@/context';
import validate, {
  AddressType,
  Network,
  getAddressInfo,
} from 'bitcoin-address-validation';
import Image from 'next/image';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import DragAndDropImage from '../../../public/drag-and-drop.png';
import Loader from '../Loader';

const Step2 = ({
  setStep,
  setInputError,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setInputError: Dispatch<SetStateAction<boolean>>;
}) => {
  let isMainnet = process.env.IS_MAINNET === 'true';

  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [isError, setIsError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [inputedBtcAddress, setInputedBtcAddress] = useState('');
  const [isShowLoader, setIsShowLoader] = useState(false);

  const checkInputedAdress = (value: string) => {
    const isValidAdress = validate(value);
    if (!value.length) {
      setIsError(false);
      setInputError(true);
      return;
    }

    if (isValidAdress) {
      const addressInfo = getAddressInfo(value);
      const isCorrectAddressType =
        addressInfo.type === AddressType.p2tr &&
        addressInfo.network === (isMainnet ? Network.mainnet : Network.testnet);
      setIsError(!isCorrectAddressType);
      setInputError(!isCorrectAddressType);
    } else {
      setIsError(true);
      setInputError(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // Додано регулярний вираз для перевірки англійських літер і цифр
    const regex = /^[a-zA-Z0-9]*$/;
    if (regex.test(value)) {
      setInputedBtcAddress(value);
      checkInputedAdress(value);
    }
  };

  const confirmBtcAdressForTranscription = () => {
    setCurrentUser({
      ...currentUser,
      btcWalletForInscription: inputedBtcAddress,
    });
    localStorage.setItem('btcWalletForInscription', inputedBtcAddress);
    setIsShowLoader(true);
    setTimeout(() => {
      setStep(3);
      setIsShowLoader(false);
    }, 500);
  };

  useEffect(() => {
    const btcWalletForInscription = localStorage.getItem(
      'btcWalletForInscription'
    );
    setInputedBtcAddress(
      btcWalletForInscription ? btcWalletForInscription : ''
    );
  }, []);

  return (
    <>
      <div className="flex justify-center items-center h-[170px] font-vt323 text-xl tracking-[0.05em]">
        <p className="px-8 w-full text-center text-grayNew">
          <span className="text-whiteNew">
            Specify an ordinals-compatible Bitcoin address of the recipient
          </span>{' '}
          where we will send your derivatives.
        </p>
      </div>
      {isShowLoader ? (
        <div className="p-[52.5px]">
          <Loader isSmall />
        </div>
      ) : (
        <>
          <div className="relative flex justify-center items-center w-full h-16">
            <div className="flex justify-center items-center w-9/12 h-16">
              <input
                onFocus={() =>
                  setShowHint(inputedBtcAddress !== currentUser.ordinalsWallet)
                }
                onBlur={() => setShowHint(false)}
                type="text"
                value={inputedBtcAddress}
                onChange={handleInputChange}
                className={`min-w-full rounded-none w-fit h-10 font-vt323 text-xl tracking-[0.05em] bg-transparent border-b ${
                  isError
                    ? 'border-rose opacity-80 focus:opacity-100'
                    : 'border-onyxNew focus:border-grayNew'
                } text-whiteNew text-center focus:outline-none`}
              />
              {currentUser.ordinalsWallet &&
              showHint &&
              inputedBtcAddress !== currentUser.ordinalsWallet ? (
                <div
                  onMouseDown={() => {
                    setInputedBtcAddress(currentUser.ordinalsWallet);
                    checkInputedAdress(currentUser.ordinalsWallet);
                  }}
                  className={`absolute min-w-fit bg-maize cursor-pointer h-10 p-4 flex -top-9 left-15 justify-start items-center gap-2 text-black font-vt323 text-xl tracking-[0.05em]`}
                >
                  <Image
                    src={DragAndDropImage}
                    className="w-5 h-5"
                    alt="paste image"
                  />
                  <p className="text-center">{currentUser.ordinalsWallet}</p>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          <button
            disabled={isError || !inputedBtcAddress.length}
            onClick={confirmBtcAdressForTranscription}
            className={`w-full text-center ${
              isError
                ? 'text-rose'
                : 'text-grayNew hover:text-whiteNew disabled:text-onyxNew disabled:cursor-not-allowed'
            } py-[22.5px] font-vt323 text-xl tracking-[0.05em]`}
          >
            {isError ? 'INCORRECT ADDRESS' : 'CONFIRM'}
          </button>
        </>
      )}
    </>
  );
};

export default Step2;
