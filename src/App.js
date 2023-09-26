import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import CreateWallet from "./pages/CreateWallet/CreateWallet.jsx";
import ExistingWallet from "./pages/ExistingWallet/ExistingWallet";
import ExternalWallet from "./pages/ExternalWallet/ExternalWallet";
import CheckPassword from "./pages/CheckPassword/CheckPassword";
import ShowMnemonic from "./pages/ShowMnemonic/ShowMnemonic";
import VerifyMnemonic from "./pages/VerifyMnemonic/VerifyMnemonic";
import Wallet from "./pages/Wallet/Wallet";
import Receive from "./pages/Receive/Receive";
import TransactionDetails from "./pages/TransactionDetails/TransactionDetails";
import ExportKeys from "./pages/ExportKeys/ExportKeys";
import Transactions from "./pages/Transactions/Transactions";
import Send from "./pages/Send/Send";
import Setting from "./pages/Setting/Setting";
import SwitchAccount from "./pages/SwitchAccount/SwitchAccount";
import QRShare from "./pages/QRShare/QRShare";
import TonConnect from "./pages/TonConnect/TonConnect";
import ScanQR from "./pages/ScanQR/ScanQR";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/*" element={<Home />} />
        <Route exact path="/create-wallet/:importStatus" element={<CreateWallet />} />
        <Route exact path="/existing-wallet/*" element={<ExistingWallet />} />
        <Route exact path="/external-wallet/*" element={<ExternalWallet />} />
        <Route exact path="/check-pass/*" element={<CheckPassword />} />
        <Route exact path="/check-pass/:importStatus*" element={<CheckPassword />} />
        <Route exact path="/keywords/*" element={<ShowMnemonic />} />
        <Route exact path="/verify-keywords/*" element={<VerifyMnemonic />} />
        <Route exact path="/wallet/*" element={<Wallet />} />
        <Route exact path="/transactions/*" element={<Transactions />} />
        <Route exact path="/send/*" element={<Send />} />
        <Route exact path="/setting/*" element={<Setting />} />

        <Route exact path="/receive/*" element={<Receive />} />
        <Route exact path="/transaction-details/*" element={<TransactionDetails />} />
        <Route exact path="/export-keys/*" element={<ExportKeys />} />
        <Route exact path="/switch-account/*" element={<SwitchAccount />} />
        <Route exact path="/qrcode/:address" element={<QRShare />} />
        <Route exact path="/ton-connect" element={<TonConnect />} />
        <Route exact path="/scan-qr" element={<ScanQR />} />
      </Routes>
    </div>
  );
}




export default App;
