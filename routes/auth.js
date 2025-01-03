const { body, validationResult } = require('express-validator');
const express = require('express');
const userSchema = require('../schema/user')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET
const fetchUser = require('../middleware/fetchUser')

// Create user - POST request
router.post('/createuser',
    [
        body('username', "Username should be at least 3 characters long").isLength({ min: 3 }),
        body('username', 'Username should not be greater than 15 characters').isLength({ max: 15 }),
        body('email', "Invalid email").isEmail(),
        body('password', "Password should be at least 6 characters long").isLength({ min: 6 }),
    ],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, message: errors.array()[0].msg })
        }
        try {
            const { username, email, password, name } = req.body
            // check if username and email already exists
            const checkUser = await userSchema.findOne({ $or: [{ username }, { email }] })

            if (checkUser) {
                return res.status(400).json({ success, message: `${checkUser.email === email ? "Email" : "Username"} already exists` })
            }

            // hash password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            //profile photo
            const profilePhoto = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`

            // create checkUser
            const newUser = await userSchema.create({ username, email, password: hashedPassword, name, profilePhoto })

            // generate token
            const token = jwt.sign({ userId: newUser.id }, jwtSecret)
            success = true

            res.send({
                success, message: "User created successfully", data: {
                    username,
                    email,
                    id: newUser.id,
                    profilePhoto,
                    name,
                    token
                }
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({ success, message: "Internal server error" })
        }
    }
)

// Login - POST request
router.post('/loginuser',
    [
        body("password", "Password should be at least 6 characters long").isLength({ min: 6 }),
    ],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, message: errors.array()[0].msg })
        }
        try {
            const { username, email, password } = req.body
            if (!username && !email) {
                return res.status(400).json({ success, message: "Username or email is required" })
            }
            // check if checkUser exists
            const checkUser = await userSchema.findOne({ $or: [{ username }, { email }] })
            if (!checkUser) {
                return res.status(400).json({ success, message: "Invalid credentials" })
            }
            // check password
            const isPasswordMatched = await bcrypt.compare(password, checkUser.password)
            if (!isPasswordMatched) {
                return res.status(400).json({ success, message: "Invalid credentials" })
            }
            // generate token
            const token = jwt.sign({ userId: checkUser.id }, jwtSecret)
            success = true
            res.send({
                success, message: "User logged in successfully", data: {
                    username: checkUser.username,
                    email: checkUser.email,
                    id: checkUser.id,
                    profilePhoto: checkUser.profilePhoto,
                    name: checkUser?.name,
                    phone: checkUser?.phone,
                    token
                }
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success, message: "Internal server error" })
        }
    }
)

// fetch user - GET request
router.get('/fetchuser', fetchUser,
    async (req, res) => {
        let success = false
        try {
            const userId = req.userId

            const checkUser = await userSchema.findById(userId)
            if (!checkUser) {
                return res.status(400).json({ success, message: "User not found" })
            }
            success = true
            res.send({
                success, message: "User fetched successfully", data: {
                    username: checkUser.username,
                    email: checkUser.email,
                    id: checkUser.id,
                    profilePhoto: checkUser.profilePhoto,
                    name: checkUser?.name,
                    phone: checkUser?.phone,
                }
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ success, message: "Internal server error" })
        }
    }
)

module.exports = router;