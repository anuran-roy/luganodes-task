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
                let newObject = { mode: "wallet", walletAddress: authData.address }
                writeToLocalStorage('loginDetails', newObject);
            })
            .catch((err) => {
                navigate('/signin');
            });
    }, []);

    async function signOut() {
        let loginMode = readFromLocalStorage('loginDetails').mode;
        if ( loginMode === 'wallet') {
            await axios(
                // `${process.env.REACT_APP_SERVER_URL}/logout`,
                `http://localhost:4000/logout`,
                {
                    withCredentials: true,
                });
        }
        navigate('/signin');
    }

    return (
        <div>
            <h3>User session:</h3>
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <button type="button" onClick={signOut}>
                Sign out
            </button>
        </div>
    );
}