//routes/auth.js

import express from "express";
import { login, register, confirmEmail} from "../controllers/auth.js ";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/confirm/:token", confirmEmail);

export default router;
