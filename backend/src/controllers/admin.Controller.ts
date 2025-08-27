

import { Request, Response } from 'express';
import asyncHandler from '@/utils/asyncHandler.utils';
import ApiError from '@/utils/apiError.utils';
import ApiResponse from '@/utils/apiResponse.utils';
import UserModel from '@/models/user.model';
import RegistrationRequest from '@/models/registrationRequest'; 
import DepartmentModel from '@/models/department.model'; //  add this
import bcrypt from 'bcryptjs'; //  required for password hashing

import OrganizationModel from '@/models/organization.model';
import AdminLimitsUtils from '@/utils/adminLimits.utils';
import mongoose, { Types } from 'mongoose';
import * as XLSX from 'xlsx';




// Enhanced organization stats pipeline
const getOrganizationStatsPipeline = (adminId: string) => [
    { $match: { admin: adminId } },
    {
        $lookup: {
            from: 'departments',
            localField: '_id',
            foreignField: 'organization',
            as: 'departments',
            pipeline: [
                {
                    $lookup: {
                        from: 'courses',
                        localField: '_id',
                        foreignField: 'linked_entities.departments',
                        as: 'courses'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        description: 1,
                        courses: {
                            $map: {
                                input: '$courses',
                                as: 'course',
                                in: {
                                    _id: '$$course._id',
                                    title: '$$course.title',
                                    description: '$$course.description',
                                    status: '$$course.status',
                                    enrolledEmployees: { $size: '$$course.enrolledEmployees' }
                                }
                            }
                        }
                    }
                }
            ]
        }
    },
    {
        $lookup: {
            from: 'courses',
            localField: '_id',
            foreignField: 'linked_entities.organization',
            as: 'courses'
        }
    },
    {
        $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'employeeData.organization',
            as: 'employees',
            pipeline: [
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        profile: 1,
                        employeeData: 1
                    }
                }
            ]
        }
    },
    {
        $project: {
            _id: 1,
            name: 1,
            admin_email: 1,
            logo_url: 1,
            departments: 1,
            courses: {
                $map: {
                    input: '$courses',
                    as: 'course',
                    in: {
                        _id: '$$course._id',
                        title: '$$course.title',
                        description: '$$course.description',
                        duration: '$$course.duration',
                        status: '$$course.status',
                        enrolledEmployees: { $size: '$$course.enrolledEmployees' }
                    }
                }
            },
            employees: 1,
            stats: {
                totalDepartments: { $size: '$departments' },
                totalCourses: { $size: '$courses' },
                totalEmployees: { $size: '$employees' }
            },
            createdAt: 1,
            updatedAt: 1
        }
    }
];


//GET MY DETAILS
export const getMyDetails = asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.user?._id;

    if (!adminId) {
        throw new ApiError(400, 'Admin ID is required');
    }

    try {
        const [admin, organizations] = await Promise.all([
            UserModel.findById(adminId).select('-password -__v'),
            OrganizationModel.aggregate(getOrganizationStatsPipeline(adminId.toString()))
        ]);

        if (!admin) {
            throw new ApiError(404, 'Admin not found');
        }

        // Calculate overall statistics
        const overallStats = {
            totalOrganizations: organizations.length,
            totalDepartments: organizations.reduce((acc, org) => acc + org.stats.totalDepartments, 0),
            totalCourses: organizations.reduce((acc, org) => acc + org.stats.totalCourses, 0),
            totalEmployees: organizations.reduce((acc, org) => acc + org.stats.totalEmployees, 0)
        };

        return new ApiResponse(200, {
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                accountType: admin.accountType,
                // profile: admin.profile,
                adminLimits: admin.adminLimits,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt
            },
            organizations,
            overallStats
        }, 'Admin details fetched successfully').send(res);
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, 'Failed to fetch admin details');
    }
});




//get admin limits and usage
export const getAdminLimitsAndUsage = asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.user?._id;

    if (!adminId){
        throw new ApiError(400, 'Admin ID is required');
    }

    try {
        const adminLimits = await AdminLimitsUtils.getAdminLimitsAndUsage(adminId as unknown as Types.ObjectId);
        return new ApiResponse(200, adminLimits).send(res);
    } catch (error) {
        throw new ApiError(500, 'Failed to fetch admin limits and usage');
    }
});





export const createUserByAdminController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password,jobTitle  } = req.body;
  const adminId = req.user?._id;
  const { orgId, deptId } = req.params; 

  console.log("==== [Create User by Admin] ====");
  console.log("req.user:", req.user);
  console.log("req.params:", req.params);
  console.log("req.body:", req.body);

  if (!name || !email || !password || !orgId || !deptId || !jobTitle) {
    console.log(" Missing field values:", {
    name, email, password, jobTitle,
    orgId, deptId,
    checks: {
      name: !!name,
      email: !!email,
      password: !!password,
      jobTitle: !!jobTitle,
      orgId: !!orgId,
      deptId: !!deptId,
    }
  });
    throw new ApiError(400, 'All fields (name, email, password, jobTitle, orgId, deptId) are required');
  }

  // Check if department exists and belongs to admin’s organization
  const department = await DepartmentModel.findOne({
    _id: deptId,
    organization: orgId,
    
  });

   console.log(" Department found:", department);

  if (!department) {
    throw new ApiError(404, 'Department not found');
  }

  // Check for duplicate user
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);


  // Create the user
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    accountType: 'employee',
    jobTitle,
    isApproved: true,
    accountStatus: 'active',
    employeeData: {
      department: deptId,
      organization: orgId,
      
    },
    createdByAdmin: adminId,
  });

    console.log("User Created:", {
      id: newUser._id,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });

   
  return new ApiResponse(201, {
    message: 'User created successfully',
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      //role: newUser.employeeData.role,
    }
  }).send(res);
});



