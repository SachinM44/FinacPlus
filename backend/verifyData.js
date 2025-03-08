const { default: mongoose } = require("mongoose");
require('dotenv').config();
const { User } = require('./db/db');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to MongoDB successfully");

        const users = await User.find();
        console.log("Users:", users);

        mongoose.connection.close();
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });