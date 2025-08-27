// src/routes/user/user.routes.ts

import express from 'express';
import { registerUser,
    getPendingRequestsByDepartment,
  updateUserApprovalStatus,
 } from '@/controllers/user.controller';

import { auth } from '@/middlewares/auth.middlewares';
import { isAdmin } from '@/middlewares/role.middleware';

const router = express.Router();

router.post('/register', registerUser); // POST /api/v1/users/register

// Admin actions
router.get('/pending/department/:departmentId', auth, isAdmin,getPendingRequestsByDepartment);
router.put('/approval/:userId', auth, isAdmin,updateUserApprovalStatus);

export default router;
