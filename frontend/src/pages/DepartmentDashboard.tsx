import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Building2, 
  ChevronLeft, 
  Users, 
  BookOpen, 
  UserPlus,
  Plus,
  ListFilter,
  Layers,
  PieChart,
  Award,
  Trash2,
  Upload,
  UserCheck,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  departments, 
  organizations, 
  courses, 
  users,
  enrollments
} from "@/data/mockData";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";
import { getDepartmentById, updateDepartmentById, getDepartmentsByOrganizationId} from "@/api/departmentAPI";
import UpdateDepartmentDialog from "@/components/Departments/UpdateDepartmentDialog";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

import  CreateUserDialog  from "@/components/Users/CreateUserDialog";
import SelfRegisterDialog from "@/components/Users/SelfRegisterDialog"; // Adjust path if different

import {
  getDepartmentUsers,
  approveUser,
  rejectUser,
  approveAllUsers,
  deleteUser,
  getPendingUsers,
  transferUser,
  updateUserDetails,
  bulkUploadUsers
} from '@/api/userAPI';

import { getAllOrganizations } from "@/api/organizationAPI";


interface User {
  id: string;
  name: string;
  email: string;
  departmentId?: string;
  role?: string;
  skills?: string[]; // Add skills for skillsCount calculation
}

const DepartmentDashboard: React.FC = () => {
  const { orgId, deptId } = useParams<{ orgId: string; deptId: string }>();
  const [activeTab, setActiveTab] = useState("pending");
  const [department, setDepartment] = useState<any>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [pendingUsersList, setPendingUsersList] = useState<any[]>([]);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectUserId, setRejectUserId] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
    const [roleUserId, setRoleUserId] = useState("");
  const [newRole, setNewRole] = useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [deptUsers, setDeptUsers] = useState<any[]>([]);
  
const [isLoading, setIsLoading] = useState(false);

const [transferUserId, setTransferUserId] = useState("");
const [transferDepartmentId, setTransferDepartmentId] = useState("");
const [transferCurrentDept, setTransferCurrentDept] = useState("");


const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
const [editUserId, setEditUserId] = useState("");
const [editName, setEditName] = useState("");
const [editEmail, setEditEmail] = useState("");

const [departments, setDepartments] = useState([]);
const [currentDeptId, setCurrentDeptId] = useState('');
//const [orgId, setOrgId] = useState<string>('');
const [derivedOrgId, setDerivedOrgId] = useState<string | null>(null);

//approve all using checkbox
const [selectedUsers,setSelectedUsers] = useState<string[]>([]);

const handleEditUser = (user: any) => {
  console.log("Edit user clicked", user);
  setEditUserId(user.id);
  setEditName(user.name);
  setEditEmail(user.email);
  setIsEditDialogOpen(true);
};