export const getUsersByDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { deptId } = req.params;

  if (!deptId) {
    throw new ApiError(400, "Department ID is required");
  }

    const users = await UserModel.find({ 
      "employeeData.department": deptId,
        isApproved: true
    })
    .select("name email accountType accountStatus jobTitle employeeData")
    .populate("employeeData.organization", "name")
    .populate("employeeData.department", "name");

  return new ApiResponse(200, {
    message: "Users fetched successfully",
    users,
  }).send(res);
});


// Approve Single User
export const approveUserController = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await UserModel.findByIdAndUpdate(userId, {
    isApproved: true,
    accountStatus:'active'
  }, { new: true });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update registration request status
  await RegistrationRequest.findOneAndUpdate(
    { user: userId },
    { status: 'approved' }, // or delete it if not needed
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'User approved successfully',
    user,
  });
});

//  Reject Single User
export const rejectUserController = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await UserModel.findByIdAndDelete(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    message: 'User rejected and deleted successfully',
  });
});

/*
//  Approve All Pending Users in a Department
export const approveAllUsersController = asyncHandler(async (req: Request, res: Response) => {
  const { deptId } = req.params;

  const result = await UserModel.updateMany(
    { 'employeeData.department': deptId, isApproved: false },
    { $set: { isApproved: true } }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} users approved successfully`,
  });
});
*/


// Approve All Pending Users in a Department
export const approveAllUsersController = asyncHandler(async (req: Request, res: Response) => {
  const { deptId } = req.params;

  // 1. Find all unapproved users in the department
  const users = await UserModel.find({
    'employeeData.department': deptId,
    isApproved: false,
  });

  if (!users.length) {
    return res.status(200).json({
      success: true,
      message: 'No users to approve',
    });
  }

  const userIds = users.map((user) => user._id);

  // 2. Approve all users
  const userUpdateResult = await UserModel.updateMany(
    { _id: { $in: userIds } },
    { $set: { isApproved: true } }
  );

  // 3. Update registration requests too
  const requestUpdateResult = await RegistrationRequest.updateMany(
    { user: { $in: userIds }, status: 'pending' },
    { $set: { status: 'approved' } }
  );

  res.status(200).json({
    success: true,
    message: `${userUpdateResult.modifiedCount} users and ${requestUpdateResult.modifiedCount} registration requests approved successfully`,
  });
});



// Update User Details (Name & Email only for now)
export const updateUserDetailsController = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json(new ApiResponse(200, {}, 'User details updated successfully'));
});


// Transfer User to Another Department
export const transferUserDepartmentController = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { newDepartmentId } = req.body;

  const user = await UserModel.findById(userId);

  if (!user || !user.employeeData) {
    throw new ApiError(404, 'User not found or does not have employee data');
  }

  user.employeeData.department = newDepartmentId;
  await user.save();

  res.status(200).json(new ApiResponse(200, {}, 'User department transferred successfully'));
});


// Delete User by Admin
export const deleteUserByAdminController = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const deletedUser = await UserModel.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new ApiError(404, 'User not found');
  }


  // Delete corresponding registration request if exists
  await RegistrationRequest.findOneAndDelete({ user: userId });


  res.status(200).json(new ApiResponse(200, {}, 'User deleted successfully'));
});




export const bulkUserUploadController = asyncHandler(async (req: Request, res: Response) => {
  const { orgId, deptId } = req.params;

  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const department = await DepartmentModel.findOne({ _id: deptId, organization: orgId });
  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const users = XLSX.utils.sheet_to_json(sheet);

  const createdUsers = [];

  for (const row of users as Array<Record<string, any>>) {
    /*
    const { name, email, password, jobTitle } = row as {
      name: string;
      email: string;
      password: string;
      jobTitle: string;
    };
    */
    const name = String(row.name).trim();
    const email = String(row.email).trim();
    const password = String(row.password).trim();
    const jobTitle = String(row.jobTitle).trim();


    if (!name || !email || !password || !jobTitle) continue;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) continue;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      accountType: 'employee',
      jobTitle,
      isApproved: true,
      employeeData: {
        department: deptId,
        organization: orgId,
      },
      createdByAdmin: req.user?._id,
    });

    createdUsers.push({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  }

  if (createdUsers.length === 0) {
    throw new ApiError(400, "No valid users were created.");
  }

  res.status(201).json(new ApiResponse(201, createdUsers, "Bulk user upload successful"));
});


