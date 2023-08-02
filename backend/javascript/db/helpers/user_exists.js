const mongoose = require("mongoose");
const User = require("../models/user");

const userExists = (userObject) => {

    User.exists({ emailAccount: userObject.emailAccount, walletAddress: userObject.walletAddress })
    return false;
}

module.exports = userExists;