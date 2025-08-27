// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import asyncHandler from '@/utils/asyncHandler.utils';
import ApiError from '@/utils/apiError.utils';
import ApiResponse from '@/utils/apiResponse.utils';
import UserModel from '@/models/user.model';
import OrganizationModel from '@/models/organization.model';
import DepartmentModel from '@/models/department.model';
import  bcrypt from 'bcryptjs';
import RegistrationRequestModel from '@/models/registrationRequest';


// Register a user (self-registration)
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, employeeData } = req.body;

  const organization = employeeData?.organization;
  const department = employeeData?.department;

  if (!name || !email || !password || !organization || !department) {
    throw new ApiError(400, 'All fields are required');
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Validate organization
  const org = await OrganizationModel.findById(organization);
  if (!org) {
    throw new ApiError(404, 'Organization not found');
  }

  // Validate department
  const dept = await DepartmentModel.findOne({
    _id: department,
    organization: org._id,
  });
  if (!dept) {
    throw new ApiError(404, 'Department not found in selected organization');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user with "employee" type and request status
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    accountType: 'employee',
    isApproved: false,
    accountStatus:'inactive',
    employeeData: {
      organization: org._id,
      department: dept._id,
    },
  });


  // Create a registration request (right after creating user)
  await RegistrationRequestModel.create({
    user: newUser._id,
    accountType: 'employee',
    status: 'pending',
    requestedAt: new Date(),
  });


  return new ApiResponse(201, {
    message: 'Registration request submitted successfully',
    userId: newUser._id,
  }).send(res);
});


//controller of handling pending user.
export const getPendingRequestsByDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { departmentId } = req.params;

  const requests = await RegistrationRequestModel.find({ status: 'pending' })
    .populate({
      path: 'user',
      match: { 'employeeData.department': departmentId },
      select: '-password',
    });

  const filteredRequests = requests.filter(req => req.user !== null);

  return new ApiResponse(200, {
    users: filteredRequests.map(req => req.user),
  }).send(res);
});

//controller for handling pending approval
export const updateUserApprovalStatus = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status, reviewNotes } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const request = await RegistrationRequestModel.findOne({ user: userId });
  if (!request) {
    throw new ApiError(404, 'Registration request not found');
  }

  request.status = status;
  request.reviewedAt = new Date();
  request.reviewedBy = req.user?.id; // assuming this is an authenticated admin
  request.reviewNotes = reviewNotes || '';
  await request.save();

  if (status === 'approved') {
      await UserModel.findByIdAndUpdate(userId, {
        accountStatus: 'active',
        isApproved: true, //Mark as approved
      });
    } else if (status === 'rejected') {
      await UserModel.findByIdAndUpdate(userId, {
        accountStatus: 'inactive',
        isApproved: false, // Explicitly mark as not approved
      });

      // Optional: you can also choose to delete the user here if needed
      // await UserModel.findByIdAndDelete(userId);
    }

  return new ApiResponse(200, {
    message: `User ${status} successfully`,
  }).send(res);
});
