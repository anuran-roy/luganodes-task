import { useNavigate } from "react-router-dom";

import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import axios from "axios";
import { useState } from "react";
import { writeToLocalStorage } from "../utils/localStorageUtils";

export default function SignIn() {
    const navigate = useNavigate();

    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [loginSuccess, setLoginSuccess] = useState({accountNew: false, success: false});

    const handleGoogleAuth = () => {

    };

    const handleTraditionalAuth = () => {

    };

    const handleWeb3Auth = async () => {
        //disconnects the web3 provider if it's already active
        if (isConnected) {
            await disconnectAsync();
        }
        // enabling the web3 provider metamask
        const { account } = await connectAsync({
            connector: new InjectedConnector(),
        });

        const userData = { address: account, chain: 1 };
        // making a post request to our 'request-message' endpoint
        const { data } = await axios.post(
            // `${process.env.REACT_APP_SERVER_URL}/request-message`,
            `http://localhost:4000/request-message`,
            userData,
            {
                headers: {
                    "content-type": "application/json",
                },
            }
        );
        const message = data.message;
        // signing the received message via metamask
        const signature = await signMessageAsync({ message });

        let res = await axios.post(
            // `${process.env.REACT_APP_SERVER_URL}/verify`,
            `http://localhost:4000/verify?loginMode=wallet`,
            {
                message,
                signature,
            },
            { withCredentials: true } // set cookie from Express server

        );

        let resp = res.data;
        // redirect to /user
        console.log("Login details received = ");
        console.log(resp);
        writeToLocalStorage('loginDetails', {mode: "wallet", walletAddress: resp.address})
        if (resp.loginSuccess?.success && !resp.loginSuccess?.accountNew) {
            navigate("/user");
        } else if (resp.loginSuccess?.success && resp.loginSuccess?.accountNew) {
            navigate("/onboarding");
        }
    };

    return (
        <div>
            <h3>Web3 Authentication</h3>
            <button onClick={() => handleWeb3Auth()}>Authenticate via MetaMask</button>
            <button onClick={() => handleGoogleAuth()}>Authenticate via Google</button>
            <button onClick={() => handleTraditionalAuth()}>Authenticate via Username/Password</button>

        </div>
    );
}