/*
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppShell from "./components/Layout/AppShell";
import Dashboard from "./pages/Dashboard";
import OrganizationsList from "./pages/OrganizationsList";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import CourseDashboard from "./pages/CourseDashboard";
import CourseCreationPage from "./pages/CourseCreationPage";
import AssessmentCreationPage from "./pages/AssessmentCreationPage";
import ReportsPage from "./pages/ReportsPage";
import SkillsPage from "./pages/SkillsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import OrganizationAnalyticsDashboard from "./pages/OrganizationAnalyticsDashboard";
import AssessmentResultsPage from "./pages/AssessmentResultsPage";
import CourseRegistrationsPage from "./pages/CourseRegistrationsPage";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const App = () => {
  // Create a new instance of QueryClient inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/organizations" element={<OrganizationsList />} />
              <Route path="/organization/:id" element={<OrganizationDashboard />} />
              <Route path="/organization/:orgId/department/:deptId" element={<DepartmentDashboard />} />
              <Route path="/organization/:orgId/course/:courseId" element={<CourseDashboard />} />
              <Route path="/organization/:orgId/course/:courseId/registrations" element={<CourseRegistrationsPage />} />
              <Route path="/organization/:orgId/create-course" element={<CourseCreationPage />} />
              <Route path="/organization/:orgId/course/:courseId/create-assessment" element={<AssessmentCreationPage />} />
              <Route path="/organization/:orgId/reports" element={<ReportsPage />} />
              <Route path="/organization/:orgId/reports/assessments" element={<AssessmentResultsPage />} />
              <Route path="/organization/:orgId/skills" element={<SkillsPage />}  />
              <Route path="/organization/:orgId/analytics" element={<AnalyticsPage />} />
              <Route path="/organization/:orgId/analytics-dashboard" element={<OrganizationAnalyticsDashboard />} />
              <Route path="/organization/:id/users" element={<UserManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
*/


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Navigate } from 'react-router-dom';

import AppShell from "./components/Layout/AppShell";
import ProtectedRoute from "./components/ProtectedRoute"; //  NEW

// Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import OrganizationsList from "./pages/OrganizationsList";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import CourseDashboard from "./pages/CourseDashboard";
import CourseCreationPage from "./pages/CourseCreationPage";
import AssessmentCreationPage from "./pages/AssessmentCreationPage";
import ReportsPage from "./pages/ReportsPage";
import SkillsPage from "./pages/SkillsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import OrganizationAnalyticsDashboard from "./pages/OrganizationAnalyticsDashboard";
import AssessmentResultsPage from "./pages/AssessmentResultsPage";
import CourseRegistrationsPage from "./pages/CourseRegistrationsPage";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";

import CourseAdminWrapper from "./pages/CourseAdminWrapper";
import { SidebarProvider } from "./feature/course/src/components/ui/sidebar"; // Course module’s SidebarProvider
import Index from "./feature/course/src/pages/Index"; // Course module’s Index
import AdminCoursesPage from "./feature/course/src/pages/adminCourses"; // Course module’s AdminCoursesPage
import CourseCreationWizard from "./feature/course/src/components/CourseCreationWizard"; // Course module’s CourseCreationWizard
import AddQuestion from "./feature/course/src/pages/questions"; // Course module’s AddQuestion

const App = () => {
  
  const [authToken, setAuthToken] = useState(null); // Shared auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/*  Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" />} />


            {/*  Protected routes */}
              <Route
                path="/homepage"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
            {/*<Route index element={<Dashboard />} /> */}
              
              <Route index element={<HomePage />} /> 
            </Route>


            {/* All actual app routes (not under /homepage) */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >

              <Route path="organizationlist" element={<Dashboard />} />
              <Route path="admin/courses/*" element={ <CourseAdminWrapper /> } />

              <Route path="organizations" element={<OrganizationsList />} />
              <Route path="organization/:id" element={<OrganizationDashboard />} />
              <Route path="organization/:orgId/department/:deptId" element={<DepartmentDashboard />} />
              <Route path="organization/:orgId/course/:courseId" element={<CourseDashboard />} />
              <Route path="organization/:orgId/course/:courseId/registrations" element={<CourseRegistrationsPage />} />
              <Route path="organization/:orgId/create-course" element={<CourseCreationPage />} />
              <Route path="organization/:orgId/course/:courseId/create-assessment" element={<AssessmentCreationPage />} />
              <Route path="organization/:orgId/reports" element={<ReportsPage />} />
              <Route path="organization/:orgId/reports/assessments" element={<AssessmentResultsPage />} />
              <Route path="organization/:orgId/skills" element={<SkillsPage />} />
              <Route path="organization/:orgId/analytics" element={<AnalyticsPage />} />
              <Route path="organization/:orgId/analytics-dashboard" element={<OrganizationAnalyticsDashboard />} />
              <Route path="organization/:id/users" element={<UserManagement />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
