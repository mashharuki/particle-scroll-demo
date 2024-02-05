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
  const [smartAccount, setSmartAccount] = useState<any>("");
  const [customProvider, setCustomProvider] = useState<any>();
  const [smartAccountAddress, setSmartAccountAddress] = useState<string>("");

  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo]);

  const fetchBalance = async () => {
    const smartAccount = new SmartAccount(provider, {
      projectId: import.meta.env.VITE_APP_PROJECT_ID!,
      clientKey: import.meta.env.VITE_APP_CLIENT_KEY!,
      appId: import.meta.env.VITE_APP_APP_ID!,
      aaOptions: {
        simple: [{ chainId: ScrollSepolia.id, version: '1.0.0' }]
      },
    });
  
    const customProvider = new ethers.providers.Web3Provider(new AAWrapProvider(smartAccount , SendTransactionMode.Gasless), "any");
    const balanceResponse = await customProvider.getBalance(await smartAccount.getAddress());

    setBalance(ethers.utils.formatEther(balanceResponse));
    setSmartAccountAddress(await smartAccount.getAddress());
    setCustomProvider(customProvider);
    setSmartAccount(smartAccount)
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
    const tx = {
      to: "0x000000000000000000000000000000000000dEaD",
      value: ethers.utils.parseEther("0.001"),
      data: "0x"
    };

    console.log("tx:", tx)

    try {
      const userOpBundle = await smartAccount.buildUserOperation({ tx })
      const userOp = userOpBundle.userOp;
      const userOpHash = userOpBundle.userOpHash;

      // send UserOp
      const txHash = await smartAccount.sendUserOperation({ userOp, userOpHash });

      notification.success({
        message: txHash
      })
    } catch(err: any) {
      console.error("err:", err)
      notification.error({
        message: err
      })
    }
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