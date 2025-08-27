/*
export interface Organization {
  _id: string;
  name: string;
  logo?: string;
  adminEmail: string;
  createdAt: string;
  departmentCount: number;
  courseCount: number;
  userCount: number;
}
*/

export interface Organization {
  _id: string;
  name: string;
  logo_url?: string;
  organization_admin_email: string;
  createdAt: string;
  statistics: {
    totalEmployees: number;
    totalDepartments: number;
    totalCourses: number;
  };
}

/*
export interface Department {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  courseCount: number;
  userCount: number;
  createdAt: string;
  employeeCount?: number;
}
*/

export interface Department {
  _id: string;  // Changed from id to _id (API response)
  //id?: string;  // Keep as optional for backward compatibility
  name: string;
  description: string;
  organizationId?: string;  // optional
  statistics: {  
    totalCourses: number;
    totalEmployees: number;
    totalEnrollments: number;
  };
  courses?: Course[];  // Add courses array 
  createdAt?: string;  // optional 
  
  
  courseCount?: number;
  userCount?: number;
  employeeCount?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  departmentIds: string[]; // Array to support multiple departments
  organizationIds: string[]; // Array to support multiple organizations
  createdAt: string;
  publishedAt?: string;
  topicCount: number;
  enrollmentCount: number;
  aiPersonaPrompt?: string;
  aiAbilityPrompt?: string;
  ragDocument?: string;
  progress?: number;
  image?: string;
  duration?: string;
  instructors?: string[];
  skills?: string[];
  topics?: Topic[]; // Added to support topics within course
  isPublished?: boolean;
  // For backward compatibility
  departmentId?: string;
  organizationId?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order?: number;
  subtopics: Subtopic[];
  // For backward compatibility
  subtopicCount?: number;
}

export interface Subtopic {
  id: string;
  title: string;
  description: string;
  topicId: string;
  order?: number;
  content?: string;
  videoUrl?: string;
  attachments?: Attachment[];
  assessments?: Assessment[];
  contentType: 'text' | 'video' | 'file' | 'link'; //ADDED THIS
  //textContent?:string;
  filenames?: { name: string }[];    //ADDED
  videoName?: string;
  videoFile?: File;
  files?: File[];
  linkUrl?: string;
  linkTitle?: string;
  links?: { title: string; url: string }[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'file' | 'link';
}

export interface Assessment {
  id: string;
  title: string;
  subtopicId: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'descriptive' | 'audio' | 'video';
  options?: string[];
  correctOption?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  organizationId: string;
  departmentId?: string;
  createdAt: string;
  avatar?: string;
  department?: string;
  enrolledCourses?: number;
  skills?: string[];
  completedCourses?: string[];
  inProgressCourses?: string[];
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  progress: number;
  createdAt: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  score: number;
  submittedAt: string;
  answers: {
    questionId: string;
    answer: string | number | string[];
  }[];
  user?: User;
  assessment?: Assessment;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  organizationId: string;
  userCount: number;
  courseCount: number;
}

export interface Analytics {
  id: string;
  organizationId: string;
  totalCourseCompletions: number;
  averageCompletionRate: number;
  skillGapAreas: { skill: string; gapPercentage: number }[];
  departmentPerformance: { department: string; completionRate: number }[];
  createdAt: string;
}
