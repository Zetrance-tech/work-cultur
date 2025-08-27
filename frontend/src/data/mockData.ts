import { 
  Organization, 
  Department, 
  Course, 
  Topic, 
  Subtopic, 
  User, 
  Enrollment,
  Assessment,
  Question,
  AssessmentResult,
  Skill,
  Analytics
} from '../types';

// Organizations
export const organizations: Organization[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    logo: 'https://ui-avatars.com/api/?name=Acme+Corporation&background=0D8ABC&color=fff',
    adminEmail: 'admin@acme.com',
    createdAt: '2024-01-15T08:00:00Z',
    departmentCount: 3,
    courseCount: 5,
    userCount: 120
  },
  {
    id: '2',
    name: 'Globex Industries',
    logo: 'https://ui-avatars.com/api/?name=Globex+Industries&background=2E8B57&color=fff',
    adminEmail: 'admin@globex.com',
    createdAt: '2024-02-20T10:30:00Z',
    departmentCount: 2,
    courseCount: 3,
    userCount: 75
  },
  {
    id: '3',
    name: 'Initech LLC',
    logo: 'https://ui-avatars.com/api/?name=Initech+LLC&background=4B0082&color=fff',
    adminEmail: 'admin@initech.com',
    createdAt: '2024-03-05T14:15:00Z',
    departmentCount: 4,
    courseCount: 8,
    userCount: 200
  }
];

// Departments
export const departments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software and hardware engineering teams',
    organizationId: '1',
    courseCount: 3,
    userCount: 45,
    createdAt: '2024-01-20T09:00:00Z',
    employeeCount: 45
  },
  {
    id: '2',
    name: 'Marketing',
    description: 'Brand, growth, and digital marketing teams',
    organizationId: '1',
    courseCount: 2,
    userCount: 30,
    createdAt: '2024-01-22T11:30:00Z',
    employeeCount: 30
  },
  {
    id: '3',
    name: 'Human Resources',
    description: 'HR, recruiting, and people operations',
    organizationId: '1',
    courseCount: 1,
    userCount: 15,
    createdAt: '2024-01-25T13:45:00Z',
    employeeCount: 15
  },
  {
    id: '4',
    name: 'Product Development',
    description: 'Product strategy, design, and management',
    organizationId: '2',
    courseCount: 2,
    userCount: 35,
    createdAt: '2024-02-22T10:00:00Z',
    employeeCount: 35
  },
  {
    id: '5',
    name: 'Sales',
    description: 'Business development and account management',
    organizationId: '2',
    courseCount: 1,
    userCount: 40,
    createdAt: '2024-02-25T14:30:00Z',
    employeeCount: 40
  }
];

// Update the courses to include skillsTaught and use correct properties
export const courses: Course[] = [
  {
    id: '1',
    title: 'Full-Stack Web Development',
    description: 'Learn modern full-stack development with React, Node.js, and PostgreSQL',
    departmentIds: ['1'],
    organizationIds: ['1'],
    departmentId: '1',  // For backward compatibility
    organizationId: '1', // For backward compatibility
    createdAt: '2024-01-25T10:00:00Z',
    publishedAt: '2024-02-01T09:00:00Z',
    topicCount: 4,
    enrollmentCount: 22,
    aiPersonaPrompt: 'You are an experienced web development instructor with 10+ years of industry experience.',
    aiAbilityPrompt: 'You specialize in explaining complex programming concepts in an approachable way with real-world examples.',
    progress: 65,
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80',
    duration: '8 weeks',
    skillsTaught: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Express']
  },
  {
    id: '2',
    title: 'Digital Marketing Fundamentals',
    description: 'Master the essentials of digital marketing including SEO, SEM, and social media',
    departmentIds: ['2'],
    organizationIds: ['1'],
    departmentId: '2',  // For backward compatibility
    organizationId: '1', // For backward compatibility
    createdAt: '2024-01-28T13:30:00Z',
    publishedAt: '2024-02-05T14:00:00Z',
    topicCount: 3,
    enrollmentCount: 18,
    aiPersonaPrompt: 'You are a marketing expert who has helped build successful campaigns for Fortune 500 companies.',
    aiAbilityPrompt: 'You provide practical marketing advice based on data-driven strategies and current industry trends.',
    progress: 40,
    image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    duration: '6 weeks',
    skillsTaught: ['SEO', 'Content Marketing', 'Social Media', 'Analytics', 'PPC Advertising']
  },
  {
    id: '3',
    title: 'HR Compliance Training',
    description: 'Essential training for HR professionals on current employment laws and regulations',
    departmentIds: ['3'],
    organizationIds: ['1'],
    departmentId: '3',  // For backward compatibility
    organizationId: '1', // For backward compatibility
    createdAt: '2024-01-30T09:15:00Z',
    publishedAt: '2024-02-08T10:30:00Z',
    topicCount: 2,
    enrollmentCount: 12,
    aiPersonaPrompt: 'You are an employment law attorney with expertise in corporate HR compliance.',
    aiAbilityPrompt: 'You explain complex legal concepts in clear, actionable terms for HR professionals.',
    progress: 90,
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2874&q=80',
    duration: '4 weeks',
    skillsTaught: ['Employment Law', 'Workplace Safety', 'Benefits Administration', 'Compliance Reporting']
  }
];

