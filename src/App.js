import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  // State vars
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false);

  const canConnectToContract = account && web3Api.contract;

  // Reload Effect
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);

  // Metamask account change listener
  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => setAccount(accounts[0]));
    provider.on("chainChanged", (_) => window.location.reload());
  };

  // Web3
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const contract = await loadContract("Faucet", provider);
        setAccountListener(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3Api((web3Api) => ({ ...web3Api, isProviderLoaded: true }));
        console.error("Please install metamask!");
      }
    };

    loadProvider();
  }, []);

  // Accounts
  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  // Balance
  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);

  // Add funds
  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  // Withdraw funds
  const withdrawFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.withdraw(web3.utils.toWei("0.2", "ether"), {
      from: account,
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  // Elements
  const accountNumber = (account) => <div>{account}</div>;
  const connectAccountButton = (
    <button
      className="button is-small"
      onClick={() =>
        web3Api.provider.request({ method: "eth_requestAccounts" })
      }
    >
      Connect Wallet
    </button>
  );
  const installWallet = (
    <div className="notification is-size-6 is-warning is-small is-rounded">
      Wallet not detected! {` `}
      <a target="_blank" rel="noreferrer" href="https://docs.metamask.io">
        Install Metamask
      </a>
    </div>
  );

  return (
    <>
      <div className="faucet-wrapper">
        {web3Api.isProviderLoaded ? (
          <div className="faucet">
            <div className="is-flex if-flex-direction-row is-align-items-center">
              <span>
                <strong className="mr-2">Account: </strong>
              </span>
              {account
                ? accountNumber(account)
                : !web3Api.provider
                ? installWallet
                : connectAccountButton}
            </div>
            <div className="balance-view is-size-2 mb-4 my-4">
              Current Balance: <strong>{balance || 0}</strong> ETH
            </div>

            {!canConnectToContract && (
              <i className="is-block my-2">
                You are connect to a wrong network. Please connect to Ganache
              </i>
            )}

            <button
              disabled={!canConnectToContract}
              onClick={addFunds}
              className="button is-link mr-2"
            >
              Donate 1 ETH
            </button>
            <button
              disabled={!canConnectToContract}
              onClick={withdrawFunds}
              className="button is-primary"
            >
              Withdraw 0.1 ETH
            </button>
          </div>
        ) : (
          <span>Looking for Web3...</span>
        )}
      </div>
    </>
  );
}

export default App;
