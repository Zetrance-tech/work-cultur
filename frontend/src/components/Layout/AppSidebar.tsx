
import React from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { 
  HomeIcon, 
  Building2, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const AppSidebar: React.FC = () => {
  const location = useLocation();
  
  const navigationItems = [
    {
      label: "Main",
      items: [
        {
          title: "Dashboard",
          icon: HomeIcon,
          url: "/"
        },
        {
          title: "Organizations",
          icon: Building2,
          url: "/organizations"
        }
      ]
    },
    {
      label: "Management",
      items: [
        {
          title: "Departments",
          icon: Users,
          url: "/departments"
        },
        {
          title: "Courses",
          icon: BookOpen,
          url: "/courses"
        }
      ]
    },
    {
      label: "Insights",
      items: [
        {
          title: "Analytics",
          icon: BarChart3,
          url: "/analytics"
        }
      ]
    },
    {
      label: "Account",
      items: [
        {
          title: "Settings",
          icon: Settings,
          url: "/settings"
        },
        {
          title: "Logout",
          icon: LogOut,
          url: "/logout"
        }
      ]
    }
  ];

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarContent>
        {navigationItems.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url} 
                        className={cn(
                          "flex items-center gap-3",
                          location.pathname === item.url ? "text-brand-700 font-medium" : "text-gray-600"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
