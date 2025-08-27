import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  accountType: string;
  jobTitle: string;
  employeeData: {
    organization: {
      _id: string;
      name: string;
    };
    department: {
      _id: string;
      name: string;
    };
    enrolledCourses: any[];
  };
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('workcultur_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
       
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('workcultur_user');
    }
  }, []);

  const login = (userData: User) => {
   
    setUser(userData);
    localStorage.setItem('workcultur_user', JSON.stringify(userData));
    localStorage.setItem('workcultur_token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('workcultur_user');
    localStorage.removeItem('workcultur_token');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


