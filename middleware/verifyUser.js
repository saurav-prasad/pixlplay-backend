const verifyUser = (req, res, next) => {
    let success = false;
    // checking if userid exists in db
    const userId = req.userId;
    try {

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success, message: "Internal server error" })
    }
}