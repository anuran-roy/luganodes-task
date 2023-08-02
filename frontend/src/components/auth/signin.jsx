import { useNavigate } from "react-router-dom";

import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import axios from "axios";
import { useState } from "react";
import { writeToLocalStorage } from "../utils/localStorageUtils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
    const navigate = useNavigate();

    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [loginSuccess, setLoginSuccess] = useState({accountNew: false, success: false});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const handleGoogleAuth = () => {
        console.log("Logging in with Google auth - gmail account")
    };

    const handleTraditionalAuth = async (username, password) => {
        console.log("Logging in with traditional auth - username and password");

        console.log("Username", username);
        console.log("Password", password);

        console.log("Sending request through Axios")
        let resp = await axios.post(
            "http://localhost:4000/verify?loginMode=username_password", {
                credentials: {
                    username, 
                    password
                }
        },
            // {
            //     headers: {
            //         "content-type": "application/json",
            //     },
            // }
        )

        console.log("Login details received = ");
        console.log(resp);
    };

    const handleWeb3Auth = async () => {
        console.log("Logging in with Web3 auth - MetaMask Wallet")
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

        let resp = await res.data;
        // redirect to /user
        console.log("Login details received = ");
        console.log(resp);
        writeToLocalStorage('loginDetails', { mode: "wallet", walletAddress: resp.address })

        if (resp.loginSuccess?.success && !resp.loginSuccess?.accountNew) {
            toast.success("Login Successful! Redirecting to your dashboard...");
        } else if (resp.loginSuccess?.success && resp.loginSuccess?.accountNew) {
            toast.success("Login Successful! New user detected, onboarding...");
        }
        setTimeout(() => {
            if (resp.loginSuccess?.success && !resp.loginSuccess?.accountNew) {
                navigate("/user");
            } else if (resp.loginSuccess?.success && resp.loginSuccess?.accountNew) {
                navigate("/onboarding");
            }
        }, 5000);
    };

    return (
        <div className="py-2 my-3 mx-3 px-2 top-0 bottom-0 h-full align-middle overflow-hidden">
            <h3 className="text-3xl font-bold align-center w-screen text-center">Login</h3>
            <ToastContainer autoClose={5000} />
            <div id="auth-panel" className="flex-row items-center objects-center justify-center w-screen self-center text-center my-3 py-5">
                <form action="submit"
                    className="flex flex-col items-center justify-center w-100 self-center text-center my-3 py-5"
                    onSubmit={async (event) => {
                        event.preventDefault();
                        let resp = await handleTraditionalAuth(username, password);
                    }
                }>
                    <div className="flex flex-row px-3 mx-3 my-2">
                        <label htmlFor="username" className="px-3 mx-3 py-2 my-2 text-gray-700">Username: </label>
                        <input type="text" name="username" id="username" placeholder="Username" className="px-3 mx-3 py-2 my-2 text-gray-500 border-2 rounded-lg" onChange={(event) => { setUsername(event.target.value)}} value={username} required/>
                    </div>
                    <div className="flex flex-row px-3 mx-3 my-2">
                        <label htmlFor="password" className="px-3 mx-3 py-2 my-2 text-gray-700">Password: </label>
                        <input type="password" name="password" id="password" placeholder="Password" className="px-3 mx-3 py-2 my-2 text-gray-500 border-2 rounded-lg" value={password} onChange={(event) => { setPassword(event.target.value)}} required/>
                    </div>
                    <button className="px-3 mx-3 py-2 my-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md" type="submit">Enter</button>
                </form>
                <button className="px-3 mx-3 py-2 my-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md" onClick={() => handleWeb3Auth()}>Authenticate via MetaMask</button>
                <button className="px-3 mx-3 py-2 my-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md" onClick={() => handleGoogleAuth()}>Authenticate via Google</button>
            </div>
        </div>
    );
}