import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import Loader from '../Loader';
import { CurrentUserContext } from '@/context';
import FeeChooseOption from './FeeChooseOption';
import { useAccount } from 'wagmi';
import axios from 'axios';
import {
  BitcoinNetworkType,
  SendBtcTransactionOptions,
  sendBtcTransaction,
} from 'sats-connect';
import { estimateFee } from '@/services/estimateFee';
import { getTransactionFee } from '@/services/getTransactionFee';
import { backBaseUrl } from '@/configs';
import { Nft } from '@/utils/types';

export interface IFeeData {
  economyFee?: number;
  fastestFee?: number;
  halfHourFee?: number;
  hourFee?: number;
  minimumFee?: number;
}

const Step4 = ({
  setStep,
  selectedNftsToInscribe,
  sizeOfAllElements,
  contentTypeSize,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  selectedNftsToInscribe: Nft[];
  sizeOfAllElements: number;
  contentTypeSize: number;
}) => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [chosedFeeOption, setChosedFeeOption] = useState(0);
  const { address, chainId } = useAccount();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feeData, setFeeData] = useState<IFeeData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(0);
  const [isSufficientBallance, setIsSufficientBallance] = useState(0);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [isShownTransactionLoader, setIsShownTransactionLoader] =
    useState(false);
  let isMainnet = process.env.IS_MAINNET === 'true';

  useEffect(() => {
    getTransactionFee(setFeeData, setIsLoading, false);
  }, []);

  function saveOrder(id: string, txId: string) {
    try {
      axios.patch(`${backBaseUrl}/api/nft/order/${id}`, { txId });
    } catch (error) {
      console.log(error);
    }
    setIsShownTransactionLoader(false);
  }

  const sendPayment = async () => {
    setIsShownTransactionLoader(true);
    const dataToPost: any = [];
    let orderId = '';
    selectedNftsToInscribe.map((el) => {
      const newObject = {
        chainId: chainId,
        collectionAddress: el.contract.address,
        collectionName: el.contract.openSeaMetadata.collectionName
          ? el.contract.openSeaMetadata.collectionName
          : el.collection?.name
          ? el.collection?.name
          : el.contract?.name,
        tokenId: el.tokenId,
        tokenName: el.name
          ? el.name
          : el.raw.metadata.name
          ? el.raw.metadata.name
          : `${el.contract?.symbol} #${el.tokenId}`,
        imageUrl: el.image.cachedUrl,
      };
      dataToPost.push(newObject);
    });
    axios
      .post(`${backBaseUrl}/api/nft/order`, {
        feeRate:
          chosedFeeOption == 1
            ? feeData.hourFee
            : chosedFeeOption == 2
            ? feeData.halfHourFee
            : feeData.fastestFee,
        receiveAddress: currentUser.btcWalletForInscription,
        migrator: currentUser.ordinalsWallet,
        nfts: dataToPost,
      })
      .then(({ data }) => {
        orderId = data.data.orderId;

        let sendBtcOptions: SendBtcTransactionOptions = {
          payload: {
            network: {
              type: isMainnet
                ? BitcoinNetworkType.Mainnet
                : BitcoinNetworkType.Testnet,
            },
            recipients: [
              {
                address: data.data.payAddress,
                amountSats: BigInt(data.data.amount),
              },
            ],
            senderAddress: currentUser.btcWallet,
          },
          onFinish: (txId: any) => {
            saveOrder(orderId, txId);
            setStep(5);
            setIsShownTransactionLoader(false);
          },
          onCancel: () => {
            setIsShownTransactionLoader(false);
          },
        };

        sendBtcTransaction(sendBtcOptions);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    axios('https://mempool.space/api/v1/prices').then((res) => {
      setPrice(res.data.USD / 1e8);
    });
    getWalletBalance(currentUser.btcWallet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getWalletBalance(address: string) {
    try {
      const { data } = await axios.get(
        `${backBaseUrl}/api/indexer/${address}/balance`
      );
      setUserBalance(data.data.btcPendingSatoshi + data.data.btcSatoshi);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  }

  function calculateFee(type: number) {
    if (feeData.hourFee && feeData.halfHourFee && feeData.fastestFee) {
      return estimateFee(
        type == 1
          ? feeData.hourFee
          : type == 2
          ? feeData.halfHourFee
          : type == 3
          ? feeData.fastestFee
          : 1,
        currentUser.btcWalletForInscription,
        contentTypeSize,
        selectedNftsToInscribe.length,
        sizeOfAllElements
      );
    }
    return estimateFee(
      1,
      currentUser.btcWalletForInscription,
      contentTypeSize,
      selectedNftsToInscribe.length,
      sizeOfAllElements
    );
  }

  return (
    <>
      {isLoading ||
      (!feeData.halfHourFee &&
        !feeData.hourFee &&
        !feeData.fastestFee &&
        !price &&
        !userBalance) ? (
        <>
          <div className="min-w-full">
            <div className="flex flex-col justify-center items-center w-full h-[170px] font-vt323 text-whiteNew text-xl tracking-[0.05em]">
              Loading...
            </div>
            <div className="flex flex-col justify-center items-center w-full h-[137px] text-whiteNew">
              <Loader isSmall={true} dataLoaded={!isLoading} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={`flex justify-center items-center font-vt323 text-xl tracking-[0.05em] h-[170px]`}
          >
            <p className="px-8 w-full text-center text-grayNew">
              <span className="text-whiteNew">Set your transaction fee.</span>{' '}
              Bitcoin network fees are needed to create inscriptions, and the
              higher the fee, the faster the transaction will be completed.
            </p>
          </div>
          <div className={`w-full h-[269px] flex justify-between gap-4 px-8 `}>
            <FeeChooseOption
              variant="LOW"
              satsPerVByte={feeData.hourFee ? Math.floor(feeData.hourFee) : ''}
              countOfSatoshi={calculateFee(1)}
              price={feeData.hourFee ? price * calculateFee(1) : 0}
              trxTime={'Within an hour.'}
              checked={chosedFeeOption === 1}
              setChosedFeeOption={setChosedFeeOption}
              setIsSufficientBalance={setIsSufficientBallance}
              userBalance={userBalance}
            />
            <FeeChooseOption
              variant="MEDIUM"
              satsPerVByte={
                feeData.halfHourFee ? Math.floor(feeData.halfHourFee) : ''
              }
              countOfSatoshi={calculateFee(2)}
              price={feeData.halfHourFee ? price * calculateFee(2) : 0}
              trxTime={'Within half an hour.'}
              checked={chosedFeeOption === 2}
              setChosedFeeOption={setChosedFeeOption}
              setIsSufficientBalance={setIsSufficientBallance}
              userBalance={userBalance}
            />
            <FeeChooseOption
              variant="HIGH"
              satsPerVByte={
                feeData.fastestFee ? Math.floor(feeData.fastestFee) : ''
              }
              countOfSatoshi={calculateFee(3)}
              price={feeData.fastestFee ? price * calculateFee(3) : 0}
              trxTime={'Within a few minutes.'}
              checked={chosedFeeOption === 3}
              setChosedFeeOption={setChosedFeeOption}
              setIsSufficientBalance={setIsSufficientBallance}
              userBalance={userBalance}
            />
          </div>

          <div>
            {address &&
            currentUser.ordinalsWallet &&
            currentUser.btcWalletForInscription ? (
              <>
                {isShownTransactionLoader ? (
                  <div className="flex flex-col justify-center items-center w-full h-[73px] text-whiteNew">
                    <Loader
                      isSmall={true}
                      dataLoaded={!isShownTransactionLoader}
                    />
                  </div>
                ) : (
                  <button
                    disabled={!chosedFeeOption || isSufficientBallance === 2}
                    onClick={() => {
                      setCurrentUser({
                        ...currentUser,
                        lastTransactionId:
                          'a7ae560eadac7b7f65f5b380e557efb1c07769c390c9c80205a9bd234d4d968b',
                      });
                      sendPayment();
                    }}
                    className={`w-full font-vt323 text-xl tracking-[0.05em] text-grayNew hover:text-whiteNew ${
                      isSufficientBallance === 2
                        ? 'disabled:text-rose disabled:hover:text-rose'
                        : 'disabled:text-onyxNew disabled:hover:text-onyxNew'
                    } py-[22.5px]`}
                  >
                    {isSufficientBallance === 2
                      ? 'INSUFFICIENT FUNDS'
                      : 'CONFIRM'}
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    setCurrentUser({
                      ...currentUser,
                      isConnectWalletModalVisible: true,
                    })
                  }
                  className="py-[22.5px] w-full font-vt323 text-grayNew text-xl hover:text-whiteNew tracking-[0.05em]"
                >
                  CONNECT WALLET
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Step4;
