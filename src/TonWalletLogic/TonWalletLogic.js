import { Address } from '../tonweb/src/utils';

const TonWeb = require('../tonweb/src/index').default;
const tonMnemonic = require("tonweb-mnemonic");

const provider = "https://tonwalletapi.kaifoundry.com/api/v1/bridge/jsonRPC";
// const provider = "https://ton-backend-api-testing.onrender.com/json-rpc";
// const provider = "https://testnet.toncenter.com/api/v2/jsonRPC";

let wallets = new TonWeb.Wallets
let WalletClass = wallets.all.v3R2;
let httpProvide = new TonWeb.HttpProvider(provider);

const importWalletFromMnemonic = async (mnemonic) => {
    let mnemonicArray = mnemonic.split(" ");
    const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonicArray);

    let walletContract = new WalletClass(provider, {
        publicKey: keyPair.publicKey,
        wc: 0
    });

    let address = await walletContract.getAddress();
    address = address.toString(true, true, true);
    return [keyPair, address];
}


const generateMnemonic = async () => {
    // const mnemonic = ['gossip', 'exotic', 'museum', 'earn', 'please', 'rose', 'stage', 'creek', 'theory', 'prefer', 'either', 'call', 'captain', 'uniform', 'shield', 'proof', 'apple', 'loan', 'zoo', 'empower', 'evoke', 'churn', 'lawsuit', 'deliver'];
    // let keypair = await tonMnemonic.validateMnemonic(mnemonic)
    // console.log("keypair",keypair)
    const mnemonic = await tonMnemonic.generateMnemonic();
    return mnemonic;
}


const fetchBalance = async (address) => {
    let balance = await httpProvide.getBalance(address);
    return balance
}

const switchWalletAddressFormate = async (keyPair, formateType) => {
    let WalletClass = wallets.all[formateType];
    let walletContract = new WalletClass(provider, {
        publicKey: keyPair.publicKey,
        wc: 0
    });

    let address = await walletContract.getAddress();
    address = address.toString(true, true, true);
    return address;
}
const deployAccount = async (keys) => {
    try {
        let secretKey = Uint8Array.from(keys.secretKey);
        let publicKey = Uint8Array.from(keys.publicKey);
        let keyPair = { secretKey, publicKey };
        let walletContract = new WalletClass(provider, {
            publicKey: keyPair.publicKey,
            wc: 0
        });
        await walletContract.deploy(httpProvide, keyPair.secretKey).send();
    } catch (error) {

    }
}

const getAllTransaction = async (address, limit = 1000000000000) => {
    let transaction = await httpProvide.getTransactions(address, limit)
    return transaction
}

const getWalletInfo = async (address) =>{
    let walletInfo = await httpProvide.getWalletInfo(address);
    return walletInfo;
}

const createAndSendTransaction = async (keys, data,address) => {
    try {
        let secretKey = Uint8Array.from(keys.secretKey);
        let publicKey = Uint8Array.from(keys.publicKey);
        let keyPair = { secretKey, publicKey };
        let walletInfo = await getWalletInfo(address);
        let seqno = 0;
        let toAddress = data.TO;
        
        if(await getWalletInfo(data.TO).account_state !== "active"){
            toAddress = (new Address(toAddress)).toString(true, true, false)
        }
        let walletContract = new WalletClass(provider, {
            publicKey: keyPair.publicKey,
            wc: 0
        });

        if(walletInfo.account_state === 'active'){
            seqno = await walletContract.methods.seqno().call(httpProvide) || 0; // Get Seqno
        }

        let transfer = walletContract.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: toAddress, //EQDjVXa_oltdBP64Nc__p397xLCvGm2IcZ1ba7anSW0NAkeP
            amount: TonWeb.utils.toNano(data.VALUE), // 0.01 TON
            seqno: seqno,
            payload: '',
            sendMode: 3,
            stateInit: await walletContract.createStateInit().stateInit,
            expireAt: Math.floor(Date.now() / 1000) + 60
        }, httpProvide);


        const transferFee = await transfer.estimateFee();   // get estimate fee of transfer
        // console.log("transferFee", transferFee)


        const transferSended = await transfer.send();  // send transfer query to blockchain
        // console.log("transferSended", transferSended)

        const transferQuery = await transfer.getQuery(); // get transfer query Cell
        // console.log("transferQuery", transferQuery)

        return transferQuery;

    } catch (err) {
        let error = err.stack ? err.stack : err;
        throw new Error(error);
    }
}

const createTransactionAndProvideAuthentication = async (keys) => {
    try {
        let secretKey = Uint8Array.from(keys.secretKey);
        let publicKey = Uint8Array.from(keys.publicKey);
        let keyPair = { secretKey, publicKey };
        let walletContract = new WalletClass(provider, {
            publicKey: keyPair.publicKey,
            wc: 0
        });
        let authentication = await walletContract.createInitExternalMessage(secretKey);
        return authentication;
    } catch (err) {
        let error = err.stack ? err.stack : err;
        throw new Error(error);
    }
}

export {
    importWalletFromMnemonic,
    generateMnemonic,
    fetchBalance,
    switchWalletAddressFormate,
    getAllTransaction,
    createAndSendTransaction,
    createTransactionAndProvideAuthentication,
    deployAccount,
    getWalletInfo
}