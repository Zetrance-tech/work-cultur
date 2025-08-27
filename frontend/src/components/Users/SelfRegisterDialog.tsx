import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
//import { toast } from 'react-hot-toast';
import { toast } from 'sonner';

import { getAllOrganizations } from '@/api/organizationAPI';
import { getDepartmentsByOrganizationId } from '@/api/departmentAPI';
import { registerUser } from '@/api/userAPI';
import type { RegisterUserPayload } from '@/api/userAPI';

type Props = {
  trigger?: React.ReactNode;
};


const SelfRegisterDialog: React.FC<Props> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    department: ''
  });

  // Load organizations
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const data = await getAllOrganizations();
        console.log("Organization received:", data);  // debug

        setOrgs(data);
      } catch {
        toast.error('Failed to load organizations');
      }
    };
    fetchOrgs();
  }, []);

  // Load departments when org changes
  useEffect(() => {
    if (formData.organization) {
      const fetchDepts = async () => {
        try {
          const data = await getDepartmentsByOrganizationId(formData.organization);
           console.log("Departments received:", data);
          setDepartments(data.departments);
        } catch {
          toast.error('Failed to load departments');
        }
      };
      fetchDepts();
    } else {
      setDepartments([]);
    }
  }, [formData.organization]);

  const handleSubmit = async () => {
    try {
        const payload: RegisterUserPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        accountType: 'employee',
        employeeData: {
            organization: formData.organization,
            department: formData.department,
        },
        };

      await registerUser(payload);
      toast.success('Registration submitted for approval');
      setOpen(false);
      setFormData({ name: '', email: '', password: '', organization: '', department: '' });
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button> Register</Button>
      </DialogTrigger>
      {/*
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Registration</DialogTitle>
          <DialogDescription>
            Register yourself by selecting an organization and department. Your request will be reviewed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
          </div>

          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="col-span-3" />
          </div>

          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="col-span-3" />
          </div>

          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="organization" className="text-right">Organization</Label>
            <Select
              value={formData.organization}
              onValueChange={(value) => setFormData({ ...formData, organization: value, department: '' })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {orgs?.map((org) => (
                  <SelectItem key={org._id} value={org._id}>{org.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
              disabled={!formData.organization}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments?.map((dept) => (
                  <SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
      */}
     <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle className="text-xl text-white">User Registration</DialogTitle>
        <DialogDescription className="text-sm text-gray-300">
          Register yourself by selecting an organization and department. Your request will be reviewed.
        </DialogDescription>
      </DialogHeader>

      <div className="px-6 py-4 space-y-4">
        {/* Name */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right text-white">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="col-span-3 bg-white/5 text-white placeholder-gray-400 border border-white/10"
          />
        </div>

        {/* Email */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right text-white">Email</Label>
          <Input
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="col-span-3 bg-white/5 text-white placeholder-gray-400 border border-white/10"
          />
        </div>

        {/* Password */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right text-white">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="col-span-3 bg-white/5 text-white placeholder-gray-400 border border-white/10"
          />
        </div>

        {/* Organization Dropdown */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="organization" className="text-right text-white">Organization</Label>
          <Select
            value={formData.organization}
            onValueChange={(value) => setFormData({ ...formData, organization: value, department: '' })}
          >
            <SelectTrigger className="col-span-3 bg-white/5 text-white border border-white/10">
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            
            <SelectContent  className="bg-black/80 backdrop-blur-md border border-white/10 text-white shadow-lg rounded-md">
              {orgs?.map((org) => (
                <SelectItem key={org._id} value={org._id}>{org.name} </SelectItem>
              ))}
            </SelectContent>
            
            
          </Select>
        </div>

        {/* Department Dropdown */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="department" className="text-right text-white">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
            disabled={!formData.organization}
          >
            <SelectTrigger className="col-span-3 bg-white/5 text-white border border-white/10 disabled:opacity-50">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            
            <SelectContent className="bg-black/80 backdrop-blur-md border border-white/10 text-white shadow-lg rounded-md">
              {departments?.map((dept) => (
                <SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
            
             
          </Select>
        </div>
      </div>

      <DialogFooter className="px-6 pb-4 pt-2 border-t border-white/10 flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setOpen(false)}
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Submit Request
        </Button>
      </DialogFooter>
    </DialogContent>


    </Dialog>
  );
};

export default SelfRegisterDialog;
