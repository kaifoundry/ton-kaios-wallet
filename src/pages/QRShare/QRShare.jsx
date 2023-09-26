import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode.react";
import Logo from "../../Assets/images/ton_symbol.png"

const QRShare = () => {
  const param = useParams();
  const address = param?.address;

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
    </div>
  );
};

export default QRShare;
