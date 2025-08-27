
// import React, { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react';

// export type ContentType = 'text' | 'video' | 'download' | 'assessment' | 'link';

// export interface FileDetail {
//   url: string;
//   name: string; 
//   type: string;
// }

// export interface LinkDetail {
//   title: string;
//   url: string;
// }

// export interface AssessmentDetail {
//   id: string;
//   title: string;
// }


// export interface SubTopic {
//   id: string;
//   title: string;
//   type: ContentType;
//   content?: string; // For text
//   videoUrl?: string; // For video
//   files?: FileDetail[]; // For download
  // links?: LinkDetail[]; // For link
  // assessmentIds?: AssessmentDetail[];
//   imageUrl?:string;// For assessments
//   audioUrl?:string; //for subtopic voice
// }

// export interface SubTopic {
//   id: string;
//   title: string;
//   type: ContentType;
//   content?: string;
//   videoUrl?: string;
//   files?:FileDetail[];
//   fileUrl?: string;
//   fileName?: string;
//   fileType?: string;
//   assessmentId?: string;
// }

// export interface Topic {
//   id: string;
//   title: string;
//   subTopics: SubTopic[];
// }

// export interface Course {
//   id: string;
//   title: string;
//   topics: Topic[];
// }

// interface ChatMessage {
//   id: string;
//   sender: 'user' | 'avatar';
//   text: string;
//   timestamp: Date;
// }

// interface CourseContextType {
//   course: Course | null;
//   setCourse: (course: Course) => void;
//   currentTopicId: string | null;
//   setCurrentTopicId: (id: string | null) => void;
//   currentSubTopicId: string | null;
//   setCurrentSubTopicId: (id: string | null) => void;
//   isVideoFullScreen: boolean;
//   setIsVideoFullScreen: (isFullScreen: boolean) => void;
//   chatMessages: ChatMessage[];
//   addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
//   showChat: boolean;
//   toggleChat: (forceShow?: boolean) => void;
//   chatLoading: boolean;
//   setChatloading: Dispatch<SetStateAction<boolean>>;
// }

// const CourseContext = createContext<CourseContextType | undefined>(undefined);

// export const CourseProvider = ({ children }: { children: ReactNode }) => {
//   const [course, setCourse] = useState<Course | null>(null);
//   const [currentTopicId, setCurrentTopicId] = useState<string | null>(null);
//   const [currentSubTopicId, setCurrentSubTopicId] = useState<string | null>(null);
//   const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
//     {
//       id: '1',
//       sender: 'avatar',
//       text: 'Hello! How can I assist you today?',
//       timestamp: new Date(),
//     },
//   ]);
//   const [showChat, setShowChat] = useState(false);
// const [isReading, setIsReading] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
  

//   const [chatLoading, setChatloading] = useState(false);
//   const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);

//   const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
//     const newMessage = {
//       ...message,
//       id: `msg-${Date.now()}`,
//       timestamp: new Date(),
//     };
//     setChatMessages((prev) => [...prev, newMessage]);
//   };

//   const toggleChat = (forceShow?: boolean) => {
//     if (forceShow !== undefined) {
//       setShowChat(forceShow);
//     } else {
//       setShowChat((prev) => !prev);
//     }
//   };

//   return (
//     <CourseContext.Provider
//       value={{
//         course,
//         setCourse,
//         currentTopicId,
//         setCurrentTopicId,
//         currentSubTopicId,
//         setCurrentSubTopicId,
//         isVideoFullScreen,
//         setIsVideoFullScreen,
//         chatMessages,
//         addChatMessage,
//         showChat,
//         toggleChat,
//         chatLoading,
//         setChatloading,


      
//       }}
//     >
//       {children}
//     </CourseContext.Provider>
//   );
// };

// export const useCourse = () => {
//   const context = useContext(CourseContext);
//   if (context === undefined) {
//     throw new Error('useCourse must be used within a CourseProvider');
//   }
//   return context;
// };







////////////////////////////new updated context//////////////////////////////////////////////

import { createContext, useContext, useState, useMemo } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "avatar";
  text: string;
  timestamp: Date;
}

export interface FileDetail {
  url: string;
  name: string; 
  type: string;
}

export interface LinkDetail {
  title: string;
  url: string;
}

export interface AssessmentDetail {
  id: string;
  title: string;
}

export interface SubTopic {
  id: string;
  title: string;
  type: string;
  content?: string;
  files?:FileDetail[];
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  links?: LinkDetail[]; // For link
  // assessmentIds?: Array<object>;
  avatarvideofile?: { url: string; public_id: string }; // For avatar video file
  assessmentIds?: AssessmentDetail[];
}

export interface Topic {
  id: string;
  title: string;
  subTopics: SubTopic[];
}

export interface Course {
  id: string;
  title: string;
  courseAvatar:any;
  azureUrl: string;
  avatarID: string;
  topics: Topic[];
}

interface CourseContextType {
  course: Course | null;
  setCourse;
  frameCache: Record<string, string>;
  setFrameCache: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  avatarID: string;
  currentTopicId: string | null;
  setCurrentTopicId: (id: string | null) => void;
  currentSubTopicId: string | null;
  setCurrentSubTopicId: (id: string | null) => void;
  isVideoFullScreen: boolean;
  setIsVideoFullScreen: (isFullScreen: boolean) => void;
  isReading: boolean;
  setIsReading: (isReading: boolean) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  showChat: boolean;
  toggleChat: (show?: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  chatLoading: boolean;
  setChatloading: (loading: boolean) => void;
  isAvatarSpeaking: boolean;
  setIsAvatarSpeaking: (isSpeaking: boolean) => void;
  // videofileUrl: string; // Expose video file URL
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null);
  const [currentSubTopicId, setCurrentSubTopicId] = useState<string | null>(null);
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatloading] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [frameCache, setFrameCache] = useState<Record<string, string>>({});

  // let videofileUrl = "https://workcultur.blob.core.windows.net/workcultur-storage/videoplayback.mp4"; // Placeholder for video file URL
  
  const toggleChat = (show?: boolean) => {
    setShowChat((prev) => (show !== undefined ? show : !prev));
  };

  const addChatMessage = (message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  const contextValue = useMemo(
    () => ({
      avatarID: course?.avatarID || "",
      course,
      frameCache,
      setFrameCache,
      setCourse,
      currentTopicId,
      setCurrentTopicId,
      currentSubTopicId,
      setCurrentSubTopicId,
      isVideoFullScreen,
      setIsVideoFullScreen,
      isReading,
      setIsReading,
      isPaused,
      setIsPaused,
      showChat,
      toggleChat,
      chatMessages,
      addChatMessage,
      chatLoading,
      setChatloading,
      isAvatarSpeaking,
      setIsAvatarSpeaking,
      // videofileUrl, // Expose video file URL
    }),
    [
      course,
      currentTopicId,
      currentSubTopicId,
      isVideoFullScreen,
      isReading,
      isPaused,
      showChat,
      chatMessages,
      chatLoading,
      isAvatarSpeaking,
      // videofileUrl
    ]
  );

  return <CourseContext.Provider value={contextValue}>{children}</CourseContext.Provider>;
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};