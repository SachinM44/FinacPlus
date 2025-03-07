const express = require('express');
const router = express.Router();
const { RegistrationInput, LoginInput, UpdateInput } = require("@finacplus1/common");
const { User } = require('../db/db');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const middleware = require('../config/middleware');
const { JWT_SECRET } = process.env;

router.post('/register', async (req, res) => {
    const { success, error } = RegistrationInput.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            msg: "Invalid input",
            error: error.errors
        });
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(409).json({
            msg: "Email is already being used, try with another email-id"
        });
    }
    await User.create({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });
    res.status(201).json({
        msg: "User registered successfully"
    });
});

router.post('/login', async (req, res) => {
    const success = await LoginInput.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: " somthing went wrong pleace try after some time "
        })
    }
    const user = User.findOne({
        email: req.body.email,
        password: req.body.password
    });
    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)
        res.json({
            token: token
        })
        return
    }
    res.status(200).json({
        msg: "you have logged-in succesfully "
    })
})

router.put('/update', middleware, async (req, res) => {
    const { success, error } = UpdateInput.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            msg: "Invalid input",
            error: error.errors
        });
    }
    const updatedUser = await User.findByIdAndUpdate(req.userId, {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    }, { new: true });

    if (!updatedUser) {
        return res.status(404).json({
            msg: "User not found"
        });
    }

    res.status(200).json({
        msg: "User updated successfully",
        user: updatedUser
    });
});

module.exports = router;
