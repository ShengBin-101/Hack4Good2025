import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { getPendingUsers, approveUser, rejectUser, getExistingUsers } from '../controllers/admin.js';

const router = express.Router();

router.get('/pending', verifyToken, verifyAdmin, getPendingUsers);
router.get('/existing', verifyToken, verifyAdmin, getExistingUsers); 
router.put('/approve/:id', verifyToken, verifyAdmin, approveUser);
router.delete('/reject/:id', verifyToken, verifyAdmin, rejectUser);

export default router;