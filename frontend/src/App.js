import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { createConfig, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from "wagmi/chains";

import SignIn from "./components/auth/signin";
import User from "./components/auth/user";
import Onboarding from "./components/auth/onboarding";
import Dashboard from "./components/home/dashboard";

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/user",
    element: <User />,
  },
  {
    path: "/",
    element: <h1>Home Component</h1>,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/home",
    element: <Dashboard />,
  },
]);

function App() {
  return (
    <WagmiConfig config={config}>
      <RouterProvider router={router} />
    </WagmiConfig>
  );
}

export default App;