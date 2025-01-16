import express from "express";
import { getUserById } from "../controllers/user.js";
import { verifyToken} from "../middleware/auth.js";

// Router setup
const router = express.Router();

/* ROUTES */
// Route to get user by userId (authenticated user can view their own data)
router.get("/:userId", verifyToken, getUserById);

export default router;
