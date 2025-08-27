
import React, { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
//import { organizations as initialOrganizations } from "@/data/mockData";
import { Organization } from "@/types";
import OrganizationCard from "@/components/Organizations/OrganizationCard";
import CreateOrganizationDialog from "@/components/Organizations/CreateOrganizationDialog";
//import { toast } from "@/components/ui/use-toast"; 
//import { SparklesCore } from "@/components/ui/sparkles";
import { ShimmerButton } from "@/components/ui/shimmer-button";

import { createOrganization ,getAllOrganizations} from "@/api/organizationAPI";
import { getAdminId } from "@/lib/authUtil";
//const [loading, setLoading] = useState(true); // for Loading
import {useNavigate} from "react-router-dom";

const Dashboard: React.FC = () => {
  //const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  //const [loading, setLoading] = useState(true);

  const navigate = useNavigate();  

  //Fetch organizations from backend on mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getAllOrganizations();
        console.log("Fetched organizations:", data); //  Debug

        setOrganizations(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);


/*
  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.adminEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );
*/

const filteredOrganizations = searchQuery.trim() === ""
  ? organizations
  : organizations.filter((org) => {
      if (!org || !org.name || !org.organization_admin_email) return false;
      return (
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.organization_admin_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });



  /*
  const handleCreateOrganization = (newOrg: { name: string; adminEmail: string; logo?: string }) => {
    const newOrganization: Organization = {
      id: (organizations.length + 1).toString(),
      name: newOrg.name,
      adminEmail: newOrg.adminEmail,
      logo: newOrg.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(newOrg.name)}&background=0D8ABC&color=fff`,
      createdAt: new Date().toISOString(),
      departmentCount: 0,
      courseCount: 0,
      userCount: 0
    };

    setOrganizations([newOrganization, ...organizations]);
  };
  */  

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };
  


  //fucntion to make call to API defintion for creating new organisation.
  const handleCreateOrganization = async (newOrg: {
    name: string;
    adminEmail: string;
    logo?: string;
  }) : Promise<{ success: boolean; message?: string }> => {
    try {
        const payload = {
        name: newOrg.name,
        organization_admin_email: newOrg.adminEmail,
        logo_url: newOrg.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(newOrg.name)}`,
        //https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png
        //adminId: "684e6406194b190a99d861e1",
        adminId:getAdminId(),
      };

      console.log("Data sent to create organization:", payload);

      const createdOrg =  await createOrganization(payload);
      console.log("Received response from backend:", createdOrg);

      const newOrganization: Organization = {
        ...createdOrg,
        createdAt: new Date().toISOString(),
        departmentCount: 0,
        courseCount: 0,
        userCount: 0,
      };

      setOrganizations([newOrganization, ...organizations]);
      return { success: true }; 
      
    } catch (error:any) {
      console.error("Failed to create organization:", error);
       return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Something went wrong while creating the organization.",
    };

    }
  };


  // Debug logs - place right before return
console.log("Search Query:", searchQuery);
console.log("Organizations in state:", organizations);
console.log("Filtered Organizations:", filteredOrganizations);

{/*
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-700 to-accent-600 text-transparent bg-clip-text mb-4">
          Welcome to SkillSpark
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Assess and develop your team's skills with our powerful platform
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
      >
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search organizations..."
            className="pl-9 border-2 h-12 focus:border-brand-500 focus:ring-brand-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

             
        <CreateOrganizationDialog onCreateOrganization={handleCreateOrganization} />
        

      </motion.div>

      {filteredOrganizations.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center py-16 bg-white rounded-xl shadow-sm"
        >
          <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No organizations found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? "We couldn't find any organizations matching your search." : "Get started by creating your first organization."}
          </p>
          {!searchQuery && (
            
            <button 
              onClick={openCreateDialog}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Organization
            </button>
            
          )}
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrganizations.map((organization, index) => (
            <motion.div 
            
              key={organization._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="transform transition-all"
            >
              <OrganizationCard organization={organization} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
    
  );
  */}

return (
    <div className="relative min-h-screen"> {/* Add relative positioning and min-height */}
      {/* Background with Shooting Stars 

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-80" /> 
        <ShootingStars />
      </div>
    */}

      {/*  <div className="absolute inset-0 z-0 overflow-hidden"> */}
  {/* Dark overlay and optional stars */}
 {/* <div className="absolute inset-0 bg-black opacity-80" /> */}
 {/* <ShootingStars /> */}

  {/* Elegant Shape Backgrounds 
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
    */}

{/*
    <div className="absolute top-4 right-6 z-20">
      <button
        onClick={() => navigate("/homepage")} // or replace "/" with your actual home route
        className="bg-white text-black font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-all"
      >
        Back To Home
      </button>
    </div>
*/}
      <div className="absolute top-6 right-6 z-50 mb-32">
        <ShimmerButton
          onClick={()=>{navigate("/homepage")}}
        >
          Back to Homepage
        </ShimmerButton>
      </div>

      {/* Main Dashboard Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          {/*
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-700 to-accent-600 text-transparent bg-clip-text mb-4">
            Welcome to WorkCulture
          </h1>
          */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
            Welcome to WorkCulture
          </h1>


          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Assess and develop your team's skills with our powerful platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
        >
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search organizations..."
              //className="pl-9 border-2 h-12 focus:border-brand-500 focus:ring-brand-500"
              className="pl-9 h-12 border  bg-white/5 text-white rounded-xl shadow-md backdrop-blur-md  focus:ring-0 focus:outline-none placeholder:text-white/60 hover:bg-white/10 transition-colors duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <CreateOrganizationDialog onCreateOrganization={handleCreateOrganization} />
        </motion.div>

        
        {filteredOrganizations.length === 0 ? (
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm"
          >
            {/*
            <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            
            
            <h3 className="text-xl font-medium mb-2">No organizations found</h3>
            
            <p className="text-gray-500 mb-6">
              {searchQuery ? "We couldn't find any organizations matching your search." : "Get started by creating your first organization."}
            </p>
            
            {!searchQuery && (
              <button
                onClick={openCreateDialog}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Organization
              </button>

            )}
          */}  
           <p className="text-white/70">No organizations found. Create one to get started!</p>
          </motion.div>
          
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrganizations.map((organization, index) => (
              <motion.div
                key={organization._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="transform transition-all"
              >
                <OrganizationCard organization={organization} />
              </motion.div>
            ))}
          </div>
        )}
          

      </div>
    </div>
  );


{/*
  return (
  <div className="relative overflow-hidden min-h-screen">
    
    <div className="absolute inset-0 z-0  border-4 border-green-500">
      <SparklesCore
        background="transparent"
        minSize={1.5}
        maxSize={3}
        particleDensity={300}
        className="w-full h-full"
        particleColor="#FFFFFF"
        speed={1}
      />
    </div>

    
    <div className="container relative z-10 mx-auto px-4 py-8 bg-red-500/40 border-2 border-yellow-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-700 to-accent-600 text-transparent bg-clip-text mb-4">
          Welcome to SkillSpark
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Assess and develop your team's skills with our powerful platform
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
      >
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search organizations..."
            className="pl-9 border-2 h-12 focus:border-brand-500 focus:ring-brand-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <CreateOrganizationDialog onCreateOrganization={handleCreateOrganization} />
      </motion.div>

      {filteredOrganizations.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center py-16 bg-transparent rounded-xl shadow-sm"
        >
          <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No organizations found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "We couldn't find any organizations matching your search."
              : "Get started by creating your first organization."}
          </p>
          {!searchQuery && (
            <button
              onClick={openCreateDialog}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Organization
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrganizations.map((organization, index) => (
            <motion.div
              key={organization._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="transform transition-all"
            >
              <OrganizationCard organization={organization} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  </div>
);
 */}
};

export default Dashboard;
