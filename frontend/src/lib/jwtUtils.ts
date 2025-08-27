import jwt_decode from "jwt-decode";

interface DecodedToken {
  userId: string;
  email: string;
  accountType: string;
  iat: number;
  exp: number;
}

export const getDecodedToken = (): DecodedToken | null => {
  const token = localStorage.getItem("workcultur_token");
  if (!token) return null;

  try {
    return jwt_decode<DecodedToken>(token);
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};
