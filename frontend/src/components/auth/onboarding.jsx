import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { readFromLocalStorage, writeToLocalStorage, updateLocalStorage } from '../utils/localStorageUtils';

export default function Onboarding() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("loginDetails")).user); 

    const saveData = () => {
        localStorage.setItem("loginDetails", JSON.stringify(userData));
    }

    const sendData = async (userData) => {
        let resp = await axios.post(
            `http://localhost:4000/signup`,
            {
                user: userData
            }, { withCredentials: true}
        )

        if (resp.status == 200 && resp.data.success === true) {
            return true;
        } else {
            return false;
        }
    } 

    return (<div className="py-2 my-3 mx-3 px-2">
        <h3 id="heading" className="text-3xl font-bold align-center w-screen text-center">Welcome to onboarding</h3>
        <form action="submit" onSubmit={async (event) => {
            event.preventDefault();
            saveData();
            let resp = await sendData(userData);

            if (resp) {
                navigate("/user");
            }
        }}>
            <label htmlFor="firstname">First Name</label>
            <input
                className="px-3 mx-3 py-2 my-2 text-gray-500 border-2 rounded-lg"
                type="text" name="firstname"
                id="firstname"
                onChange={(event) => {
                    setUserData({ ...userData, first_name: event.target.value })
                }} value={userData?.first_name} required={true} />
            <br />
            <label htmlFor="lastname">Last Name</label>
            <input
                className="px-3 mx-3 py-2 my-2 text-gray-500 border-2 rounded-lg"
                type="text" name="lastname" id="lastname" onChange={(event) => { setUserData({ ...userData, last_name: event.target.value }) }} value={userData?.last_name} required={true} />
            <br />
            <label htmlFor="walletAddress">Wallet Address</label>
            <input
                className="px-3 mx-3 py-2 my-2 text-gray-500 border-2 rounded-lg"
                type="text" name="walletAddress" id="walletAddress"
                // disabled={userData?.walletAddress !== undefined}
                value={userData?.walletAddress}
                required={readFromLocalStorage('loginDetails').mode === 'wallet' ? true : false}
                onChange={(event) => { setUserData({ ...userData, walletAddress: event.target.value }) }}
            />
            <br />
            <label htmlFor="username">Username</label>
            <input
                className="px-3 mx-3 py-2 my-2 text-gray-500 border-2 rounded-lg"
                type="text" name="username" id="username"
                // disabled={userData?.walletAddress !== undefined}
                value={userData?.username}
                required={true}
                onChange={(event) => { setUserData({ ...userData, username: event.target.value }) }}
            />
            <br />
            <label htmlFor="password">Password</label>
            <input
                className="px-3 mx-3 py-2 my-2 text-gray-500 border-2 rounded-lg"
                type="password" name="password" id="password"
                // disabled={userData?.walletAddress !== undefined}
                value={userData?.password}
                required={readFromLocalStorage('loginDetails').mode === 'username_password' ? true : false}
                onChange={(event) => { setUserData({ ...userData, password: event.target.value }) }}
            />
            <br />
            <button
                className="px-3 mx-3 py-2 my-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md"
                type="submit">Sign Up</button>
        </form>
    </div>);
}