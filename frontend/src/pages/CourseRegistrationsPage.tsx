
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Filter,
  Search,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { users, departments, courses } from "@/data/mockData";

const mockRegistrations = [
  { id: "1", userId: "1", courseId: "1", status: "pending", registeredAt: "2023-04-15" },
  { id: "2", userId: "2", courseId: "1", status: "approved", registeredAt: "2023-04-14" },
  { id: "3", userId: "3", courseId: "1", status: "rejected", registeredAt: "2023-04-13" },
  { id: "4", userId: "4", courseId: "1", status: "approved", registeredAt: "2023-04-12" },
  { id: "5", userId: "5", courseId: "1", status: "pending", registeredAt: "2023-04-11" },
];

const CourseRegistrationsPage: React.FC = () => {
  const { id, courseId } = useParams<{ id: string; courseId: string }>();
  const [registrations, setRegistrations] = useState(mockRegistrations);
  const [filteredRegistrations, setFilteredRegistrations] = useState(mockRegistrations);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const course = courses.find(c => c.id === courseId);
  const orgDepartments = departments.filter(dept => dept.organizationId === id);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterRegistrations(term, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterRegistrations(searchTerm, status);
  };

  const filterRegistrations = (term: string, status: string) => {
    let filtered = registrations;
    
    if (term) {
      filtered = filtered.filter(reg => {
        const user = users.find(u => u.id === reg.userId);
        return user?.name.toLowerCase().includes(term) || 
               user?.email.toLowerCase().includes(term);
      });
    }
    
    if (status !== "all") {
      filtered = filtered.filter(reg => reg.status === status);
    }
    
    setFilteredRegistrations(filtered);
  };

  const handleStatusChange = (registrationId: string, newStatus: "approved" | "rejected" | "pending") => {
    const updated = registrations.map(reg => 
      reg.id === registrationId ? { ...reg, status: newStatus } : reg
    );
    setRegistrations(updated);
    setFilteredRegistrations(
      filteredRegistrations.map(reg => 
        reg.id === registrationId ? { ...reg, status: newStatus } : reg
      )
    );
    
    toast.success(`Registration ${newStatus} successfully`);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link to={`/organization/${id}/course/${courseId}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {course?.title || "Course"} Registrations
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage course registrations and enrollments
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add User to Course</DialogTitle>
                <DialogDescription>
                  Select a user to add to this course.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select User</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.filter(u => u.organizationId === id).map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Department</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {orgDepartments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => toast.success("User added to course successfully")}>
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Registrations</CardTitle>
          <CardDescription>
            View and manage all user registrations for this course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter by Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map(registration => {
                const user = users.find(u => u.id === registration.userId);
                return (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user?.name}</div>
                          <div className="text-sm text-muted-foreground">{user?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{registration.registeredAt}</TableCell>
                    <TableCell>{getStatusBadge(registration.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {registration.status !== "approved" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-1 text-green-600"
                            onClick={() => handleStatusChange(registration.id, "approved")}
                          >
                            <UserCheck className="h-4 w-4" />
                            Approve
                          </Button>
                        )}
                        {registration.status !== "rejected" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-1 text-red-600"
                            onClick={() => handleStatusChange(registration.id, "rejected")}
                          >
                            <UserX className="h-4 w-4" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredRegistrations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No registrations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Enrollments</CardTitle>
          <CardDescription>
            Manage department-wide enrollments for this course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgDepartments.map(department => (
                <TableRow key={department.id}>
                  <TableCell>
                    <div className="font-medium">{department.name}</div>
                  </TableCell>
                  <TableCell>{department.userCount}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{Math.floor(Math.random() * department.userCount)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.success(`Opened department enrollment management`)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Manage Users
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseRegistrationsPage;
