import React, { useEffect,useState } from "react";
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
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { getDepartmentById,updateDepartmentById} from "@/api/departmentAPI"; // adjust the path
import UpdateDepartmentDialog from "@/components/Departments/UpdateDepartmentDialog";




const DepartmentDashboard: React.FC = () => {
  const { orgId, deptId } = useParams<{ orgId: string; deptId: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [department, setDepartment] = useState<any>(null);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  
  //const organization = organizations.find(org => org._id === orgId);
  const organization = department?.organization;

  /*
  const department = departments.find(dept => dept.id === deptId && dept.organizationId === orgId);
 */

  //now fetching department details from backend
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await getDepartmentById(deptId);
        console.log("Fetched department:", response); 

        const actualDept = response.department;

        setDepartment(actualDept);
      } catch (error) {
        console.error("Failed to fetch department:", error);
      }
    };

    if (deptId) fetchDepartment();
  }, [deptId]);



  if (!organization || !department) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Building2 className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Department Not Found</h2>
        <p className="text-gray-500 mb-6">The department you're looking for doesn't exist or has been removed.</p>
        <Button asChild variant="outline">
          <Link to={`/organization/${orgId}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Organization
          </Link>
        </Button>
      </div>
    );
  }
  

  // Get department-specific data
  const deptCourses = courses.filter(course => 
    (course.departmentIds.includes(deptId || '') || course.departmentId === deptId)
  );
  const deptUsers = users.filter(user => user.departmentId === deptId);
  
  // Find available users (organization users not in this department)
  const availableUsers = users.filter(user => 
    user.organizationId === orgId && user.departmentId !== deptId
  );
  
  // Find available courses (organization courses not in this department)
  const availableCourses = courses.filter(course => 
    (course.organizationIds.includes(orgId || '') || course.organizationId === orgId) &&
    !course.departmentIds.includes(deptId || '') && 
    course.departmentId !== deptId
  );
  
  // Calculate course completion rates
  const completedCourses = deptCourses.filter(course => (course.progress || 0) === 100).length;
  const inProgressCourses = deptCourses.filter(course => (course.progress || 0) > 0 && (course.progress || 0) < 100).length;
  const notStartedCourses = deptCourses.filter(course => (course.progress || 0) === 0).length;
  
  // Calculate overall department progress
  const totalProgress = deptCourses.reduce((acc, course) => acc + (course.progress || 0), 0);
  const departmentProgress = deptCourses.length > 0 ? totalProgress / deptCourses.length : 0;
  
  // Prepare data for skills chart
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
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
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
    
    // In a real app, this would be an API call
    toast.success("User added to department successfully");
    setIsAddMemberOpen(false);
    setSelectedUserId("");
  };
  
  const handleAddCourse = () => {
    if (!selectedCourseId) {
      toast.error("Please select a course to add");
      return;
    }
    
    // In a real app, this would be an API call
    toast.success("Course added to department successfully");
    setIsAddCourseOpen(false);
    setSelectedCourseId("");
  };

  return (
    <div>
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
              {/*              <Button variant="outline" className="gap-2">
                <ListFilter className="h-4 w-4" />
                Manage
              </Button>
              */}


              {/*Update department dialog button*/}
              <UpdateDepartmentDialog
                department={department}
                onUpdate={(updatedDept) => setDepartment(updatedDept)}
              />

              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-brand-600 hover:bg-brand-700">
                    <UserPlus className="h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  
                  <DialogHeader>
                    <DialogTitle>Add Member to Department</DialogTitle>
                    <DialogDescription>
                      Select a user to add to the {department.name} department.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="user-select">Select User</Label>
                      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {/*                          
                          {availableUsers.length === 0 ? (
                            <SelectItem value="" disabled>No available users</SelectItem>
                          ) : (
                            availableUsers.map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} - {user.email}
                              </SelectItem>
                            ))
                          )}
                        */}
                        {availableUsers.length === 0 ? (
                          <p className="text-sm text-gray-500 px-2">No available users</p>
                        ) : (
                          availableUsers.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} - {user.email}
                            </SelectItem>
                          ))
                        )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddMember}
                      disabled={!selectedUserId || availableUsers.length === 0}
                    >
                      Add to Department
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <Layers className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Courses</span>
            </TabsTrigger>

              

          </TabsList>
          
          <TabsContent value="overview">
            <motion.div 
              variants={containerAnimation}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <motion.div variants={itemAnimation}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Members
                    </CardTitle>
                    <CardDescription>
                      Total employees in department
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-3xl font-bold">{deptUsers.length}</div>
                      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <UserPlus className="h-3.5 w-3.5" />
                            Add
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemAnimation}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Courses
                    </CardTitle>
                    <CardDescription>
                      Course completion progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-3xl font-bold">{deptCourses.length}</div>
                      <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="h-3.5 w-3.5" />
                            Add
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Course to Department</DialogTitle>
                            <DialogDescription>
                              Select a course to add to the {department.name} department.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="course-select">Select Course</Label>
                              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableCourses.length === 0 ? (
                                    <SelectItem value="" disabled>No available courses</SelectItem>
                                  ) : (
                                    availableCourses.map(course => (
                                      <SelectItem key={course.id} value={course.id}>
                                        {course.title}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddCourseOpen(false)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleAddCourse}
                              disabled={!selectedCourseId || availableCourses.length === 0}
                            >
                              Add Course
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Overall Progress</span>
                        <span>{departmentProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={departmentProgress} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span className="text-green-600">{completedCourses} Completed</span>
                        <span className="text-amber-600">{inProgressCourses} In Progress</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemAnimation}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Skills
                    </CardTitle>
                    <CardDescription>
                      Top skills in department
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-3xl font-bold">
                        {Object.keys(skillsCount).length}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="gap-1"
                      >
                        <Link to={`/organization/${orgId}/skills`}>
                          <Award className="h-3.5 w-3.5" />
                          View All
                        </Link>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {skillsData.map(skill => (
                        <div key={skill.name} className="flex justify-between items-center">
                          <span className="text-sm">{skill.name}</span>
                          <Badge variant="secondary">
                            {skill.count} {skill.count === 1 ? 'member' : 'members'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemAnimation} className="md:col-span-2 lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Distribution</CardTitle>
                    <CardDescription>Most common skills among department members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={skillsData} 
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip />
                          <Bar 
                            dataKey="count" 
                            name="Members" 
                            fill="#8884d8" 
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          
         
          <TabsContent value="members">
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <div className="font-medium">Department Members</div>
                <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <UserPlus className="h-3.5 w-3.5" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
              <div className="grid grid-cols-4 p-4 font-medium border-b bg-gray-50">
                <div>Employee</div>
                <div>Role</div>
                <div>Courses</div>
                <div>Skills</div>
              </div>
              {deptUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No members yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add members to this department to see them here
                  </p>
                  <Button className="gap-2" onClick={() => setIsAddMemberOpen(true)}>
                    <UserPlus className="h-4 w-4" />
                    Add Member
                  </Button>
                </div>
              ) : (
                deptUsers.map(user => (
                  <div key={user.id} className="grid grid-cols-4 p-4 border-b last:border-0 items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div>
                      <Badge variant={user.role === 'admin' ? 'default' : user.role === 'manager' ? 'secondary' : 'outline'}>
                        {user.role}
                      </Badge>
                    </div>
                    <div>
                      <div className="flex gap-1">
                        {user.completedCourses?.length ? (
                          <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                            {user.completedCourses.length} completed
                          </Badge>
                        ) : null}
                        {user.inProgressCourses?.length ? (
                          <Badge variant="warning" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                            {user.inProgressCourses.length} in progress
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {user.skills?.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="outline" className="bg-gray-100">
                          {skill}
                        </Badge>
                      ))}
                      {(user.skills?.length || 0) > 3 && (
                        <Badge variant="outline" className="bg-gray-100">
                          +{(user.skills?.length || 0) - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          

        

          <TabsContent value="courses">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Department Courses</h2>
              <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Add Course
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {deptCourses.length === 0 ? (
                <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-gray-50 rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No courses yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add courses to this department to see them here
                  </p>
                  <Button className="gap-2" onClick={() => setIsAddCourseOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add Course
                  </Button>
                </div>
              ) : (
                deptCourses.map(course => (
                  <Link 
                    key={course.id} 
                    to={`/organization/${orgId}/course/${course.id}`}
                    className="block"
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer h-full">
                      <div className="h-36 bg-gray-100 relative">
                        {course.image ? (
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gradient-to-r from-gray-200 to-gray-300">
                            <BookOpen className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-white rounded-full px-2 py-1 text-xs font-medium">
                          {course.duration || 'N/A'}
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Enrollment</span>
                            <span className="font-medium">{course.enrollmentCount} users</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium">{course.progress || 0}%</span>
                          </div>
                          <Progress value={course.progress || 0} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Add this Badge component to handle the different badge variants
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { constants } from "node:buffer";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
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


export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export default DepartmentDashboard;
