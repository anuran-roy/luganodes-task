const mongoose = require("mongoose");
const User = require("../models/user");

const userExists = async (userObject) => {

    if (userObject === null || userObject === undefined) {
        return false;
    }
    let resp = await User.exists({ emailAccount: userObject.emailAccount, walletAddress: userObject.walletAddress })
    return resp;
}

module.exports = userExists;