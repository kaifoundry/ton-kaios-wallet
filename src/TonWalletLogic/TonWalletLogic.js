const TonWeb = require('../tonweb/src/index').default;
const tonMnemonic = require("tonweb-mnemonic");

let wallets = new TonWeb.Wallets
let WalletClass = wallets.all.v3R2;
let httpProvide = new TonWeb.HttpProvider("http://tonwalletapi.kaifoundry.com/api/v1/bridge/jsonRPC");

const importWalletFromMnemonic = async (mnemonic) => {
    let mnemonicArray = mnemonic.split(" ");
    const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonicArray);

    // let keyPair = {
    //     publicKey: [77, 69, 34, 112, 178, 54, 213, 206, 112, 221, 165, 35, 0, 25, 67, 251, 205, 92, 51, 211, 202, 47, 176, 205, 12, 230, 133, 226, 144, 15, 116, 214],
    //     secretKey: [215, 100, 160, 86, 43, 211, 96, 190, 175, 150, 136, 34, 211, 231, 56, 24, 201, 2, 65, 185, 16, 17, 54, 85, 197, 107, 87, 97, 224, 193, 239, 115, 77, 69, 34, 112, 178, 54, 213, 206, 112, 221, 165, 35, 0, 25, 67, 251, 205, 92, 51, 211, 202, 47, 176, 205, 12, 230, 133, 226, 144, 15, 116, 214]
    // }
    let walletContract = new WalletClass("http://tonwalletapi.kaifoundry.com/api/v1/bridge/jsonRPC", {
        publicKey: keyPair.publicKey
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

export {
    importWalletFromMnemonic,
    generateMnemonic,
    fetchBalance
}