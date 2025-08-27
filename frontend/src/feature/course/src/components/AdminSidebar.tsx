{/*


import { 
   
  Sidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator
} from './ui/sidebar';


// Updated (use shared alias)
//import { SidebarProvider } from '/components/ui/sidebar';


import { LogOut, Plus, BookOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const LOGO_URL = "../../public/logo.png";

// Reusable Admin Sidebar Component
export const AdminSidebar = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-slate-50 to-white shadow-xl">
        <img 
          src={LOGO_URL} 
          alt="Company Logo" 
          className="h-20 w-full mx-auto filter drop-shadow-sm"
        />
      
      <SidebarSeparator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <SidebarContent className="px-4 py-8">
        <SidebarMenu className="space-y-3">
          <SidebarMenuItem>
            <SidebarMenuButton 
              //onClick={() => navigate("/")}
              //onClick={() => navigate("/admin/courses/edit/new")}
              onClick={() => navigate("/admin/courses/create")}
              isActive={location.pathname === "/"}
              className="w-full justify-start h-14 px-6 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-600 data-[active=true]:to-indigo-600 data-[active=true]:text-white data-[active=true]:font-semibold data-[active=true]:shadow-lg group"
            >
              <Plus className="h-5 w-5 mr-4 group-data-[active=true]:scale-110 transition-transform" />
              <span className="text-sm font-medium tracking-wide">Create Course</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate("/admin/courses")}
              isActive={location.pathname === "/admin/courses"}
              className="w-full justify-start h-14 px-6 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-emerald-600 data-[active=true]:to-teal-600 data-[active=true]:text-white data-[active=true]:font-semibold data-[active=true]:shadow-lg group"
            >
              <BookOpen className="h-5 w-5 mr-4 group-data-[active=true]:scale-110 transition-transform" />
              <span className="text-sm font-medium tracking-wide">All Courses</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-gray-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={onLogout}
              className="w-full justify-start h-14 px-6 rounded-xl text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:shadow-md transition-all duration-300 group"
            >
              <LogOut className="h-5 w-5 mr-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium tracking-wide">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
*/}
import { useState, useEffect } from "react";
import { 
  Sidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from './ui/sidebar';
import { LogOut, Plus, BookOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const LOGO_URL = "../../public/logo.png";

export const AdminSidebar = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="border-r-0 bg-black w-64 p-0"> {/* Changed bg to black, removed padding */}
      <div className="flex items-center justify-center h-16">
        <img 
          src={LOGO_URL} 
          alt="Company Logo" 
          className="h-10 w-auto object-contain" // Adjusted for compactness
        />
      </div>
      <SidebarSeparator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <SidebarContent className="px-4 py-4">
        <SidebarMenu className="space-y-3">
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate("/admin/courses/create")}
              isActive={location.pathname === "/admin/courses/create"}
              className="w-full justify-start h-14 px-6 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-600 data-[active=true]:to-indigo-600 data-[active=true]:text-white data-[active=true]:font-semibold data-[active=true]:shadow-lg group"
            >
              <Plus className="h-5 w-5 mr-4 group-data-[active=true]:scale-110 transition-transform" />
              <span className="text-sm font-medium tracking-wide">Create Course</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate("/admin/courses")}
              isActive={location.pathname === "/admin/courses"}
              className="w-full justify-start h-14 px-6 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md data-[active=true]:bg-gradient-to-r data-[active=true]:from-emerald-600 data-[active=true]:to-teal-600 data-[active=true]:text-white data-[active=true]:font-semibold data-[active=true]:shadow-lg group"
            >
              <BookOpen className="h-5 w-5 mr-4 group-data-[active=true]:scale-110 transition-transform" />
              <span className="text-sm font-medium tracking-wide">All Courses</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-gray-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={onLogout}
              className="w-full justify-start h-14 px-6 rounded-xl text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:shadow-md transition-all duration-300 group"
            >
              <LogOut className="h-5 w-5 mr-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium tracking-wide">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
