import mongoose from "mongoose";

export const connectToDB = async () => {
  const uri = process.env.MONGO || "";

  const connection = { isConnected: false };

  try {
    if (connection.isConnected) return;
    const db = await mongoose.connect(uri);
    connection.isConnected = db.connections[0].readyState === 1;
  } catch (error: any) {
    throw new Error(error);
  }
};
