
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, UserCircle, LogOut } from "lucide-react";

const AppHeader: React.FC = () => {
  return (
      <header className="bg-black text-white border-b z-20 sticky top-0">
          <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {/*
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 bg-gradient-to-r from-brand-600 to-brand-700 rounded flex items-center justify-center text-white font-bold text-lg"
          >
            W
          </motion.div> */}
        {/*
           <motion.img 
            src="/newLogo.svg" // image is in public/
            alt="WorkCultur Logo"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="h-16 max-h-20 w-auto object-contain"
          />
          */}
          <img 
            src="/logo.jpg" 
            alt="Logo" 
            className="h-20 max-h-32 w-auto object-contain"
          />

          {/*
          <span className="font-bold text-xl bg-gradient-to-r from-brand-700 to-accent-600 text-transparent bg-clip-text">
            WorkCultur
          </span> */}
        </Link>
        
        {/*
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 overflow-hidden rounded-full bg-brand-50 ring-2 ring-brand-100">
              <img
                src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
                alt="User Avatar"
                className="h-full w-full object-cover"
              />
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Billing & Subscription</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
            
          </DropdownMenu>
        </div>
        */}
      </div>

    </header>
  );
};

export default AppHeader;
