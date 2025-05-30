//index.js

import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import entryRoute from "./routes/entries.js";
import routineRoute from "./routes/routines.js";
import mealRoute from "./routes/meals.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser"; 
import { createServer } from 'http';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7700;

mongoose.connect(process.env.mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

app.use(cookieParser())
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());

app.use(cors({
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}))
app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome to MERN-GYMBRO-api');
  });

app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/entries", entryRoute);
app.use("/api/routines", routineRoute);
app.use("/api/meals", mealRoute);

const server = createServer(app);
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);

});
export default server;