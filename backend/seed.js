const { default: mongoose } = require("mongoose");
require('dotenv').config();
const { User } = require('./db/db');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to MongoDB successfully");

        const users = [
            {
                userName: "John Doe",
                email: "john.doe@example.com",
                password: "password123"
            },
            {
                userName: "Jane Smith",
                email: "jane.smith@example.com",
                password: "password123"
            },
            {
                userName: "Alice Johnson",
                email: "alice.johnson@example.com",
                password: "password123"
            }
        ];

        try {
            await User.deleteMany({});
            await User.insertMany(users);
            console.log("Data seeded successfully");
        } catch (error) {
            console.error("Error seeding data:", error);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });