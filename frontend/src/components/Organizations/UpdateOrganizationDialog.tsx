/*
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { updateOrganization } from "@/api/organizationAPI";
import { Organization } from "@/types";

interface UpdateOrganizationDialogProps {
  organization: Organization;
  onUpdate: (updatedOrg: Organization) => void;
}

const UpdateOrganizationDialog: React.FC<UpdateOrganizationDialogProps> = ({
  organization,
  onUpdate,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(organization.name);
  const [email, setEmail] = useState(organization.organization_admin_email || "");

  const handleSubmit = async () => {
    try {

      console.log("🧪 Final Payload:", {
        id: organization._id,
        name,
        organization_admin_email: email,
      });

      const updated = await updateOrganization({
        id: organization._id,
        name,
        organization_admin_email: email,

      });

      toast({
        title: "Updated",
        description: "Organization updated successfully.",
      });

      onUpdate(updated);
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md">Update Organization</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Organization</DialogTitle>
          <DialogDescription>
            Edit the organization name and admin email, then click "Update".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            placeholder="Organization Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateOrganizationDialog;
*/

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { updateOrganization } from "@/api/organizationAPI";
import { Organization } from "@/types";

interface UpdateOrganizationDialogProps {
  organization: Organization;
  onUpdate: (updatedOrg: Organization) => void;
}

const UpdateOrganizationDialog: React.FC<UpdateOrganizationDialogProps> = ({
  organization,
  onUpdate,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(organization.name);
  const [email, setEmail] = useState(organization.organization_admin_email || "");

  const handleSubmit = async () => {
    try {
      const updated = await updateOrganization({
        id: organization._id,
        name,
        organization_admin_email: email,
      });

      toast({
        title: "Updated",
        description: "Organization updated successfully.",
      });

      onUpdate(updated);
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md">
          Update Organization
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-6 bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Update Organization</DialogTitle>
          <DialogDescription className="text-sm text-gray-300">
            Edit the organization name and admin email, then click "Update".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="org-name" className="text-base text-white block mb-1">
              Organization Name
            </label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization Name"
              className="h-12 text-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="admin-email" className="text-base text-white block mb-1">
              Admin Email
            </label>
            <Input
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="h-12 text-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateOrganizationDialog;
