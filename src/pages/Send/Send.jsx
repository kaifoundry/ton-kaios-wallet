import React, { useEffect } from 'react';
import "./Send.scss";
import { FaQrcode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Send = () => {
    const navigate = useNavigate();

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

    return (
        <div className='send-page'>
            <div className="header">
                <strong>Send Money</strong>
                <strong>
                    <FaQrcode />
                </strong>
            </div>

            <div className="form">
                <label htmlFor="password">To</label>
                <input onChange={(e) => { }} className='items' tabIndex={0} type="password" />
                <label htmlFor="confirm-password">TON</label>
                <input onChange={(e) => { }} className='items' tabIndex={1} type="password" />
            </div>

            <div className="value">
                <div>Total available amount</div>
                <div><pre>0.00000 TON</pre></div>
            </div>

            <div className="navigation">
                <button onClick={() => navigate(-1)} tabIndex={2} className='items'><FaArrowLeft /></button>
                <button onClick={() => { }} tabIndex={3} className='items'><FaArrowRight /></button>
            </div>
        </div>
    )
}

export default Send