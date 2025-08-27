
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  BarChart4, 
  ChevronLeft, 
  Filter, 
  TrendingUp,
  Award,
  Users,
  Building2,
  BookOpen,
  Network,
  BrainCircuit,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { organizations, analytics, departments, users, courses } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const OrganizationAnalyticsDashboard: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [timePeriod, setTimePeriod] = useState("monthly");
  
  const organization = organizations.find(org => org.id === orgId);
  const orgAnalytics = analytics.find(a => a.organizationId === orgId);
  
  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <BarChart4 className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Organization Not Found</h2>
        <p className="text-gray-500 mb-6">The organization you're looking for doesn't exist or has been removed.</p>
        <Button asChild variant="outline">
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }
  
  const orgDepartments = departments.filter(dept => dept.organizationId === orgId);
  const orgUsers = users.filter(user => user.organizationId === orgId);
  const orgCourses = courses.filter(course => 
    course.organizationIds.includes(orgId || '') || course.organizationId === orgId
  );
  
  // Data for charts
  const roleDistribution = [
    { name: 'Admins', value: orgUsers.filter(user => user.role === 'admin').length },
    { name: 'Managers', value: orgUsers.filter(user => user.role === 'manager').length },
    { name: 'Employees', value: orgUsers.filter(user => user.role === 'employee').length }
  ];
  
  const departmentDistribution = orgDepartments.map(dept => ({
    name: dept.name,
    value: dept.userCount
  }));
  
  // Skill gap radar data
  const skillGapRadarData = orgAnalytics?.skillGapAreas.map(skill => ({
    subject: skill.skill,
    A: 100 - skill.gapPercentage,
    fullMark: 100
  })) || [];
  
  // Mind map data (simulated)
  const mindMapData = {
    name: "Technical Skills",
    children: [
      {
        name: "Programming",
        children: [
          { name: "JavaScript", size: 75 },
          { name: "Python", size: 65 },
          { name: "Java", size: 45 }
        ]
      },
      {
        name: "Database",
        children: [
          { name: "SQL", size: 80 },
          { name: "NoSQL", size: 55 }
        ]
      },
      {
        name: "DevOps",
        children: [
          { name: "Docker", size: 40 },
          { name: "Kubernetes", size: 25 }
        ]
      }
    ]
  };
  
  // Course completion trend (simulated)
  const completionTrend = [
    { month: 'Jan', completions: 15 },
    { month: 'Feb', completions: 20 },
    { month: 'Mar', completions: 18 },
    { month: 'Apr', completions: 25 },
    { month: 'May', completions: 30 },
    { month: 'Jun', completions: 28 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
              className="rounded-full"
            >
              <Link to={`/organization/${orgId}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for {organization.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{organization.userCount}</div>
            <p className="text-xs text-muted-foreground">
              Across {organization.departmentCount} departments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-green-500" />
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{organization.courseCount}</div>
            <p className="text-xs text-muted-foreground">
              With {orgAnalytics?.totalCourseCompletions || 0} completions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-purple-500" />
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{organization.departmentCount}</div>
            <div className="flex gap-1 mt-1">
              {orgDepartments.slice(0, 2).map(dept => (
                <Badge key={dept.id} variant="outline" className="bg-gray-100">
                  {dept.name}
                </Badge>
              ))}
              {orgDepartments.length > 2 && (
                <Badge variant="outline" className="bg-gray-100">
                  +{orgDepartments.length - 2}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2 text-amber-500" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{orgAnalytics?.averageCompletionRate || 0}%</div>
            <Progress 
              value={orgAnalytics?.averageCompletionRate || 0} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-[500px] grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="skills">Skill Gaps</TabsTrigger>
          <TabsTrigger value="mindmap">Mind Maps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Distribution of users by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {roleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Course Completion Trend</CardTitle>
                <CardDescription>Monthly course completions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={completionTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line 
                        type="monotone" 
                        dataKey="completions" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="departments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Completion rates by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={orgAnalytics?.departmentPerformance || []}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="department" type="category" width={100} />
                    <RechartsTooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                    <Bar 
                      dataKey="completionRate" 
                      fill="#82ca9d" 
                      name="Completion Rate"
                      radius={[0, 4, 4, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skill Gaps</CardTitle>
                <CardDescription>Areas where your organization needs improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={orgAnalytics?.skillGapAreas || []}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="skill" type="category" width={100} />
                      <RechartsTooltip formatter={(value) => [`${value}%`, 'Gap Percentage']} />
                      <Bar 
                        dataKey="gapPercentage" 
                        fill="#ff8042" 
                        name="Gap Percentage"
                        radius={[0, 4, 4, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Skill Proficiency</CardTitle>
                <CardDescription>Radar view of skill proficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={150} width={500} height={500} data={skillGapRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar 
                        name="Proficiency" 
                        dataKey="A" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.6} 
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="mindmap" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-purple-500" />
                Skills Mind Map
              </CardTitle>
              <CardDescription>
                Visual representation of skills and their relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="flex justify-center mb-8">
                  <div className="p-3 bg-purple-100 rounded-full border-2 border-purple-200 text-purple-800 font-medium">
                    Technical Skills
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Programming Skills Branch */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-16 bg-purple-300 mb-2"></div>
                    <div className="p-2 bg-blue-100 rounded-lg border-2 border-blue-200 text-blue-800 font-medium mb-4">
                      Programming
                    </div>
                    <div className="flex flex-col gap-3 items-center">
                      <div className="w-0.5 h-10 bg-blue-300 mb-1"></div>
                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 text-blue-700 w-32 text-center">
                        JavaScript (75%)
                      </div>
                      <div className="w-0.5 h-10 bg-blue-300 my-1"></div>
                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 text-blue-700 w-32 text-center">
                        Python (65%)
                      </div>
                      <div className="w-0.5 h-10 bg-blue-300 my-1"></div>
                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 text-blue-700 w-32 text-center">
                        Java (45%)
                      </div>
                    </div>
                  </div>
                  
                  {/* Database Skills Branch */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-16 bg-purple-300 mb-2"></div>
                    <div className="p-2 bg-green-100 rounded-lg border-2 border-green-200 text-green-800 font-medium mb-4">
                      Database
                    </div>
                    <div className="flex flex-col gap-3 items-center">
                      <div className="w-0.5 h-10 bg-green-300 mb-1"></div>
                      <div className="p-2 bg-green-50 rounded-lg border border-green-200 text-green-700 w-32 text-center">
                        SQL (80%)
                      </div>
                      <div className="w-0.5 h-10 bg-green-300 my-1"></div>
                      <div className="p-2 bg-green-50 rounded-lg border border-green-200 text-green-700 w-32 text-center">
                        NoSQL (55%)
                      </div>
                    </div>
                  </div>
                  
                  {/* DevOps Skills Branch */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-16 bg-purple-300 mb-2"></div>
                    <div className="p-2 bg-orange-100 rounded-lg border-2 border-orange-200 text-orange-800 font-medium mb-4">
                      DevOps
                    </div>
                    <div className="flex flex-col gap-3 items-center">
                      <div className="w-0.5 h-10 bg-orange-300 mb-1"></div>
                      <div className="p-2 bg-orange-50 rounded-lg border border-orange-200 text-orange-700 w-32 text-center">
                        Docker (40%)
                      </div>
                      <div className="w-0.5 h-10 bg-orange-300 my-1"></div>
                      <div className="p-2 bg-orange-50 rounded-lg border border-orange-200 text-orange-700 w-32 text-center">
                        Kubernetes (25%)
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center text-gray-500 text-sm">
                  <Network className="h-4 w-4 inline mr-1" />
                  Interactive mind map - Percentages indicate proficiency level
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationAnalyticsDashboard;
