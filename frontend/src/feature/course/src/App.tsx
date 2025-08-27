
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { BrowserRouter, Routes, Route } from "react-router-dom";
import {  Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminCoursesPage from "./pages/adminCourses";
import CourseCreationWizard from "./components/CourseCreationWizard";
//import AdminEnrollmentsPage from "./pages/entrollments";
import AddQuestion from "./pages/questions";    
import DraftCoursePage from "./pages/draftCourses";   //new page to show draft courses

const queryClient = new QueryClient();


{/*
const App = () => {
  console.log( "Checking whether CourseApp is rendered");

  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
*/}


/*
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);
*/

{/*
useEffect(() => {
  // 1. Try to get token from URL
  const urlToken = new URLSearchParams(window.location.search).get("token");

  if (urlToken) {
    // 2. Store in localStorage using the same key as your main project
    localStorage.setItem("workcultur_token", urlToken);
    setAuthToken(urlToken);
    setIsAuthenticated(true);
  } else {
    // 3. Fallback to localStorage if already set
    const savedToken = localStorage.getItem("workcultur_token");
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
    }
  }
}, []);
*/}

/*
  const handleLogin = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };
*/

{/*
const handleLogin = (token: string) => {
    localStorage.setItem("workcultur_token", token);
    setAuthToken(token);
    setIsAuthenticated(true);
  };
*/}

{/*
  // Return JSX
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/*
        <Routes>
          <Route
            path="/"
            element={
              <Index
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                authToken={authToken}
                setAuthToken={setAuthToken}
                handleLogin={handleLogin}
              />
            }
          />
          <Route 
          path="/admin/courses" 
          element={
          <AdminCoursesPage 
          setAuthToken={setAuthToken}  
          setIsAuthenticated={setIsAuthenticated}
           />} />
          <Route
            path="/admin/courses/edit/:courseId"
            element={
              <CourseCreationWizard
                authToken={authToken}
                setAuthToken={setAuthToken}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
	  {/*
	  <Route
            path="/admin/enrollments"
            element={
              <AdminEnrollmentsPage
                authToken={authToken}
                setAuthToken={setAuthToken}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
	 
          <Route
            path="/add-question/:assessmentId"
            element={<AddQuestion />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        

            
          

      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
*/}

{/*
const CourseAppRoutes = ({ authToken, setAuthToken, isAuthenticated, setIsAuthenticated, handleLogin }) => {
  return (
    <>
      <Route path="" element={
        <AdminCoursesPage
          setAuthToken={setAuthToken}
          setIsAuthenticated={setIsAuthenticated}
        />
      } />
      <Route path="edit/:courseId" element={
        <CourseCreationWizard
          authToken={authToken}
          setAuthToken={setAuthToken}
          setIsAuthenticated={setIsAuthenticated}
        />
      } />
      <Route path="add-question/:assessmentId" element={<AddQuestion />} />
      <Route path="*" element={<NotFound />} />
    </>
  );
};

export default CourseAppRoutes;
*/}


const CourseApp = ({ authToken, setAuthToken, isAuthenticated, setIsAuthenticated, handleLogin }) => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <AdminCoursesPage
            setAuthToken={setAuthToken}
            setIsAuthenticated={setIsAuthenticated}
          />
        }
      />
      <Route
        
        path="create"
        element={
          <CourseCreationWizard
            authToken={authToken}
            setAuthToken={setAuthToken}
            setIsAuthenticated={setIsAuthenticated}
          />
        }
      />

      <Route
        path="create/course/:courseId/:step"
        element={
          <CourseCreationWizard
           
            authToken={authToken}
            setAuthToken={setAuthToken}
            setIsAuthenticated={setIsAuthenticated}
          />
        }
      />


      {/*Adding new route to edit the course*/}
      {/*
      <Route
        path="edit/:courseId"
        element={
          <CourseCreationWizard
            
            authToken={authToken}
            setAuthToken={setAuthToken}
            setIsAuthenticated={setIsAuthenticated}
          />
        }
      />
      */}

      
      <Route
        path="edit/:courseId/:step?"
        element={
          <CourseCreationWizard
            
            authToken={authToken}
            setAuthToken={setAuthToken}
            setIsAuthenticated={setIsAuthenticated}
          />
        }
      />

      {/*ROute for draft courses*/}
      <Route
        path="draft-courses"
        element={
          <DraftCoursePage/>
        }
      />

{/*
      <Route path="add-question/:assessmentId" element={<AddQuestion />} />
 */}    
      <Route path=":courseId/add-question/:assessmentId" element={<AddQuestion />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default CourseApp;



{/*
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import CourseAdminDashboard from "./pages/CourseAdminDashboard";
import NotFound from "./pages/NotFound";
import { SidebarProvider } from "@/components/ui/sidebar"; // Moved SidebarProvider here

const queryClient = new QueryClient();
*/}

{/*
const CourseApp = ({ authToken, setAuthToken, isAuthenticated, setIsAuthenticated, handleLogin }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>

        
        <Toaster />
        <Sonner />

        
        <Routes>
          <Route
            path="/*"
            element={
              <CourseAdminDashboard
                authToken={authToken}
                setAuthToken={setAuthToken}
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
                handleLogin={handleLogin}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default CourseApp;
*/}