import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  ChevronLeft, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock,
  PlayCircle,
  FileText,
  UserPlus,
  BarChart4,
  PenSquare,
  Award,
  CheckSquare,
  CornerDownRight,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { courses, topics, subtopics, organizations, enrollments, users } from "@/data/mockData";
import { motion } from "framer-motion";

const CourseDashboard: React.FC = () => {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  const organization = organizations.find(org => org.id === orgId);
  const course = courses.find(c => c.id === courseId && 
    (c.organizationIds.includes(orgId || '') || c.organizationId === orgId)
  );
  
  if (!organization || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Course Not Found</h2>
        <p className="text-gray-500 mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Button asChild variant="outline">
          <Link to={`/organization/${orgId}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Organization
          </Link>
        </Button>
      </div>
    );
  }
  
  const courseTopics = topics.filter(topic => topic.courseId === courseId);
  const courseEnrollments = enrollments.filter(enrollment => enrollment.courseId === courseId);
  const enrolledUsers = users.filter(user => 
    courseEnrollments.some(enrollment => enrollment.userId === user.id)
  );
  
  const completedEnrollments = courseEnrollments.filter(e => e.status === 'completed').length;
  const inProgressEnrollments = courseEnrollments.filter(e => e.status === 'approved' && e.progress > 0 && e.progress < 100).length;
  const pendingEnrollments = courseEnrollments.filter(e => e.status === 'pending').length;
  
  const totalProgress = courseEnrollments.reduce((acc, enrollment) => acc + enrollment.progress, 0);
  const averageProgress = courseEnrollments.length > 0 ? totalProgress / courseEnrollments.length : 0;
  
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
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-sm text-gray-500">{course.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <PenSquare className="h-4 w-4" />
                Edit
              </Button>
              <Button className="gap-2 bg-brand-600 hover:bg-brand-700">
                <UserPlus className="h-4 w-4" />
                Enroll Users
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart4 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="enrollments" className="gap-2">
              <Users className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Enrollments</span>
            </TabsTrigger>
            <TabsTrigger value="assessments" className="gap-2">
              <CheckSquare className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Assessments</span>
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
                      Enrollments
                    </CardTitle>
                    <CardDescription>
                      Users enrolled in this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-3xl font-bold">{courseEnrollments.length}</div>
                      <Button 
                        onClick={() => navigate(`/organization/${orgId}/course/${courseId}/registrations`)}
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                      >
                        <Users className="h-3.5 w-3.5" />
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemAnimation}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completion
                    </CardTitle>
                    <CardDescription>
                      Course completion status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-3xl font-bold">
                        {courseEnrollments.length > 0 
                          ? `${Math.round((completedEnrollments / courseEnrollments.length) * 100)}%` 
                          : '0%'}
                      </div>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {completedEnrollments} completed
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Average Progress</span>
                        <span>{averageProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={averageProgress} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-600">{inProgressEnrollments} In Progress</span>
                        <span className="text-yellow-600">{pendingEnrollments} Pending</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemAnimation}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Content
                    </CardTitle>
                    <CardDescription>
                      Course topics and subtopics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-3xl font-bold">{courseTopics.length}</div>
                      <div className="text-sm text-gray-500">
                        {course.topicCount} topics
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {course.duration || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>
                          {new Date(course.publishedAt || course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemAnimation} className="md:col-span-2 lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Skills</CardTitle>
                    <CardDescription>Skills taught in this course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {course.skillsTaught?.map((skill, index) => (
                        <Badge key={index} className="py-1.5 px-3 bg-brand-100 text-brand-800 hover:bg-brand-200 border-brand-200">
                          <Award className="h-3.5 w-3.5 mr-1.5" />
                          {skill}
                        </Badge>
                      )) || (
                        <div className="text-center py-6 w-full">
                          <p className="text-gray-500">No skills have been added to this course yet.</p>
                          <Button variant="outline" className="mt-4 gap-2">
                            <Award className="h-4 w-4" />
                            Add Skills
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="bg-white rounded-lg border overflow-hidden mb-6">
              <div className="p-4 border-b">
                <h3 className="font-medium">Course Curriculum</h3>
                <p className="text-sm text-gray-500">
                  All topics and subtopics in this course
                </p>
              </div>
              
              {courseTopics.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No content yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add topics and subtopics to build your course
                  </p>
                  <Button className="gap-2">
                    <PenSquare className="h-4 w-4" />
                    Create Content
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {courseTopics.map((topic, index) => {
                    const topicSubtopics = subtopics.filter(
                      subtopic => subtopic.topicId === topic.id
                    );
                    
                    return (
                      <div key={topic.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="bg-gray-100 flex items-center justify-center w-8 h-8 rounded-full mr-3 font-medium text-gray-700">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{topic.title}</h4>
                              <p className="text-sm text-gray-500">{topic.description}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {topic.subtopicCount || topicSubtopics.length} subtopics
                          </div>
                        </div>
                        
                        {topicSubtopics.length > 0 && (
                          <div className="ml-8 pl-4 border-l border-gray-200 mt-3">
                            {topicSubtopics.map((subtopic, i) => (
                              <div key={subtopic.id} className="py-2 flex">
                                <div className="flex items-center mr-3">
                                  <CornerDownRight className="h-4 w-4 text-gray-400 mr-2" />
                                  {subtopic.videoUrl ? (
                                    <PlayCircle className="h-5 w-5 text-brand-600" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-indigo-600" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{subtopic.title}</div>
                                  <div className="text-xs text-gray-500">{subtopic.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button className="gap-2">
                <PenSquare className="h-4 w-4" />
                Edit Curriculum
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="enrollments">
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="grid grid-cols-5 p-4 font-medium border-b bg-gray-50">
                <div className="col-span-2">User</div>
                <div>Status</div>
                <div>Progress</div>
                <div>Enrolled On</div>
              </div>
              {enrolledUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No enrollments yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Enroll users to see them here
                  </p>
                  <Button 
                    onClick={() => navigate(`/organization/${orgId}/course/${courseId}/registrations`)}
                    className="gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Manage Enrollments
                  </Button>
                </div>
              ) : (
                enrolledUsers.map(user => {
                  const enrollment = courseEnrollments.find(e => e.userId === user.id);
                  if (!enrollment) return null;
                  
                  return (
                    <div key={user.id} className="grid grid-cols-5 p-4 border-b last:border-0 items-center">
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div>
                        <Badge
                          variant={
                            enrollment.status === 'completed' ? 'outline' :
                            enrollment.status === 'approved' ? 'default' :
                            enrollment.status === 'pending' ? 'outline' : 'outline'
                          }
                          className={
                            enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            enrollment.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            enrollment.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs">
                            <span>{enrollment.progress}%</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="assessments">
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Course Assessments</h3>
                    <p className="text-sm text-gray-500">
                      View and manage assessments for this course
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate(`/organization/${orgId}/course/${courseId}/create-assessment`)}
                    className="gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Assessment
                  </Button>
                </div>
              </div>
              
              {/* Here we'd map through course assessments */}
              <div className="divide-y">
                <div className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Module 1 Assessment</h4>
                      <p className="text-sm text-gray-500">10 questions · 30 minutes</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
                {/* Add more assessments here */}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDashboard;
