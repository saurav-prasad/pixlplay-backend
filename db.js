const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongo = async () => {
    try {
        // connect to the mongoDB database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error(error);
    }
}
module.exports = connectToMongo