import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { createTaskCategory, getTaskCategories } from '../controllers/taskCategory.js';

const router = express.Router();

router.post('/', verifyToken, verifyAdmin, createTaskCategory);
router.get('/', verifyToken, verifyAdmin, getTaskCategories);

export default router;