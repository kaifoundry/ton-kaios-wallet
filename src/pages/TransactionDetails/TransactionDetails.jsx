import React, { useEffect } from 'react';
import "./TransactionDetails.scss";
import Logo from "../../Assets/images/ton_symbol.png"
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const TransactionDetails = () => {
  const navigate = useNavigate();

  const transactionDetails = useSelector(state => state.saveTransactionDetailsReducer);

  useEffect(() => {
    if (!transactionDetails.hash) {
      navigate(-1);
    }
  }, [])

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
    <div className='transaction-details'>
      <div className="header">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <p>Ton Kaios Wallet</p>
      </div>
      <div className="content">
        <div className="title"><span>Transaction Details</span></div>
        <div className="form">
          <div className="data">
            <small>TO</small>
            <p>{transactionDetails?.to}</p>
          </div>
          <div className="data">
            <small>FROM</small>
            <p>{transactionDetails?.from}</p>
          </div>
          <div className="data">
            <small>Amount (TON)</small>
            <p>{transactionDetails?.value} TON</p>
          </div>
          <div className="data">
            <small>Transaction Hash</small>
            <p>{transactionDetails?.hash}</p>
          </div>
          <div className="data">
            <small>Creation LT</small>
            <p>{transactionDetails?.lt}</p>
          </div>
        </div>
      </div>
      <div className="navigation">
        <button className='items' tabIndex={3} onClick={() => navigate(-1)}><FaArrowLeft /></button>
        {/* <button className='items' disabled tabIndex={4} onClick={() => {}}><FaArrowRight /></button> */}
      </div>
    </div>
  )
}

export default TransactionDetails