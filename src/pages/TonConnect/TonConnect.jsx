import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./TonConnect.scss";
import logo from "../../Assets/images/56X56.png"
import arrowPng from "../../Assets/images/arrow.png"
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from '../../commanFunctions/commanFunctions';
import { createTransactionAndProvideAuthentication } from '../../TonWalletLogic/TonWalletLogic';
import BridgeAPI from '../../APIs/BridgeAPI';
import { v4 as uuidv4 } from "uuid";


function TonConnect() {
    const navigate = useNavigate();

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();
    let r = query.get('r');
    let v = query.get('v');
    let dAppWalletClientId = query.get('id');
    let ourClientId = uuidv4().replace(/-/g, '');
    r = JSON.parse(r);

    const encryptedMnemonic = localStorage.getItem("t-em")?.slice(1, -1);
    const encryptedKeys = localStorage.getItem("t-ek")?.slice(1, -1);

    const [isPasswordScreen, setIsPasswordScreen] = useState(false);
    const [isExported, setIsExported] = useState(false);
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [addressVersion, setAddressVersion] = useState("");

    const fetchDappData = async () => {
        let response = await axios.get(r.manifestUrl);
        setImageUrl(response?.data?.iconUrl);
        setName(response?.data?.name);
        setUrl(response?.data?.url);
    }

    const checkIsWalletExist = () => {
        let address = localStorage.getItem("t-address")?.slice(1, -1);
        let addressVersion = localStorage.getItem("t-active");
        setAddressVersion(addressVersion);
        setAddress(address);
        if (!address) {
            navigate('/');
        }
    }

    const handleAuthentication = async (plainKeys) => {
        try {
            let response = await createTransactionAndProvideAuthentication(plainKeys);
            sendDataToDApp(Buffer.from(JSON.stringify(response)).toString('base64'));

        } catch (error) {
            sendDataToDApp(Buffer.from(JSON.stringify(error)).toString('base64'));

        }
    }

    const sendDataToDApp = async (base64Encoded) => {
        try {
            const axiosConfig = {
                headers: {
                    'Content-Type': 'text/plain',
                },
            };
            const response = await BridgeAPI.post(`message?client_id=${ourClientId}&to=${dAppWalletClientId}&ttl=300`, base64Encoded, axiosConfig);
            if (response?.data?.statusCode) {
                navigate("/wallet");
            }
        } catch (error) {
            alert(error);
        }
    }

    const handleExportKeys = () => {
        try {
            const plainKeys = decryptData(password, encryptedKeys);
            if (plainKeys) {
                setIsExported(true);
                handleAuthentication(plainKeys);
            }
        } catch (error) {
            alert("Please enter valid password.")
        }
    }

    const handleNextButton = async () => {
        await setIsPasswordScreen(true);
        const items = document.querySelectorAll(".items");
        const targetElement = items[0];
        targetElement.focus();
    }

    useEffect(() => {
        fetchDappData();
        checkIsWalletExist();
    }, []);

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

    return (
        <div className='connect-ton-page'>
            <div className='connect-ton-page-inner'>
                {!isPasswordScreen ? <div>
                    <div className="logos">
                        <div className="logo">
                            <img src={logo} alt="" srcset="" />
                        </div>
                        <div className="logo arrow">
                            <img src={arrowPng} alt="" srcset="" />
                        </div>
                        <div className="logo">
                            <img src={imageUrl} alt="" srcset="" />
                        </div>
                    </div>
                    <div className="summary">
                        <div className="heading">Connect to {name}?</div>
                        <p>{url} is requesting access to your wallet address {address} {addressVersion}</p>
                    </div>
                    <button tabIndex={0} onClick={() => handleNextButton()} className='items connect-wallet-btn'>Connect Wallet</button>
                    <button tabIndex={1} onClick={() => navigate(-1)} className='items cancel-btn'>Cancel</button>
                </div> :
                    <div className="form">
                        <p>Enter your password here.</p>
                        <input className='items next' tabIndex={0} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter your password' />
                        <button className='items' tabIndex={1} onClick={() => handleExportKeys()}>Continue</button>
                    </div>}
            </div>
        </div>
    )
}

export default TonConnect