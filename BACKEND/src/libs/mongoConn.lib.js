import mongoose from "mongoose";

export let connectMongoDB = async () => {
    try {
        let conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected! ${conn.connection.host}`)
    }
    catch (e) {
        console.log(`Database connection Error ${e}`)
    }
}