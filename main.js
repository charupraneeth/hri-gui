import "./style.css";

import { ethers } from "./ethers.min.js";

const getAccountResult = document.querySelector("#getAccountsResult");
const tokenName = document.querySelector("#tokenName");
const tokenBalance = document.querySelector("#tokenBalance");
const myAddress = document.querySelector("#myAddress");

const recieverAddressInput = document.querySelector("#recieverAddress");
const sendBtn = document.querySelector(".send-btn");

async function init() {
  try {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // MetaMask requires requesting permission to connect users accounts
    const accounts = await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...

    const signer = provider.getSigner();
    const accountAddress = accounts[0];

    myAddress.textContent = accountAddress;
    const balance = await signer.getBalance();
    const formatedBalance = ethers.utils.formatEther(balance);
    console.log(formatedBalance);
    getAccountResult.textContent = `${formatedBalance} eth`;

    // const haiAddress = "0x204C6fB8279588a1a8E49BE61C9B30E5648708FF";
    const daiAddress = "0xaD6D458402F60fD3Bd25163575031ACDce07538D";

    // The ERC-20 Contract ABI, which is a common contract interface
    // for tokens (this is the Human-Readable ABI format)
    const daiAbi = [
      // Some details about the token
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns(uint256)",
      // Get the account balance
      "function balanceOf(address) view returns (uint)",

      // Send some of your tokens to someone else
      "function transfer(address to, uint amount)",

      // An event triggered whenever anyone transfers to someone else
      "event Transfer(address indexed from, address indexed to, uint amount)",
    ];

    // The Contract object
    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);

    // Get the ERC-20 token name
    const contactName = await daiContract.name();
    // 'Dai Stablecoin'
    const contractDecimals = (await daiContract.decimals()).toNumber();

    // Get the ERC-20 token symbol (for tickers and UIs)
    const contractSymbol = await daiContract.symbol();

    // 'DAI'

    const daiBalance = ethers.utils.formatEther(
      (await daiContract.balanceOf(accountAddress)).toBigInt()
    );

    console.log({ contactName, contractSymbol, daiBalance, contractDecimals });
    tokenBalance.textContent = `${daiBalance} ${contractSymbol}`;
    tokenName.textContent = contactName;
    console.log(daiContract);

    // Receive an event when ANY transfer occurs
    daiContract.on("Transfer", (from, to, amount, event) => {
      console.log(
        `${from} sent ${ethers.utils.formatEther(
          amount
        )} ${contractSymbol} to ${to}`
      );
      alert(`${from} sent ${ethers.utils.formatEther(amount)} to ${to}`);
      // The event object contains the verbatim log data, the
      // EventFragment and functions to fetch the block,
      // transaction and receipt and event functions
    });
    const daiWithSigner = daiContract.connect(signer);

    const dai = ethers.utils.parseUnits("1.0", 18);

    console.log(dai);
    // Send 1 DAI to "ricmoo.firefly.eth"

    sendBtn.addEventListener("click", (e) => {
      try {
        e.preventDefault();
        const tx = daiWithSigner.transfer(recieverAddressInput.value, dai);
        console.log(recieverAddressInput.value);
        console.log(tx);
      } catch (error) {
        alert(error.message || "failed to complete transaction");
      }
    });
  } catch (error) {
    alert(error.message);
    getAccountResult.textContent = error.message;
  }
}

init();
