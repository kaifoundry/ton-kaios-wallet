import React, { useEffect, useState } from 'react';
import "./ShowMnemonic.scss";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { generateMnemonic } from '../../TonWalletLogic/TonWalletLogic';
import { saveMnmonic } from '../../Redux/action';
import { useDispatch, useSelector } from 'react-redux';

const ShowMnemonic = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [mnemonic, setMnemonic] = useState([]);
    const [showWarring, setShowWarring] = useState(true);

    let reduxMnemonic = useSelector((state) => state.saveMnmonicReducer);

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
            case "ArrowRight":
                nav(1);
                break;
            case "ArrowLeft":
                nav(-1);
                break;
        }
    }

    // const mnemonic = ['gossip', 'exotic', 'museum', 'earn', 'please', 'rose', 'stage', 'creek', 'theory', 'prefer', 'either', 'call', 'captain', 'uniform', 'shield', 'proof', 'apple', 'loan', 'zoo', 'empower', 'evoke', 'churn', 'lawsuit', 'deliver'];

    useEffect(() => {
        if (!reduxMnemonic) {
            handleGenerateMnemonic();
        } else {
            setMnemonic(reduxMnemonic);
        }
    }, [])

    const handleGenerateMnemonic = async () => {
        let mnemonic = await generateMnemonic();
        dispatch(saveMnmonic(mnemonic));
        setMnemonic(mnemonic);
    }

    return (
        <div className='show-mnemonic-page'>
            {!showWarring && <div>
                <p>Write down words and keep them secret. Together with your passphrase they allow access to your wallet.</p>

                <div className="mnemonic">
                    {mnemonic.map((element, index) => {
                        return (
                            <div key={index} className="mnemonic-word"><p>{index + 1 + ".  " + element}</p></div>
                        )
                    })}
                </div>

                <div className="navigation">
                    <button className='items' tabIndex={0} onClick={() => setShowWarring(!showWarring)}><FaArrowLeft /></button>
                    <button className='items' tabIndex={1} onClick={() => navigate("/verify-keywords")}><FaArrowRight /></button>
                </div>
            </div>}

            {showWarring && <div>
                <p style={{textAlign:"justify"}}>Your Secret Recovery Phrase makes it easy to back up and restore
                    your account.</p>
                <div className="warning-inst">
                    <span>WARNING:</span> Never disclose your Secret Recovery Phrase.
                    Anyone with this phrase can take your TON forever. Please
                    store it at a safe location.
                </div>
                <div className="navigation">
                    <button className='items' tabIndex={0} onClick={() => navigate(-1)}><FaArrowLeft /></button>
                    <button className='items' tabIndex={1} onClick={() => setShowWarring(!showWarring)}><FaArrowRight /></button>
                </div>
            </div>}
        </div>
    )
}

export default ShowMnemonic