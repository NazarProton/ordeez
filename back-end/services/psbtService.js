const bitcoin = require("bitcoinjs-lib");
const { logger} = require("../modules/logger");
const { getUtxoInfo } = require('../services/unisatClient');
const { getInscription } = require('../services/bestinslotClient');

const models = require('../models');
const { BuyerSigner, SellerSigner } = require("@magiceden-oss/msigner");
const { FullnodeRPC }  = require('@magiceden-oss/msigner/dist/src/vendors/fullnoderpc');
const { getFees, getUtxosByAddress } = require("@magiceden-oss/msigner/dist/src/vendors/mempool");

const TxStatus = require('../enums/txStatus');

const DEFAULT_FEE_RATE = 'hourFee';

async function getOrderItem( inscriptionId ) {
    const inscription = await getInscription(inscriptionId);
    const orderItem = {
        id: inscription.inscription_id,
        contentURI: inscription.content_url,
        contentType: inscription.mime_type,
        contentPreviewURI: inscription.bis_url,
        // sat: number;
        // satName: string;
        // genesisTransaction: string;
        // genesisTransactionBlockTime?: string;
        // genesisTransactionBlockHash?: string;
        // inscriptionNumber: number;
        // meta?: IOrdItemMeta;
        // chain: string;
        // owner: string;

        // dynamic
        location: inscription.satpoint,
        // locationBlockHeight?: number;
        // locationBlockTime?: string;
        // locationBlockHash?: string;
         outputValue: inscription.output_value,
         output: inscription.utxo,
        // mempoolTxId?: string;

        // listing
        // listed: boolean;
        // listedAt?: string;
        // listedPrice: dbListing.get('listingPrice'),
        // listedMakerFeeBp?: number;
        // listedSellerReceiveAddress: dbListing.get('sellerPaymentAddress')
    };

    const dbListing = await models.listing.findOne({
        where: { inscriptionId }
    });

    if (dbListing) {
        orderItem.listedPrice = dbListing.get('listingPrice');
        orderItem.listedSellerReceiveAddress = dbListing.get('sellerPaymentAddress');
    }
    return orderItem;
}

exports.getDummyUtxos = async (buyerAddress) => {
    const itemProvider = new ItemProvider();
    const utxos = await getUtxosByAddress(buyerAddress);
    return await BuyerSigner.selectDummyUTXOs(utxos, itemProvider);
};

exports.generateDummyUtxosPsbt = async (buyerAddress, buyerPublicKey, feeRateTier = 'hourFee') => {
    const itemProvider = new ItemProvider();
    const utxos = await getUtxosByAddress(buyerAddress);
    const selectedDummyUtxos = await BuyerSigner.selectDummyUTXOs(utxos, itemProvider);
    if (selectedDummyUtxos && selectedDummyUtxos.length === 2) {
        return '';
    }
    return await BuyerSigner.generateUnsignedCreateDummyUtxoPSBTBase64(buyerAddress, buyerPublicKey, utxos, feeRateTier, itemProvider);
};

exports.getBuyPsbt = async (buyerAddress, buyerPublicKey, buyerTokenReceiveAddress, inscriptionId, feeRateTier = 'halfHourFee') => {
    try {
        const orderItem = await getOrderItem(inscriptionId);
        const itemProvider = new ItemProvider();
        const utxos = await getUtxosByAddress(buyerAddress);
        const selectedDummyUtxos = await BuyerSigner.selectDummyUTXOs(utxos, itemProvider);

        const price = +orderItem.listedPrice;
        const selectedPaymentUtxos = await BuyerSigner.selectPaymentUTXOs(
            utxos,
            +price, // amount is expected total output (except tx fee)
            2, //vinsLength:
            7, //voutsLength:
            feeRateTier, //feeRateTier
            itemProvider
        );

        const listing = {
            buyer: {
                takerFeeBp: 0, //????
                buyerAddress: buyerAddress,
                buyerTokenReceiveAddress: buyerTokenReceiveAddress,
                feeRateTier: feeRateTier, //????
                // feeRate?: number;
                buyerPublicKey: buyerPublicKey,
                // unsignedBuyingPSBTBase64?: string;
                // unsignedBuyingPSBTInputSize?: number;
                // signedBuyingPSBTHex?: string;
                buyerDummyUTXOs: selectedDummyUtxos,
                buyerPaymentUTXOs: selectedPaymentUtxos,
                // buyerUnconfirmedDummyUTXOs?: utxo[];
                // buyerUnConfirmedPaymentUTXOs?: utxo[];
                // mergedSignedBuyingPSBTHex?: string;
                // platformFeeAddress?: string;
                // txHex?: string;
            },
            seller: {
                makerFeeBp: 0, //????
                // sellerOrdAddress: string;
                price: orderItem.listedPrice,
                ordItem: orderItem,
                sellerReceiveAddress: orderItem.listedSellerReceiveAddress,
                // unsignedListingPSBTBase64?: string;
                // signedListingPSBTBase64?: string;
                // tapInternalKey?: string;
            }
        };
        const psbt = await BuyerSigner.generateUnsignedBuyingPSBTBase64(listing);
        return {
            psbtBase64: psbt.buyer.unsignedBuyingPSBTBase64,
            psbtLength: psbt.buyer.unsignedBuyingPSBTInputSize,
            psbtSigningIndexes: psbt.buyer.unsignedBuyingPSBTSigningIndexes
        };
    } catch (err) {
        logger.error(`Buy psbt error: ${inscriptionId}. ${err}`);
        throw (err);
    }
};

