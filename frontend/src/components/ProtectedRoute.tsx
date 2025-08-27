/*
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
   const { user } = useAuth();
   const token = user?.token;
  const authToken = localStorage.getItem('workcultur_token');
  const RedirectUrl = `https://www.youtube.com/${token}`; 

  useEffect(() => {
    if (authToken) {
      window.open(RedirectUrl, '_blank');
    }
  }, [authToken]);

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h2>
        <p className="text-gray-600">
          You have been redirected to your dashboard in a new tab.
        </p>
      </div>
    </div>
  ); 
};

export default ProtectedRoute;
*/

/*
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const token = user?.token;
  const authToken = localStorage.getItem('workcultur_token');
  const RedirectUrl = `https://www.youtube.com/${token}`;

  useEffect(() => {
    if (authToken) {
      window.open(RedirectUrl, '_blank');
    }
  }, [authToken]);

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  //  Return children here so that AppShell and nested routes can be rendered
  return <>{children}</>;
};

export default ProtectedRoute;
*/

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const token = user?.token;

  const authToken = localStorage.getItem("workcultur_token");


  if (!authToken || !user) {
      return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;



/*
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { getDecodedToken } from "@/lib/jwtUtils";

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("workcultur_token");
  const decoded = getDecodedToken();

  useEffect(() => {
    if (token && decoded?.userId) {
      // 👇 use the adminId here
      const adminId = decoded.userId;
      console.log("Logged in adminId:", adminId);

      // Optional: redirect to YouTube or dashboard or just log
      // const redirectUrl = `https://www.youtube.com/${adminId}`;
      // window.open(redirectUrl, "_blank");
    }
  }, [token, decoded]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h2>
        <p className="text-gray-600">
          You have been redirected to your dashboard in a new tab.
        </p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
*/