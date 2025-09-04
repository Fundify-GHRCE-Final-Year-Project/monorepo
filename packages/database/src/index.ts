import mongoose from "mongoose";
import {
  ProjectModel,
  InvestmentModel,
  UserModel,
  IndexerStateModel,
} from "./models/models.ts";

let cached: typeof mongoose | null = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set.");
  if (cached) return cached;

  mongoose.connection.on("connected", () => console.log("🟢 Mongo connected"));
  mongoose.connection.on("error", (err) =>
    console.error("🔴 Mongo error", err)
  );

  cached = await mongoose.connect(uri);
  return cached;
}

export {
  ProjectModel,
  InvestmentModel,
  UserModel,
  IndexerStateModel,
  connectDB,
};
