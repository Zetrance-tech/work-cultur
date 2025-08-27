
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Building2, ChevronLeft, PlusCircle, BarChart3, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { organizations, departments, users, courses } from "@/data/mockData";
import { Department, User, Course } from "@/types";

import DepartmentCard from "@/components/Departments/DepartmentCard";
import CreateDepartmentDialog from "@/components/Departments/CreateDepartmentDialog";
import UpdateOrganizationDialog from "@/components/Organizations/UpdateOrganizationDialog";

import {useToast} from "@/components/ui/use-toast";
//import { toast } from "react-hot-toast";
import { getOrganizationById,updateOrganization } from "@/api/organizationAPI"; 
import { createDepartment, getDepartmentsByOrganizationId ,deleteDepartmentById} from "@/api/departmentAPI"; 
import { getAdminId } from "@/lib/authUtil";

const OrganizationDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState(organizations.find(org => org._id === id));
  const [orgDepartments, setOrgDepartments] = useState<Department[]>([]);
  const [orgUsers, setOrgUsers] = useState<User[]>([]);
  const [orgCourses, setOrgCourses] = useState<Course[]>([]);

  const { toast } = useToast();

/*
  useEffect(() => {
    const fetchOrganization = async () => {
      if (!id) return;

      console.log("OrganizationId i.e is sent to backend:", id); // <-- This logs the ID

      

      try {
        const organizationData = await getOrganizationById(id); // API call
        
        if (!organizationData  || Object.keys(organizationData).length === 0) {
          toast({
            variant: "destructive",
            title: "Not Found",
            description: "No organization details found",
          });
          return;
        }
        setOrganization(organizationData);


      // Fix: Extract departments from the correct path
        const departmentResponse = await getDepartmentsByOrganizationId(id);
        console.log("Department Response:", departmentResponse); // Debug log
        
        // Use the departments directly from the response
        const departments = departmentResponse?.departments ?? [];
        console.log("Extracted departments:", departments); // Add this debug log
        setOrgDepartments(departments);

        const filteredUsers = users.filter(user => user.organizationId === id);
        setOrgUsers(filteredUsers);

        const filteredCourses = courses.filter(course =>
          course.organizationIds.includes(id) || course.organizationId === id
        );
        setOrgCourses(filteredCourses);

        toast({
          title: "Organization loaded",
          description: `Organization ${organizationData.name} & departments fetched successfully!`,
        });
      } catch (error) {
        console.error("Error fetching organization:", error);
        toast({
          variant: "destructive",
          title: "Fetch failed",
          description: "Failed to fetch organization details",
        });
      }
    };

    fetchOrganization();
  }, [id]);
*/


useEffect(() => {
  const fetchOrganization = async () => {
    if (!id) return;

    let organizationData = null;

    try {
      organizationData = await getOrganizationById(id);
    } catch (err) {
      console.error("API call to get organization failed:", err);
      toast({
        variant: "destructive",
        title: "Fetch failed",
        description: "Could not fetch organization details. Please try again.",
      });
      return;
    }

    // If API call succeeded
    if (!organizationData || Object.keys(organizationData).length === 0) {
      toast({
        variant: "destructive",
        title: "Not Found",
        description: "No organization details found",
      });
      return;
    }

    // Success path
    setOrganization(organizationData);

    // Fetch departments
    try {
      const departmentResponse = await getDepartmentsByOrganizationId(id);
      const departments = departmentResponse?.departments ?? [];
      setOrgDepartments(departments);
    } catch (deptErr) {
      console.warn("Departments fetch failed or returned empty", deptErr);
      setOrgDepartments([]); // safe fallback
    }

    // Set mock users/courses
    const filteredUsers = users.filter(user => user.organizationId === id);
    setOrgUsers(filteredUsers);

    const filteredCourses = courses.filter(course =>
      course.organizationIds.includes(id) || course.organizationId === id
    );
    setOrgCourses(filteredCourses);

    // Final success toast
    toast({
      title: "Organization Loaded",
      description: "Organization fetched successfully.",
    });
  };

  fetchOrganization();
}, [id]);

