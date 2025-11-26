const mongoose = require("mongoose")

const connectDB = async()=>{
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb+srv://somesh:somesh@cluster0.bmkn5te.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(mongoURI);
        console.log("Connected to DB!!")
    } catch (error) {
        console.log(error)
    }
}
module.exports = connectDB