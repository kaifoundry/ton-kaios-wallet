import React, { useEffect, useState } from 'react';
import "./Transactions.scss";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { RiKey2Line } from "react-icons/ri";
import { fetchBalance, getAllTransaction } from '../../TonWalletLogic/TonWalletLogic';
import { useDispatch } from 'react-redux';
import { saveTransactionDetails } from '../../Redux/action';

const Transactions = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const address = localStorage.getItem("t-address")?.slice(1, -1);
    const [transactions, setTransactions] = useState([]);
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
        }
    }

    useEffect(() => {
        fetchAllTransaction();
        fetchWalletBalance();
    }, [])

    const fetchAllTransaction = async () => {
        let transaction = await getAllTransaction(address);
        setTransactions(transaction);
    }

    const fetchWalletBalance = async () => {
        let balance = await fetchBalance(address);
        setBalance(balance / 1000000000);
    }

    const calculateTime = (timeStamp) => {
        let dt = new Date(timeStamp * 1000);
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        return [`${dt.getDate()} ${monthNames[dt.getMonth()]} ${dt.getFullYear()}`, `${dt.getHours()}:${dt.getMinutes()}`]
    }

    const getTransactionAmount = (element) => {
        if (element?.out_msgs.length) {
            return `-${element?.out_msgs[0]?.value / 1000000000}`
        } else {
            return `+${element?.in_msg?.value / 1000000000}`
        }
    }

    const handleTransactionDetails = (element) => {
        let data = {};
        if (element?.out_msgs.length) {
            data = {
                to: element?.out_msgs[0]?.destination,
                from: element?.out_msgs[0]?.source,
                value: element?.out_msgs[0]?.value / 1000000000,
                hash: element?.transaction_id?.hash,
                lt: element?.transaction_id?.lt
            }
        } else {
            data = {
                to: element?.in_msg?.destination,
                from: element?.in_msg?.source,
                value: element?.in_msg?.value / 1000000000,
                hash: element?.transaction_id?.hash,
                lt: element?.transaction_id?.lt
            }
        }
        dispatch(saveTransactionDetails(data))
        navigate("/transaction-details");
    }

    return (
        <div className='transactions-page'>
            <div className="header">
                <button className='items' tabIndex={0} onClick={() => navigate(-1)}>
                    <FaArrowLeft />
                </button>
                <div>
                    <pre>{balance.toFixed(5)} TON</pre>
                </div>
            </div>

            <div className="transactions-container">
                {transactions.map((element, index) => {
                    return (
                        <div key={index} className="transaction">
                            <label>{calculateTime(element.utime)[0]}</label>
                            <div className="data">
                                <div className="left"><RiKey2Line /> <pre>{calculateTime(element.utime)[1]}</pre></div>
                                <div className="center">
                                    <pre>{getTransactionAmount(element)}</pre>
                                </div>
                                <div className="right"><button tabIndex={index + 1} className='items' onClick={() => handleTransactionDetails(element)}><FaArrowRight /></button></div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Transactions