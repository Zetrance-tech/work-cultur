{/*
import { useState, useEffect } from "react";
//import { Card } from "@/components/ui/card";
//import { Button } from "@/components/ui/button";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

import { X, ChevronLeft, ChevronRight, LogOut, Plus, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
//import BasicInfoStep from "@/components/steps/BasicInfoStep";
import BasicInfoStep from './steps/BasicInfoStep';

//import ContentStep from "@/components/steps/ContentStep";
import ContentStep from "./steps/ContentStep";
//import AssessmentStep from "@/components/steps/AssessmentStep";
import AssessmentStep from "./steps/AssessmentStep";
//import PublishStep from "@/components/steps/PublishStep";
import PublishStep from "./steps/PublishStep";
import { useNavigate, useParams } from "react-router-dom";


import { 
 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator
} from "./ui/sidebar";

import { SidebarProvider } from '@/components/ui/sidebar';


//import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminSidebar } from "./AdminSidebar";
//import { AdminHeader } from "@/components/AdminHeader";
import { AdminHeader } from "./AdminHeader";

//import { api } from "@/services/api";
import { api } from "../services/api";
import { Loader2 } from "lucide-react";
import axios from 'axios';

const LOGO_URL = "/logo.png";

const CourseCreationWizard = ({ authToken, setAuthToken, setIsAuthenticated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({});
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [isLoading, setIsLoading] = useState(!!courseId);
  const [isGlobalEditMode, setIsGlobalEditMode] = useState(false);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const response = await axios.post(
            api.GET_COURSE_BY_ID,
            { courseId },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

         
          
        
          setCourseData(response.data.data);
          setIsGlobalEditMode(true)
        } catch (error) {
          console.error("Error fetching course:", error);
        } finally {
          setIsLoading(false);
         
        }
      };
  
      fetchCourseData();
    }
  }, [courseId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  const handleLogout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    localStorage.clear();
    navigate("/");
  };

  const steps = [
    { id: 1, title: "Basic Info", description: "Course details", icon: "📚" },
    { id: 2, title: "Content", description: "Topics & Subtopics", icon: "📝" },
    { id: 3, title: "Assessments", description: "Questions & Tests", icon: "🎯" },
    { id: 4, title: "Publish", description: "Review & Publish", icon: "🚀" },
  ];

  const updateCourseData = (stepData) => {
   
    setCourseData((prev) => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId) => {
    setCurrentStep(stepId);
  };


  const cancelEditCourse = ()=>{
    setCourseData({
      title: "",
      description: "",
      duration: "",
      image_url: "",
      skills: [],
      instructors: [],
      ai_settings: {
        persona_prompt: "",
        ability_prompt: "",
        rag_documents: [],
      },
    });
    setIsGlobalEditMode(false);
    navigate('/');
  }



  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
          onGlobalCancel = {cancelEditCourse}
            data={courseData}
            onUpdate={updateCourseData}
            onNext={nextStep}
            authToken={authToken}
            isGlobalEditMode={isGlobalEditMode}
            setIsGlobalEditMode={setIsGlobalEditMode}
          />
        );
      case 2:
        return (
          <ContentStep
            data={courseData}
            onUpdate={updateCourseData}
            onNext={nextStep}
            onPrev={prevStep}
            authToken={authToken}
          />
        );
      case 3:
        return (
          <AssessmentStep
            data={courseData}
            onUpdate={updateCourseData}
            onNext={nextStep}
            onPrev={prevStep}
            authToken={authToken}
          />
        );
      case 4:
        return (
          <PublishStep
            data={courseData}
            onUpdate={updateCourseData}
            onPrev={prevStep}
            authToken={authToken}
            isGlobalEditMode={isGlobalEditMode}
            setIsGlobalEditMode={setIsGlobalEditMode}
          />
        );
      default:
        return null;
    }
  };

 return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <AdminSidebar onLogout={handleLogout}/>
        
        <SidebarInset className="flex-1 flex flex-col">
          <AdminHeader title={courseId ? "Edit Course" : "Create New Course"} />
     
          <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-6 shadow-lg">
            <div className="container mx-auto px-6 py-2">
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                {steps.map((step, index) => (
                  <div key={step?.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold border-3 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105",
                          currentStep === step.id
                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-500 shadow-blue-500/25 scale-110"
                            : currentStep > step.id
                            ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white border-emerald-400 shadow-emerald-500/25"
                            : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        )}
                        onClick={() => goToStep(step.id)}
                      >
                        {currentStep > step.id ? "✓" : step.icon}
                      </div>
                      <div className="mt-4 text-center">
                        <div className={cn(
                          "text-sm font-semibold transition-colors tracking-wide",
                          currentStep === step.id ? "text-blue-600" : "text-slate-700"
                        )}>
                          {step.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 font-medium">{step.description}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-2 mx-8 transition-all duration-500 rounded-full relative overflow-hidden",
                          currentStep > step.id ? "bg-gradient-to-r from-emerald-400 to-green-500" : "bg-slate-200"
                        )}
                      >
                        {currentStep > step.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-green-400 animate-pulse"></div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 container mx-auto px-8 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  {renderStep()}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CourseCreationWizard;
*/}
// CourseCreationWizard.tsx (Key Changes Highlighted)

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, ChevronLeft, ChevronRight, LogOut, Plus, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import BasicInfoStep from './steps/BasicInfoStep';
import ContentStep from "./steps/ContentStep";
import AssessmentStep from "./steps/AssessmentStep";
import PublishStep from "./steps/PublishStep";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset, SidebarSeparator } from "./ui/sidebar";
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { api } from "../services/api";
import { Loader2 } from "lucide-react";
import axios from 'axios';