const handleUpdateUserDetails = async () => {
  if (!editName || !editEmail) {
    toast.error("Name and email are required");
    return;
  }

  try {
    await updateUserDetails(editUserId, { name: editName, email: editEmail });
    toast.success("User updated successfully");

    setDeptUsers(prev =>
      prev.map(user =>
        user.id === editUserId ? { ...user, name: editName, email: editEmail } : user
      )
    );
  } catch (error) {
    console.error("Error updating user:", error);
    toast.error("Failed to update user");
  } finally {
    setIsEditDialogOpen(false);
    setEditUserId("");
    setEditName("");
    setEditEmail("");
  }
};


    const fetchDeptUsers = async () => {
    setIsLoading(true);
    try {
      if (deptId) {
        console.log("Fetching users from department:", deptId);
          const response = await getDepartmentUsers(deptId);
        console.log('getDepartmentUsers Response:', response); // Debug
       
        const users = response.users;
        console.log('employeeData:', users[0]?.employeeData);

        
        const mappedUsers = Array.isArray(users)
          ? users.map(user => ({
              id: user._id,
              name: user.name,
              email: user.email,
              departmentId: user.employeeData?.departmentId || '', // Adjust based on actual structure
              departmentName: user.employeeData?.department?.name,
              role: user.employeeData?.role || 'Viewer', // Default to 'Viewer'
              skills: user.employeeData?.skills || [], // Ensure skills is an array
            }))
          : [];
          

        setDeptUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch department users:', error);
      toast.error('Failed to fetch department users');
      setDeptUsers([]); // Fallback to empty array
    }finally {
    setIsLoading(false);
  }
  };

  
    const fetchPendingUsers = async () => {
      try {
        if (deptId) {
          console.log("Calling getPendingUsers with deptId:", deptId); 
          const pending = await getPendingUsers(deptId);
          console.log("Pending users response:", pending);

          setPendingUsersList(pending.users || []); 
          //setPendingUsersList(pending);
          console.log(" Set pendingUsersList:", pending.users);

        }
      } catch (error) {
        toast.error("Failed to fetch pending users");
      }
    };



/*
  useEffect(() => {
  
  const fetchDepartment = async () => {
    try {
      // Step 1: Get department
      const deptResponse = await getDepartmentById(deptId);
      const dept  =  deptResponse.department;
      console.log("DEPARYMENT ID:",dept);

      setDepartment(dept);

      const orgIdFromDept = typeof dept.organization === "string"
      ? dept.organization
      : dept.organization?._id;

      console.log("ORGNAIZATION ID:",orgIdFromDept);
      setDerivedOrgId(orgIdFromDept); 

      // Step 2: If orgId exists, fetch all departments for the org
      if (orgIdFromDept) {
        const orgDepartments = await getDepartmentsByOrganizationId(orgIdFromDept);
        
        // Extract the array from the { departments: [...] } object
        const departmentList = orgDepartments.departments;


        if (Array.isArray(departmentList)) {
          setDepartments(departmentList);
          console.log("Fetched departments for org:", departmentList);
        } else {
          setDepartments([]);
          console.warn("Organization departments not found.");
        }
      }
    } catch (error) {
      console.error("Failed to fetch department:", error);
      toast.error("Failed to fetch department");
    }
  };



    if (deptId) fetchDepartment();
    fetchDeptUsers();
    fetchPendingUsers();
  }, [deptId, orgId]);
*/

useEffect(() => {
  if (!deptId) return;

  const fetchDepartment = async () => {
    try {
      const deptResponse = await getDepartmentById(deptId);
      const dept = deptResponse.department;
      console.log("DEPARYMENT ID:", dept);

      setDepartment(dept);

      const orgIdFromDept =
        typeof dept.organization === "string"
          ? dept.organization
          : dept.organization?._id;

      console.log("ORGNAIZATION ID:", orgIdFromDept);
      setDerivedOrgId(orgIdFromDept);

      if (orgIdFromDept) {
        const orgDepartments = await getDepartmentsByOrganizationId(orgIdFromDept);
        const departmentList = orgDepartments.departments;

        if (Array.isArray(departmentList)) {
          setDepartments(departmentList);
          console.log("Fetched departments for org:", departmentList);
        } else {
          setDepartments([]);
          console.warn("Organization departments not found.");
        }
      }
    } catch (error) {
      console.error("Failed to fetch department:", error);
      toast.error("Failed to fetch department");
    }
  };

  // Initial data fetch
  fetchDepartment();
  fetchDeptUsers();
  fetchPendingUsers();

  // Fetch pending users every 10 seconds
  const intervalId = setInterval(() => {
    fetchPendingUsers();
  }, 10000); // 10 seconds

  
  return () => clearInterval(intervalId);
}, [deptId,orgId]); 


  
  if (!department) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {/*
        <Building2 className="h-16 w-16 text-gray-300 mb-4" />
        
        <h2 className="text-2xl font-semibold mb-2">Department Not Found</h2>
        <p className="text-gray-500 mb-6">The department you're looking for doesn't exist or has been removed.</p>
        */}
        <p className="text-gray-500 mb-6">Loading...</p>
        {/*
        <Button asChild variant="outline">
          <Link to={`/organization/${orgId}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Organization
          </Link>
        </Button>
        */}
      </div>
    );
  }


  const organization = department.organization;
  const deptCourses = courses.filter(course => 
    (course.departmentIds.includes(deptId || '') || course.departmentId === deptId)
  );
  //const deptUsers = users.filter(user => user.departmentId === deptId);
  //const deptUsers = dummyDeptUsers; 

  /*
  const availableUsers = users.filter(user => 
    user.organizationId === orgId && user.departmentId !== deptId
  );
  const availableCourses = courses.filter(course => 
    (course.organizationIds.includes(orgId || '') || course.organizationId === orgId) &&
    !course.departmentIds.includes(deptId || '') && 
    course.departmentId !== deptId
  );
  const completedCourses = deptCourses.filter(course => (course.progress || 0) === 100).length;
  const inProgressCourses = deptCourses.filter(course => (course.progress || 0) > 0 && (course.progress || 0) < 100).length;
  const totalProgress = deptCourses.reduce((acc, course) => acc + (course.progress || 0), 0);
  const departmentProgress = deptCourses.length > 0 ? totalProgress / deptCourses.length : 0;

  const skillsCount: Record<string, number> = {};
  deptUsers.forEach(user => {
    user.skills?.forEach(skill => {
      skillsCount[skill] = (skillsCount[skill] || 0) + 1;
    });
  });
  const skillsData = Object.entries(skillsCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
*/

