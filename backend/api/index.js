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

dotenv.config();

const app = express();

// MongoDB connection cache (for serverless)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.mongoDBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}

// Connect to DB before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: "*", // You can restrict to frontend domain if needed
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(morgan("dev"));

// Root route
app.get("/", (req, res) => {
  res.status(200).send("✅ MERN-GYMBRO API is working!");
});

// API routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/entries", entryRoute);
app.use("/api/routines", routineRoute);
app.use("/api/meals", mealRoute);

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Internal Server Error:", err);
  res.status(500).json({
    message: "Something went wrong!",
    error: err?.message || "Unknown error",
  });
});

// ✅ Export the app for Vercel serverless function handler
export default app;
