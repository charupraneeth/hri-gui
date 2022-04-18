import "./style.css";

import MetaMaskOnboarding from "@metamask/onboarding";

const getAccountsResult = document.getElementById("getAccountsResult");

window.addEventListener("DOMContentLoaded", () => {
  const onboarding = new MetaMaskOnboarding();
  const onboardButton = document.getElementById("onboard");
  let accounts;

  const updateButton = () => {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      onboardButton.innerText = "Click here to install MetaMask!";
      onboardButton.onclick = () => {
        onboardButton.innerText = "Onboarding in progress";
        onboardButton.disabled = true;
        onboarding.startOnboarding();
      };
    } else if (accounts && accounts.length > 0) {
      onboardButton.innerText = "Connected";
      onboardButton.disabled = true;
      onboarding.stopOnboarding();
    } else {
      onboardButton.innerText = "Connect";
      onboardButton.onclick = async () => {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      };

      init();
    }
  };

  updateButton();
  if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    window.ethereum.on("accountsChanged", (newAccounts) => {
      accounts = newAccounts;
      updateButton();
    });
  }
});

async function init() {
  const accounts = await ethereum.request({ method: "eth_accounts" });
  //We take the first address in the array of addresses and display it
  getAccountsResult.innerHTML = accounts[0] || "Not able to get accounts";
}
