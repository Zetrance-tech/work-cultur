import { useToast } from "@/hooks/use-toast";
import { apiConnector } from  "./apiConnector";
import { departmentEndpoints } from "./apis/departmentEndpoints";
import {toast } from "react-hot-toast";
import { getAuthToken,getAdminId } from "@/lib/authUtil";


const ADMIN_TOKEN  = getAuthToken(); 

const {
    CREATE_DEPARTMENT_API,
    GET_ALL_DEPARTMENTS_API,
    GET_DEPARTMENT_BY_ID_API,
    UPDATE_DEPARTMENT_API,
    DELETE_DEPARTMENT_API,
} = departmentEndpoints;


//adding types.
export interface CreateDepartmentPayload {
  name: string;
  description: string;
  organizationId: string;
  adminId: string;
}


//Defining API CALL for creating new department and sending its request to backend.
export const createDepartment = async (data: CreateDepartmentPayload) => {
  try {
    const response = await apiConnector("POST", CREATE_DEPARTMENT_API, data, {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    });

    if (!response.data.success) {
      throw new Error("Department creation failed");
    }

    toast.success("Department created successfully");
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to create department");
    throw error;
  }
};


//defining API call for fetching all departments under specific organization
export const getDepartmentsByOrganizationId = async (organizationId: string) => {
  try {

     console.log("OrgId send to backend for getting deparments:", organizationId);

    const response = await apiConnector(
      "POST",
      GET_ALL_DEPARTMENTS_API,
      { organizationId },
      {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      }
    );

    if (!response.data.success) {
      throw new Error("Failed to fetch departments");
    }

    return response.data.data; // array of departments
    
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to load departments");
    throw error;
  }
};

//Defining API call to fetch single departmetn by its Id.
export const getDepartmentById = async(departmentId:string) =>{

  try{

    const response = await apiConnector("POST", GET_DEPARTMENT_BY_ID_API,
      {departmentId},
      {
        Authorization:`Bearer ${ADMIN_TOKEN}`,
        "Content-Type": "application/json",
      }
    );

    if(!response.data.success){
      throw new Error("Failed to fetch department.");
    }

    //store  the response.
    const department = response.data.data;
    toast.success(`Department "${department.name}" fetched successfully!`);
    return department;
    
  }catch(error:any){
    toast.error(error?.response?.data?.message || "Failed to fetch department.");
  }
};

/*
//API call to update name & description.
export const updateDepartmentById = async(
  {
    departmentId,name,description,adminId
  }:{
    departmentId:string,name:string,description:string,adminId:string
  })=>{

  
  const response = await apiConnector("PUT",UPDATE_DEPARTMENT_API,
    {departmentId,name,description,adminId},
    {Authorization:`Bearer ${ADMIN_TOKEN}`,"Content-Type": "application/json",}
  );

  return response;

};
*/

export const updateDepartmentById = async (data: {
  organizationId: string;
  departmentId: string;
  name?: string;
  description?: string;
  adminId: string;
}) => {
  try {
    console.log("Payload to update department:", data);
    
    const response = await apiConnector("PUT", UPDATE_DEPARTMENT_API, data, {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      "Content-Type": "application/json", 
    });

    if (!response.data.success) {
      throw new Error("Failed to update department.");
    }

    toast.success("Department updated successfully!");
    return response.data.data;
  } catch (error: any) {
     console.error("Raw error:", error);

    if (error.response) {
      console.error("Response Data:", error.response.data);
      toast.error(error.response.data?.message || "Update failed due to validation.");
    } else {
      toast.error("Unexpected error occurred.");
    }
    throw error;
    }
};


//API call to delete department
export const deleteDepartmentById = async (departmentId: string) => {
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_DEPARTMENT_API,
      { departmentId },
      {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
        "Content-Type": "application/json",
      }
    );

    if (!response.data.success) {
      throw new Error("Failed to delete department.");
    }

    console.log("Delete response:", response.data);

    toast.success("Department deleted successfully!");
    return response.data;
  } catch (error: any) {
    console.error("Error deleting department:", error);
    toast.error(error.response?.data?.message || "Failed to delete department.");
    throw error;
  }
};