import React, { useEffect } from 'react';
import "./ExistingWallet.scss";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const ExistingWallet = () => {

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
          case "ArrowRight":
            nav(1);
            break;
          case "ArrowLeft":
            nav(-1);
            break;
        }
      }

  return (
    <div className='existing-wallet-page'>
        <div className="back-btn">
            <button className='items' tabIndex={0} onClick={()=> navigate(-1)}>
                <FaArrowLeft />
            </button>
        </div>
        <p>Restoring a wallet? No problem, let's restore your wallet.</p>
        <button className='items' tabIndex={1} onClick={()=> navigate("/create-wallet/:true")}>I have an external wallet{" "}<FaArrowRight /></button>
    </div>
  )
}

export default ExistingWallet