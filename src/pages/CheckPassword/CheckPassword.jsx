import React, { useEffect, useState } from 'react';
import "./CheckPassword.scss";
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSelector } from 'react-redux';

const CheckPassword = () => {
    const navigate = useNavigate();
    const param = useParams();

    const [password, setPassword] = useState(
        useSelector((state) => state.savePasswordReducer)
      );

    const importStatus = param.importStatus;

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

    const handleNextProcess = () => {
        if (importStatus.slice(1) == "true") {
            navigate("/external-wallet");
        } else {
            navigate("/keywords");
        }
    }

    return (
        <div className='check-password-page'>
            <div className="check-password-page-inner">
                <strong>Passphrase is a required part of your wallet. Without the passphrase you will not be able to do any transaction</strong>
                <div className="form">
                    <label htmlFor="password">Your Passphrase</label>
                    <input disabled type="text" value={password} />

                    <div className='checkbox'>
                        <span>Your passphrase will not be shown to you again.</span>
                    </div>
                </div>
            </div>

            <div className="navigation">
                <button className='items' tabIndex={0} onClick={() => navigate(-1)}><FaArrowLeft /></button>
                <button className='items' tabIndex={1} onClick={() => handleNextProcess()}><FaArrowRight /></button>
            </div>
        </div>
    )
}

export default CheckPassword