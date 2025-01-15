import express from 'express';
import { login, register, verifyOtp } from "../controllers/auth.js";

const router = express.Router();

router.post('/register', register);
router.post("/login", login); // will be prefixed with auth/ so it becomes auth/login later
router.post('/verify-otp', verifyOtp);

export default router;