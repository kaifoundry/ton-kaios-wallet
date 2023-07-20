import React, { useEffect, useState } from 'react';
import "./VerifyMnemonic.scss";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { importWalletFromMnemonic } from '../../TonWalletLogic/TonWalletLogic';
import { saveAddress, savePassword } from '../../Redux/action';
import { encryptData, saveData } from '../../commanFunctions/commanFunctions';

const VerifyMnemonic = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let reduxMnemonic = useSelector((state) => state.saveMnmonicReducer);
    const [password, setPassword] = useState(
        useSelector((state) => state.savePasswordReducer)
    );

    const [firstMnemonic, setFirstMnemonic] = useState("");
    const [secondMnemonic, setSecondMnemonic] = useState("");
    const [thirdMnemonic, setThirdMnemonic] = useState("");
    const [noOfCount, setNoOfCount] = useState(1);

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


    useEffect(() => {
        if (!reduxMnemonic) {
            navigate("/");
        }
    }, [])


    const handleMnemonicValidation = () => {
        if (noOfCount === 1 && firstMnemonic === reduxMnemonic[8]) {
            setNoOfCount(noOfCount + 1);
            const items = document.querySelectorAll(".items");
            const targetElement = items[0];
            targetElement.focus();
            return
        }
        if (noOfCount === 2 && secondMnemonic === reduxMnemonic[19]) {
            setNoOfCount(noOfCount + 1);
            const items = document.querySelectorAll(".items");
            const targetElement = items[0];
            targetElement.focus();
            return
        }
        if (noOfCount === 3 && thirdMnemonic === reduxMnemonic[5]) {
            handleGenerateWallet();
            return
        }
        alert("Please enter valid mnemonic.");
    }


    const handleGenerateWallet = async () => {
        let walletResponse = await importWalletFromMnemonic(reduxMnemonic.join(" "));
        dispatch(saveAddress(walletResponse[1]));
        saveData("t-address", walletResponse[1]);
        let encrypt = encryptData(password, walletResponse[0]);
        let encryptMnemonic = encryptData(password, reduxMnemonic.join(" "));
        saveData("t-ek", encrypt);
        saveData("t-em", encryptMnemonic);
        navigate("/wallet");
    }

    return (
        <div className='verify-mnemonic-page'>
            {noOfCount === 1 && <div>
                <p><b>Verify Keywords</b>
                    <br />
                    <small>Please Select the 9th keyword!</small>
                </p>

                <div className="form">
                    <div className="form-check">
                        <input tabIndex={0} className='items' type="radio" checked={reduxMnemonic[8] === firstMnemonic} value={reduxMnemonic[8]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setFirstMnemonic(event.target.value);
                            }
                        }} name="mnemonic" />
                        <label>{reduxMnemonic[8]}</label>
                    </div>
                    <div className="form-check">
                        <input tabIndex={1} className='items' type="radio" checked={reduxMnemonic[2] === firstMnemonic} value={reduxMnemonic[2]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setFirstMnemonic(event.target.value);
                            }
                        }} name="mnemonic2" />
                        <label>{reduxMnemonic[2]}</label>
                    </div>
                    <div className="form-check">
                        <input tabIndex={2} className='items' type="radio" checked={reduxMnemonic[13] === firstMnemonic} value={reduxMnemonic[13]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setFirstMnemonic(event.target.value);
                            }
                        }} name="mnemonic3" />
                        <label>{reduxMnemonic[13]}</label>
                    </div>
                    <div className="form-check">
                        <input tabIndex={3} className='items' type="radio" checked={reduxMnemonic[17] === firstMnemonic} value={reduxMnemonic[17]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setFirstMnemonic(event.target.value);
                            }
                        }} name="mnemonic4" />
                        <label>{reduxMnemonic[17]}</label>
                    </div>
                </div>
            </div>}
            {noOfCount === 2 && <div>
                <p><b>Verify Keywords</b>
                    <br />
                    <small>Please Select the 20th keyword!</small>
                </p>

                <div className="form">
                    <div className="form-check">
                        <input tabIndex={0} className='items' type="radio" checked={reduxMnemonic[22] === secondMnemonic} value={reduxMnemonic[22]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setSecondMnemonic(event.target.value);
                            }
                        }} name="mnemonic" />
                        <label>{reduxMnemonic[22]}</label>
                    </div>
                    <div className="form-check">
                        <input tabIndex={1} className='items' type="radio" checked={reduxMnemonic[5] === secondMnemonic} value={reduxMnemonic[5]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setSecondMnemonic(event.target.value);
                            }
                        }} name="mnemonic2" />
                        <label>{reduxMnemonic[5]}</label>
                    </div>
                    <div className="form-check">
                        <input tabIndex={2} className='items' type="radio" checked={reduxMnemonic[19] === secondMnemonic} value={reduxMnemonic[19]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setSecondMnemonic(event.target.value);
                            }
                        }} name="mnemonic3" />
                        <label>{reduxMnemonic[19]}</label>
                    </div>
                    <div className="form-check">
                        <input tabIndex={3} className='items' type="radio" checked={reduxMnemonic[13] === secondMnemonic} value={reduxMnemonic[13]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setSecondMnemonic(event.target.value);
                            }
                        }} name="mnemonic4" />
                        <label>{reduxMnemonic[13]}</label>
                    </div>
                </div>
            </div>}
            {noOfCount === 3 && <div>
                <p><b>Verify Keywords</b>
                    <br />
                    <small>Please Select the 6th keyword!</small>
                </p>

                <div className="form">
                    <div className="form-check">
                        <input tabIndex={0} className='items' type="radio" checked={reduxMnemonic[11] === thirdMnemonic} value={reduxMnemonic[11]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setThirdMnemonic(event.target.value);
                            }
                        }} name="mnemonic" />
                        <label>{reduxMnemonic[11]}</label>
                    </div>
                    <div className="form-check">
                        <input tabIndex={1} className='items' type="radio" checked={reduxMnemonic[5] === thirdMnemonic} value={reduxMnemonic[5]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setThirdMnemonic(event.target.value);
                            }
                        }} name="mnemonic2" />
                        <label>{reduxMnemonic[5]}</label>
                    </div>
                    <div className="form-check">
                        <input tabIndex={2} className='items' type="radio" checked={reduxMnemonic[23] === thirdMnemonic} value={reduxMnemonic[23]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setThirdMnemonic(event.target.value);
                            }
                        }} name="mnemonic3" />
                        <label>{reduxMnemonic[23]}</label>
                    </div>
                    <div className="form-check">
                        <input tabIndex={3} className='items' type="radio" checked={reduxMnemonic[1] === thirdMnemonic} value={reduxMnemonic[1]} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setFirstMnemonic(event.target.value);
                            }
                        }} name="mnemonic4" />
                        <label>{reduxMnemonic[1]}</label>
                    </div>
                </div>
            </div>}

            <div className="navigation">
                <button className='items' tabIndex={4} onClick={() => navigate(-1)}><FaArrowLeft /></button>
                <button className='items' tabIndex={5} onClick={() => handleMnemonicValidation()}><FaArrowRight /></button>
            </div>
        </div>
    )
}

export default VerifyMnemonic