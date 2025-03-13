import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "pages/Home";
import reportWebVitals from "./reportWebVitals";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import "./index.less";

const sepolia = {
  id: window.TransformChainId,
  name: window.network,
  network: window.network,
  nativeCurrency: {
    decimals: 18,
    name: window.network,
    symbol: window.symbol,
  },
  rpcUrls: {
    public: { http: window.URL_LIST },
    default: { http: [window.ST_URL] },
  },
};

const { chains, publicClient } = configureChains([sepolia], [publicProvider()]);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: window.projectId,
        qrModalOptions: {
          "--wcm-z-index": "2000",
        },
      },
    }),
  ],
  publicClient,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WagmiConfig config={config}>
    {/*<React.StrictMode>*/}
    <RouterProvider router={router} />
    {/*</React.StrictMode>*/}
  </WagmiConfig>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
