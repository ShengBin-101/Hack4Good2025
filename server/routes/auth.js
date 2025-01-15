import express from 'express';
import { login } from "../controllers/auth.js";
import { register } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post("/login", login); // will be prefixed with auth/ so it becomes auth/login later

export default router;