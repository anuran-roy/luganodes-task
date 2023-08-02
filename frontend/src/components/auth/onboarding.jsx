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
            }
        )

        if (resp.status == 200 && resp.data.success === true) {
            return true;
        } else {
            return false;
        }
    } 

    return (<>
        <h3 id="heading">Welcome to onboarding</h3>
        <form action="submit" onSubmit={async (event) => {
            event.preventDefault();
            saveData();
            let resp = await sendData(userData);

            if (resp) {
                navigate("/user");
            }
        }}>
            <label htmlFor="firstname">First Name</label>
            <input type="text" name="firstname" id="firstname" onChange={(event) => { setUserData({ ...userData, first_name: event.target.value }) }} value={userData?.first_name} required={true} />
            <br />
            <label htmlFor="lastname">Last Name</label>
            <input type="text" name="lastname" id="lastname" onChange={(event) => { setUserData({ ...userData, last_name: event.target.value }) }} value={userData?.last_name} required={true}/>
            <br />
            <label htmlFor="walletAddress">Wallet Address</label>
            <input type="text" name="walletAddress" id="walletAddress"
                // disabled={userData?.walletAddress !== undefined}
                value={userData?.walletAddress}
                required={true}
                onChange={(event) => { setUserData({ ...userData, walletAddress: event.target.value }) }}
            />
            <br />
            <button type="submit">Sign Up</button>
        </form>
    </>);
}