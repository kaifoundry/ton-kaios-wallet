import React, { useEffect } from 'react';
import "./Transactions.scss";
import { useNavigate } from 'react-router-dom';
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import {RiKey2Line} from "react-icons/ri";

const Transactions = () => {
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
    <div className='transactions-page'>
        <div className="header">
            <button className='items' tabIndex={0} onClick={()=> navigate(-1)}>
                <FaArrowLeft />
            </button>

            <div>
                <pre>0.00000 TON</pre>
            </div>
            
        </div>

        <div className="transactions-container">
            <div className="transaction">
                <label>12 June 2023</label>
                <div className="data">
                    <div className="left"><RiKey2Line /> <pre>10:00</pre></div>
                    <div className="center">
                        <pre>-0.00002</pre>
                    </div>
                    <div className="right"><FaArrowRight /></div>
                </div>
            </div>
            <div className="transaction">
                <label>12 June 2023</label>
                <div className="data">
                    <div className="left"><RiKey2Line /> <pre>10:00</pre></div>
                    <div className="center">
                        <pre>-0.00002</pre>
                    </div>
                    <div className="right"><FaArrowRight /></div>
                </div>
            </div>
            <div className="transaction">
                <label>12 June 2023</label>
                <div className="data">
                    <div className="left"><RiKey2Line /> <pre>10:00</pre></div>
                    <div className="center">
                        <pre>-0.00002</pre>
                    </div>
                    <div className="right"><FaArrowRight /></div>
                </div>
            </div>
            <div className="transaction">
                <label>12 June 2023</label>
                <div className="data">
                    <div className="left"><RiKey2Line /> <pre>10:00</pre></div>
                    <div className="center">
                        <pre>-0.00002</pre>
                    </div>
                    <div className="right"><FaArrowRight /></div>
                </div>
            </div>
            <div className="transaction">
                <label>12 June 2023</label>
                <div className="data">
                    <div className="left"><RiKey2Line /> <pre>10:00</pre></div>
                    <div className="center">
                        <pre>-0.00002</pre>
                    </div>
                    <div className="right"><FaArrowRight /></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Transactions