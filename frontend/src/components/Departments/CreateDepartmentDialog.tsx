/*
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateDepartmentDialogProps {
  organizationId: string;
  onCreateDepartment: (department: {
    name: string;
    description: string;
    organizationId: string;
  }) => void;
}

const CreateDepartmentDialog: React.FC<CreateDepartmentDialogProps> = ({
  organizationId,
  onCreateDepartment,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Missing fields",
        description: "Please provide a department name.",
        variant: "destructive",
      });
      return;
    }
    
    onCreateDepartment({
      name,
      description,
      organizationId,
    });
    
    // Reset form
    setName("");
    setDescription("");
    
    // Close dialog
    setOpen(false);
    
    toast({
      title: "Department created",
      description: `${name} department has been created successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md">
          <PlusCircle className="h-4 w-4" />
          New Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
            <DialogDescription>
              Add a new department to this organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="required">
                Department Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Engineering"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Software and hardware engineering teams"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Department</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartmentDialog;
*/

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateDepartmentDialogProps {
  organizationId: string;
  onCreateDepartment: (department: {
    name: string;
    description: string;
    organizationId: string;
  }) => void;
}

const CreateDepartmentDialog: React.FC<CreateDepartmentDialogProps> = ({
  organizationId,
  onCreateDepartment,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Missing fields",
        description: "Please provide a department name.",
        variant: "destructive",
      });
      return;
    }

    onCreateDepartment({
      name,
      description,
      organizationId,
    });

    setName("");
    setDescription("");
    setOpen(false);

    toast({
      title: "Department created",
      description: `${name} department has been created successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md">
          <PlusCircle className="h-4 w-4" />
          New Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6 bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Create Department</DialogTitle>
            <DialogDescription className="text-sm text-gray-300">
              Add a new department to this organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-base text-white">
                Department Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Engineering"
                required
                className="h-12 text-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:outline-none focus-visible:ring-0 rounded-md"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-base text-white">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Software and hardware engineering teams"
                rows={3}
                className="text-base bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:outline-none focus-visible:ring-0 rounded-md"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-white hover:text-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2"
            >
              Create Department
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartmentDialog;
