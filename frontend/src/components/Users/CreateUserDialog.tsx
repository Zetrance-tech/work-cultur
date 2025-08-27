/*
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createUserByAdmin } from '@/api/userAPI';
import { useParams } from 'react-router-dom';

interface CreateUserDialogProps {
  onCreate: (user: any) => void;
  trigger: React.ReactNode;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ onCreate, trigger }) => {
  const { orgId, deptId } = useParams<{ orgId: string; deptId: string }>();
  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    accountType: 'employee',
    jobTitle: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    accountType: '',
    jobTitle: '',
  });

  const handleSubmit = async () => {
    const errors = {
      name: userData.name.trim() === '' ? 'Name is required' : '',
      email: (() => {
        if (userData.email.trim() === '') return 'Email is required';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return !emailRegex.test(userData.email.trim()) ? 'Enter a valid email address' : '';
      })(),

      password: userData.password.trim() === '' ? 'Password is required' : '',
      accountType: userData.accountType === '' ? 'Account type is required' : '',
      jobTitle:
        userData.accountType === 'employee' && userData.jobTitle.trim() === ''
          ? 'Job title is required for employees'
          : '',
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((err) => err !== '');
    if (hasErrors) return;

    try {
      const payload: any = {
        ...userData,
        ...(userData.accountType === 'employee' && {
          employeeData: {
            organization: orgId,
            department: deptId,
          },
        }),
      };

      const newUser = await createUserByAdmin(payload);
      onCreate(newUser.user);
      toast.success('User created successfully');
      setOpen(false);
      setUserData({
        name: '',
        email: '',
        password: '',
        accountType: 'employee',
        jobTitle: '',
      });
      setFormErrors({
        name: '',
        email: '',
        password: '',
        accountType: '',
        jobTitle: '',
      });
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new registered user to this department.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
         
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <div className="col-span-3">
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
            </div>
          </div>

         
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <div className="col-span-3">
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className={formErrors.email ? 'border-red-500' : ''}
              />
              {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
            </div>
          </div>

         
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Password</Label>
            <div className="col-span-3">
              <Input
                id="password"
                type="password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                className={formErrors.password ? 'border-red-500' : ''}
              />
              {formErrors.password && <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>}
            </div>
          </div>

         
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accountType" className="text-right">Account Type</Label>
            <div className="col-span-3">
              <Select
                value={userData.accountType}
                onValueChange={(value) => setUserData({ ...userData, accountType: value })}
              >
                <SelectTrigger className={formErrors.accountType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.accountType && <p className="text-sm text-red-500 mt-1">{formErrors.accountType}</p>}
            </div>
          </div>

         
          {userData.accountType === 'employee' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobTitle" className="text-right">Job Title</Label>
              <div className="col-span-3">
                <Input
                  id="jobTitle"
                  value={userData.jobTitle}
                  onChange={(e) => setUserData({ ...userData, jobTitle: e.target.value })}
                  className={formErrors.jobTitle ? 'border-red-500' : ''}
                />
                {formErrors.jobTitle && <p className="text-sm text-red-500 mt-1">{formErrors.jobTitle}</p>}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
*/

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { createUserByAdmin } from '@/api/userAPI';
import { useParams } from 'react-router-dom';

interface CreateUserDialogProps {
  onCreate: (user: any) => void;
  trigger: React.ReactNode;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ onCreate, trigger }) => {
  const { orgId, deptId } = useParams<{ orgId: string; deptId: string }>();
  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    accountType: 'employee',
    jobTitle: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    accountType: '',
    jobTitle: '',
  });

  const handleSubmit = async () => {
    const errors = {
      name: userData.name.trim() === '' ? 'Name is required' : '',
      email: (() => {
        if (userData.email.trim() === '') return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(userData.email.trim()) ? 'Enter a valid email address' : '';
      })(),
      password: userData.password.trim() === '' ? 'Password is required' : '',
      accountType: userData.accountType === '' ? 'Account type is required' : '',
      jobTitle:
        userData.accountType === 'employee' && userData.jobTitle.trim() === ''
          ? 'Job title is required for employees'
          : '',
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((err) => err !== '');
    if (hasErrors) return;

    try {
      const payload: any = {
        ...userData,
        ...(userData.accountType === 'employee' && {
          employeeData: {
            organization: orgId,
            department: deptId,
          },
        }),
      };

      const newUser = await createUserByAdmin(payload);
      onCreate(newUser.user);
      toast.success('User created successfully');
      setOpen(false);
      setUserData({
        name: '',
        email: '',
        password: '',
        accountType: 'employee',
        jobTitle: '',
      });
      setFormErrors({
        name: '',
        email: '',
        password: '',
        accountType: '',
        jobTitle: '',
      });
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6 bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Create New User</DialogTitle>
          <DialogDescription className="text-sm text-gray-300">
            Add a new registered user to this department.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {[
            { label: 'Name', key: 'name', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Password', key: 'password', type: 'password' },
          ].map((field) => (
            <div key={field.key}>
              <Label htmlFor={field.key} className="text-white block mb-1">
                {field.label}
              </Label>
              <Input
                id={field.key}
                type={field.type}
                value={(userData as any)[field.key]}
                onChange={(e) =>
                  setUserData({ ...userData, [field.key]: e.target.value })
                }
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className={`h-12 text-lg bg-white/5 text-white placeholder-gray-400 border ${
                  formErrors[field.key as keyof typeof formErrors]
                    ? 'border-red-500'
                    : 'border-white/10'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md`}
              />
              {formErrors[field.key as keyof typeof formErrors] && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors[field.key as keyof typeof formErrors]}
                </p>
              )}
            </div>
          ))}

          {/* Account Type */}
          <div>
            <Label htmlFor="accountType" className="text-white block mb-1">
              Account Type
            </Label>
            <Select
              value={userData.accountType}
              onValueChange={(value) => setUserData({ ...userData, accountType: value })}
            >
              <SelectTrigger
                className={`h-12 text-lg bg-white/5 text-white placeholder-gray-400 border ${
                  formErrors.accountType ? 'border-red-500' : 'border-white/10'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md`}
              >
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-md border border-white/10 text-white shadow-lg rounded-md">
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.accountType && (
              <p className="text-sm text-red-500 mt-1">{formErrors.accountType}</p>
            )}
          </div>

          {/* Job Title */}
          {userData.accountType === 'employee' && (
            <div>
              <Label htmlFor="jobTitle" className="text-white block mb-1">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                value={userData.jobTitle}
                onChange={(e) => setUserData({ ...userData, jobTitle: e.target.value })}
                placeholder="Enter job title"
                className={`h-12 text-lg bg-white/5 text-white placeholder-gray-400 border ${
                  formErrors.jobTitle ? 'border-red-500' : 'border-white/10'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md`}
              />
              {formErrors.jobTitle && (
                <p className="text-sm text-red-500 mt-1">{formErrors.jobTitle}</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2">
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;


