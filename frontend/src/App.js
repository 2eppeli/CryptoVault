import React, { useState } from "react";
import { ethers } from "ethers";
import { RelayerSdk } from "@zama-fhe/relayer-sdk";

const CONTRACT_ADDRESS = "0xYourDeployedContractAddress"; // 替换为实际部署地址
const CONTRACT_ABI = [/* ABI of CryptoVaultToken */];

function App() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  async function mintTokens() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
    const relayer = new RelayerSdk(provider, signer);
    const encryptedAmount = await relayer.encrypt(parseInt(amount));
    const proof = await relayer.getProof(encryptedAmount);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.mint(encryptedAmount, proof);
    await tx.wait();
    console.log("Tokens minted");
  }

  async function transferTokens() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
    const relayer = new RelayerSdk(provider, signer);
    const encryptedAmount = await relayer.encrypt(parseInt(amount));
    const proof = await relayer.getProof(encryptedAmount);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.transfer(recipient, encryptedAmount, proof);
    await tx.wait();
    console.log("Tokens transferred");
  }

  async function getBalance(address: string) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const encryptedBalance = await contract.balanceOf(address);
    const relayer = new RelayerSdk(provider, new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider));
    const decryptedBalance = await relayer.decrypt(encryptedBalance);
    console.log(`Balance of ${address}: ${decryptedBalance}`);
  }

  return (
    <div>
      <h1>CryptoVault Demo</h1>
      <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      <button onClick={mintTokens}>Mint Tokens</button>
      <button onClick={transferTokens}>Transfer Tokens</button>
      <button onClick={() => getBalance(recipient)}>Get Balance</button>
    </div>
  );
}

export default App;
