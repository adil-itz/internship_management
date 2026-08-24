import mongoose from "mongoose";
import dns from "dns";
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);

        process.exit(1);
    }
};

export default connectDB;
