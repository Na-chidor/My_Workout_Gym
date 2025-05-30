// api/index.js

import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import userRoute from "../routes/users.js";
import authRoute from "../routes/auth.js";
import entryRoute from "../routes/entries.js";
import routineRoute from "../routes/routines.js";
import mealRoute from "../routes/meals.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import serverless from "serverless-http";

dotenv.config();

const app = express();

// Reusable DB connection
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.mongoDBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
// Connect on each request (serverless safe)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("common"));

// Routes
app.get("/", (req, res) => {
  console.log("GET / hit");
  return res.status(200).send("Welcome to MERN-GYMBRO-api");
});
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/entries", entryRoute);
app.use("/api/routines", routineRoute);
app.use("/api/meals", mealRoute);
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).json({ message: 'Something broke!', error: err.toString() });
});
// Export for Vercel serverless function
export const handler = serverless(app);
export default handler;
