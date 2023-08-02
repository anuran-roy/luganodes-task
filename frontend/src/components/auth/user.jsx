import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { readFromLocalStorage, writeToLocalStorage } from '../utils/localStorageUtils';

export default function User() {
    const navigate = useNavigate();

    const [session, setSession] = useState({});

    useEffect(() => {
        axios(
            // `${process.env.REACT_APP_SERVER_URL}/authenticate`,
            `http://localhost:4000/authenticate`,
            {
            withCredentials: true,
        })
            .then(({ data }) => {
                const { iat, ...authData } = data; // remove unimportant iat value

                setSession(authData);
                console.log("Writing auth data to local storage");
                let newObject = {user: { mode: "wallet", walletAddress: authData.address }}
                writeToLocalStorage('loginDetails', newObject);
            })
            .catch((err) => {
                console.log(err);
                navigate('/signin');
            });
    }, []);

    async function signOut() {
        await axios(
            // `${process.env.REACT_APP_SERVER_URL}/logout`,
            `http://localhost:4000/logout`,
            {
                withCredentials: true,
            }
        );
        navigate('/signin');
    }

    return (
        <div>
            <h3 className="p-3 m-3 font-bold text-4xl w-screen text-center">Dashboard</h3>
            <pre className="bg-gray-300 rounded-lg mx-3 my-2 px-3 py-2 flex w-100 max-w-100">{JSON.stringify(session, null, 2)}</pre>
            <div className="flex flex-col">
                <div className="w-100 flex">
                    <div className="text-xl font-bold mx-3 py-2 px-3">Username:</div>
                    <div className="text-xl mx-3 py-2 px-3">{session?.username}</div>
                </div>
                <div className="w-100 flex">
                    <div className="text-xl font-bold mx-3 py-2 px-3">Name:</div>
                    <div className="text-xl mx-3 py-2 px-3">{`${session?.first_name} ${session?.last_name}`}</div>
                </div>
                {
                    (session?.walletAddress !== undefined) ? (<div className="w-100 flex">
                    <div className="text-xl font-bold mx-3 py-2 px-3">Wallet Address:</div>
                    <div className="text-xl mx-3 py-2 px-3">{session?.walletAddress}</div>
                </div>) : (<></>)
                }
            </div>
            <button type="button" onClick={signOut} className="px-3 my-2 mx-3 py-2 text-white bg-red-500 hover:bg-red-700 rounded-xl">
                Sign out
            </button>
        </div>
    );
}