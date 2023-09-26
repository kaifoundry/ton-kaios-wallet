import React, { useEffect } from 'react';
import "./Receive.scss";
import QRCode from "qrcode.react";
import Logo from "../../Assets/images/ton_symbol.png"
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { MdShare } from 'react-icons/md';

const Receive = () => {

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
    document.body.addEventListener("keydown", handleKeydown);
    return () => document.body.removeEventListener("keydown", handleKeydown);
  }, []);


  let address = localStorage.getItem("t-address")?.slice(1, -1);

  useEffect(() => {
    if (!address) {
      navigate("/");
    }
  }, [])


  const shareUrl = window.location.origin + `/qrcode/${address}`;
  async function shareFiles() {
    // Share Code
    try {
      let url = `https://wa.me/?text=TON Address:-${address} and Link ${shareUrl}`;
      window.location = url;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='receive-page'>
      <div className="header">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <p>Ton Kaios Wallet</p>
      </div>

      <div className="content">
        <div className="title"><small>Scan QR Code</small></div>
        <div className="qr-code">
          <QRCode
            className="icon"
            size={256}
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%",
              borderRadius: "0.5rem",
            }}
            value={address}
            viewBox={`0 0 256 256`}
            id="qr-code-id"
            includeMargin={true}
          />
        </div>
        <div className="bottom">
          <div className="title">Wallet Address</div>
          <p>{address ? address : "address"}</p>
        </div>
      </div>
      <div className="navigation">
        <button className='items' tabIndex={0} onClick={() => navigate(-1)}><FaArrowLeft /></button>
        <button
          className=" icons items"
          tabIndex={1}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              shareFiles();
            }
          }}
          onClick={() => shareFiles()}
        >
          <MdShare id="share" className="icon" />
        </button>
        {/* <button className='items' disabled tabIndex={4} onClick={() => {}}><FaArrowRight /></button> */}
      </div>
    </div>
  )
}

export default Receive