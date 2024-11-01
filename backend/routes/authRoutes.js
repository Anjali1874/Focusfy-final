import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);  // Assuming you'll add login functionality in authController

export default router;
