import React, { useEffect, useState } from 'react';
import "./SwitchAccount.scss";
import { useNavigate } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa';
import { switchWalletAddressFormate } from "../../TonWalletLogic/TonWalletLogic";
import { decryptData, saveData } from '../../commanFunctions/commanFunctions';
import { async } from 'q';

const SwitchAccount = () => {

    const navigate = useNavigate();
    const activeFormate = localStorage.getItem("t-active")?.slice(1, -1) || "v3R2";
    const encryptedKeys = localStorage.getItem("t-ek")?.slice(1, -1);

    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [reload, setReload] = useState(false);
    const [password, setPassword] = useState("");
    const [selectFormate, setSelectFormate] = useState("");
    const [address, setAddress] = useState(localStorage.getItem("t-address")?.slice(1, -1) || "In valid");

    useEffect(() => {
        let address = localStorage.getItem("t-address")?.slice(1, -1) || "In valid";
        setAddress(address);
    }, [reload]);


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

    const handleSwitchWallet = (formateType) => {
        setOpenPasswordModal(true);
        setSelectFormate(formateType);
    }

    const handleExportKeys = async () => {
        try {
            const plainKeys = decryptData(password, encryptedKeys);
            if (plainKeys) {
                console.log(plainKeys.secretKey.toString())
                let address = await switchWalletAddressFormate(plainKeys, selectFormate);
                console.log(address)
                saveData('t-address', address);
                saveData('t-active', selectFormate);
                setOpenPasswordModal(false);
                setPassword("");
                setReload(!reload);
            }
        } catch (error) {
            setOpenPasswordModal(false);
            setPassword("");
            alert("Please enter valid password.")
        }
    }

    return (
        <div className='switch-account-page'>
            {!openPasswordModal ?
                <>
                    <div className="header">
                        <button className='items' tabIndex={0} onClick={() => navigate(-1)}>
                            <FaArrowLeft />
                        </button>
                        <div style={{ wordBreak: "break-word", width: "88vw", marginTop: "30px" }}>
                            <span>you can switch your wallet address formate.</span> <br />
                            <span>{address}</span>
                        </div>
                    </div>
                    <div className="cards">
                        <div className="card">
                            <div className="formate-name">v3R1</div>
                            {activeFormate === "v3R1" ? <button tabIndex={1} className='selected items'>Selected</button> :
                                <button tabIndex={1} className='items' onClick={() => handleSwitchWallet("v3R1")}>Select</button>}
                        </div>
                        <div className="card">
                            <div className="formate-name">v3R2</div>
                            {activeFormate === "v3R2" ? <button tabIndex={2} className='selected items'>Selected</button> :
                                <button tabIndex={2} className='items' onClick={() => handleSwitchWallet("v3R2")}>Select</button>}
                        </div>
                        <div className="card">
                            <div className="formate-name">v4R2</div>
                            {activeFormate === "v4R2" ? <button tabIndex={3} className='selected items'>Selected</button> :
                                <button tabIndex={3} className='items' onClick={() => handleSwitchWallet("v4R2")}>Select</button>}
                        </div>
                    </div>
                </>
                :
                <div className="form">
                    <div className="header" style={{ height: "16vh" }}>
                        <button className='items background' tabIndex={0} onClick={() => navigate(-1)}>
                            <FaArrowLeft />
                        </button>
                        <div>
                            <span>please enter your password.</span> <br />
                        </div>
                    </div>
                    <input className='items' tabIndex={1} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter your password' />
                    <button className='items' tabIndex={2} onClick={() => handleExportKeys()}>Switch Address</button>
                </div>
            }
        </div>
    )
}

export default SwitchAccount