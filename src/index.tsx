import React from 'react';
import ReactDOM from 'react-dom/client';

import { AuthType } from '@particle-network/auth-core';
import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';
import { ScrollSepolia } from '@particle-network/chains/dist';

import App from './App';

import('buffer').then(({ Buffer }) => {
  window.Buffer = Buffer;
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthCoreContextProvider
      options={{
        projectId: import.meta.env.VITE_APP_PROJECT_ID!,
        clientKey: import.meta.env.VITE_APP_CLIENT_KEY!,
        appId: import.meta.env.VITE_APP_APP_ID!,
        authTypes: [
          AuthType.email, 
          AuthType.google, 
          AuthType.twitter,
          AuthType.discord,
          AuthType.facebook,
          AuthType.github
        ],
        themeType: 'dark',
        fiatCoin: 'USD',
        language: 'en',
        erc4337: {
          name: "BICONOMY",
          version: "2.0.0",
        },
        wallet: {
          visible: true,
          customStyle: {
            supportChains: [ScrollSepolia]
          },
        },
      }}
    >
      <App />
    </AuthCoreContextProvider>
  </React.StrictMode>
)