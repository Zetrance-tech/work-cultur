/*
import React from "react";
import AppHeader from "./AppHeader";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    
    <div className="min-h-screen flex flex-col w-full bg-black text-white"> 
    
    <AppHeader />
      <div className="flex-1 w-full">
        <main className="flex-1 p-6 md:p-8 pt-6 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
*/


/*
import React from "react";
import AppHeader from "./AppHeader";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { ElegantShape } from "@/components/ui/elegant-shape";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col w-full bg-black text-white overflow-hidden">
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-80" />
        <ShootingStars />
       
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

    
      <div className="relative z-10">
        <AppHeader />
      </div>

      <div className="relative z-10 flex-1 w-full">
        <main className="flex-1 p-6 md:p-8 pt-6 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
*/

/*
import React from "react";
import AppHeader from "./AppHeader";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { ElegantShape } from "@/components/ui/elegant-shape";
import { Outlet } from "react-router-dom";

const AppShell: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col w-full bg-black text-white overflow-hidden">

      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-80" />
        <ShootingStars />
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10">
        <AppHeader />
      </div>

      <div className="relative z-10 flex-1 w-full">
        <main className="flex-1 p-6 md:p-8 pt-6 overflow-y-auto w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
*/

{/*
import React from "react";
import { useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { ElegantShape } from "@/components/ui/elegant-shape";
import { Outlet } from "react-router-dom";

const AppShell: React.FC = () => {
  const location = useLocation();
const isAuthRoute = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="relative min-h-screen flex flex-col w-full bg-black text-white overflow-hidden">
   
      {!isAuthRoute && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-80" />
          <ShootingStars />
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-indigo-500/[0.15]"
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-rose-500/[0.15]"
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />
          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-violet-500/[0.15]"
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          />
          <ElegantShape
            delay={0.6}
            width={200}
            height={60}
            rotate={20}
            gradient="from-amber-500/[0.15]"
            className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          />
          <ElegantShape
            delay={0.7}
            width={150}
            height={40}
            rotate={-25}
            gradient="from-cyan-500/[0.15]"
            className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          />
        </div>
      )}

   
      <div className="relative z-10">
        <AppHeader />
      </div>

      <div className="relative z-10 flex-1 w-full">
        <main className="flex-1 p-6 md:p-8 pt-6 overflow-y-auto w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
*/}

import React from "react";
import { useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { ElegantShape } from "@/components/ui/elegant-shape";
import { Outlet } from "react-router-dom";

const AppShell: React.FC = () => {
  const location = useLocation();
  const isAuthRoute = ['/login', '/signup'].includes(location.pathname);
  const isCourseFeature = location.pathname.startsWith('/admin/courses');

  return (
    <div className="relative min-h-screen flex flex-col w-full bg-black text-white overflow-hidden">
      {/* Full-screen background, skipped for login/signup or course feature routes */}
      {!isAuthRoute && !isCourseFeature && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-80" />
          <ShootingStars />
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-indigo-500/[0.15]"
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-rose-500/[0.15]"
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />
          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-violet-500/[0.15]"
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          />
          <ElegantShape
            delay={0.6}
            width={200}
            height={60}
            rotate={20}
            gradient="from-amber-500/[0.15]"
            className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          />
          <ElegantShape
            delay={0.7}
            width={150}
            height={40}
            rotate={-25}
            gradient="from-cyan-500/[0.15]"
            className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          />
        </div>
      )}

      {/* Foreground: Header + Page Content */}
      <div className="relative z-10">
        {!isCourseFeature && <AppHeader />} {/* Render AppHeader only if not in course feature */}
      </div>

      <div className="relative z-10 flex-1 w-full">
        <main className="flex-1 p-6 md:p-8 pt-6 overflow-y-auto w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;