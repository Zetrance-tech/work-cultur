const BASE_URL = "https://wc-backend.zetrance.com/api/v1";

export const userEndpoints = {
  REGISTER_USER_API: `${BASE_URL}/users/register`,
  CREATE_USER_BY_ADMIN_API: `${BASE_URL}/admin/create`, 
  GET_DEPARTMENT_USERS_API: `${BASE_URL}/admin/users/department`, 
  GET_PENDING_USERS_API: `${BASE_URL}/users/pending/department`, 

  APPROVE_USER_API: `${BASE_URL}/admin/approve`, 
  REJECT_USER_API: `${BASE_URL}/admin/reject`, 
  APPROVE_ALL_USERS_API: `${BASE_URL}/admin/approve-all`,

  DELETE_USER_API: `${BASE_URL}/admin/delete`, 
  TRANSFER_USER_API: `${BASE_URL}/admin/transfer`, 
  UPDATE_USER_DETAILS_API: `${BASE_URL}/admin/update`, 
  BULK_UPLOAD_USERS_API: `${BASE_URL}/admin/bulk-upload`, 

};