const skillsCount: Record<string, number> = {};
if (Array.isArray(deptUsers)) {
  deptUsers.forEach(user => {
    if (Array.isArray(user.skills)) {
      user.skills.forEach(skill => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
      });
    }
  });
}
const skillsData = Object.entries(skillsCount)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleAddMember = () => {
    if (!selectedUserId) {
      toast.error("Please select a user to add");
      return;
    }
    toast.success("User added to department successfully");
    setIsAddMemberOpen(false);
    setSelectedUserId("");
  };

  const handleAddCourse = () => {
    if (!selectedCourseId) {
      toast.error("Please select a course to add");
      return;
    }
    toast.success("Course added to department successfully");
    setIsAddCourseOpen(false);
    setSelectedCourseId("");
  };


const handleApproveUser = async (userId: string) => {
  console.log("handleApproveUser CALLED with:", userId); 

  try {
    await approveUser(userId);

    console.log("Pending users before update:", pendingUsersList);
    console.log("Trying to remove userId:", userId);

    //updating the pending user list.
    setPendingUsersList(prev => prev.filter(user => user._id !== userId));

    //fetching updated approved user.
    fetchDeptUsers();
    toast.success("User approved successfully");
  } catch (error) {
    console.error("Error in handleApproveUser:", error);
    toast.error("Failed to approve user");
  }
};


const handleRejectUser = async () => {
  
  try {
    await rejectUser(rejectUserId);
    setPendingUsersList(prev => prev.filter(user => user._id !== rejectUserId));
    toast.success("User rejected successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to reject user");
  } finally {
    setIsRejectDialogOpen(false);
    setRejectReason("");
    setRejectUserId("");
  }
};


