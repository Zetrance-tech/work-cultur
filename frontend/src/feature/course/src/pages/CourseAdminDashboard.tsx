// src/feature/course/src/pages/CourseAdminDashboard.tsx
{/*
import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "../components/ui/tooltip";
import { Toaster } from "../components/ui/toaster";
import { Toaster as Sonner } from "../components/ui/sonner";
import { SidebarProvider } from "../components/ui/sidebar";
import { AdminSidebar } from "../components/AdminSidebar";
import { AdminHeader } from "../components/AdminHeader";
import CourseCreationWizard from "../components/CourseCreationWizard";
import AddQuestion from "./questions"; // Adjust path if needed
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Clock, BookOpen, Trash2, Edit3, Loader2, ExternalLink } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { api } from "../services/api";
import axios from "axios";
import { useToast } from "../hooks/use-toast";

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  image_url: string;
  status: string;
  courseAvatar: any;
  courseLink: string;
  instructors: string[];
  linked_entities: {
    organization: { _id: string; name: string };
    departments: { _id: string; name: string }[];
  }[];
}

const CourseAdminDashboard: React.FC<{
  authToken?: string;
  setAuthToken?: (token: string | null) => void;
  setIsAuthenticated?: (auth: boolean) => void;
  isAuthenticated?: boolean;
  handleLogin?: (token: string) => void;
}> = ({ authToken, setAuthToken, setIsAuthenticated, isAuthenticated, handleLogin }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { assessmentId } = useParams(); // For /add-question/:assessmentId
  const [error, setError] = useState<string | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem("workcultur_token");
    if (savedToken && !authToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
    }
  }, [authToken, setAuthToken, setIsAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("workcultur_token");
    setAuthToken(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(api.GET_PUBLISHED_COURSES, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCourses(data.data.courses);
    } catch (err) {
      setError("Failed to load courses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && authToken && !location.pathname.includes("create") && !location.pathname.includes("add-question")) fetchCourses();
  }, [isAuthenticated, authToken, location.pathname]);

  const getAllDepartments = (linked_entities: Course["linked_entities"]) => {
    const allDepartments: { _id: string; name: string }[] = [];
    linked_entities.forEach((entity) => {
      entity.departments.forEach((dept) => {
        if (!allDepartments.find((d) => d._id === dept._id)) {
          allDepartments.push(dept);
        }
      });
    });
    return allDepartments;
  };

  const handleDeleteCourse = async (courseId: string) => {
    setDeletingCourse(courseId);
    try {
      const response = await axios.delete(api.DELETE_COURSE, {
        data: { courseId },
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setCourses(courses.filter((course) => course._id !== courseId));
        setError(null);
        toast({ title: "Success", description: "Course deleted successfully!" });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete course",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Failed to delete course.");
    } finally {
      setDeletingCourse(null);
    }
  };

  const handleEditCourse = async (courseId: string) => {
    setEditingCourse(courseId);
    try {
      navigate(`/admin/courses/edit/${courseId}`);
    } catch (err) {
      setError("Failed to navigate to edit course.");
    } finally {
      setEditingCourse(null);
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in.</div>; // Placeholder for login redirection
  }

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <AdminHeader
          title={
            location.pathname.includes("create")
              ? "Create New Course"
              : location.pathname.includes("add-question")
              ? "Add Question"
              : "Course Library"
          }
        />
        <div className="flex-1 container mx-auto px-6 py-6" style={{ margin: 0, paddingTop: 0 }}>
          {error && (
            <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {location.pathname.includes("create") ? (
            <CourseCreationWizard
              authToken={authToken}
              setAuthToken={setAuthToken}
              setIsAuthenticated={setIsAuthenticated}
            />
          ) : location.pathname.includes("add-question") && assessmentId ? (
            <AddQuestion assessmentId={assessmentId} authToken={authToken} />
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-slate-600">Loading courses...</p>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Course Library</h2>
                  <p className="text-slate-600">
                    Showing {courses.length} published courses
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={fetchCourses}
                  disabled={isLoading}
                  className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <Card
                    key={course._id}
                    className="group flex flex-col hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden transform hover:scale-105"
                  >
                    <CardHeader className="p-0 relative">
                      <div className="relative overflow-hidden rounded-t-3xl">
                        <img
                          src={course.image_url || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg">
                            {course.status}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => handleEditCourse(course._id)}
                            disabled={editingCourse === course._id || deletingCourse === course._id}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                              editingCourse === course._id
                                ? "bg-blue-500/20 cursor-not-allowed"
                                : "bg-blue-500/70 hover:bg-blue-600/80 hover:scale-110"
                            }`}
                          >
                            {editingCourse === course._id ? (
                              <Loader2 className="w-5 h-5 text-white animate-spin" />
                            ) : (
                              <Edit3 className="w-5 h-5 text-white" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            disabled={deletingCourse === course._id || editingCourse === course._id}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                              deletingCourse === course._id
                                ? "bg-red-500/20 cursor-not-allowed"
                                : "bg-red-500/70 hover:bg-red-600/80 hover:scale-110"
                            }`}
                          >
                            {deletingCourse === course._id ? (
                              <Loader2 className="w-5 h-5 text-white animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5 text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="p-6 pb-4">
                        <CardTitle className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </CardTitle>
                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-4 space-y-3 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-500 bg-slate-50 rounded-full px-2 py-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{course.duration} hours</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 bg-slate-50 rounded-full px-2 py-1">
                          <BookOpen className="w-4 h-4" />
                          <span className="max-w-[100px] truncate font-medium" title={course.instructors.join(", ")}>
                            {course.instructors.join(", ")}
                          </span>
                        </div>
                      </div>
                      {course?.courseAvatar?.avatarName && (
                        <div className="text-xs text-slate-500 bg-blue-50 rounded-lg p-2">
                          <span className="font-medium">AI Avatar:</span>{" "}
                          <strong className="text-blue-700">{course?.courseAvatar?.avatarName}</strong>
                        </div>
                      )}
                      <div className="space-y-2">
                        {course.linked_entities.map((entity, index) => (
                          <div
                            key={`${entity.organization._id}-${index}`}
                            className="text-xs text-slate-500 bg-emerald-50 rounded-lg p-2"
                          >
                            <span className="font-medium">Organization:</span>{" "}
                            <strong className="text-emerald-700">{entity.organization.name}</strong>
                            {entity.departments.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {entity.departments.map((dept) => (
                                  <Badge
                                    key={`${entity.organization._id}-${dept._id}`}
                                    variant="secondary"
                                    className="text-xs bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-0 hover:from-emerald-200 hover:to-green-200 transition-all duration-300"
                                  >
                                    {dept.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <a href={course.courseLink} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 rounded-xl h-10 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Course
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {courses.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No courses found</h3>
                  <p className="text-slate-500">There are no published courses available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseAdminDashboard;
*/}

