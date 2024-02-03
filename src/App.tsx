import { useEffect, useState } from 'react';

import { AAWrapProvider, SendTransactionMode, SmartAccount } from '@particle-network/aa';
import { useAuthCore, useConnect, useEthereum } from '@particle-network/auth-core-modal';
import { ScrollSepolia } from '@particle-network/chains/dist';

import { notification } from 'antd';
import { ethers } from 'ethers';

import './App.css';

const App = () => {
  const { provider } = useEthereum();
  const { connect, disconnect } = useConnect();
  const { userInfo } = useAuthCore();

  const [balance, setBalance] = useState<string>("");
  const [smartAccountAddress, setSmartAccountAddress] = useState<string>("");

  const smartAccount = new SmartAccount(provider, {
    projectId: import.meta.env.VITE_APP_PROJECT_ID!,
    clientKey: import.meta.env.VITE_APP_CLIENT_KEY!,
    appId: import.meta.env.VITE_APP_APP_ID!,
    aaOptions: {
      simple: [{ chainId: ScrollSepolia.id, version: '1.0.0' }]
    }
  });

  const customProvider = new ethers.providers.Web3Provider(new AAWrapProvider(smartAccount, SendTransactionMode.Gasless), "any");

  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo]);

  const fetchBalance = async () => {
    const balanceResponse = await customProvider.getBalance(await smartAccount.getAddress());

    setBalance(ethers.utils.formatEther(balanceResponse));
    setSmartAccountAddress(await smartAccount.getAddress())
  }

  const handleLogin = async (authType: any) => {
    if (!userInfo) {
      await connect({
        socialType: authType,
        chain: ScrollSepolia,
      });
    }
  };

  const executeUserOp = async () => {
    const signer = customProvider.getSigner();

    const tx = {
      to: "0x000000000000000000000000000000000000dEaD",
      value: ethers.utils.parseEther("0.001"),
    };

    const txResponse = await signer.sendTransaction(tx);
    const txReceipt = await txResponse.wait();

    notification.success({
      message: txReceipt.transactionHash
    })
  };

  return (
    <div className="App">
      {!userInfo ? (
        <div className="login-section">
          <button className="sign-button" onClick={() => handleLogin('google')}>Sign in with Google</button>
          <button className="sign-button" onClick={() => handleLogin('twitter')}>Sign in with Twitter</button>
        </div>
      ) : (
        <div className="profile-card">
          <h2>{userInfo.name}</h2>
          <h3>Your Address: {smartAccountAddress}</h3>
          <div className="balance-section">
            <small>{balance} ETH</small>
            <button className="sign-message-button" onClick={executeUserOp}>Execute User Operation</button>
            <button className="disconnect-button" onClick={() => disconnect()}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;