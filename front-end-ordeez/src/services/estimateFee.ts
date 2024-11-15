export function estimateFee(
  feeRateParam: number,
  btcWalletForInscription: string,
  contentTypeSize: number,
  selectedNftsToInscribeLength: number,
  sizeOfAllElements: number
) {
  const inscriptionBalance = 546; // the balance in each inscription
  const fileCount = selectedNftsToInscribeLength; // the fileCount
  const fileSize = sizeOfAllElements; // the total size of all files
  const feeRate = feeRateParam; // the feeRate
  const feeFileCount = 25; // do not change this

  const balance = inscriptionBalance * fileCount;

  let addrSize = 25 + 1; // p2pkh
  if (
    btcWalletForInscription?.indexOf('bc1q') == 0 ||
    btcWalletForInscription?.indexOf('tb1q') == 0
  ) {
    addrSize = 22 + 1;
  } else if (
    btcWalletForInscription?.indexOf('bc1p') == 0 ||
    btcWalletForInscription?.indexOf('tb1p') == 0
  ) {
    addrSize = 34 + 1;
  } else if (
    btcWalletForInscription?.indexOf('2') == 0 ||
    btcWalletForInscription?.indexOf('3') == 0
  ) {
    addrSize = 23 + 1;
  }

  const baseSize = 88;
  let networkSats =
    ((fileSize + contentTypeSize) / 4 + (baseSize + 8 + addrSize + 8 + 23)) *
    feeRate;
  if (fileCount > 1) {
    networkSats =
      ((fileSize + contentTypeSize) / 4 +
        (baseSize +
          8 +
          addrSize +
          (35 + 8) * (fileCount - 1) +
          8 +
          23 +
          (baseSize + 8 + addrSize + 0.5) * (fileCount - 1))) *
      feeRate;
  }
  let networkSatsByFeeCount =
    ((fileSize + contentTypeSize) / 4 + (baseSize + 8 + addrSize + 8 + 23)) *
    feeRate;

  if (fileCount > 1) {
    networkSatsByFeeCount =
      ((fileSize + contentTypeSize * (feeFileCount / fileCount)) / 4 +
        (baseSize +
          8 +
          addrSize +
          (35 + 8) * (fileCount - 1) +
          8 +
          23 +
          (baseSize + 8 + addrSize + 0.5) *
            Math.min(fileCount - 1, feeFileCount - 1))) *
      feeRate;
  }

  const baseFee = 1999 * Math.min(fileCount, feeFileCount); // 1999 base fee for top 25 files
  const floatFee = networkSatsByFeeCount * 0.0499; // 4.99% extra miner fee for top 25 transations
  const serviceFee = baseFee + floatFee;
  const devFee = 1500; // the fee for developer
  const total = balance + networkSats + serviceFee + devFee;

  return Math.floor(total);
}
