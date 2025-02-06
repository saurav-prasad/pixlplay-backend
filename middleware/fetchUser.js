require('dotenv').config()
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

const fetchUser = (req, res, next) => {
    let success = false
    // checking if token present in req headers
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).json({ success, message: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, jwtSecret)
        req.userId = data.userId // map usedId to req object
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success, message: "Internal server error" })
    }
}
module.exports = fetchUser