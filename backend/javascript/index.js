const Moralis = require('moralis').default;

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const connectToDb = require("./db/connect");
const createUser = require("./db/helpers/create_user");
const userExists = require('./db/helpers/user_exists');
const User = require("./db/models/user");
const { hashPassword, comparePassword } = require("./utils/passwordUtils");

// to use our .env variables
require('dotenv').config();

const app = express();
const port = 4000;

app.use(express.json());
app.use(cookieParser());

// allow access to React app domain
app.use(
    cors({
        origin: 'http://localhost:3001',
        credentials: true,
    })
);


const config = {
    domain: process.env.APP_DOMAIN,
    statement: 'Please sign this message to confirm your identity.',
    uri: process.env.REACT_URL,
    timeout: 60,
};

// request message to be signed by client
app.post('/request-message', async (req, res) => {
    console.log("Received request message");
    // console.log(req.body);
    const { address, chain, network } = req.body;

    try {
        const message = await Moralis.Auth.requestMessage({
            address,
            chain,
            ...config,
        });

        console.log(message);
        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.error(error);
    }
});

app.post('/verify', async (req, res) => {
    try {
        const loginMode = req.query.loginMode;
        const { message, signature } = req.body;

        if (loginMode === "wallet") {
            const { address, profileId } = (
                await Moralis.Auth.verify({
                    message,
                    signature,
                    networkType: 'evm',
                })
            ).raw;

            // const user = { address, profileId, signature };
            console.log("Received address = ", address);
            const user = JSON.parse(JSON.stringify(await User.findOne({ walletAddress: address })));
            console.log("Found User = ", user);
            let loginSuccess = { accountNew: false, success: false };

            if (await userExists(user)) {
                console.log(user);
                console.log(typeof user);
                // create JWT token
                const token = jwt.sign(user, process.env.AUTH_SECRET);

                // set JWT cookie
                res.cookie('jwt', token, {
                    httpOnly: true,
                });

                console.log(user);

                loginSuccess.success = true;

            } else {
                loginSuccess.accountNew = true;
                // createUser({ walletAddress: address });
                loginSuccess.success = true;
            }
            res.status(200).json({ user: user, loginSuccess: loginSuccess });
        }
        else if (loginMode === "username_password") {
            const credentials = req.body.credentials;

            console.log(credentials);
            let foundUser = await userExists({ username: credentials.username });
            console.log("User found?", foundUser);
            if (foundUser !== undefined) {
                console.log("User exists. Searching for users...");
                let getUser = await User.findOne({ username: credentials.username });
                let getUserLean = await User.findOne({ username: credentials.username }).lean();
                console.log("Found user = ", getUser);
                let getHash = await hashPassword(credentials.password);
                console.log("Generated hash: ", getHash);
                if (comparePassword(credentials.password, getUser.passwordHash)) {
                    console.log("User matches!");
                    const token = await jwt.sign(getUserLean, process.env.AUTH_SECRET);

                    console.log("Token = ", token)
                    // set JWT cookie
                    console.log("Setting JWT cookie")
                    res.status(200).cookie('jwt', token, {
                        httpOnly: true,
                    })
                    res.status(200).json({
                        user: JSON.parse(JSON.stringify(getUser)),
                        loginSuccess: { success: true, accountNew: false },
                    });
                    console.log("JWT cookie set");
                } else if (getUser.passwordHash === null || getUser.passwordHash === "" || getUser.passwordHash === undefined) {
                    console.log("New login method detected. Joining auth methods...");

                    let hashedPwd = await hashPassword(credentials.password);
                    getUser.passwordHash = hashedPwd;
                    await getUser.save();

                    const token = jwt.sign(getUserLean, process.env.AUTH_SECRET);
                    res.status(200).cookie('jwt', token, {
                        httpOnly: true,
                    });
                    res.status(200).json({
                        user: JSON.parse(JSON.stringify(getUserLean)),
                        loginSuccess: { success: true, accountNew: false },
                    });
                } else {
                    console.log("User found, but passwords don't match.")
                    res.status(200).json({
                        user: null,
                        loginSuccess: { success: false, accountNew: false },
                    });
                }

            }
        } else {
            console.log("User not found, creating...");
            createUser({ username: credentials.username, passwordHash: await hashPassword(credentials.password) });
            res.status(200).json({
                user: null,
                loginSuccess: { success: true, accountNew: true },
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.error(error);
    }
});

app.get('/authenticate', async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.sendStatus(403); // if the user did not send a jwt token, they are unauthorized

    try {
        const data = jwt.verify(token, process.env.AUTH_SECRET);
        res.json(data);
    } catch {
        return res.sendStatus(403);
    }
});

app.post("/signup", async (req, res) => {
    try {
        let newUser = req.body.user;
        console.log("New user = ", newUser)
        const ifUserExists = await userExists(newUser);
        console.log("Does user already exist?", ifUserExists);
        if (!ifUserExists) {
            console.log("New User Details=", newUser);
            createUser(newUser);
            res.status(200).json({ success: true, message: "New account created successfully. Please login." });
        } else {
            res.status(200).json({ success: false, message: "Account already exists. Please login" });
        }

    } catch (err) {
        console.log(err);
        res.status(200).json({ success: false });
    }
})

app.get('/logout', async (req, res) => {
    try {
        res.clearCookie('jwt');
        return res.sendStatus(200);
    } catch {
        return res.sendStatus(403);
    }
});

const startServer = async () => {
    await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
        connectToDb();
    });
};

startServer();