// src/feature/course/src/pages/CourseAdminDashboard.tsx
import React, { useState, useEffect } from "react";
import { TooltipProvider } from "../components/ui/tooltip";
import { Toaster } from "../components/ui/toaster";
import { Toaster as Sonner } from "../components/ui/sonner";
import { SidebarProvider } from "../components/ui/sidebar"; // Added SidebarProvider
import { AdminSidebar } from "../components/AdminSidebar";
import { AdminHeader } from "../components/AdminHeader";
import CourseCreationWizard from "../components/CourseCreationWizard";
import AddQuestion from "./questions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Clock, BookOpen, Trash2, Edit3, Loader2, ExternalLink } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { api } from "../services/api";
import axios from "axios";
import { useToast } from "../hooks/use-toast";

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  image_url: string;
  status: string;
  courseAvatar: any;
  courseLink: string;
  instructors: string[];
  linked_entities: {
    organization: { _id: string; name: string };
    departments: { _id: string; name: string }[];
  }[];
}

const CourseAdminDashboard: React.FC<{
  authToken?: string;
  setAuthToken?: (token: string | null) => void;
  setIsAuthenticated?: (auth: boolean) => void;
  isAuthenticated?: boolean;
  handleLogin?: (token: string) => void;
}> = ({ authToken, setAuthToken, setIsAuthenticated, isAuthenticated, handleLogin }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { assessmentId } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem("workcultur_token");
    if (savedToken && !authToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
    }
  }, [authToken, setAuthToken, setIsAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("workcultur_token");
    setAuthToken(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(api.GET_PUBLISHED_COURSES, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCourses(data.data.courses);
    } catch (err) {
      setError("Failed to load courses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && authToken && !location.pathname.includes("create") && !location.pathname.includes("add-question")) fetchCourses();
  }, [isAuthenticated, authToken, location.pathname]);

  const getAllDepartments = (linked_entities: Course["linked_entities"]) => {
    const allDepartments: { _id: string; name: string }[] = [];
    linked_entities.forEach((entity) => {
      entity.departments.forEach((dept) => {
        if (!allDepartments.find((d) => d._id === dept._id)) {
          allDepartments.push(dept);
        }
      });
    });
    return allDepartments;
  };

  const handleDeleteCourse = async (courseId: string) => {
    setDeletingCourse(courseId);
    try {
      const response = await axios.delete(api.DELETE_COURSE, {
        data: { courseId },
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setCourses(courses.filter((course) => course._id !== courseId));
        setError(null);
        toast({ title: "Success", description: "Course deleted successfully!" });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete course",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Failed to delete course.");
    } finally {
      setDeletingCourse(null);
    }
  };

  const handleEditCourse = async (courseId: string) => {
    setEditingCourse(courseId);
    try {
      navigate(`/admin/courses/edit/${courseId}`);
    } catch (err) {
      setError("Failed to navigate to edit course.");
    } finally {
      setEditingCourse(null);
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in.</div>;
  }

  return (
    <SidebarProvider> {/* Added SidebarProvider here */}
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col">
          <AdminHeader
            title={
              location.pathname.includes("create")
                ? "Create New Course"
                : location.pathname.includes("add-question")
                ? "Add Question"
                : "Course Library"
            }
          />
          <div className="flex-1 container mx-auto px-6 py-6" style={{ margin: 0, paddingTop: 0 }}>
            {error && (
              <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {location.pathname.includes("create") ? (
              <CourseCreationWizard
                authToken={authToken}
                setAuthToken={setAuthToken}
                setIsAuthenticated={setIsAuthenticated}
              />
            ) : location.pathname.includes("add-question") && assessmentId ? (
              <AddQuestion assessmentId={assessmentId} authToken={authToken} />
            ) : isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-slate-600">Loading courses...</p>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Course Library</h2>
                    <p className="text-slate-600">Showing {courses.length} published courses</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={fetchCourses}
                    disabled={isLoading}
                    className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      "Refresh"
                    )}
                  </Button>
                </div>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <Card
                      key={course._id}
                      className="group flex flex-col hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden transform hover:scale-105"
                    >
                      <CardHeader className="p-0 relative">
                        <div className="relative overflow-hidden rounded-t-3xl">
                          <img
                            src={course.image_url || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg">
                              {course.status}
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button
                              onClick={() => handleEditCourse(course._id)}
                              disabled={editingCourse === course._id || deletingCourse === course._id}
                              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                                editingCourse === course._id
                                  ? "bg-blue-500/20 cursor-not-allowed"
                                  : "bg-blue-500/70 hover:bg-blue-600/80 hover:scale-110"
                              }`}
                            >
                              {editingCourse === course._id ? (
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                              ) : (
                                <Edit3 className="w-5 h-5 text-white" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              disabled={deletingCourse === course._id || editingCourse === course._id}
                              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                                deletingCourse === course._id
                                  ? "bg-red-500/20 cursor-not-allowed"
                                  : "bg-red-500/70 hover:bg-red-600/80 hover:scale-110"
                              }`}
                            >
                              {deletingCourse === course._id ? (
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5 text-white" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="p-6 pb-4">
                          <CardTitle className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {course.title}
                          </CardTitle>
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="px-6 pb-4 space-y-3 flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-slate-500 bg-slate-50 rounded-full px-2 py-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{course.duration} hours</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 bg-slate-50 rounded-full px-2 py-1">
                            <BookOpen className="w-4 h-4" />
                            <span className="max-w-[100px] truncate font-medium" title={course.instructors.join(", ")}>
                              {course.instructors.join(", ")}
                            </span>
                          </div>
                        </div>
                        {course?.courseAvatar?.avatarName && (
                          <div className="text-xs text-slate-500 bg-blue-50 rounded-lg p-2">
                            <span className="font-medium">AI Avatar:</span>{" "}
                            <strong className="text-blue-700">{course?.courseAvatar?.avatarName}</strong>
                          </div>
                        )}
                        <div className="space-y-2">
                          {course.linked_entities.map((entity, index) => (
                            <div
                              key={`${entity.organization._id}-${index}`}
                              className="text-xs text-slate-500 bg-emerald-50 rounded-lg p-2"
                            >
                              <span className="font-medium">Organization:</span>{" "}
                              <strong className="text-emerald-700">{entity.organization.name}</strong>
                              {entity.departments.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {entity.departments.map((dept) => (
                                    <Badge
                                      key={`${entity.organization._id}-${dept._id}`}
                                      variant="secondary"
                                      className="text-xs bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-0 hover:from-emerald-200 hover:to-green-200 transition-all duration-300"
                                    >
                                      {dept.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-0">
                        <a href={course.courseLink} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 rounded-xl h-10 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Course
                          </Button>
                        </a>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                {courses.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-600 mb-2">No courses found</h3>
                    <p className="text-slate-500">There are no published courses available at the moment.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CourseAdminDashboard;