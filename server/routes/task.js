import express from "express";
import { 
  createTask, 
  approveTask, 
  getAllTasks, 
  getUserTasks 
} from "../controllers/task.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

/* ROUTES */
// User creates a task
router.post("/", verifyToken, createTask);

// Admin approves/rejects a task
router.put("/:taskId/approve", verifyToken, verifyAdmin, approveTask);

// Admin gets all tasks
router.get("/", verifyToken, verifyAdmin, getAllTasks);

// User gets their tasks
router.get("/:userId", verifyToken, getUserTasks);

export default router;
