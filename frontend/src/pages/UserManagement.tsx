
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, PlusCircle, Users, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { organizations, departments, users } from "@/data/mockData";
import { User } from "@/types";

const UserManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState(organizations.find(org => org.id === id));
  const [orgUsers, setOrgUsers] = useState<User[]>([]);
  const [orgDepartments, setOrgDepartments] = useState(departments.filter(dept => dept.organizationId === id));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("employee");
  const [newUserDepartment, setNewUserDepartment] = useState("");

  const [isEditDeptOpen, setIsEditDeptOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedDeptForUser, setSelectedDeptForUser] = useState("");

  useEffect(() => {
    if (id) {
      const foundOrganization = organizations.find(org => org.id === id);
      setOrganization(foundOrganization);
      const filteredUsers = users.filter(user => user.organizationId === id);
      setOrgUsers(filteredUsers);
      const filteredDepartments = departments.filter(dept => dept.organizationId === id);
      setOrgDepartments(filteredDepartments);
    }
  }, [id]);

  const filteredUsers = orgUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment ? user.departmentId === selectedDepartment : true;
    return matchesSearch && matchesDepartment;
  });

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) {
      toast.error("Name and email are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole as 'admin' | 'manager' | 'employee',
      organizationId: id || '',
      departmentId: newUserDepartment || undefined,
      createdAt: new Date().toISOString(),
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      skills: [],
      enrolledCourses: 0,
      completedCourses: [],
      inProgressCourses: []
    };

    setOrgUsers([...orgUsers, newUser]);
    toast.success("User added successfully");
    
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("employee");
    setNewUserDepartment("");
    setIsAddUserOpen(false);
  };

  const handleUpdateUserDepartment = () => {
    if (!editingUser) return;

    const updatedUsers = orgUsers.map(user => {
      if (user.id === editingUser.id) {
        return {
          ...user,
          departmentId: selectedDeptForUser || undefined
        };
      }
      return user;
    });

    setOrgUsers(updatedUsers);
    setIsEditDeptOpen(false);
    setEditingUser(null);
    
    const deptName = selectedDeptForUser 
      ? orgDepartments.find(d => d.id === selectedDeptForUser)?.name 
      : "no department";
    
    toast.success(`User ${editingUser.name} has been assigned to ${deptName}`);
  };

  const handleRemoveUser = (userId: string) => {
    const updatedUsers = orgUsers.filter(user => user.id !== userId);
    setOrgUsers(updatedUsers);
    toast.success("User removed successfully");
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
              <Link to={`/organization/${id}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage users and department assignments for {organization?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Add a new user to {organization?.name} and assign them to a department.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={newUserName} 
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter user name" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newUserEmail} 
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Enter user email" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Select value={newUserDepartment} onValueChange={setNewUserDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Department</SelectItem>
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
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select 
          value={selectedDepartment || "all"} 
          onValueChange={(value) => setSelectedDepartment(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {orgDepartments.map(dept => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog open={isEditDeptOpen} onOpenChange={setIsEditDeptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Department</DialogTitle>
            <DialogDescription>
              Change the department for {editingUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-2">
              <Label htmlFor="dept-select">Department</Label>
              <Select value={selectedDeptForUser} onValueChange={setSelectedDeptForUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Department</SelectItem>
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
            <Button variant="outline" onClick={() => setIsEditDeptOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUserDepartment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  <Users className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-muted-foreground">No users found</p>
                  {searchTerm && (
                    <Button 
                      variant="link" 
                      onClick={() => setSearchTerm("")}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        user.role === 'admin' 
                          ? 'default' 
                          : user.role === 'manager' 
                            ? 'secondary' 
                            : 'outline'
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.departmentId ? (
                      <span>
                        {orgDepartments.find(dept => dept.id === user.departmentId)?.name || 'Unknown'}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.completedCourses?.length ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                          {user.completedCourses.length} completed
                        </Badge>
                      ) : null}
                      {user.inProgressCourses?.length ? (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                          {user.inProgressCourses.length} in progress
                        </Badge>
                      ) : null}
                      {(!user.completedCourses?.length && !user.inProgressCourses?.length) && (
                        <span className="text-muted-foreground">No courses</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.skills?.slice(0, 2).map((skill, i) => (
                        <Badge key={i} variant="outline" className="bg-gray-100">
                          {skill}
                        </Badge>
                      ))}
                      {(user.skills?.length || 0) > 2 && (
                        <Badge variant="outline" className="bg-gray-100">
                          +{(user.skills?.length || 0) - 2}
                        </Badge>
                      )}
                      {(!user.skills?.length) && (
                        <span className="text-muted-foreground">No skills</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => {
                            setEditingUser(user);
                            setSelectedDeptForUser(user.departmentId || "none");
                            setIsEditDeptOpen(true);
                          }}
                        >
                          Change Department
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
