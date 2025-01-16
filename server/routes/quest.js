import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import { createQuest, getQuests } from "../controllers/quest.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createQuest);
router.get("/", verifyToken, getQuests);

export default router;