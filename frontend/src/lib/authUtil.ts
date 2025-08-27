// src/lib/authUtils.ts
export const getUserFromStorage = () => {
  const user = localStorage.getItem("workcultur_user");
  return user ? JSON.parse(user) : null;
};

export const getAdminId = () => getUserFromStorage()?._id;
export const getAuthToken = () => getUserFromStorage()?.token;
