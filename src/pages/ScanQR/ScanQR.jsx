import React, { useEffect, useRef, useState } from 'react';
import "../Send/Send.scss";
import { FaQrcode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from "react-icons/bs";
import QrScanner from "qr-scanner";

const ScanQR = () => {
    const navigate = useNavigate();

    const videoRef = useRef();
    const photoRef = useRef();

    const [globalStream, setGlobalStream] = useState(undefined);
    const [scannerData, setScannerData] = useState('');

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

    useEffect(() => {
        setwebcam();
    }, [])

    useEffect(() => {
        // Prevent the Arrow up down of amount field 
        try {
            document.getElementById('amount-input').addEventListener('keydown', function (e) {
                if (e.which === 38 || e.which === 40) {
                    e.preventDefault();
                }
            });
        } catch (error) {

        }
    }, []);


    // Take Photo
    const takePhoto = () => {
        const width = 414;
        const height = width / (16 / 9);

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext("2d");
        ctx.drawImage(video, 0, 0, width, height);

        const canvas = document.getElementById("canvas");
        let image = canvas.toDataURL();
        blobImg(image);
    };

    // Create a blob img
    async function blobImg(url) {
        const pngUrl = url;
        const blob = await (await fetch(pngUrl)).blob();
        // Create file form the blob
        const image = new File([blob], "qr-code.png", { type: blob.type });
        // Share Code
        try {
            readQrCode(image);
        } catch (error) {
            console.log(error);
        }
    }

    // Stop the camera stream
    function stopCamera() {
        globalStream.getTracks().forEach(function (track) {
            track.stop();
        });
    }

    // New Scanner Function for qr img
    const readQrCode = (file) => {
        if (!file) {
            return;
        }
        QrScanner.scanImage(file, { returnDetailedScanResult: true })
            .then((result) => {
                if (result?.data) {
                    checkValidData(result.data);
                }
            })
            .catch((e) => setScannerData(""));
    };

    function setwebcam() {
        var options = true;
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            try {
                navigator.mediaDevices.enumerateDevices().then(function (devices) {
                    devices.forEach(function (device) {
                        if (device.kind === "videoinput") {
                            if (device.label.toLowerCase().search("back") > -1)
                                options = {
                                    deviceId: { exact: device.deviceId },
                                    facingMode: "environment",
                                };
                        }
                    });
                    setwebcam2(options);
                });
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log("no navigator.mediaDevices.enumerateDevices");
            setwebcam2(options);
        }
    }

    function setwebcam2(options) {
        var n = navigator;
        if (n.mediaDevices.getUserMedia) {
            n.mediaDevices
                .getUserMedia({ video: options, audio: false })
                .then(function (stream) {
                    success(stream);
                })
                .catch(function (error) {
                    showError(error);
                });
        } else if (n.getUserMedia) {
            n.getUserMedia({ video: options, audio: false }, success, showError);
        } else if (n.webkitGetUserMedia) {
            n.webkitGetUserMedia(
                { video: options, audio: false },
                success,
                showError
            );
        }
    }


    function success(stream) {
        let v = videoRef.current;
        v.srcObject = stream;
        v.play();
        setGlobalStream(stream);
    }

    function showError(error) {
        console.log(error);
    }

    const checkValidData = (data) => {
        if(data.includes(window.location.origin)){
            let newUrl = new URL(data);
            stopCamera();
            navigate(newUrl.pathname + newUrl.search);
        }else{
            alert("Please Scan a valid QR code");
        }
    }

    return (
        <div className='send-page'>
            <div className="header">
                <button
                    className="items"
                    tabIndex={0}
                    onClick={() => stopCamera() + navigate(-1)}
                >
                    <BsArrowLeft />
                </button>{" "}
                <strong>Scan QR Code</strong>
                <strong>
                    <FaQrcode />
                </strong>
            </div>



            {!scannerData && (
                <div className="scanner-div">
                    <div className="container">
                        <div className="camera">
                            <video ref={videoRef}></video>
                        </div>
                        <div className="btn">
                            <button
                                className="items"
                                tabIndex={1}
                                onClick={() => takePhoto()}
                            >
                                Capture Qr Code
                            </button>
                        </div>
                        <canvas
                            style={{ display: "none" }}
                            id="canvas"
                            ref={photoRef}
                        ></canvas>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ScanQR