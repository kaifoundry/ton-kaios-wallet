import React, { useEffect, useState } from 'react';
import "./Wallet.scss";
import { IoMdSettings } from "react-icons/io"
import { FaArrowRight } from 'react-icons/fa';
import { BsSendFill } from 'react-icons/bs';
import { HiCurrencyDollar } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { fetchBalance } from '../../TonWalletLogic/TonWalletLogic';

const Wallet = () => {

    const navigate = useNavigate();

    let address = localStorage.getItem("t-address")?.slice(1, -1);
    let mnemonic = localStorage.getItem("t-em")?.slice(1, -1);
    let keyPair = localStorage.getItem("t-ek")?.slice(1, -1);


    const [balance, setBalance] = useState(0);

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
        if (!address || !mnemonic || !keyPair) {
            localStorage.clear();
            navigate("/");
        }
    }, [])


    useEffect(() => {
        fetchWalletBalance();
    })

    const fetchWalletBalance = async () => {
        let balance = await fetchBalance(address);
        setBalance(balance / 1000000000);
    }

    return (
        <div className='wallet-page'>
            <div className="wallet-header">
                <button onClick={() => navigate("/setting")} className='items' tabIndex={0}>
                    <IoMdSettings />
                </button>
                <div style={{marginTop: "0.5rem"}}>
                    <span>{address}</span>
                    <div><pre>{balance.toFixed(5)} TON</pre></div>

                </div>
            </div>
            <div className="wallet-middle">
                <button className='items' tabIndex={1} onClick={() => navigate("/transactions")}>Go to transactions <FaArrowRight /> </button>
            </div>

            <div className="wallet-send-receive">
                <div>
                    <button style={{ marginRight: "1rem" }} className='items' tabIndex={2} onClick={() => navigate("/send")}><BsSendFill /></button>
                    <span style={{ marginRight: "1rem" }}>Send</span>
                </div>
                <div>
                    <button style={{ marginLeft: "1rem" }} className='items' tabIndex={3} onClick={() => navigate("/receive")}><HiCurrencyDollar /></button>
                    <span style={{ marginLeft: "1rem" }}>Receive</span>
                </div>
            </div>
        </div>
    )
}

export default Wallet