//function to select multi user to approve once
const toggleUserSelection = (userId:string) =>{
    setSelectedUsers((prevSelected) => 
      prevSelected.includes(userId)
      ? prevSelected.filter((id) => id !== userId)
      :[...prevSelected,userId]
    );
}; 


  const handleApproveAll = async () => {
    if (selectedUsers.length === 0) return;

    setIsLoading(true);
    try {
      await Promise.all(selectedUsers.map((userId) => handleApproveUser(userId)));
      setSelectedUsers([]); // Clear selection after approval
    } catch (error) {
      console.error("Error approving selected users:", error);
    } finally {
      setIsLoading(false);
    } 
  };



  const handleDeleteUser = async () => {
    try {
      await deleteUser(deleteUserId);
      setDeptUsers(prev => prev.filter(user => user.id !== deleteUserId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteUserId("");
    }
  };


  const handleTransferDepartment = async () => {
    if (!transferDepartmentId) {
      toast.error("Please select a department");
      return;
    }

    try {
      await transferUser(transferUserId, transferDepartmentId);
      toast.success("User transferred successfully");
      fetchDeptUsers(); // refresh
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error("Failed to transfer user");
    } finally {
      setIsTransferDialogOpen(false);
      setTransferUserId("");
      setTransferDepartmentId("");
    }
  };



  const handleRoleChange = () => {
    if (!newRole) {
      toast.error("Please select a role");
      return;
    }
    toast.success("Role updated successfully");
    setIsRoleDialogOpen(false);
    setRoleUserId("");
    setNewRole("");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Optional: show progress bar animation manually
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      const result = await bulkUploadUsers(orgId!, deptId!, file);

      clearInterval(interval);
      setUploadProgress(100);
      toast.success(`${result.length} users uploaded successfully`);
      setIsUploading(false);

      // Optionally reload user list
      //fetchDepartmentUsers();
      fetchDeptUsers();
    } catch (error) {
      setIsUploading(false);
      toast.error("Upload failed. Please check the file and try again.");
    }
  };


  const downloadTemplate = () => {
    const templateUrl = "/templates/user-upload-template.xlsx";
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'user-upload-template.xlsx';
    link.click();
  };

  const roleTooltips: Record<string, string> = {
    Admin: "Full access to all features and settings",
    Editor: "Can edit content but limited administrative access",
    Viewer: "Read-only access to view content"
  };

  return (
    <div>
      {/*
      <div className="bg-gradient-to-r from-brand-50 to-indigo-50 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                asChild
                className="h-10 w-10 rounded-full bg-white"
              >
                <Link to={`/organization/${orgId}`}>
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{department.name}</h1>
                  <Badge variant="outline" className="ml-2">
                    {organization.name}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{department.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <UpdateDepartmentDialog
                department={department}
                onUpdate={(updatedDept) => setDepartment(updatedDept)}
              />
              <div className="flex justify-end mb-4">
              
               <CreateUserDialog
                onCreate={() => fetchDeptUsers()} 
                trigger={
                  <Button className="gap-2 bg-brand-600 hover:bg-brand-700">
                    <UserPlus className="h-4 w-4" />
                    Add User
                  </Button>
                }
              />

            </div>
              

              <div className="flex justify-end mb-4">
                  <SelfRegisterDialog
                    trigger={
                      <Button className="gap-2 bg-green-600 hover:bg-green-700">
                        <UserPlus className="h-4 w-4" />
                        Register User
                      </Button>
                    }
                  />
                </div>
            </div>
          </div>
        </div>
      </div>
      */}
    <div className="bg-black/60 border-b border-white/10 backdrop-blur-lg">
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Title + Back Button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          asChild
          className="h-10 w-10 rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          <Link to={`/organization/${orgId}`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{department.name}</h1>
            <Badge variant="outline" className="text-white border-white/20 bg-white/10">
              {organization.name}
            </Badge>
          </div>
          <p className="text-sm text-white/70">{department.description}</p>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-end">
        <UpdateDepartmentDialog
          department={department}
          onUpdate={(updatedDept) => setDepartment(updatedDept)}
        />

        <CreateUserDialog
          onCreate={() => fetchDeptUsers()} 
          trigger={
            <Button className="gap-2 bg-brand-600 hover:bg-brand-700 text-white shadow-md rounded-lg">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          }
        />

        <SelfRegisterDialog
          trigger={
            <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md rounded-lg">
              <UserPlus className="h-4 w-4" />
              Register User
            </Button>
          }
        />
      </div>
    </div>
  </div>
</div>

      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/*
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
            
            <TabsTrigger value="pending" className="gap-2">
              <UserCheck className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Pending Approvals</span>
            </TabsTrigger>
            <TabsTrigger value="directory" className="gap-2">
              <Users className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">User Directory</span>
            </TabsTrigger>
            <TabsTrigger value="bulk-upload" className="gap-2">
              <Upload className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Bulk Upload</span>
            </TabsTrigger>
            

          </TabsList>
          */}
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8 gap-2 bg-white/5 text-white border border-white/10 rounded-xl p-1 backdrop-blur-lg">
            
             <TabsTrigger
                value="pending"
                className="gap-2 px-3 py-2 rounded-lg transition-colors 
                          data-[state=active]:bg-white/20 
                          data-[state=active]:text-white 
                          data-[state=inactive]:text-gray-300"
                >
                <UserCheck className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Pending Approvals</span>
              </TabsTrigger>

            

              <TabsTrigger
                value="directory"
                className="gap-2 px-3 py-2 rounded-lg transition-colors 
                          data-[state=active]:bg-white/20 
                          data-[state=active]:text-white 
                          data-[state=inactive]:text-gray-300"
                >
                <Users className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">User Directory</span>
              </TabsTrigger>
            
            
              <TabsTrigger
                value="bulk-upload"
                className="gap-2 px-3 py-2 rounded-lg transition-colors 
                          data-[state=active]:bg-white/20 
                          data-[state=active]:text-white 
                          data-[state=inactive]:text-gray-300"
                >
                <Upload className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Bulk Upload</span>
              </TabsTrigger>
          </TabsList>

          
          
{/*
    <TabsContent value="pending">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>{pendingUsersList.length} pending approvals</CardDescription>
      </div>


    {pendingUsersList.length > 0 && (
      <Button
        onClick={handleApproveAll}
        className="bg-green-600 hover:bg-green-700"
        disabled={isLoading || selectedUsers.length === 0}
      >
        {isLoading ? "Approving..." : "Approve Selected"}
      </Button>
    )}

    </CardHeader>
    <CardContent>
      {(() => { console.log("Rendering pending users:", pendingUsersList); return null })()}

      {pendingUsersList.length === 0 ? (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-muted-foreground">No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-4">

          {pendingUsersList.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 border rounded-lg border-blue-500"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="h-4 w-4"
                />
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                  onClick={() => handleApproveUser(user._id)}
                >
                  Approve
                </Button>

                
                <Dialog
                  open={isRejectDialogOpen && rejectUserId === user._id}
                  onOpenChange={(open) => {
                    setIsRejectDialogOpen(open);
                    if (!open) setRejectReason("");
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setRejectUserId(user._id)}
                    >
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject User</DialogTitle>
                      <DialogDescription>
                        Provide a reason for rejecting {user.name}'s registration.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="reject-reason">Reason</Label>
                      <Textarea
                        id="reject-reason"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter rejection reason"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsRejectDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleRejectUser}>
                        Confirm Rejection
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}

        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>
*/}
<TabsContent value="pending">
  <Card className="bg-white/5 border border-white/10 backdrop-blur-md shadow-xl rounded-2xl text-white">
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-white">Pending Approvals</CardTitle>
        <CardDescription className="text-white/70">{pendingUsersList.length} pending approvals</CardDescription>
      </div>
      {pendingUsersList.length > 0 && (
        <Button
          onClick={handleApproveAll}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={isLoading || selectedUsers.length === 0}
        >
          {isLoading ? "Approving..." : "Approve Selected"}
        </Button>
      )}
    </CardHeader>
    <CardContent>
      {pendingUsersList.length === 0 ? (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 mx-auto text-white/40 mb-4" />
          <p className="text-white/70">No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUsersList.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="h-4 w-4 text-brand-500"
                />
                <div>
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="text-sm text-white/70">{user.email}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                  onClick={() => handleApproveUser(user._id)}
                >
                  Approve
                </Button>
                <Dialog
                  open={isRejectDialogOpen && rejectUserId === user._id}
                  onOpenChange={(open) => {
                    setIsRejectDialogOpen(open);
                    if (!open) setRejectReason("");
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setRejectUserId(user._id)}
                    >
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/10 border border-white/20 backdrop-blur-md">
                    <DialogHeader>
                      <DialogTitle className="text-white">Reject User</DialogTitle>
                      <DialogDescription className="text-white/70">
                        Provide a reason for rejecting {user.name}'s registration.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="reject-reason" className="text-white">Reason</Label>
                      <Textarea
                        id="reject-reason"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter rejection reason"
                        className="bg-white/5 text-white border border-white/10"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsRejectDialogOpen(false)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleRejectUser}>
                        Confirm Rejection
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>


{/*
<TabsContent value="directory">
  <Card>
    <CardHeader>
      <CardTitle>User Directory</CardTitle>
      <CardDescription>Manage department users, transfer users, and delete records</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="grid grid-cols-6 p-4 font-medium border-b bg-gray-50">
          <div>Name</div>
          <div>Email</div>
          <div>Department</div>
          <div>Transfer</div>
          <div>Edit</div>
          <div>Delete</div>
        </div>

        {deptUsers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-muted-foreground">No users in this department</p>
          </div>
        ) : (
          deptUsers.map(user => {
            console.log("departments at render time:", departments);
            departments.forEach(d => console.log("Each dept:", d));

            const currentDept = departments?.find(d => d && d._id === user.departmentId);
            return (
              <div key={user.id} className="grid grid-cols-6 p-4 border-b last:border-0 items-center">
                <div>{user.name}</div>
                <div>{user.email}</div>
                
                <div>{user.departmentName}</div>

                
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTransferUserId(user.id);
                      setTransferCurrentDept(user.departmentName);
                      setTransferDepartmentId(""); 
                      setCurrentDeptId(user.departmentId);
                      setIsTransferDialogOpen(true);
                    }}
                  >
                    Transfer
                  </Button>
                </div>
                <div>
                  <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Dialog
                    open={isDeleteDialogOpen && deleteUserId === user.id}
                    onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open);
                      if (!open) setDeleteUserId("");
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeleteUserId(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete {user.name} permanently?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>


                  
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium">Name</label>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Enter user name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            placeholder="Enter user email"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateUserDetails}>Update</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                </div>
              </div>
            );
          })
        )}
      </div>
    </CardContent>
  </Card>

  
  <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Transfer User to Another Department</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      
      <div>
        <label className="block mb-1 text-sm font-medium">Current Department</label>
        <Input value={transferCurrentDept} disabled />
      </div>

      
      <div>
        <label className="block mb-1 text-sm font-medium">Transfer To</label>
        <Select
          value={transferDepartmentId}
          onValueChange={setTransferDepartmentId}
          disabled={departments.filter(d => d._id !== currentDeptId).length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select new department" />
          </SelectTrigger>
          <SelectContent>
            {departments
              .filter(dept => dept._id !== currentDeptId) //  exclude current department
              .map(dept => (
                <SelectItem key={dept._id} value={dept._id}>
                  {dept.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

      
        {departments.filter(dept => dept._id !== currentDeptId).length === 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            No other departments available for transfer.
          </p>
        )}
      </div>
    </div>


    <DialogFooter>
      <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
        Cancel
      </Button>
      <Button
        onClick={handleTransferDepartment}
        disabled={!transferDepartmentId}
      >
        Confirm Transfer
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

</TabsContent>
*/}

<TabsContent value="directory">
  <Card className="bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-md">
    <CardHeader>
      <CardTitle className="text-white">User Directory</CardTitle>
      <CardDescription className="text-white/80">
        Manage department users, transfer users, and delete records
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-6 p-4 font-semibold border-b border-white/10 bg-white/10 text-white">
          <div>Name</div>
          <div>Email</div>
          <div>Department</div>
          <div>Transfer</div>
          <div>Edit</div>
          <div>Delete</div>
        </div>

        {deptUsers.length === 0 ? (
          <div className="p-8 text-center text-white/70">
            <Users className="h-12 w-12 mx-auto text-white/30 mb-4" />
            <p>No users in this department</p>
          </div>
        ) : (
          deptUsers.map(user => {
            const currentDept = departments?.find(d => d && d._id === user.departmentId);

            return (
              <div
                key={user.id}
                className="grid grid-cols-6 p-4 border-b border-white/10 items-center text-white bg-white/5 hover:bg-white/10 transition"
              >
                <div>{user.name}</div>
                <div>{user.email}</div>
                <div>{user.departmentName}</div>

                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    /*className="text-white border-white/20 hover:bg-white/10"*/
                    className="bg-white/10 text-white border border-white/20 hover:bg-white/20"

                    onClick={() => {
                      setTransferUserId(user.id);
                      setTransferCurrentDept(user.departmentName);
                      setTransferDepartmentId("");
                      setCurrentDeptId(user.departmentId);
                      setIsTransferDialogOpen(true);
                    }}
                  >
                    Transfer
                  </Button>
                </div>

                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    /*className="text-white border-white/20 hover:bg-white/10"*/
                      className="bg-white/10 text-white border border-white/20 hover:bg-white/20"

                    onClick={() => handleEditUser(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Dialog
                    open={isDeleteDialogOpen && deleteUserId === user.id}
                    onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open);
                      if (!open) setDeleteUserId("");
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeleteUserId(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white/5 text-white border border-white/10">
                      <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription className="text-white/80">
                          Are you sure you want to delete {user.name} permanently?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDeleteDialogOpen(false)}
                          className="text-white border-white/20 hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteUser}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })
        )}
      </div>
    </CardContent>
  </Card>

  {/* Transfer Dialog */}
  <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
    <DialogContent 
      /*className="bg-white/5 text-white border border-white/10"*/
      /*className="bg-white/20 backdrop-blur-lg text-white border border-white/10"*/
      className="bg-black/80 backdrop-blur-md text-white border border-white/10">
      <DialogHeader>
        <DialogTitle>Transfer User to Another Department</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Current Department</label>
          <Input value={transferCurrentDept} disabled className="bg-white/10 text-white border-white/20" />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Transfer To</label>
          <Select
            value={transferDepartmentId}
            onValueChange={setTransferDepartmentId}
            disabled={departments.filter(d => d._id !== currentDeptId).length === 0}
          >
            <SelectTrigger className="bg-white/10 text-white border-white/20">
              <SelectValue placeholder="Select new department" />
            </SelectTrigger>
            <SelectContent className="bg-white/10 text-white border-white/10">
              {departments
                .filter(dept => dept._id !== currentDeptId)
                .map(dept => (
                  <SelectItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {departments.filter(dept => dept._id !== currentDeptId).length === 0 && (
            <p className="text-sm text-white/60 mt-2">
              No other departments available for transfer.
            </p>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setIsTransferDialogOpen(false)}
          /*className="text-white border-white/20 hover:bg-white/20"*/
          className="bg-black text-white border border-white/20 hover:bg-neutral-900"
        >
          Cancel
        </Button>
        <Button
          onClick={handleTransferDepartment}
          disabled={!transferDepartmentId}
        >
          Confirm Transfer
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  {/*  Edit User Dialog */}
  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
    <DialogContent className="bg-white/10 backdrop-blur border border-white/20">
      <DialogHeader>
        <DialogTitle className="text-white">Edit User</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white">Name</label>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Enter user name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Email</label>
          <Input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="Enter user email"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleUpdateUserDetails}>
          Update
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>


</TabsContent>


{/*
          <TabsContent value="bulk-upload">
            <Card>
              <CardHeader>
                <CardTitle>Bulk User Upload</CardTitle>
                <CardDescription>Upload an Excel file to add multiple users at once</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop an Excel file here or click to upload
                  </p>
                  <Input 
                    type="file" 
                    accept=".xlsx,.xls" 
                    onChange={handleFileUpload} 
                    className="max-w-xs mx-auto"
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="mt-4">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-sm text-gray-500 mt-2">Uploading... {uploadProgress}%</p>
                    </div>
                  )}
                  <Button 
                    variant="link" 
                    className="mt-4" 
                    onClick={downloadTemplate}
                  >
                    Download Excel Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
*/}
  <TabsContent value="bulk-upload">
  <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-md rounded-2xl text-white">
    <CardHeader>
      <CardTitle className="text-white">Bulk User Upload</CardTitle>
      <CardDescription className="text-white/70">
        Upload an Excel file to add multiple users at once
      </CardDescription>
    </CardHeader>
    
    <CardContent>
      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center bg-white/5">
        <Upload className="h-12 w-12 mx-auto text-white/40 mb-4" />
        
        <p className="text-sm text-white/60 mb-4">
          Drag and drop an Excel file here or click to upload
        </p>
        
        {/*
        <Input 
          type="file" 
          accept=".xlsx,.xls" 
          onChange={handleFileUpload} 
          className="max-w-xs mx-auto text-white file:text-white file:bg-white/10 file:border-white/10 file:rounded-md file:px-4 file:py-1"
          disabled={isUploading}
        />
        */}
        <label className="inline-flex items-center justify-center px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition">
          Upload Excel File
          <input 
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>


        {isUploading && (
          <div className="mt-4">
            <Progress 
              value={uploadProgress} 
              className="h-2 bg-white/10 [&>div]:bg-green-500"
            />
            <p className="text-sm text-white/70 mt-2">Uploading... {uploadProgress}%</p>
          </div>
        )}
  {/*
        <Button 
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white transition"
          onClick={downloadTemplate}
        >
          Download Excel Template
        </Button>
    */}
      </div>
    </CardContent>
  </Card>
</TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning: "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export default DepartmentDashboard;