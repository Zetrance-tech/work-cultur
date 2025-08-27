//const BASE_URL = "https://workculture.onrender.com/api/v1";

const BASE_URL = "https://wc-backend.zetrance.com/api/v1";


export const departmentEndpoints = {
  CREATE_DEPARTMENT_API: `${BASE_URL}/admin/department/create`,
  GET_ALL_DEPARTMENTS_API: `${BASE_URL}/admin/department/getall`, 
  GET_DEPARTMENT_BY_ID_API: `${BASE_URL}/admin/department/get`, 
  UPDATE_DEPARTMENT_API:`${BASE_URL}/admin/department/update`,
  DELETE_DEPARTMENT_API:`${BASE_URL}/admin/department/delete`,
};
  
