import express from "express";
import {
  createTransaction,
  getUserTransactions,
  getAllTransactions,
} from "../controllers/transaction.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

/* CREATE TRANSACTION */
router.post("/", verifyToken, createTransaction);

/* GET TRANSACTIONS FOR A SPECIFIC USER */
router.get("/user/:userId", verifyToken, getUserTransactions);

/* GET ALL TRANSACTIONS (Admin) */
router.get("/",  verifyToken, verifyAdmin, getAllTransactions);

export default router;