// Topics for Course 1
export const topics: Topic[] = [
  {
    id: '1',
    title: 'Frontend Development with React',
    description: 'Learn modern React development including hooks, context, and state management',
    courseId: '1',
    order: 1,
    subtopics: [],
    subtopicCount: 3 // For backward compatibility
  },
  {
    id: '2',
    title: 'Backend Development with Node.js',
    description: 'Build scalable APIs with Express, authentication, and database integration',
    courseId: '1',
    order: 2,
    subtopics: [],
    subtopicCount: 3 // For backward compatibility
  },
  {
    id: '3',
    title: 'Database Design and PostgreSQL',
    description: 'Learn relational database concepts and PostgreSQL implementation',
    courseId: '1',
    order: 3,
    subtopics: [],
    subtopicCount: 2 // For backward compatibility
  },
  {
    id: '4',
    title: 'Deployment and DevOps',
    description: 'Master the deployment process, CI/CD, and basic DevOps principles',
    courseId: '1',
    order: 4,
    subtopics: [],
    subtopicCount: 2 // For backward compatibility
  }
];

// Subtopics for Topic 1
export const subtopics: Subtopic[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Core concepts of React including components, props, and state',
    topicId: '1',
    order: 1,
    content: 'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small, isolated pieces of code called "components".'
  },
  {
    id: '2',
    title: 'Hooks and State Management',
    description: 'Using React hooks for state and side effects',
    topicId: '1',
    order: 2,
    content: 'Hooks are functions that let you "hook into" React state and lifecycle features from function components.'
  },
  {
    id: '3',
    title: 'Advanced React Patterns',
    description: 'Learn compound components, render props, and context API',
    topicId: '1',
    order: 3,
    content: 'Advanced React patterns help you create reusable, flexible component APIs.'
  }
];

// Sample Questions
export const questions: Question[] = [
  {
    id: '1',
    text: 'What is the main advantage of using React hooks?',
    type: 'multiple_choice',
    options: [
      'They make code faster',
      'They allow state in functional components',
      'They require less code to write',
      'They automatically optimize performance'
    ],
    correctOption: 1
  },
  {
    id: '2',
    text: 'Explain how the React Context API helps with prop drilling.',
    type: 'descriptive'
  },
  {
    id: '3',
    text: 'Demonstrate how to create a custom hook in React.',
    type: 'video'
  }
];

// Sample Assessment
export const assessments: Assessment[] = [
  {
    id: '1',
    title: 'React Fundamentals Quiz',
    subtopicId: '1',
    questions: [questions[0], questions[1]]
  }
];

