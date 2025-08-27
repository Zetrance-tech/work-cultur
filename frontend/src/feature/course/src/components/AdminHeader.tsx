{/*
import { useState, useEffect } from "react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { LogOut, Plus, BookOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const AdminHeader = ({ title }: { title: string }) => {
    return (
      <header className="bg-black border-b border-slate-700/50 sticky top-0 z-40 shadow-2xl backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-6">
            <SidebarTrigger className="text-white hover:bg-white/10 rounded-xl p-3 transition-all duration-300 hover:shadow-lg backdrop-blur-sm border border-white/20" />
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">{title}</h1>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-2"></div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white/80 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </header>
    );
  };
*/}

{/*
import { useState, useEffect } from "react";
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLocation, useNavigate } from "react-router-dom";

export const AdminHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-black border-b border-slate-700/50 flex items-center justify-between p-2 shadow-2xl backdrop-blur-sm h-16">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-white/80 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Online</span>
        </div>
        <SidebarTrigger className="text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-300 hover:shadow-lg backdrop-blur-sm border border-white/20" />
      </div>
    </div>
  );
};
*/}
import { LogOut, Plus, BookOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export const AdminHeader = ({ title, onLogout }: { title: string; onLogout: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-black h-16 border-b border-slate-700/50 flex items-center justify-between px-6 shadow-2xl backdrop-blur-sm">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-6">
        <img src={logo} alt="Logo" className="h-16 w-auto object-contain" />
        <h1 className="text-xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>

      {/* Right: Nav Buttons + Logout */}
      <div className="flex items-center gap-4 text-sm">
        {/*
        <button
          onClick={() => navigate("/admin/courses/create")}
          className={`text-white px-4 py-2 rounded-xl transition ${
            location.pathname === "/admin/courses/create"
              ? "bg-blue-600 font-semibold"
              : "hover:bg-white/10"
          }`}
        >
          <Plus className="inline-block w-4 h-4 mr-1" />
          Create Course
        </button>

        <button
          onClick={() => navigate("/admin/courses")}
          className={`text-white px-4 py-2 rounded-xl transition ${
            location.pathname === "/admin/courses"
              ? "bg-emerald-600 font-semibold"
              : "hover:bg-white/10"
          }`}
        >
          <BookOpen className="inline-block w-4 h-4 mr-1" />
          All Courses
        </button>
        */}


        {/*Button to Draft COurse*/}
        {/*
        <button
          onClick={() => navigate("/admin/courses/draft-courses",{ state: { refetch: true }})}
          className={`text-white px-4 py-2 rounded-xl transition ${
            location.pathname === "/admin/courses"
              ? "bg-emerald-600 font-semibold"
              : "hover:bg-white/10"
          }`}
        >
          <BookOpen className="inline-block w-4 h-4 mr-1" />
         Draft Courses
        </button>
        */}

        {!location.pathname.includes("/admin/courses/create") &&
        !location.pathname.includes("/admin/courses/edit") && (
          <button
            onClick={() =>
              navigate("/admin/courses/draft-courses", { state: { refetch: true } })
            }
            className={`text-white px-4 py-2 rounded-xl transition ${
              location.pathname === "/admin/courses"
                ? "bg-emerald-600 font-semibold"
                : "hover:bg-white/10"
            }`}
          >
            <BookOpen className="inline-block w-4 h-4 mr-1" />
            Draft Courses
          </button>
        )}



        <button
          onClick={()=>{navigate("/homepage")}}
          className="flex items-center gap-2 text-white bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold"
          >
          <LogOut className="inline-block w-4 h-4 " />
          Exit
        </button>
      </div>
    </header>
  );
};
