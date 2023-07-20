import React, { useEffect, useState } from 'react';
import "./Home.scss";
import { useNavigate } from 'react-router-dom';
import brandImg from "./ton_symbol.png";

const Home = () => {

  const navigate = useNavigate();

  const [brandingLoading, setBrandingLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBrandingLoading(false);
    }, 2000);
  }, [])

  let address = localStorage.getItem("t-address")?.slice(1, -1);
  let mnemonic = localStorage.getItem("t-em")?.slice(1, -1);
  let keyPair = localStorage.getItem("t-ek")?.slice(1, -1);

  useEffect(() => {
    if (address && mnemonic && keyPair) {
      navigate("/wallet");
    } else {
      localStorage.clear();
      navigate("/");
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
    <div className='home-page'>
      {!brandingLoading ? <div className='home-inner'>
        <button tabIndex={0} onClick={() => navigate("/create-wallet/:false")} className='items new-wallet-btn'>Create New Wallet</button>
        <button tabIndex={1} onClick={() => navigate("/existing-wallet")} className='items restore-wallet-btn'>Restore an Existing Wallet</button>
      </div>
        :
        <div className="branding">
          <div className="home-inner">
            <div className="logo">
              <img src={brandImg} alt="" />
            </div>
            <p><strong className='first'>Ton Kaios Wallet</strong><br />
              <span>Powered by </span> <strong>Kaifoundry</strong>
            </p>
          </div>
        </div>}
    </div>
  )
}

export default Home