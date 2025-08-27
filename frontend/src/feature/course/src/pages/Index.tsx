

import React, { useState, useEffect } from "react";
import { LoginPage } from "@/components/LoginPage";

//import CourseCreationWizard from "@/components/CourseCreationWizard";
import CourseCreationWizard from "../components/CourseCreationWizard";

//import AdminEnrollmentsPage from "@/pages/entrollments";
import { useNavigate } from 'react-router-dom';
//import {api} from '@/services/api'
import {api} from '../services/api';

import toast, { Toaster } from 'react-hot-toast';


interface IndexProps {
  handleLogin?: () => void;
  authToken?: string;
  setAuthToken?: (token: string | null) => void;
  setIsAuthenticated?: (auth: boolean) => void;
  isAuthenticated?: boolean;
  currentPage?: string;
}

const fetchUsers = async (authToken) => {
  
  const response = await fetch(api.FETCH_USER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      organizationId: "683c3032d48159335435f9ca"
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please login again");
    }
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch users");
  }
 
  
  return data.data.users;
};


/*
const Index = ({ 
  handleLogin, 
  authToken, 
  setAuthToken, 
  setIsAuthenticated, 
  isAuthenticated,
  currentPage = "course-creation" 
}) =>
 */

const Index: React.FC<IndexProps> = ({
  handleLogin,
  authToken,
  setAuthToken,
  setIsAuthenticated,
  isAuthenticated,
  currentPage = "course-creation",
}) =>  {
  const [prefetchedUsers, setPrefetchedUsers] = useState(null);
  const [prefetchError, setPrefetchError] = useState(null);
  const [isPrefetching, setIsPrefetching] = useState(false);


  useEffect(() => {
    if (isAuthenticated && authToken && !prefetchedUsers) {
      const prefetchUsers = async () => {
        try {
          setIsPrefetching(true);
          setPrefetchError(null);
          
          const userData = await fetchUsers(authToken);
          
        
          const transformedUsers = userData.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            department: user.employeeData?.department?.name || "N/A",
            jobTitle: user.jobTitle,
            accountStatus: user.accountStatus,
            accountType: user.accountType,
            createdAt: user.createdAt,
            organizationName: user.employeeData?.organization?.name || "",
            avatar: null,
          }));

          setPrefetchedUsers(transformedUsers);
         
          
        } catch (err) {
          console.error("❌ Prefetch error:", err);
          setPrefetchError(err.message);
          
      
          if (err.message.includes("Unauthorized")) {
            setAuthToken(null);
            setIsAuthenticated(false);
            localStorage.removeItem("authToken");
          }
        } finally {
          setIsPrefetching(false);
        }
      };

     
      const timeoutId = setTimeout(prefetchUsers, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, authToken, prefetchedUsers, setAuthToken, setIsAuthenticated]);

  
  useEffect(() => {
    if (!isAuthenticated) {
      setPrefetchedUsers(null);
      setPrefetchError(null);
      setIsPrefetching(false);
    }
  }, [isAuthenticated]);

  {/*
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }
*/}
 
  switch (currentPage) {
    /*
    case "enrollments":
      return (
        <AdminEnrollmentsPage 
          authToken={authToken} 
          setAuthToken={setAuthToken} 
          setIsAuthenticated={setIsAuthenticated}
          prefetchedUsers={prefetchedUsers}
          prefetchError={prefetchError}
          isPrefetching={isPrefetching}
        />
      );
      */
    
    case "course-creation":
    default:
      return (
        <div>
          <CourseCreationWizard 
            authToken={authToken} 
            setAuthToken={setAuthToken} 
            setIsAuthenticated={setIsAuthenticated}
          />
          
         
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              position: 'fixed', 
              bottom: '10px', 
              right: '10px', 
              background: 'rgba(0,0,0,0.8)', 
              color: 'white', 
              padding: '5px 10px', 
              borderRadius: '4px',
              fontSize: '12px',
              zIndex: 9999
            }}>
              {isPrefetching && "🔄 Prefetching users..."}
              {prefetchedUsers && `✅ ${prefetchedUsers.length} users cached`}
              {prefetchError && "❌ Prefetch failed"}
            </div>
          )}
        </div>
      );
  }
};

export default Index;