/*
  const handleCreateDepartment = (department: { name: string; description: string; organizationId: string }) => {
    const newDepartment: Department = {
      id: (orgDepartments.length + 1).toString(),
      ...department,
      userCount: 0,
      courseCount: 0,
      createdAt: new Date().toISOString(),
    };
    setOrgDepartments([...orgDepartments, newDepartment]);
  };
*/

const handleCreateDepartment = async (department: {
  name: string;
  description: string;
  organizationId: string;
}) => {
  try {
    const payload = {
      ...department,
        //adminId:"684e6406194b190a99d861e1",   //created using script
        adminId:getAdminId(),
    };

    console.log("Data sent to create department:", payload);
/*
    const createdDept = await createDepartment(payload);
    console.log("Received response from backend:", createdDept);

    const newDepartment: Department = {
      ...createdDept,
      createdAt: new Date().toISOString(),
      userCount: 0,
      courseCount: 0,
    };
*/

    const response = await createDepartment(payload);
    console.log("Received response from backend:", response);

    const created = response.department;

    const newDepartment: Department = {
      id: created._id, //  fix here
      _id: created._id,
      name: created.name,
      description: created.description,
      organizationId: created.organization,
      createdAt: new Date().toISOString(),
      userCount: 0,
      courseCount: 0,
    };


    setOrgDepartments((prev) => [...prev, newDepartment]);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to create department:", error);
    toast({
      variant: "destructive",
      title: "Creation Failed",
      description:
        error?.response?.data?.message || "Something went wrong while creating the department.",
    });
    return { success: false };
  }
};


const handleDeleteDepartment = async (departmentId: string) => {
  try {
    await deleteDepartmentById(departmentId);

    //toast.success("Department deleted successfully");
    toast({
      title: "Department deleted successfully",
    });

    // Remove department from local state
    setOrgDepartments((prev) =>
      prev.filter((dept) => dept._id !== departmentId)
    );

  } catch (err) {
    console.error("Delete failed", err);
  }
};


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
              className="rounded-full"
            >
              <Link to="/organizationlist">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8 hidden sm:inline" />
              {organization?.name || 'Organization'}
            </h1>
           
          </div>
          <p className="text-muted-foreground">
            Manage departments, courses, and users
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CreateDepartmentDialog organizationId={id || ''} onCreateDepartment={handleCreateDepartment} />
          {organization && (
            <UpdateOrganizationDialog organization={organization} onUpdate={setOrganization} />
          )}
          
          
          {/*
          <Button asChild variant="default">
            <Link to={`/organization/${id}/create-course`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link to={`/organization/${id}/analytics-dashboard`}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics Dashboard
            </Link>
          </Button>
          */}
          
        </div>
      </div>
{/*
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orgDepartments.map((department) => (
          <DepartmentCard key={department.id} department={department} organizationId={id} />
        ))}
      </div>
*/}
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {orgDepartments.map((department) => (
    <DepartmentCard
      key={department._id}
      department={department}
      organizationId={organization?._id}
      onDelete={handleDeleteDepartment}
    />
  ))}
</div>

    {/*
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orgCourses.map(course => (
                <div key={course.id} className="flex items-center justify-between">
                  <Link to={`/organization/${id}/course/${course.id}`} className="hover:underline">
                    {course.title}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{course.enrollmentCount} Enrolled</span>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/organization/${id}/course/${course.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              {orgCourses.length === 0 && (
                <div className="text-center text-muted-foreground">No courses found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Users</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to={`/organization/${id}/users`}>
                <UserPlus className="mr-2 h-4 w-4" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orgUsers.slice(0, 5).map(user => (
                <div key={user.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              ))}
              {orgUsers.length === 0 && (
                <div className="text-center text-muted-foreground">No users found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      */}
    </div>
  );
};

export default OrganizationDashboard;
