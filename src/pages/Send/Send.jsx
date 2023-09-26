import React, { useEffect, useRef, useState } from 'react';
import "./Send.scss";
import { FaQrcode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import { createAndSendTransaction, fetchBalance, getAllTransaction } from '../../TonWalletLogic/TonWalletLogic';
import { decryptData } from '../../commanFunctions/commanFunctions';
import QrScanner from "qr-scanner";
import paymentDone from "../../Assets/images/green-tick.png";
import Loading from "../../Assets/images/loading.gif";
import errorImg from "../../Assets/images/error.png";
import API from '../../APIs/API';
import Address from "../../tonweb/src/utils/Address";

const Send = () => {
    const navigate = useNavigate();

    const videoRef = useRef();
    const photoRef = useRef();


    const [globalStream, setGlobalStream] = useState(undefined);
    const [balance, setBalance] = useState(0);
    const [toAddress, setToAddress] = useState("");
    const [tonAmount, setTonAmount] = useState(null);
    const [youAreSure, setYouAreSure] = useState(false);
    const [transactionDone, setTransactionDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [plainKeys, setPlainKeys] = useState(null);
    const [scanResult, setScanResult] = useState("");
    const [scannerOn, setScannerOn] = useState(false);
    const [transactionError, setTransactionError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const address = localStorage.getItem("t-address")?.slice(1, -1);
    const encryptedKeys = localStorage.getItem("t-ek")?.slice(1, -1);


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

    useEffect(() => {
        fetchWalletBalance();
    }, [])

    const fetchWalletBalance = async () => {
        let balance = await fetchBalance(address);
        setBalance(balance / 1000000000);
    }

    const handleNextButton = async () => {
        if (await validateData()) {
            if (youAreSure) {
                handleValidationPassword();
            } else {
                const items = document.querySelectorAll(".items");
                const targetElement = items[0];
                targetElement.focus();
                setYouAreSure(true);
            }
        }
    }

    const validateData = async () => {
        if (!Address.isValid(toAddress)) {
            alert("Invalid wallet address");
            return
        }
        if (balance <= 0) {
            alert("You have not TON.");
            return
        }
        if (tonAmount > balance) {
            alert(`you can send only less than ${balance} TON`)
            return false
        }
        if (toAddress.length > 0 && tonAmount > 0) {
            return true
        }
        return false;
    }

    const handleValidationPassword = async () => {
        try {
            const plainKeys = decryptData(password, encryptedKeys);
            setPlainKeys(plainKeys);
            handleSendTransaction(plainKeys);
        } catch (error) {
            alert("Please enter valid password.")
        }
    }
    const handleSendTransaction = async (plainKeys) => {
        try {
            setLoading(true);
            let response = await createAndSendTransaction(plainKeys, { TO: toAddress, VALUE: tonAmount }, address);
            if (!response?.isExotic) {
                setTransactionDone(true);
                setLoading(false);
                let transaction = await getAllTransaction(address, 1);
                handleSaveTransaction(transaction[0].transaction_id.hash);
            } else {
                setTransactionError(true);
            }
        } catch (error) {
            setErrorMessage(error.toString());
            setTransactionError(true);
            setLoading(false);
        }
    }

    // Handle Save Transaction in DataBase
    const handleSaveTransaction = async (cid) => {
        const response = await API.post('/api/v1/wallets/save-transaction', { from: address, to: toAddress, value: tonAmount, cid });
    }

    useEffect(() => {
        // Prevent the Arrow up down of amount field 
        try {
            document.getElementById('amount-input').addEventListener('keydown', function (e) {
                if (e.which === 38 || e.which === 40) {
                    e.preventDefault();
                }
            });
        } catch (error) {

        }
    }, []);


    // Take Photo
    const takePhoto = () => {
        const width = 414;
        const height = width / (16 / 9);

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext("2d");
        ctx.drawImage(video, 0, 0, width, height);

        const canvas = document.getElementById("canvas");
        let image = canvas.toDataURL();
        blobImg(image);
    };

    // Create a blob img
    async function blobImg(url) {
        const pngUrl = url;
        const blob = await (await fetch(pngUrl)).blob();
        // Create file form the blob
        const image = new File([blob], "qr-code.png", { type: blob.type });
        // Share Code
        try {
            readQrCode(image);
        } catch (error) {
            console.log(error);
        }
    }

    // Stop the camera stream
    function stopCamera() {
        globalStream.getTracks().forEach(function (track) {
            track.stop();
        });
    }

    // New Scanner Function for qr img
    const readQrCode = (file) => {
        if (!file) {
            return;
        }
        QrScanner.scanImage(file, { returnDetailedScanResult: true })
            .then((result) => {
                if (result?.data) {
                    setToAddress(result.data);
                    setScanResult(result.data);
                    setScannerOn(false);
                    stopCamera();
                }
            })
            .catch((e) => setScanResult(""));
    };

    function setwebcam() {
        var options = true;
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            try {
                navigator.mediaDevices.enumerateDevices().then(function (devices) {
                    devices.forEach(function (device) {
                        if (device.kind === "videoinput") {
                            if (device.label.toLowerCase().search("back") > -1)
                                options = {
                                    deviceId: { exact: device.deviceId },
                                    facingMode: "environment",
                                };
                        }
                    });
                    setwebcam2(options);
                });
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log("no navigator.mediaDevices.enumerateDevices");
            setwebcam2(options);
        }
    }

    function setwebcam2(options) {
        var n = navigator;
        if (n.mediaDevices.getUserMedia) {
            n.mediaDevices
                .getUserMedia({ video: options, audio: false })
                .then(function (stream) {
                    success(stream);
                })
                .catch(function (error) {
                    showError(error);
                });
        } else if (n.getUserMedia) {
            n.getUserMedia({ video: options, audio: false }, success, showError);
        } else if (n.webkitGetUserMedia) {
            n.webkitGetUserMedia(
                { video: options, audio: false },
                success,
                showError
            );
        }
    }


    function success(stream) {
        let v = videoRef.current;
        v.srcObject = stream;
        v.play();
        setGlobalStream(stream);
    }

    function showError(error) {
        console.log(error);
    }

    return (
        <div className='send-page'>
            <div className="header">
                <strong>Send Money</strong>
                <strong>
                    <FaQrcode />
                </strong>
            </div>

            {!youAreSure && !transactionError && !scannerOn && !loading && !transactionDone && <>
                <div className="form">
                    <label htmlFor="to-address">To</label>
                    <input value={toAddress} onChange={(e) => setToAddress(e.target.value)} className='items' tabIndex={0} type="text" />
                    <label htmlFor="amount">TON</label>
                    <input id='amount-input' value={tonAmount} onChange={(e) => setTonAmount(e.target.value)} className='items' tabIndex={1} type="number" />
                </div>

                <div className="value">
                    <div>Total available amount</div>
                    <div><pre>{balance.toFixed(5)} TON</pre></div>
                </div>
            </>}

            {youAreSure && !transactionError && !scannerOn && !loading && !transactionDone && <>
                <p className='are-you-sure'>Are you sure you want to send {tonAmount + " TON"}</p>

                <div className="form">
                    <label htmlFor="password">Password</label>
                    <input placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} className='items' tabIndex={0} type="password" />
                </div>
            </>
            }

            {transactionDone && !transactionError && !scannerOn && !loading &&
                <div className='transaction-done'>
                    <div className="form">
                        <div style={{ width: "67px", height: "61px", margin: "auto" }}>
                            <img
                                style={{ width: "100%", height: "100%" }}
                                src={paymentDone}
                                alt=""
                            />
                        </div>
                        <div className="heading">
                            <span>Success Transaction</span>
                        </div>
                        <p>
                            Your ton transaction successfully completed.
                        </p>
                        <div className="btn">
                            <button
                                className="items"
                                tabIndex={1}
                                onClick={() => navigate("/transactions")}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            }

            {!transactionDone && !transactionError && !scannerOn && loading &&
                <div className="transaction-loading">
                    <div className="form" style={{ padding: "5rem 1rem" }}>
                        <div style={{ width: "55px", height: "55px", margin: "auto" }}>
                            <img
                                style={{ width: "100%", height: "100%" }}
                                src={Loading}
                                alt=""
                            />
                        </div>
                        <p style={{ textAlign: "center", marginTop: "10px" }}>
                            Processing...
                        </p>
                    </div>
                </div>
            }


            {!transactionDone && !transactionDone && scannerOn && !transactionError && (
                <div className="scanner-div">
                    <div className="container">
                        <div
                            className="heading-scanner items"
                            tabIndex={0}
                            onKeyPress={(e) => {
                                setScannerOn(!scannerOn);
                                stopCamera();
                            }}
                            onClick={() => setScannerOn(!scannerOn) + stopCamera()}
                        >
                            <BsArrowLeft className="larr" />
                            <h3> Scan Qr Code</h3>
                        </div>

                        <div className="camera">
                            <video ref={videoRef}></video>
                        </div>
                        <div className="btn">
                            <button
                                className="items"
                                tabIndex={1}
                                onClick={() => takePhoto()}
                            >
                                Capture Qr Code
                            </button>
                        </div>
                        <canvas
                            style={{ display: "none" }}
                            id="canvas"
                            ref={photoRef}
                        ></canvas>
                    </div>
                </div>
            )}

            {!transactionDone && !transactionError && !scannerOn && !loading && <div className="navigation">
                <button onClick={() => navigate(-1)} tabIndex={youAreSure ? 1 : 2} className='items'><FaArrowLeft /></button>
                {!youAreSure && <button
                    type="button"
                    className="items"
                    tabIndex={youAreSure ? 2 : 3}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            setScannerOn(true);
                            setwebcam();
                        }
                    }}
                    onClick={() => setScannerOn(true) + setwebcam()}
                >
                    QR Scanner
                </button>}
                <button onClick={() => handleNextButton()} tabIndex={youAreSure ? 3 : 4} className='items'><FaArrowRight /></button>
            </div>}

            {transactionError && !loading &&
                <div className='showError'>
                    <div className="error-img"><img src={errorImg} alt="" srcset="" /></div>
                    <div className="heading">Some Error Occurred</div>
                    <p>{errorMessage}</p>
                    <button className="button items" type='button' tabIndex={0} onClick={() => navigate("/wallet")}>Back</button>
                </div>
            }
        </div>
    )
}

export default Send