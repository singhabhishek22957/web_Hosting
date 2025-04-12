import mongoose from "mongoose"

const connectMongoDB = async()=>{
    try {
        const connectionInstance = await  mongoose.connect(`${process.env.MONGO_URL}${process.env.MONGODB_DATABASE}`)
        console.log("\n\n\n MongoDB connected successfully: ", connectionInstance.connection.host, "\n\n\n");
        
    } catch (error) {
        console.log("\n\n\n MongoDB connection failed: ", error, "\n\n\n");
        process.exit(1);
        
    }
}

export default connectMongoDB