exports.getInitPsbt = async (inscriptionId, price, outputAddress, ordinalAddress, ordinalPublicKey) => {
    const orderItem = await getOrderItem(inscriptionId);

    const listing = {
        seller: {
            makerFeeBp: 0,
            sellerOrdAddress: ordinalAddress,
            price: price,
            ordItem: orderItem,
            sellerReceiveAddress: outputAddress,
            tapInternalKey: ordinalPublicKey
        }
    };

    await SellerSigner.generateUnsignedListingPSBTBase64(listing);
    return listing.seller.unsignedListingPSBTBase64;
};

exports.verifySellerSignedPsbt = async (inscriptionId, signedPsbtBase64) => {
    const orderItem = await getOrderItem(inscriptionId);
    const req = {
        price: orderItem.listedPrice,
        tokenId: orderItem.id,
        sellerReceiveAddress: orderItem.listedSellerReceiveAddress,
        signedListingPSBTBase64: signedPsbtBase64
    };

    await SellerSigner.verifySignedListingPSBTBase64(req, new FeeProvider(), new ItemProvider());
};

exports.broadcastPurchase = async (inscriptionId, feeRateTier = DEFAULT_FEE_RATE) => {

    const dbListing = await models.listing.findOne({
        where: { inscriptionId }
    });

    const signedListingPSBT = dbListing.get('signedListingPSBT');
    const signedBuyerPSBT = dbListing.get('signedBuyerPSBT');
    const mergedPsbtBase64 = BuyerSigner.mergeSignedBuyingPSBTBase64(signedListingPSBT, signedBuyerPSBT);
    // First, decode the PSBT and finalize it to get the raw transaction hex
    const rawTx = await FullnodeRPC.finalizepsbt(mergedPsbtBase64);
    const recommendedFeeRate = await getFees(feeRateTier);
    // Broadcast the raw transaction
    const client = FullnodeRPC.getClient();
    const txid = await client.sendrawtransaction({ hexstring: rawTx.hex, maxfeerate: recommendedFeeRate });
    return txid;
};

exports.broadcastSignedPsbt = async (signedPsbt, feeRateTier = DEFAULT_FEE_RATE) => {
    const recommendedFeeRate = await getFees(feeRateTier);
    const rawTx = await FullnodeRPC.finalizepsbt(signedPsbt);
    const client = FullnodeRPC.getClient();
    const txid = await client.sendrawtransaction({ hexstring: rawTx.hex, maxfeerate: recommendedFeeRate });
    return txid;
};

exports.getTxConfirmations = async (txid) => {
    const client = FullnodeRPC.getClient();
    const txDetails = await client.getrawtransaction({ txid, verbose: true });
    return txDetails.confirmations || 0;
};

exports.getTxStatus = async (txid) => {
    const client = FullnodeRPC.getClient();
    const txDetails = await client.getrawtransaction({ txid, verbose: true });
    if (!txDetails) {
        return TxStatus.FAILED;
    }

    if (txDetails.confirmations >= 6) {
        return TxStatus.CONFIRMED;
    }

    return TxStatus.PENDING;
};

exports.getOutputAddressFromPsbt = (signedPsbtBase64, index = 0) => {
    const psbt = bitcoin.Psbt.fromBase64(signedPsbtBase64);
    if (psbt.txOutputs.length === 0) {
        throw new Error('No outputs in the PSBT');
    }
    const output = psbt.txOutputs[index];
    return output.address;
};

class ItemProvider {
    constructor() {
        // Initialize any necessary data or dependencies here
    }

    async getTokenByOutput(output) {
        const [txId, index] = output.split(':');
        const utxoData = await getUtxoInfo(txId, index);
        if (utxoData && utxoData.inscriptions.length > 0) {
            const orderItem = utxoData.inscriptions[index];
            orderItem.id = orderItem.inscriptionId;
            return orderItem;
        }
        return null;
    }

    async getTokenById(tokenId) {
        return null;
    }
}

class FeeProvider {
    async getMakerFeeBp(maker) {
        return 0;
    }
    async getTakerFeeBp(taker) {
        return 0;
    }
}
