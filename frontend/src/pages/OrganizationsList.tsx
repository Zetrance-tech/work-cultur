
import React, { useState } from "react";
import { organizations as initialOrganizations } from "@/data/mockData";
import { Organization } from "@/types";
import OrganizationCard from "@/components/Organizations/OrganizationCard";
import CreateOrganizationDialog from "@/components/Organizations/CreateOrganizationDialog";
import { Input } from "@/components/ui/input";
import { Building2, Search } from "lucide-react";

const OrganizationsList: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.adminEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Organizations
          </h1>
          <p className="text-muted-foreground">
            Manage and view all organizations on the platform.
          </p>
        </div>
        <CreateOrganizationDialog onCreateOrganization={handleCreateOrganization} />
      </div>

      <div className="relative w-full max-w-[400px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search organizations..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredOrganizations.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No organizations found</h3>
          <p className="text-muted-foreground">
            We couldn't find any organizations matching your search.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrganizations.map(organization => (
            <OrganizationCard key={organization.id} organization={organization} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationsList;
