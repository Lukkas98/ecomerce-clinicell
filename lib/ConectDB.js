import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectDB = async () => {
  if (global.mongooseConn) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    global.mongooseConn = conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
