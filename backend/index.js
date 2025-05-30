import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "../routes/users.js";
import authRoute from "../routes/auth.js";
import entryRoute from "../routes/entries.js";
import routineRoute from "../routes/routines.js";
import mealRoute from "../routes/meals.js";
import cors from "cors";
import bodyParser from "body-parser";


dotenv.config();

const app = express();



// Middleware
app.use(bodyParser());
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

// Routes
app.get("/", (req, res) => {
  console.log("✅ GET / route hit");
  res.status(200).send("Welcome to MERN-GYMBRO-api");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/entries", entryRoute);
app.use("/api/routines", routineRoute);
app.use("/api/meals", mealRoute);


mongoose.connect(process.env.MONGO_URI)
  app.listen(process.env.PORT, () => {
    console.log('connected to db & listening on port', process.env.PORT)
  })
 