import { UserBalanceStatusType } from '@/components/Profile/NftModalsForSale';
import { backBaseUrl } from '@/configs';
import { ICurrentUser } from '@/context';
import { MarketplaceNftProps } from '@/utils/types';
import axios from 'axios';
import { Transaction } from 'bitcoinjs-lib/src/transaction';
import { error } from 'console';
import { Dispatch, SetStateAction } from 'react';
import { BitcoinNetworkType, signTransaction } from 'sats-connect';

export enum FeeRate {
  LOW = 'hourFee',
  MEDIUM = 'halfHourFee',
  HIGH = 'fastestFee',
}

async function getDummyUtxos(
  currentUser: ICurrentUser,
  feeRateTier: FeeRate,
  setUserBalanceStatus: Dispatch<SetStateAction<UserBalanceStatusType>>
) {
  try {
    const response = await axios.post(
      `${backBaseUrl}/api/marketplace/dummy-utxos-psbt`,
      {
        buyerPaymentAddress: currentUser.btcWallet,
        buyerPaymentPublicKey: currentUser.paymentPublicKey,
        feeRateTier,
      }
    );
    return response.data.data.psbt;
  } catch (error: any) {
    if (error.response.data.code === 'InsufficientFundsError') {
      setUserBalanceStatus('INSUFFICIENT FUNDS');
    } else {
      setUserBalanceStatus('SERVER ERROR');
    }
    console.error('Error fetching dummy UTXOs:', error);
  }
}

export function buyNft(
  elementNft: MarketplaceNftProps,
  setisShownTransactionLoader: Dispatch<SetStateAction<boolean>>,
  currentUser: ICurrentUser,
  setCurrentUser: Dispatch<SetStateAction<ICurrentUser>>,
  choosedPriceVariant: number,
  changeData: any,
  setUserBalanceStatus: Dispatch<SetStateAction<UserBalanceStatusType>>,
  rigthFieldName?: string,
  CloseModal?: () => void
) {
  try {
    setisShownTransactionLoader(true);
    let isMainnet = process.env.IS_MAINNET === 'true';
    const feeRateTier: FeeRate =
      choosedPriceVariant === 1
        ? FeeRate.LOW
        : choosedPriceVariant === 2
        ? FeeRate.MEDIUM
        : FeeRate.HIGH;
    getDummyUtxos(currentUser, feeRateTier, setUserBalanceStatus).then(
      (psbt) => {
        if (psbt) {
          const buyerInput = {
            address: currentUser.btcWallet,
            signingIndexes: [0],
          };

          const payload = {
            network: {
              type: isMainnet
                ? BitcoinNetworkType.Mainnet
                : BitcoinNetworkType.Testnet,
            },
            message: 'Sign Buyer Transaction',
            psbtBase64: psbt,
            broadcast: false,
            inputsToSign: [buyerInput],
          };
          signTransaction({
            payload,
            onFinish: (response) => {
              axios
                .post(`${backBaseUrl}/api/marketplace/broadcast-psbt`, {
                  signedPsbt: response.psbtBase64,
                  feeRateTier,
                })
                .then(({ data }) => {
                  if (data.data.txId) {
                    BuyNft();
                  } else {
                    console.log('txId error');
                    setisShownTransactionLoader(false);
                  }
                });
            },
            onCancel: () => setisShownTransactionLoader(false),
          });
        } else if (typeof psbt === 'string' && psbt === '') {
          BuyNft();
        } else {
          setisShownTransactionLoader(false);
        }
        function BuyNft() {
          axios
            .post(`${backBaseUrl}/api/marketplace/create-buy-offer`, {
              id: elementNft.inscription_id,
              buyerPaymentAddress: currentUser.btcWallet,
              buyerOrdinalAddress: currentUser.ordinalsWallet,
              buyerPaymentPublicKey: currentUser.paymentPublicKey,
              buyerOrdinalPublicKey: currentUser.publicKey,
              feeRateTier,
            })
            .then(({ data }) => {
              const buyerPaymentInput = {
                address: currentUser.btcWallet,
                signingIndexes: data.data.psbtSigningIndexes,
                sigHash: Transaction.SIGHASH_DEFAULT,
              };
              const buyerOrdinalInput = {
                address: currentUser.ordinalsWallet,
                signingIndexes: [],
                sigHash: Transaction.SIGHASH_DEFAULT,
              };
              const payload = {
                network: {
                  type: isMainnet
                    ? BitcoinNetworkType.Mainnet
                    : BitcoinNetworkType.Testnet,
                },
                message: 'Sign Buyer Transaction',
                psbtBase64: data.data.psbtBase64,
                broadcast: false,
                inputsToSign: [buyerPaymentInput, buyerOrdinalInput],
              };

              try {
                signTransaction({
                  payload,
                  onFinish: (response) => {
                    try {
                      axios
                        .post(
                          `${backBaseUrl}/api/marketplace/submit-buy-offer`,
                          {
                            id: elementNft.inscription_id,
                            psbtBase64: response.psbtBase64,
                            feeRateTier,
                          }
                        )
                        .then(() => {
                          const newNftArray = changeData(true);
                          if (newNftArray && rigthFieldName) {
                            setCurrentUser({
                              ...currentUser,
                              [rigthFieldName]: newNftArray,
                            });
                          }
                          if (CloseModal) {
                            CloseModal();
                          }
                        });
                    } catch (error) {
                      setisShownTransactionLoader(false);
                    }
                  },
                  onCancel: () => {
                    setisShownTransactionLoader(false);
                  },
                });
              } catch (error) {
                setisShownTransactionLoader(false);
              }
            })
            .catch((error) => {
              if (error.response.data.code === 'InsufficientFundsError') {
                setUserBalanceStatus('INSUFFICIENT FUNDS');
              } else {
                setUserBalanceStatus('SERVER ERROR');
              }
              setisShownTransactionLoader(false);
            });
        }
      }
    );
  } catch (error) {
    setisShownTransactionLoader(false);
  }
}
