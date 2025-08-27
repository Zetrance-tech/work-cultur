/*
import React, { useState } from "react";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateDepartmentById } from "@/api/departmentAPI";
import { useToast } from "@/components/ui/use-toast";

interface UpdateDepartmentDialogProps {
  department: any;
  onUpdate: (updated: any) => void;
}

const UpdateDepartmentDialog: React.FC<UpdateDepartmentDialogProps> = ({
  department,
  onUpdate,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(department.description);

  const updateDeparment = async () => {
    try {
      const payload = {
        departmentId: department._id,
        name,
        description,
        adminId: "683b29ed7e154cbcff29dd47",
      };
      
      console.log("Data sent to udpate:", payload);

      const response = await updateDepartmentById(payload);

      toast({ title: "Success", description: "Department updated successfully." });
      onUpdate({ ...department, name, description });
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error?.message || "Something went wrong.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Department</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>Update name and description.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={updateDeparment}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDepartmentDialog;
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
import { Textarea } from "@/components/ui/textarea";
import { updateDepartmentById } from "@/api/departmentAPI";
import { useToast } from "@/components/ui/use-toast";
import { getAdminId } from "@/lib/authUtil";

interface UpdateDepartmentDialogProps {
  department: any;
  onUpdate: (updated: any) => void;
}

const UpdateDepartmentDialog: React.FC<UpdateDepartmentDialogProps> = ({
  department,
  onUpdate,
}) => {

  console.log("Received department prop:", department);

  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(department.description);

  const updateDeparment = async () => {
    try {
      const payload = {
        organizationId: department.organization._id,
        departmentId: department._id,
        name,
        description,
        //adminId: "683b29ed7e154cbcff29dd47", // Replace with actual adminId logic
        adminId:getAdminId(),
      };

      const response = await updateDepartmentById(payload);

      toast({ title: "Success", description: "Department updated successfully." });
      onUpdate({ ...department, name, description });
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error?.message || "Something went wrong.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" 
          /*className="text-white border-white/20 hover:bg-white/10"*/
           className="bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-md px-4 py-2 shadow"
          >
          Edit Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6 bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Edit Department</DialogTitle>
          <DialogDescription className="text-sm text-gray-300">
            Update the department name and description.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="name" className="text-base text-white block mb-1">
              Department Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              placeholder="Department name"
            />
          </div>

          <div>
            <label htmlFor="description" className="text-base text-white block mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Enter department description..."
              className="text-base bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={updateDeparment}
            className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDepartmentDialog;
