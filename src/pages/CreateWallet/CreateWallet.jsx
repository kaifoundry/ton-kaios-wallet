import React, { useEffect, useState } from 'react';
import "./CreateWallet.scss";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { savePassword } from "../../Redux/action/index";

const CreateWallet = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const param = useParams();
    const [checked, setChecked] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
        }
    }


    const handleValidation = () => {
        if (!password) {
            alert("Please enter password.");
            return
        }
        if (password !== confirmPassword) {
            alert("Confirm password is invalid.");
            return
        }
        if (!checked) {
            alert("Please check the terms and conditions.");
            return
        }
        const reg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (reg.test(password)) {
            dispatch(savePassword(password));
            if (importStatus.slice(1) == "true") {
                navigate("/check-pass/:true");
            } else {
                navigate("/check-pass/:false");
            }
        } else {
            alert(`*Please Enter Strong Password.
                1. Contain at least one Uppercase letter
                2. Contain at least one Lowercase letter
                3. Contain at least one numeric
                4. Contain at least one special character`);
        }
    }

    return (
        <div className='create-wallet-page'>
            <div className="create-wallet-page-inner">
                <strong>Create a strong passphrase for your wallet.</strong>
                <div className="form">
                    <label htmlFor="password">Create a Passphrase</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className='items' tabIndex={0} type="password" />
                    <label htmlFor="confirm-password">Confirm the Passphrase</label>
                    <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='items' tabIndex={1} type="password" />
                    <div className='checkbox'>
                        <input checked={checked ? true : false} onChange={() => setChecked(!checked)} onKeyPress={(event) => {
                            if (event.which === 13) {
                                setChecked(!checked)
                            }
                        }} className='items' tabIndex={2} type="checkbox" name="" id="" />
                        <span>I understand that
                            Walnut Wallet can't provide assistance in the case of lost or
                            forgotten passphrases. Walnut Wallet never has any knowledge of
                            my passphrase.</span>
                    </div>
                </div>
            </div>

            <div className="navigation">
                <button className='items' tabIndex={3} onClick={() => navigate(-1)}><FaArrowLeft /></button>
                <button className='items' tabIndex={4} onClick={() => handleValidation()}><FaArrowRight /></button>
            </div>
        </div>
    )
}

export default CreateWallet