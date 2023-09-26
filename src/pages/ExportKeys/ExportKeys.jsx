import React, { useEffect, useState } from 'react';
import "./ExportKeys.scss";
import Logo from "../../Assets/images/ton_symbol.png"
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { decryptData } from '../../commanFunctions/commanFunctions';

const ExportKeys = () => {
  const navigate = useNavigate();

  const [isExported, setIsExported] = useState(false);
  const [password, setPassword] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  // const [publicKey, setPublicKey] = useState("");
  // const [privateKey, setPrivateKey] = useState("");

  const encryptedMnemonic = localStorage.getItem("t-em")?.slice(1, -1);
  const encryptedKeys = localStorage.getItem("t-ek")?.slice(1, -1);
  const address = localStorage.getItem("t-address")?.slice(1, -1);

  useEffect(() => {
    if (!encryptedKeys || !encryptedMnemonic) {
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

  const handleExportKeys = () => {
    try {
      const plainKeys = decryptData(password, encryptedKeys);
      const plainMnemonic = decryptData(password, encryptedMnemonic);
      if (plainKeys && plainMnemonic) {
        console.log(plainKeys.secretKey.toString())
        setIsExported(true);
        setMnemonic(plainMnemonic);
        // setPublicKey(plainMnemonic);
        // setPrivateKey(plainMnemonic);
      }
    } catch (error) {
      alert("Please enter valid password.")
    }
  }

  return (
    <div className='export-key-page'>
      <div className="header">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <p>Ton Kaios Wallet</p>
      </div>
      <div className="content">
        <p>Export private key and public key through your password</p>
        {!isExported ? <div className="form">
          <input className='items' tabIndex={0} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter your password' />
          <button className='items' tabIndex={1} onClick={() => handleExportKeys()}>Export</button>
        </div> :
          <div className="form">
            <div className="data">
              <small>Address</small>
              <p>{address}</p>
            </div>
            {/* <div className="data">
              <small>Private Key</small>
              <p>abhishekasherqwertsfdhbghswevxsdfegrtyi</p>
            </div> */}
            <div className="data">
              <small>Mnemonic</small>
              <p>{mnemonic}</p>
            </div>
          </div>}
      </div>
      <div className="navigation">
        <button className='items' tabIndex={2} onClick={() => navigate(-1)}><FaArrowLeft /></button>
        {/* <button className='items' disabled tabIndex={4} onClick={() => {}}><FaArrowRight /></button> */}
      </div>
    </div>
  )
}

export default ExportKeys