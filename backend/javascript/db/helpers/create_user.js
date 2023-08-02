const User = require("../models/user")

const createUser = (userObject) => {
    const newUser = new User(userObject);
    console.log("Creating new user...")
    newUser.save()
        .then(
            (result) => {
                console.log("User created successfully");
                console.log(result)
            }
        ).catch((err) => {
            console.log("Failed to create new user. Reason:");
            console.log(err);
        })
}

module.exports = createUser;