import { Router } from 'express';
import { auth } from '@/middlewares/auth.middlewares';
import { isAdmin, isSuperAdmin } from '@/middlewares/role.middleware';
import { getAdminLimitsAndUsage,
         getMyDetails,
           } from '@/controllers/admin.Controller';

import { 
    createUserByAdminController,getUsersByDepartment,approveUserController,
          rejectUserController,
          approveAllUsersController,
          updateUserDetailsController,
          transferUserDepartmentController,
          deleteUserByAdminController,
          bulkUserUploadController
    // saveEmployeeAnswer,
} from '@/controllers/admin.Controller';

import multer from 'multer';
const upload = multer(); 

const router = Router();

// Admin routes will be added here
router.get('/dashboard', auth, isSuperAdmin, (req, res) => {
    res.status(200).json({ message: 'Admin dashboard' });
});



//get admin details--> pending need recheck
router.get('/mydetails',
    auth,
    isAdmin,
    getMyDetails
)



//get admin limits and usage -->pending need recheck
router.get('/adminLimits', 
    auth, 
    isAdmin, 
    getAdminLimitsAndUsage);


//create a user
router.post(
  '/create/:orgId/:deptId',
  auth,
  isAdmin,
  createUserByAdminController
);


//get all users
router.get(
  "/users/department/:deptId",
  auth,
  isAdmin,
  getUsersByDepartment
);


// Approve one user
router.put(
  '/approve/:userId',
  auth,
  isAdmin,
  approveUserController
);


// Reject one user
router.put(
  '/reject/:userId',
  auth,
  isAdmin,
  rejectUserController
);

// Approve all users in a department
router.put(
  '/approve-all/:deptId',
  auth,
  isAdmin,
  approveAllUsersController
);


// Transfer User to a New Department
router.put(
  '/transfer/:userId',
  auth,
  isAdmin,
  transferUserDepartmentController
);

// Update user name and email
router.put(
  '/update/:userId',
  auth,
  isAdmin,
  updateUserDetailsController
);

// Delete User
router.delete(
  '/delete/:userId',
  auth,
  isAdmin,
  deleteUserByAdminController
);


router.post(
  '/bulk-upload/:orgId/:deptId',
  auth,
  isAdmin,
  upload.single('file'),
  bulkUserUploadController
);


export default router; 