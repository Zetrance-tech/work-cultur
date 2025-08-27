
const API_BASE_URL = 'https://wc-backend.zetrance.com/api/v1';



export const sendOTP = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to send OTP');
  }

  return response.json();
};


export const signup = async (data: any) => {
  console.log("sinup data --->", data)
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to signup');
  }

  return response.json();
};




export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid email or password');
  }

  return response.json();
};


/*
export const login = async (email: string, password: string) => {
  console.log("login call gyiii-------->");

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Return both response and data for proper handling
  return {
    status: response.status,
    data: data,
    ok: response.ok
  };
};
*/