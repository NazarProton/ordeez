
const {
    getInitPsbt,
    getBuyPsbt,
    getDummyUtxos,
    generateDummyUtxosPsbt,
    broadcastPurchase,
    verifySellerSignedPsbt
} = require('../services/psbtService');

// const buyerAddress = '32nZ9LVBmCnJKtFg9BoF7kbRh1fyJc1XHB'; //2
// const buyerPublicKey = '020a9733fb09fb4f17549e764a75315fb5900e0092879efa0f1415d67f75c8a50c'; //2
// const feeRateTier = 'hourFee'; //2
// const buyerTokenReceiveAddress = 'bc1peus3jmxku6fqd8qlcjaw7s4qfjax00g5hrglun5srlknm0gyjehs9hduwr';
// const inscriptionId = '7d818ac723b2122b95ded087b926223ad9a116b67f3828df32937678fbfd4693i0';

const buyerAddress = '3ANhQcmxU7QBHoVpscafsAX5RFwuN2frUF'; //2
const buyerPublicKey = '0219bdc44b51435adaaf9b133dcd6c80cdc1bda4d9e05b7cb141580c3f53c4b3bd'; //2
const feeRateTier = 'hourFee'; //2
const buyerTokenReceiveAddress = 'bc1p84gfrzzvzx89hf862ysz9nxsw9vwagd769g5d0kllydxkfsufwhstsdqd4';
const inscriptionId = '3be399f99010314266bd5cf78c495c51389b8917ae530af0c3b393ca619107edi0';

const sellerAddress = '32nZ9LVBmCnJKtFg9BoF7kbRh1fyJc1XHB';
const sellInscriptionId = 'b07d55ced0da4f00fe10f6c9a6f04d5a0182bd6b78cb7da0db2e54fd66148bf2i0';
const sellerOrdinalAddress = 'bc1peus3jmxku6fqd8qlcjaw7s4qfjax00g5hrglun5srlknm0gyjehs9hduwr';
const price = '100000000';

const signedPsbt = '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';


describe('getBuyPsbt', () => {
    test('should return PSBT', async () => {
        const result = await getBuyPsbt(buyerAddress, buyerPublicKey, buyerTokenReceiveAddress, inscriptionId, feeRateTier);
        expect(result).toBeDefined();
    });
});

describe('generateDummyUtxosPsbt', () => {
    test('should return PSBT', async () => {
        const result = await generateDummyUtxosPsbt(buyerAddress, buyerPublicKey);
        expect(result).toBeDefined();
    });
});

describe('broadcastPurchase', () => {
    test('should return PSBT', async () => {
        const result = await broadcastPurchase(inscriptionId);
        expect(result).toBeDefined();
    });
});

describe('getInitPsbt', () => {
    test('should return PSBT', async () => {
        const result = await getInitPsbt(sellInscriptionId, price, sellerAddress, sellerOrdinalAddress);
        expect(result).toBeDefined();
    });
});

describe('verifySellerSignedPsbt', () => {
    test('should return PSBT', async () => {

        const inscriptionId = 'd5d697691ba7335230813e416b39b7388af54110a8e64590e1a344bcde372ac4i0';
        const result = await verifySellerSignedPsbt(inscriptionId, signedPsbt);
        expect(result).toBeDefined();
    });
});