const LOGO_URL = "/logo.png";

const CourseCreationWizard = ({ authToken, setAuthToken, setIsAuthenticated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({});
  const navigate = useNavigate();
  //const { courseId } = useParams();
  const { courseId, step: stepParam } = useParams();
  console.log("Parameter", { courseId, step:stepParam });

const pathname = window.location.pathname;
const isEditModeFromPath = pathname.includes("/edit/");
  const [isLoading, setIsLoading] = useState(!!courseId);
  const [isGlobalEditMode, setIsGlobalEditMode] = useState(false);

  //const token = localStorage.getItem('authToken');

  //Correct key based on our ProtectedRoute and login logic
  const token = localStorage.getItem("workcultur_token");
  const [formData, setFormData] = useState({});


  {/*
  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const response = await axios.post(
            api.GET_COURSE_BY_ID,
            { courseId },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
           
          console.log("Fetched course data:", response.data.data); 

          setCourseData(response.data.data);
          setIsGlobalEditMode(true);
        } catch (error) {
          console.error("Error fetching course:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCourseData();
    }
  }, [courseId, token]);
*/}

useEffect(() => {
console.log(" courseId from useParams:", courseId);
console.log(" token from localStorage:", token);


  if (courseId) {
    const fetchCourseData = async () => {
      console.log("⏳ fetchCourseData triggered with ID:", courseId);

      try {
        const response = await axios.post(
          api.GET_COURSE_BY_ID,
          { courseId },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetched = response.data.data;

        console.log("Fetched course data:", fetched);

        // Flatten the nested structure to match what BasicInfoStep expects
        const flattened = {
          ...fetched.basicInfo,
          id: fetched.basicInfo._id,
          ai_settings: fetched.aiSettings,
          content: fetched.content,
          assessments: fetched.assessments,
          topics: fetched.content?.topics || [],  

        };

        console.log("Flattened courseData:", flattened);
        console.log("fetched.content.topics ", fetched.content?.topics);

        setCourseData(flattened);
        console.log(" courseData set in wizard:", flattened);

        setIsGlobalEditMode(true);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }
}, [courseId, token]);





  const stepMap = {
    "basic-info": 1,
    "content": 2,
    "assessments": 3,
    "publish": 4,
  };

  const reverseStepMap = {
    1: "basic-info",
    2: "content",
    3: "assessments",
    4: "publish",
  };
    
  useEffect(() => {
    if (!stepParam && courseId) {
      navigate(`/admin/courses/edit/${courseId}/basic-info`, { replace: true });
    }
  }, [stepParam, courseId, navigate]);

  useEffect(() => {
    if (stepParam && stepMap[stepParam]) {
      setCurrentStep(stepMap[stepParam]);
    }
  }, [stepParam]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  const handleLogout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    localStorage.clear();
    navigate("/");
  };


  const steps = [
    { id: 1, title: "Basic Info", description: "Course details", icon: "📚" },
    { id: 2, title: "Content", description: "Topics & Subtopics", icon: "📝" },
    { id: 3, title: "Assessments", description: "Questions & Tests", icon: "🎯" },
    { id: 4, title: "Publish", description: "Review & Publish", icon: "🚀" },
  ];

  {/*
  const updateCourseData = (stepData) => {
    setCourseData((prev) => ({ ...prev, ...stepData }));
  };
*/}
const updateCourseData = (stepData) => {
  setCourseData((prev) => {
    const updated = { ...prev, ...stepData };
    console.log("🧠 Updated courseData in wizard:", updated); //  Add this
    return updated;
  });
};

{/*
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId) => {
    setCurrentStep(stepId);
  };
*/}

{/*
const nextStep = () => {
  if (currentStep < steps.length) {
    const next = currentStep + 1;
    navigate(`/admin/courses/edit/${courseId}/${reverseStepMap[next]}`);
  }
};
*/}

const nextStep = () => {
  if (currentStep < steps.length) {
    const next = currentStep + 1;
    const stepSlug = reverseStepMap[next];

    
    //if (isGlobalEditMode && courseId) {
    if (isEditModeFromPath) {
      //console.log("courseId before navigating to Content:", courseId);

      // For edit mode
      navigate(`/admin/courses/edit/${courseId}/${stepSlug}`);
    } else {
      console.log("courseId before navigating to Content:", courseId);

      // For new course creation
      navigate(`/admin/courses/create/course/${courseId}/${stepSlug}`);
    }
  }
};


{/*
const prevStep = () => {
  if (currentStep > 1) {
    const prev = currentStep - 1;
    navigate(`/admin/courses/edit/${courseId}/${reverseStepMap[prev]}`);
  }
};
*/}
const prevStep = () => {
  if (currentStep > 1) {
    const prev = currentStep - 1;
    const stepSlug = reverseStepMap[prev];


    //if (isGlobalEditMode && courseId) {
    if (isEditModeFromPath) {
      // For edit mode
      navigate(`/admin/courses/edit/${courseId}/${stepSlug}`);
    } else {
      // For creation mode
      navigate(`/admin/courses/create/course/${courseId}/${stepSlug}`);
    }
  }
};


const goToStep = (stepId) => {
  navigate(`/admin/courses/edit/${courseId}/${reverseStepMap[stepId]}`);
};


  const cancelEditCourse = () => {
    setCourseData({
      title: "",
      description: "",
      duration: "",
      image_url: "",
      skills: [],
      instructors: [],
      ai_settings: {
        persona_prompt: "",
        ability_prompt: "",
        rag_documents: [],
      },
    });
    setIsGlobalEditMode(false);
    //navigate('/');
    navigate('/admin/courses');

  };

  console.log("🪜 Current step:", currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            onGlobalCancel={cancelEditCourse}
            data={courseData}
            onUpdate={updateCourseData}
            onNext={nextStep}
            authToken={authToken}
            isGlobalEditMode={isGlobalEditMode}
            setIsGlobalEditMode={setIsGlobalEditMode}
          />
        );
      case 2:
        return (
          <ContentStep
            data={courseData}
            onUpdate={updateCourseData}
            
            onNext={nextStep}
            onPrev={prevStep}
            authToken={authToken}
          />
        );
      case 3:
        return (
          <AssessmentStep
            data={courseData}
            onUpdate={updateCourseData}
            onNext={nextStep}
            onPrev={prevStep}
            authToken={authToken}
            
          />
        );
      case 4:
        return (
          <PublishStep
            data={courseData}
            onUpdate={updateCourseData}
            onPrev={prevStep}
            authToken={authToken}
            isGlobalEditMode={isGlobalEditMode}
            setIsGlobalEditMode={setIsGlobalEditMode}
          />
        );
      default:
        return null;
    }
  };

  {/*
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <AdminSidebar onLogout={handleLogout} />
        
        <SidebarInset className="flex-1 flex flex-col" style={{ margin: 0, padding: 0 }}>
          <AdminHeader title={courseId ? "Edit Course" : "Create New Course"} />
          <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-2 shadow-lg" style={{ margin: 0 }}>
            <div className="container mx-auto px-6 py-1" style={{ margin: 0 }}>
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                {steps.map((step, index) => (
                  <div key={step?.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold border-3 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105",
                          currentStep === step.id
                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-500 shadow-blue-500/25 scale-110"
                            : currentStep > step.id
                            ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white border-emerald-400 shadow-emerald-500/25"
                            : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        )}
                        onClick={() => goToStep(step.id)}
                      >
                        {currentStep > step.id ? "✓" : step.icon}
                      </div>
                      <div className="mt-4 text-center">
                        <div className={cn(
                          "text-sm font-semibold transition-colors tracking-wide",
                          currentStep === step.id ? "text-blue-600" : "text-slate-700"
                        )}>
                          {step.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 font-medium">{step.description}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-2 mx-8 transition-all duration-500 rounded-full relative overflow-hidden",
                          currentStep > step.id ? "bg-gradient-to-r from-emerald-400 to-green-500" : "bg-slate-200"
                        )}
                      >
                        {currentStep > step.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-green-400 animate-pulse"></div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 container mx-auto px-8 py-0" style={{ margin: 0, paddingTop: 0 }}>
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 relative overflow-hidden" style={{ marginTop: 0 }}>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  {renderStep()}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
*/}

return (
  <SidebarProvider>
    {/*
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50"
    */}
    <div className="flex w-full min-h-screen bg-black text-white">



    {/* Sidebar - Left 
      <AdminSidebar onLogout={handleLogout} />
      */}

      {/* Right - Header and Content */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Header */}
        {/*
        <AdminHeader title={courseId ? "Edit Course" : "Create New Course"} />
        */}
        <AdminHeader title={isEditModeFromPath ? "Edit Course" : "Create New Course"} />


        {/* Stepper Header */}
        {/*
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-2 shadow-lg">
        */}
        <div className="bg-black/30 backdrop-blur-md border-b border-white/10 py-2 shadow-md">
          <div className="container mx-auto px-6 py-1">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  {/* Step Icons */}
  
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="flex-1 container mx-auto px-8 py-0">
          <div className="max-w-6xl mx-auto">
          {/*
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 relative overflow-hidden">
          */} 
          <div className="bg-white/1 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(255,255,255,0.1)] rounded-2xl p-6 text-white">
         
 
            {/* Gradient Decorations */}
              
              <div className="relative z-10">
                {renderStep()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SidebarProvider>
);
};

export default CourseCreationWizard;