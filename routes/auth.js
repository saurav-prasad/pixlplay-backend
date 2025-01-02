const { body, validationResult } = require('express-validator');
const express = require('express');
const userSchema = require('../schema/user')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET

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
            const user = await userSchema.findOne({ $or: [{ username }, { email }] })

            if (user) {
                return res.status(400).json({ success, message: `${user.email === email ? "Email" : "Username"} already exists` })
            }

            // hash password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            //profile photo
            const dp = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`

            // create user
            const newUser = await userSchema.create({ username, email, password: hashedPassword, name, dp })

            // generate token
            const token = jwt.sign({ userId: newUser.id }, jwtSecret)
            success = true

            res.send({
                success, message: "User created successfully", data: {
                    username,
                    email,
                    id: newUser.id,
                    dp,
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

module.exports = router;