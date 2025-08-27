// src/api/apis/organizationEndpoints.ts
//const BASE_URL = "https://workculture.onrender.com/api/v1";

const BASE_URL = "https://wc-backend.zetrance.com/api/v1";

export const organizationEndpoints = {
  CREATE_ORGANIZATION_API: `${BASE_URL}/admin/organizations/create`,
  GET_ALL_ORGANIZATIONS_API: `${BASE_URL}/admin/organizations/get-all`, 
  GET_ORGANIZATION_BY_ID_API: `${BASE_URL}/admin/organizations/get`,
  UPDATE_ORGANIZATION_API: `${BASE_URL}/admin/organizations/update`,

  // add more if needed later
};
