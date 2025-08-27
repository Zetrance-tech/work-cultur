/*
// src/pages/CourseAdminWrapper.tsx
import React from "react";
import Index from "@course/pages/Index"; // or use alias like @course/pages/Index
// TEMPORARY TEST:
//import Index from "../feature/course/src/pages/Index";
import { SidebarProvider } from "@course/components/ui/sidebar"; //  your existing SidebarProvider


const CourseAdminWrapper = () => {
  //return <Index />;
  return (
    <SidebarProvider>
      <Index />
    </SidebarProvider>
  );
};

export default CourseAdminWrapper;
*/

{/*
import React from "react";
import { BrowserRouter } from "react-router-dom";
import CourseApp from "../feature/course/src/App"; // Import the course module's App.tsx
import { SidebarProvider } from "../feature/course/src/components/ui/sidebar"; // Use course module's SidebarProvider

const CourseAdminWrapper = () => {
    console.log("🎯 CourseAdminWrapper rendered");
    
  return (
    <SidebarProvider>
      
        <CourseApp />
    </SidebarProvider>
  );
};

export default CourseAdminWrapper;
*/}

{/*
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SidebarProvider } from "../feature/course/src/components/ui/sidebar";
import CourseAppRoutes from "../feature/course/src/App"; // updated export

const CourseAdminWrapper = () => {
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) {
      localStorage.setItem("workcultur_token", urlToken);
      setAuthToken(urlToken);
      setIsAuthenticated(true);
    } else {
      const savedToken = localStorage.getItem("workcultur_token");
      if (savedToken) {
        setAuthToken(savedToken);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem("workcultur_token", token);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  return (
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider>
          <Routes>
            <CourseAppRoutes
              authToken={authToken}
              setAuthToken={setAuthToken}
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              handleLogin={handleLogin}
            />
          </Routes>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default CourseAdminWrapper;
*/}

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SidebarProvider } from "../feature/course/src/components/ui/sidebar";
// After (correct, use the one your AppShell also uses)
//import { SidebarProvider } from "@/components/ui/sidebar"; //  USE ROOT CONTEXT

import CourseApp from "../feature/course/src/App"; //  updated import

const CourseAdminWrapper = () => {
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) {
      localStorage.setItem("workcultur_token", urlToken);
      setAuthToken(urlToken);
      setIsAuthenticated(true);
    } else {
      const savedToken = localStorage.getItem("workcultur_token");
      if (savedToken) {
        setAuthToken(savedToken);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem("workcultur_token", token);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  

  return (
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider>
           
            <CourseApp
              authToken={authToken}
              setAuthToken={setAuthToken}
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              handleLogin={handleLogin}
            />
          
            
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default CourseAdminWrapper;
