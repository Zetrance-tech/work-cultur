import { Router } from 'express';
import { 
    addEmployeeToDepartment,
    getEmployeeEnrolledCourses,
    // saveEmployeeAnswer,
} from '@/controllers/employee.Controller';
/*
import { 
    createUserByAdminController,
    // saveEmployeeAnswer,
} from '@/controllers/admin.Controller';
*/

import { auth } from '@/middlewares/auth.middlewares';
import { isAdmin, isEmployee } from '@/middlewares/role.middleware';


const router = Router();



//add emp to department from other department --> pending
router.post('/addEmployeedepartment', 
    auth,
    isAdmin,
    addEmployeeToDepartment
);


//router.post('/create-user', auth, isAdmin, createUserByAdminController);
/*
router.post(
  '/create/:orgId/:deptId',
  auth,
  isAdmin,
  createUserByAdminController
);
*/



///---------------------------------------------->



// // Create employee
// router.post('/', 
//     auth, 
//     isAdmin, 
//     validateRequest(['email', 'firstName', 'lastName', 'department']), 
//     createEmployee
// );

// // Get all employees
// router.get('/', 
//     auth, 
//     isAdmin, 
//     getEmployees
// );

// // Get employee by ID
// router.get('/:id', 
//     auth, 
//     isAdmin, 
//     getEmployeeById
// );

// // Update employee
// router.put('/:id', 
//     auth, 
//     isAdmin, 
//     validateRequest(['firstName', 'lastName', 'department']), 
//     updateEmployee
// );

// // Delete employee
// router.delete('/:id', 
//     auth, 
//     isAdmin, 
//     deleteEmployee
// );

export default router; 