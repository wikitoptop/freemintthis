import { useState } from "react";
import { ethers } from "ethers";
import { Button,Input,Form,Image } from 'antd';
import BatchNFTs from "./BatchNFTs.json";
import myImage from './logo.png';
import "./App.css"

function App() {
  const [quantity, setQuantity] = useState(0);
  const [transactionHash, setTransactionHash] = useState("");
  const [userAddress, setUserAddress] = useState("");

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Please install MetaMask!");
    }
  }

  async function handleMint(event) {
    event.preventDefault();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractAddress = "0x0aDe49D4F452B3ECFF80D45D7AAABbF8E7C7b394";
    const contract = new ethers.Contract(contractAddress, BatchNFTs.abi, signer);

    const value = ethers.utils.parseEther(String(quantity*0));

    const transaction = await contract.mint(userAddress, quantity, { value });

    setTransactionHash(transaction.hash);
  }

  return (
    <div>
      <div className="connect">
        {!userAddress && <Button onClick={connectWallet}>Connect Wallet</Button>}
        {userAddress && <p>{userAddress}</p>}
      </div>
      <Form className="container">
      <Image
         width={200}
         src={myImage}
         preview={false}
         className="rounded-image"
        />
        <label>
          Free Mint ERC721A(MAX 3):
          <Input
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(parseInt(event.target.value))}
            min={1}
            max={3}
          />
        </label>
          <Button onClick={handleMint}>Mint</Button>
          {transactionHash && (
        <p>
          Transaction hash:{" "}
          <a href={`https://testnet.bscscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            {transactionHash}
          </a>
        </p>
      )}
      </Form>

    </div>
  );
}

export default App;