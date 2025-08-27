import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  ChevronLeft, 
  PieChart, 
  Download, 
  Calendar, 
  Filter, 
  ChevronDown,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle2,
  ClipboardList,
  BadgeCheck,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

import { organizations, courses, departments, users, enrollments, assessmentResults, analytics } from "@/data/mockData";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const ReportsPage: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month");
  const [activeTab, setActiveTab] = useState("overview");
  
  const organization = organizations.find(org => org.id === orgId);
  const orgDepartments = departments.filter(dept => dept.organizationId === orgId);
  const orgCourses = courses.filter(course => 
    course.organizationIds.includes(orgId || '') || course.organizationId === orgId
  );
  const orgUsers = users.filter(user => user.organizationId === orgId);
  const orgEnrollments = enrollments.filter(enrollment => 
    orgCourses.some(course => course.id === enrollment.courseId)
  );
  
  const analyticsData = analytics.find(a => a.organizationId === orgId);
  
  if (!organization || !analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Analytics Not Found</h2>
        <p className="text-gray-500 mb-6">The analytics data for this organization could not be found.</p>
        <Button asChild variant="outline">
          <Link to={`/organization/${orgId}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Organization
          </Link>
        </Button>
      </div>
    );
  }
  
  // Calculate training progress metrics
  const totalEnrollments = orgEnrollments.length;
  const completedEnrollments = orgEnrollments.filter(e => e.status === 'completed').length;
  const inProgressEnrollments = orgEnrollments.filter(e => e.status === 'approved' && e.progress > 0 && e.progress < 100).length;
  const pendingEnrollments = orgEnrollments.filter(e => e.status === 'pending').length;
  
  const completionRate = totalEnrollments > 0 
    ? Math.round((completedEnrollments / totalEnrollments) * 100) 
    : 0;
  
  // Format department data for charts
  const departmentData = orgDepartments.map(dept => ({
    name: dept.name,
    users: dept.userCount,
    courses: dept.courseCount,
    completionRate: analyticsData.departmentPerformance.find(d => d.department === dept.name)?.completionRate || 0
  }));
  
  // Format skill gap data for charts
  const skillGapData = analyticsData.skillGapAreas.map(skill => ({
    name: skill.skill,
    value: skill.gapPercentage
  }));

  // Format monthly completion data (mock data for demonstration)
  const monthlyCompletionData = [
    { name: 'Jan', completions: 5 },
    { name: 'Feb', completions: 8 },
    { name: 'Mar', completions: 12 },
    { name: 'Apr', completions: 10 },
    { name: 'May', completions: 15 },
    { name: 'Jun', completions: 18 },
    { name: 'Jul', completions: 20 },
    { name: 'Aug', completions: 22 },
    { name: 'Sep', completions: 18 },
    { name: 'Oct', completions: 25 },
    { name: 'Nov', completions: 28 },
    { name: 'Dec', completions: 30 },
  ];
  
  // Format user engagement data (mock data)
  const userEngagementData = [
    { name: 'Active Users', value: 65 },
    { name: 'Occasional Users', value: 25 },
    { name: 'Inactive Users', value: 10 },
  ];
  
  // Format course popularity data
  const coursePopularityData = orgCourses.slice(0, 5).map(course => ({
    name: course.title.length > 20 ? course.title.substring(0, 20) + '...' : course.title,
    enrollments: course.enrollmentCount
  }));
  
  // Format skill acquisition data for radar chart
  const skillAcquisitionData = [
    { subject: 'JavaScript', A: 85, fullMark: 100 },
    { subject: 'React', A: 75, fullMark: 100 },
    { subject: 'Node.js', A: 60, fullMark: 100 },
    { subject: 'CSS', A: 80, fullMark: 100 },
    { subject: 'UX Design', A: 55, fullMark: 100 },
    { subject: 'Agile', A: 70, fullMark: 100 },
  ];
  
  // Format top performing users
  const topPerformingUsers = orgUsers
    .filter(user => user.completedCourses && user.completedCourses.length > 0)
    .sort((a, b) => {
      const aCompleted = a.completedCourses?.length || 0;
      const bCompleted = b.completedCourses?.length || 0;
      return bCompleted - aCompleted;
    })
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

  return (
    <div className="pb-12">
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
                <h1 className="text-2xl font-bold">Analytics & Reports</h1>
                <p className="text-sm text-gray-500">Performance metrics and insights for {organization.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-2">
              <Users className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Departments</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2">
              <Award className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Skills Analysis</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <motion.div 
              variants={containerAnimation}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              <motion.div variants={itemAnimation} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Enrollments
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalEnrollments}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Across {orgCourses.length} courses
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completion Rate
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{completionRate}%</div>
                    <div className="flex items-center text-xs mt-1 space-x-2">
                      <Progress value={completionRate} className="h-2 flex-1" />
                      <span className="text-green-600">{completedEnrollments} completed</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Learners
                    </CardTitle>
                    <Users className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{orgUsers.length}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      {inProgressEnrollments} currently in training
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Learning Time
                    </CardTitle>
                    <Clock className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">42h</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Per course completion
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemAnimation} className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Course Completion Trend</CardTitle>
                    <CardDescription>Monthly course completions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyCompletionData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="completions" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Course Popularity</CardTitle>
                    <CardDescription>Most enrolled courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={coursePopularityData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={150} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="enrollments" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemAnimation} className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>User Engagement</CardTitle>
                    <CardDescription>Distribution of user activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={userEngagementData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {userEngagementData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Top Performing Learners</CardTitle>
                    <CardDescription>Users with highest course completion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topPerformingUsers.map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                                {index + 1}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium">{user.name}</h4>
                              <p className="text-xs text-gray-500">{user.department}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-medium">{user.completedCourses?.length} courses</div>
                              <div className="text-xs text-gray-500">{user.skills?.length} skills</div>
                            </div>
                            <BadgeCheck className="h-5 w-5 text-green-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="departments">
            <div className="grid gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>Comparison of completion rates across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={departmentData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="users" name="Users" fill="#8884d8" />
                        <Bar yAxisId="left" dataKey="courses" name="Courses" fill="#82ca9d" />
                        <Bar yAxisId="right" dataKey="completionRate" name="Completion Rate (%)" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {departmentData.map((dept, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle>{dept.name}</CardTitle>
                      <CardDescription>Department performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Completion Rate</span>
                            <span className="font-medium">{dept.completionRate}%</span>
                          </div>
                          <Progress value={dept.completionRate} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-md">
                            <div className="text-xs text-gray-500">Users</div>
                            <div className="text-xl font-bold">{dept.users}</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <div className="text-xs text-gray-500">Courses</div>
                            <div className="text-xl font-bold">{dept.courses}</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span>Ahead of target</span>
                          </div>
                          <span>{dept.completionRate > 70 ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="skills">
            <div className="grid gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Analysis</CardTitle>
                  <CardDescription>Skill gap assessment and acquisition metrics</CardDescription>
                </CardHeader>
                <CardContent className="mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-medium mb-4">Skill Gap Areas</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={skillGapData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Gap']} />
                            <Legend />
                            <Bar dataKey="value" name="Gap Percentage" fill="#FF8042" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Skill Acquisition</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillAcquisitionData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis domain={[0, 100]} />
                            <Radar name="Skill Level" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Tooltip />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-8" />
                  
                  <div>
                    <h3 className="font-medium mb-4">Recommended Training Focus</h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {skillGapData.slice(0, 3).map((skill, index) => (
                        <Card key={index} className="border-l-4" style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
                          <CardContent className="pt-6">
                            <h4 className="font-medium mb-2">{skill.name}</h4>
                            <div className="text-sm text-gray-500 mb-3">Gap: {skill.value}%</div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Priority</span>
                              <span className="font-medium">
                                {skill.value > 40 ? 'High' : skill.value > 20 ? 'Medium' : 'Low'}
                              </span>
                            </div>
                            <Progress value={100 - skill.value} className="h-2" />
                            <div className="mt-4">
                              <Button variant="outline" className="w-full text-xs gap-1">
                                <BookOpen className="h-3 w-3" />
                                Explore Courses
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Skill Distribution</CardTitle>
                  <CardDescription>Most common skills in your organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {['JavaScript', 'React', 'Node.js', 'CSS', 'UX Design', 'Agile', 'Python', 'AWS', 'TypeScript', 'Leadership'].map((skill, index) => (
                      <Badge key={index} variant="outline" className="py-3 px-4 flex items-center justify-between gap-2">
                        <Award className="h-4 w-4 text-brand-600" />
                        <span>{skill}</span>
                        <div className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                          {Math.floor(Math.random() * 30) + 5}
                        </div>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;