// Users
export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@acme.com',
    role: 'admin',
    organizationId: '1',
    departmentId: '1',
    createdAt: '2024-01-15T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80',
    department: 'Engineering',
    enrolledCourses: 2,
    skills: ['JavaScript', 'React', 'Node.js'],
    completedCourses: ['3'],
    inProgressCourses: ['1']
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@acme.com',
    role: 'manager',
    organizationId: '1',
    departmentId: '1',
    createdAt: '2024-01-17T11:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80',
    department: 'Engineering',
    enrolledCourses: 1,
    skills: ['TypeScript', 'AWS', 'Python'],
    completedCourses: [],
    inProgressCourses: ['2']
  },
  {
    id: '3',
    name: 'Charlie Davis',
    email: 'charlie@acme.com',
    role: 'employee',
    organizationId: '1',
    departmentId: '1',
    createdAt: '2024-01-20T09:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    department: 'Engineering',
    enrolledCourses: 3,
    skills: ['React', 'CSS', 'UI/UX'],
    completedCourses: [],
    inProgressCourses: ['1', '3']
  },
  {
    id: '4',
    name: 'Diana Patel',
    email: 'diana@acme.com',
    role: 'employee',
    organizationId: '1',
    departmentId: '2',
    createdAt: '2024-01-22T14:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2788&q=80',
    department: 'Marketing',
    enrolledCourses: 1,
    skills: ['SEO', 'Content Marketing', 'Social Media'],
    completedCourses: ['2'],
    inProgressCourses: []
  },
  {
    id: '5',
    name: 'Ethan Wilson',
    email: 'ethan@acme.com',
    role: 'manager',
    organizationId: '1',
    departmentId: '3',
    createdAt: '2024-01-25T11:20:00Z',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80',
    department: 'Human Resources',
    enrolledCourses: 1,
    skills: ['Recruiting', 'Employment Law', 'Benefits Administration'],
    completedCourses: ['3'],
    inProgressCourses: []
  }
];

// Sample Enrollments
export const enrollments: Enrollment[] = [
  {
    id: '1',
    userId: '3',
    courseId: '1',
    status: 'approved',
    progress: 35,
    createdAt: '2024-02-05T10:30:00Z'
  }
];

// Sample Assessment Results
export const assessmentResults: AssessmentResult[] = [
  {
    id: '1',
    userId: '3',
    assessmentId: '1',
    score: 80,
    submittedAt: '2024-02-15T14:00:00Z',
    answers: [
      {
        questionId: '1',
        answer: 1
      },
      {
        questionId: '2',
        answer: 'Context API allows data to be passed through a component tree without having to pass props down manually at every level.'
      }
    ]
  }
];

// Skills
export const skills: Skill[] = [
  {
    id: '1',
    name: 'JavaScript',
    description: 'Web programming language for interactive website features',
    category: 'Programming',
    organizationId: '1',
    userCount: 15,
    courseCount: 2
  },
  {
    id: '2',
    name: 'React',
    description: 'JavaScript library for building user interfaces',
    category: 'Programming',
    organizationId: '1',
    userCount: 12,
    courseCount: 1
  },
  {
    id: '3',
    name: 'Node.js',
    description: 'JavaScript runtime for server-side applications',
    category: 'Programming',
    organizationId: '1',
    userCount: 8,
    courseCount: 1
  },
  {
    id: '4',
    name: 'SEO',
    description: 'Search engine optimization techniques',
    category: 'Marketing',
    organizationId: '1',
    userCount: 10,
    courseCount: 1
  },
  {
    id: '5',
    name: 'Content Marketing',
    description: 'Creating and distributing valuable content',
    category: 'Marketing',
    organizationId: '1',
    userCount: 12,
    courseCount: 1
  },
  {
    id: '6',
    name: 'Employment Law',
    description: 'Legal knowledge for HR professionals',
    category: 'Human Resources',
    organizationId: '1',
    userCount: 5,
    courseCount: 1
  }
];

// Analytics
export const analytics: Analytics[] = [
  {
    id: '1',
    organizationId: '1',
    totalCourseCompletions: 35,
    averageCompletionRate: 68,
    skillGapAreas: [
      { skill: 'Python', gapPercentage: 45 },
      { skill: 'Data Analysis', gapPercentage: 38 },
      { skill: 'Cloud Computing', gapPercentage: 32 }
    ],
    departmentPerformance: [
      { department: 'Engineering', completionRate: 72 },
      { department: 'Marketing', completionRate: 65 },
      { department: 'Human Resources', completionRate: 84 }
    ],
    createdAt: '2024-04-01T10:00:00Z'
  }
];
