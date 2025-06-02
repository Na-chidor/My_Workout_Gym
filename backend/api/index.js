import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoute from "../routes/users.js";
import authRoute from "../routes/auth.js";
import entryRoute from "../routes/entries.js";
import routineRoute from "../routes/routines.js";
import mealRoute from "../routes/meals.js";

// Load environment variables
dotenv.config();

const app = express();

// MongoDB connection management
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
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

// Connect to DB before each request
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
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  console.log("✅ GET / route hit");
  res.status(200).send("Welcome to MERN-GYMBRO-api");
});

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/entries", entryRoute);
app.use("/api/routines", routineRoute);
app.use("/api/meals", mealRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Internal Server Error:", err);
  res.status(500).json({
    message: "Something broke!",
    error: err?.message || err?.toString() || "Unknown error",
  });
});

// ✅ Export the Express app for Vercel
export default app;
