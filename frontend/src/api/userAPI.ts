import { toast } from "react-hot-toast";
import { apiConnector } from "./apiConnector";
import { userEndpoints } from "./apis/userEndpoints";
import { getAuthToken,getAdminId } from "@/lib/authUtil";


  
const ADMIN_TOKEN = getAuthToken();

const {
  REGISTER_USER_API,
  CREATE_USER_BY_ADMIN_API,
  GET_DEPARTMENT_USERS_API,
  GET_PENDING_USERS_API,

  APPROVE_USER_API,
  REJECT_USER_API,
  APPROVE_ALL_USERS_API,
  
  DELETE_USER_API,
  TRANSFER_USER_API,
  UPDATE_USER_DETAILS_API,
  BULK_UPLOAD_USERS_API,
} = userEndpoints;


export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  accountType: 'employee';
  employeeData: {
    organization: string;
    department: string;
  };
}

export interface CreateUserByAdminPayload {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Editor' | 'Viewer';
}

export interface RejectUserPayload {
  rejectReason: string;
}

export interface UpdateUserRolePayload {
  role: 'Admin' | 'Editor' | 'Viewer';
}

// Self-register a user
export const registerUser = async (data: RegisterUserPayload) => {
  try {
     console.log("Submitting registration payload:", data);

    const response = await apiConnector("POST", REGISTER_USER_API, data, {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    });

    if (!response.data.success) {
      throw new Error("User registration failed");
    }

    toast.success("User registered successfully, awaiting approval");
    return response.data.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Registration failed");
    throw error;
  }
};


export const createUserByAdmin = async (payload: any) => {
  const { employeeData, ...userData } = payload;
  const { organization: orgId, department: deptId } = employeeData;

  const url = `${CREATE_USER_BY_ADMIN_API}/${orgId}/${deptId}`;

  const response = await apiConnector("POST", url, userData, {
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  });

  if (!response.data.success) {
    throw new Error("User creation failed");
  }

  return response.data.data;
};




// Get all users in a department
export const getDepartmentUsers = async (deptId: string) => {
  try {
    const response = await apiConnector("GET", `${GET_DEPARTMENT_USERS_API}/${deptId}`, {}, {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    });

    if (!response.data.success) {
      throw new Error("Failed to fetch department users");
    }

    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to fetch department users");
    throw error;
  }
};

// Get pending users for an organization
export const getPendingUsers = async (deptId: string) => {
  try {
    const url = `${GET_PENDING_USERS_API}/${deptId}`;
    console.log("API Call: GET", url); 

    const response = await apiConnector("GET", `${GET_PENDING_USERS_API}/${deptId}`, {}, {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    });

     console.log(" FULL Pending response:", response.data); 

    if (!response.data.success) {
      throw new Error("Failed to fetch pending users");
    }

     console.log("Pending users response:", response.data.data); //  Add this
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to fetch pending users");
    throw error;
  }
};


// Approve a user
export const approveUser = async (userId: string) => {
  try {
    const response = await apiConnector("PUT", `${APPROVE_USER_API}/${userId}`, {}, {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    });

    if (!response.data.success) {
      throw new Error("User approval failed");
    }

    toast.success("User approved successfully");
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to approve user");
    throw error;
  }
};

// Reject a user
export const rejectUser = async (userId: string) => {
  try {
    const response = await apiConnector("PUT", `${REJECT_USER_API}/${userId}`, {}, {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    });

    if (!response.data.success) {
      throw new Error("User rejection failed");
    }

    toast.success("User rejected successfully");
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to reject user");
    throw error;
  }
};

//approve all api
export const approveAllUsers = async (deptId: string) => {
  try {
    const response = await apiConnector(
      "PUT",
      `${APPROVE_ALL_USERS_API}/${deptId}`,
      {},
      {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      }
    );

    if (!response.data.success) {
      throw new Error("Approving all users failed");
    }

    toast.success("All users approved successfully");
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to approve all users");
    throw error;
  }
};



// Delete a user
export const deleteUser = async (userId: string) => {
  try {
    const response = await apiConnector("DELETE", `${DELETE_USER_API}/${userId}`, {}, {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    });

    if (!response.data.success) {
      throw new Error("User deletion failed");
    }

    toast.success("User deleted successfully");
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to delete user");
    throw error;
  }
};

// Transfer a user to another department
export const transferUser = async (userId: string,deptId:string) => {
  try {
    const response = await apiConnector("PUT",
       `${TRANSFER_USER_API}/${userId}`, 
        {newDepartmentId: deptId}, 
        {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        }
    );

    if (!response.data.success) {
      throw new Error("User transfer failed");
    }

    toast.success("User transferred successfully");
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to transfer user");
    throw error;
  }
};

//update user details.
export const updateUserDetails = async (userId: string, data: any) => {
  try {
    const response = await apiConnector("PUT", `${UPDATE_USER_DETAILS_API}/${userId}`, data, {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    });

    if (!response.data.success) {
      throw new Error("User update failed");
    }

    toast.success("User details updated successfully");
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to update user");
    throw error;
  }
};


export const bulkUploadUsers = async (orgId: string, deptId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiConnector(
      "POST",
      `${BULK_UPLOAD_USERS_API}/${orgId}/${deptId}`,
      formData,
      {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
        "Content-Type": "multipart/form-data",
      }
    );

    if (!response.data.success) {
      throw new Error("Bulk upload failed");
    }

    toast.success("Bulk user upload successful");
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to upload users");
    throw error;
  }
};
