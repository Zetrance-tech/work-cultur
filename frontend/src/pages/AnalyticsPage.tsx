import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  BarChart4, 
  ChevronLeft, 
  PieChart, 
  TrendingUp, 
  Award,
  Users,
  Building2,
  BookOpen,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { organizations, analytics, departments, users, courses } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const AnalyticsPage: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>();
  
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
  
  const roleDistribution = [
    { name: 'Admins', value: orgUsers.filter(user => user.role === 'admin').length },
    { name: 'Managers', value: orgUsers.filter(user => user.role === 'manager').length },
    { name: 'Employees', value: orgUsers.filter(user => user.role === 'employee').length }
  ];
  
  const departmentDistribution = orgDepartments.map(dept => ({
    name: dept.name,
    value: dept.userCount
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
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
            Analytics and insights for {organization.name}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
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
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
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
                    <RechartsPieChart>
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
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Users by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Users" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
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
                    <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
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
                    <Tooltip formatter={(value) => [`${value}%`, 'Gap Percentage']} />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
