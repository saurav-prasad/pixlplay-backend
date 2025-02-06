const userSchema = require('../models/userSchema')

const verifyUser = async (req, res, next) => {
    let success = false;
    // checking if userid exists in db
    const userId = req.userId;
    try {
        const checkUser = await userSchema.findById(userId)
        if (!checkUser) {
            return res.status(400).json({ success, message: "User not found" })
        }
        else {
            next()
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success, message: "Internal server error" })
    }
}