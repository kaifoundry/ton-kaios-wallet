import React, { useEffect, useState } from 'react';
import "./ExternalWallet.scss";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { importWalletFromMnemonic } from '../../TonWalletLogic/TonWalletLogic';
import { encryptData, saveData } from '../../commanFunctions/commanFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { saveAddress } from '../../Redux/action';


const ExternalWallet = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [mnemonic, setMnemonic] = useState("");
    const [password, setPassword] = useState(
        useSelector((state) => state.savePasswordReducer)
    );

    function nav(move) {
        try {
            const currentIndex = document.activeElement.tabIndex;
            const next = currentIndex + move;
            const items = document.querySelectorAll(".items");
            const targetElement = items[next];
            targetElement.focus();
        } catch (e) {
            console.log("Home Error:", e);
        }
    }

    useEffect(() => {
        document.body.addEventListener("keydown", handleKeydown);
        return () => document.body.removeEventListener("keydown", handleKeydown);
    }, []);

    function handleKeydown(e) {
        e.stopImmediatePropagation();
        switch (e.key) {
            case "ArrowUp":
                nav(-1);
                break;
            case "ArrowDown":
                nav(1);
                break;
        }
    }


    const handleImportWallet = async () => {
        if (!mnemonic.length) {
            alert("Please enter your mnemonic for import wallet.");
            return
        }

        let valid = checkWords();
        if (valid) {
            handleGenerateWallet();
        } else {
            alert("Please Enter valid mnemonic.")
        }
    }

    const checkWords = () => {
        let mnemonicArray = mnemonic.split(" ");
        if (mnemonicArray.length === 24) {
            return true;
        }
        return false;
    }


    const handleGenerateWallet = async () => {
        let walletResponse = await importWalletFromMnemonic(mnemonic);
        dispatch(saveAddress(walletResponse[1]));
        saveData("t-address", walletResponse[1]);
        let encrypt = encryptData(password, walletResponse[0]);
        let encryptMnemonic = encryptData(password, mnemonic);
        saveData("t-ek", encrypt);
        saveData("t-em", encryptMnemonic);
        navigate("/wallet");
    }

    return (
        <div className='external-wallet-page'>
            <p>
                IMPORT EXTERNAL WALLET
                <br />
                <small>Enter your mnemonic key (24 Words) to import a wallet from another provider.</small>
            </p>

            <div className="form">
                <label>Enter your code here</label>
                <input value={mnemonic} onChange={(e) => setMnemonic(e.target.value)} tabIndex={0} className='items' type="text" />
            </div>
            <div className="navigation">
                <button onClick={() => navigate(-1)} tabIndex={1} className='items'><FaArrowLeft /></button>
                <button onClick={() => handleImportWallet()} tabIndex={2} className='items'><FaArrowRight /></button>
            </div>
        </div>
    )
}

export default ExternalWallet