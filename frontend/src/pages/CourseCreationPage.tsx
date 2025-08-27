import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { BookOpen, ChevronLeft, PlusCircle, Save, Upload, Clock, Award, Users, FileText, CheckSquare, Trash2, Video, File, Link as LinkIcon, ChevronDown, ChevronUp, Edit, ArrowRight, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { departments, organizations, courses } from "@/data/mockData";
import { Course, Topic, Subtopic, Assessment, Question } from "@/types";
import SaveButton from "@/components/Courses/SaveButton";
//import { courseService } from '@/services/courseService';

import { Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";
import { Check } from "lucide-react";


//importing API calls defined in courseAPI
import { publishCourse,createCourse,createTopic,updateTopic ,deleteTopic,createSubtopic,updateSubtopic,deleteSubtopic} from '../api/courseAPI' 



const courseFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters."
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters."
  }),
  departmentIds: z.array(z.string()).min(1, {
    message: "Select at least one department."
  }),
  organizationIds: z.array(z.string()).min(1, {
    message: "Select at least one organization."
  }),
  duration: z.string().min(1, { message: "Duration is required." }),
  skills: z.array(z.string()).min(1, { message: "At least one skill is required." }),
  instructors: z.array(z.string()).min(1, { message: "At least one instructor is required." }),
  image: z.string().optional(),
  aiPersonaPrompt: z.string().min(10,{ message: "Enter a persona prompt." }),
  aiAbilityPrompt: z.string().min(10, { message: "Enter an ability prompt." }),
  ragDocument: z.string().optional()
});
const topicSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, {
    message: "Topic title is required"
  }),
  description: z.string().optional(),
  order: z.number(),
  subtopics: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(3, {
      message: "Subtopic title is required"
    }),
    description: z.string().optional(),
    order: z.number(),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    assessments: z.array(z.object({
      id: z.string().optional(),
      title: z.string().min(3, {
        message: "Assessment title is required"
      }),
      questions: z.array(z.object({
        id: z.string().optional(),
        text: z.string().min(3, {
          message: "Question text is required"
        }),
        type: z.enum(["multiple_choice", "descriptive", "audio", "video"]),
        options: z.array(z.string()).optional(),
        correctOption: z.number().optional()
      }))
    })).optional()
  }))
});
const CourseCreationPage: React.FC = () => {
  const {
    orgId
  } = useParams<{
    orgId: string;
  }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
//const newSkill = useRef("");

  const [instructors, setInstructors] = useState<string[]>([]);
  const [newInstructor, setNewInstructor] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [editflag,seteditflag]=useState(false)
  const [editSubTopic,setEditsubtopic] = useState(false)
  const [fileContent, setFileContent] = useState<{
    [key: string]: string;
  }>({});
  const [currentTopicIndex, setCurrentTopicIndex] = useState<number | null>(null);
  const [currentSubtopicIndex, setCurrentSubtopicIndex] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: File;
  }>({});
  const orgDepartments = departments.filter(dept => dept.organizationId === orgId);
  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      departmentIds: [orgId ? orgDepartments[0]?.id || "" : ""],
      organizationIds: [orgId || ""],
      duration: "",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2874&q=80",
     // instructors: [],      // Must be an array
     // skills: [],  
      aiPersonaPrompt: "",
      aiAbilityPrompt: "",
      ragDocument: ""
    }
  });
  //used to store courseId needed while publishing course 
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);



  //Creating Save Button for  BasicInfo , COurse Content & 
  const [savingBasicInfo, setSavingBasicInfo] = useState(false);
  // const [savingContent, setSavingContent] = useState(false); 
  const [savingAssessments, setSavingAssessments] = useState(false);
  
const [attachmentType, setAttachmentType] = useState<"file" | "link" | null>(null);
const [attachmentFiles, setAttachmentFiles] = useState<Record<string, File[]>>({});

const [linkTitle, setLinkTitle] = useState("");
const [linkUrl, setLinkUrl] = useState("");

  
  /*
  const handleAddTopic = () => {
    const newTopic: Topic = {
      id: uuidv4(),
      title: `New Topic ${topics.length + 1}`,
      description: "",
      courseId: "",
      order: topics.length,
      subtopics: []
    };
    setTopics([...topics, newTopic]);
    setCurrentTopicIndex(topics.length);
    setCurrentSubtopicIndex(null);
    
  };
  */


 const handleAddTopic = async () => {
  if (!createdCourseId) {
    toast.error("Course ID not found. Please create the course first.");
    return;
  }

  const newTopic: Topic = {
    id: uuidv4(),
    title: `New Topic ${topics.length + 1}`,
    description: "Default description",
    courseId: createdCourseId,
    subtopics: []
  };

  setTopics([...topics, newTopic]); // add locally
  setCurrentTopicIndex(topics.length); // select the new topic
  setCurrentSubtopicIndex(null);
};

//function that call handleAddTopic() 
//const handleSaveTopic = async () => {
//  await handleAddTopic(); // delegate to your existing method
//};


const handleSaveTopic = async () => {
  if (currentTopicIndex === null) {
    toast.error("No topic selected");
    return;
  }

  const topic = topics[currentTopicIndex];

  if (!topic.title.trim()) {
    toast.error("Topic title cannot be empty");
    return;
  }

  try {
    const result = await createTopic({
      courseId: topic.courseId,
      title: topic.title,
      description: topic.description,
    });

    // response form backend when create topic endpoint is hit
    console.log("Create Topic API response:", result);

    
    if (result.success) {
      // Assuming API returns created topic ID as result.data.id or similar
      const topicIdFromBackend = result.data?.id || result.data?.topicId || null;

      if (!topicIdFromBackend) {
        toast.error("Failed to get topic ID from server");
        return;
      }
    

      
      // Update local topic with returned id
      const updatedTopics = [...topics];
      updatedTopics[currentTopicIndex] = {
        ...topic,
        id: topicIdFromBackend,
      };

      setTopics(updatedTopics);
      toast.success("Topic created successfully");
    } else {
      toast.error("Failed to create topic");
    }
  } catch (error) {
    console.error("Error saving topic:", error);
    toast.error("Failed to create topic");
  }
};



/*
  const handleTopicChange = (index: number, field: keyof Topic, value: string) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = {
      ...updatedTopics[index],
      [field]: value
    };
    setTopics(updatedTopics);
  };
*/

  //method to changeTopic name which sents data to updateTopic backend Endpoint 
  /*
  const handleTopicChange = async (index: number, field: keyof Topic, value: string) => {
  const updatedTopics = [...topics];
  const updatedTopic = {
    ...updatedTopics[index],
    [field]: value
  };

  updatedTopics[index] = updatedTopic;
  setTopics(updatedTopics);

  console.log(updatedTopics);
  console.log("Checking topic id",topics);
  try {
    await updateTopic({
      courseId: updatedTopic.courseId, // ← this is required
      topicId: updatedTopic.id,
      title: updatedTopic.title,
      description: updatedTopic.description,
    });

    toast.success("Topic updated successfully");
  } catch (error) {
    toast.error("Failed to update topic");
    console.error("Error updating topic:", error);
  }
};
*/

const handleTopicChange = (index: number, field: keyof Topic, value: string) => {
  const updatedTopics = [...topics];
  updatedTopics[index] = {
    ...updatedTopics[index],
    [field]: value,
  };
  setTopics(updatedTopics);
};


//Helper function to save handleTopicChange()
/*
const handleSaveEditTopic = async () => {
  if (currentTopicIndex === null) return;

  const topic = topics[currentTopicIndex];

  await handleTopicChange(currentTopicIndex, "title", topic.title);
  await handleTopicChange(currentTopicIndex, "description", topic.description);
};
*/

const handleSaveEditTopic = async () => {
  if (currentTopicIndex === null) return;

  const topic = topics[currentTopicIndex];

  try {
    const response = await updateTopic({
      courseId: topic.courseId,
      topicId: topic.id,
      title: topic.title,
    });

    //checking response form backend.
    console.log("Update topic response:",response);

    toast.success("Topic updated successfully");
    seteditflag(false);
  } catch (error) {
    toast.error("Failed to update topic");
    console.error("Error updating topic:", error);
  }
};


/*
  const handleAddSubtopic = (topicIndex: number) => {
    const updatedTopics = [...topics];

    console.log("updateTopic -->", updatedTopics);

    const newSubtopic: Subtopic = {
      id: uuidv4(),
      title: `New Subtopic ${updatedTopics[topicIndex].subtopics?.length + 1 || 1}`,
      description: "",
      topicId: updatedTopics[topicIndex].id || "",
      order: updatedTopics[topicIndex].subtopics?.length || 0,
      content: "",
      assessments: [],
      contentType: "text",
      videoUrl: "",
      videoName: "",
      videoFile: undefined,
      filenames: [],
      files: [],
      links: []
    };
    updatedTopics[topicIndex].subtopics = [...(updatedTopics[topicIndex].subtopics || []), newSubtopic];
    setTopics(updatedTopics);
    setCurrentTopicIndex(topicIndex);
    setCurrentSubtopicIndex(updatedTopics[topicIndex].subtopics.length - 1);
  };
  */

 const handleAddSubtopic = (topicIndex: number) => {
  const newSubtopic = {
    id: null,
    title: "",
    description: "",
    contentType: "text",
    content: "",
    videoName: "",
    videoUrl: "",
    files: [],
    links: [],
  };

  const updatedTopics = [...topics];
  updatedTopics[topicIndex].subtopics = updatedTopics[topicIndex].subtopics || [];
  updatedTopics[topicIndex].subtopics.push(newSubtopic);

  setTopics(updatedTopics);
  setCurrentTopicIndex(topicIndex);
  setCurrentSubtopicIndex(updatedTopics[topicIndex].subtopics.length - 1);
};

//Function to uplaod multiple files when contentType='file'
const handleAttachmentFileUpload = (e: React.ChangeEvent<HTMLInputElement>, topicIndex: number, subtopicIndex: number) => {
  const files = e.target.files;
  if (!files) return;

  console.log("Files selected:", files);


  // Set the attachment type
  setAttachmentType("file");

  //update subtopic state (local state) 
  const updatedTopics = [...topics];
  updatedTopics[topicIndex].subtopics[subtopicIndex].files = Array.from(files);
  setTopics(updatedTopics);

   //  update attachmentFiles map (used in API formData)
  const key = `${topicIndex}-${subtopicIndex}`;
  /*
  setAttachmentFiles(prev => ({
    ...prev,
    [key]: Array.from(files),
  }));
  */
 setAttachmentFiles(prev => {
    const updated = {
      ...prev,
      [key]: Array.from(files),
    };
    console.log(" Updated attachmentFiles:", updated);
    return updated;
  });
};



//function to upload link + URL name when contentType='link'
const handleAddLink = (topicIndex: number, subtopicIndex: number) => {
  const updatedTopics = [...topics];
  const subtopic = updatedTopics[topicIndex].subtopics[subtopicIndex];

  if (!subtopic.linkUrl || !subtopic.linkTitle) {
    toast.error("Please enter both a URL and title.");
    return;
  }

  const newLink = {
    url: subtopic.linkUrl,
    title: subtopic.linkTitle,
  };

  subtopic.links = subtopic.links ? [...subtopic.links, newLink] : [newLink];
  subtopic.linkUrl = "";
  subtopic.linkTitle = "";

  setTopics(updatedTopics);
  toast.success("Link added");
};


const handleSaveSubtopic = async (topicIndex: number, subtopicIndex: number) => {
  const topic = topics[topicIndex];
  const subtopic = topic.subtopics[subtopicIndex];

  const formData = new FormData();
  formData.append("courseId", createdCourseId);
  formData.append("topicId", topic.id);
  formData.append("title", subtopic.title);
  formData.append("description", subtopic.description);
  formData.append("contentType", subtopic.contentType);

  switch (subtopic.contentType) {
    case "text":
      formData.append("text_content", subtopic.content || "");
      break;
/*
    case "file":
      const file = uploadedFiles[`${topicIndex}-${subtopicIndex}`];
      if (!file) {
        toast.error("Please upload a file.");
        return;
      }
      formData.append("files", file);
      formData.append("filenames", JSON.stringify([{ name: file.name.replace(/\.[^/.]+$/, "") }]));
      break;
*/
    case "video":
      formData.append("videoName", subtopic.videoName || "");
      formData.append("videoUrl", subtopic.videoUrl || "");
      break;


    case "file":
      const files = attachmentFiles[`${topicIndex}-${subtopicIndex}`]; // array

      console.log(" Files being uploaded:", files);

      if (!files?.length) {
        toast.error("Please upload at least one file.");
        return;
      }
      files.forEach(file => {
        formData.append("files", file);
      });
      
      const filenames = files.map(file => ({ name: file.name.replace(/\.[^/.]+$/, "") }));
      console.log("Filenames being sent:", filenames);
      formData.append("filenames", JSON.stringify(filenames));

      break;
    case "link":
      console.log("Saveing links:",subtopic.links);
      formData.append("links", JSON.stringify(subtopic.links || []));
      break;

    default:
      toast.error("Invalid content type.");
      return;
  }

  try {

    console.log("Final FormData before upload:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    /*
    const newSubtopic = await createSubtopic(formData);
    const updatedTopics = [...topics];
    
    updatedTopics[topicIndex].subtopics[topic.subtopics.length - 1] = {
      ...subtopic,
      id: newSubtopic.id,
    };
    */

    //Since when subtopic is cretaed,complete topic object is returned with subtopic data nested in it.
    //hence extracting subtopic id from it.
    const newTopicData = await createSubtopic(formData);

    console.log("Full response from createSubtopic:", newTopicData);

    // Get the last subtopic from the response
    const createdSubtopics = newTopicData.data.subtopics;
    const lastCreatedSubtopic = createdSubtopics[createdSubtopics.length - 1];

    const updatedTopics = [...topics];
    updatedTopics[topicIndex].subtopics[subtopicIndex] = {
      ...subtopic,
      id: lastCreatedSubtopic._id, // set the real backend ID
    };


    setTopics(updatedTopics);

    //return newSubtopic;
    toast.success("Subtopic saved successfully");
  } catch (error) {
    toast.error("Failed to save subtopic");
  }
};





/*
const handleSaveSubtopic = async () => {
  if (currentTopicIndex !== null) {
    await handleAddSubtopic(currentTopicIndex);
  } else {
    toast.error("Select a topic before adding a subtopic.");
  }
};
*/





const handleSubtopicChange = (topicIndex: number, subtopicIndex: number, field: keyof Subtopic, value: string) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].subtopics[subtopicIndex] = {
      ...updatedTopics[topicIndex].subtopics[subtopicIndex],
      [field]: value
    };
    setTopics(updatedTopics);
  };


/*
const handleSubtopicChange = async (
  topicIndex: number,
  subtopicIndex: number,
  field: keyof Subtopic,
  value: string
) => {
  const updatedTopics = [...topics];
  const subtopic = updatedTopics[topicIndex].subtopics[subtopicIndex];

  // Update the local state first
  updatedTopics[topicIndex].subtopics[subtopicIndex] = {
    ...subtopic,
    [field]: value,
  };
  setTopics(updatedTopics);

  
  // Only make the API call if the field is "title"
  if (field === 'title') {
    try {
      await updateSubtopicName({
        topicId: updatedTopics[topicIndex].id,
        subtopicId: subtopic.id,
        title: value,
        description: subtopic.description || '',
        contentType: subtopic.contentType,
        filenames: subtopic.contentType === 'file' ? subtopic.filenames : undefined,
        files: undefined, // No file updates here, only name
      });
    } catch (error) {
      console.error('Failed to update subtopic name:', error);
    }
  }
  
};
*/

const handleSaveEditSubtopic = async () => {
  if (currentTopicIndex === null || currentSubtopicIndex === null) {
    toast.error("No subtopic selected to edit.");
    return;
  }

  const subtopic = topics[currentTopicIndex].subtopics[currentSubtopicIndex];

  // Only re-trigger save if needed (like for revalidation or toast)
  try {

    console.log("Updating subtopic with ID:", subtopic.id);

    await updateSubtopic({
      topicId: topics[currentTopicIndex].id,
      subtopicId: subtopic.id,
      title: subtopic.title,
      description: subtopic.description,
      contentType: subtopic.contentType,

      textContent: subtopic.contentType === 'text' ? subtopic.content : undefined,

      videoName: subtopic.contentType === 'video' ? subtopic.videoName : undefined,
      videoUrl: subtopic.contentType === 'video' ? subtopic.videoUrl : undefined,

      filenames: subtopic.contentType === 'file' ? subtopic.filenames : undefined,
      //files: undefined, // no files while editing title/description
      files: subtopic.contentType === 'file'
      ? attachmentFiles[`${currentTopicIndex}-${currentSubtopicIndex}`] || []
      : undefined,
      
      links: subtopic.contentType === 'link' ? subtopic.links : undefined,

    });
    toast.success("Subtopic updated successfully.");
  } catch (err) {
    console.error("Failed to save subtopic edit:", err);
    toast.error("Failed to save subtopic changes.");
  }
};


/*
  const handleDeleteTopic = (topicIndex: number) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(topicIndex, 1);
    setTopics(updatedTopics);
    setCurrentTopicIndex(null);
    setCurrentSubtopicIndex(null);
  };
*/

const handleDeleteTopic = async (topicIndex: number) => {
  const topicToDelete = topics[topicIndex];
  if (!topicToDelete || !topicToDelete.id) return;

  try {
    // Make the API call to delete the topic
    await deleteTopic({
      courseId: createdCourseId,         // make sure courseId is in scope
      topicId: topicToDelete.id,
    });

    // Update state only after successful deletion
    const updatedTopics = [...topics];
    updatedTopics.splice(topicIndex, 1);
    setTopics(updatedTopics);
    setCurrentTopicIndex(null);
    setCurrentSubtopicIndex(null);
  } catch (error) {
    console.error("Error deleting topic:", error);
  }
};

  const handleEditTopic = () =>{
    seteditflag(true);    
  }

  /*
  const handleDeleteSubtopic = (topicIndex: number, subtopicIndex: number) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].subtopics.splice(subtopicIndex, 1);
    setTopics(updatedTopics);
    setCurrentSubtopicIndex(null);
  };
  */

  const handleDeleteSubtopic = async (topicIndex: number, subtopicIndex: number) => {
  const topic = topics[topicIndex];
  const subtopic = topic.subtopics[subtopicIndex];

  try {
    // Call API to delete the subtopic from backend
    await deleteSubtopic({
      topicId: topic.id,
      subtopicId: subtopic.id,
    });

    // If successful, update UI state by removing subtopic locally
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].subtopics.splice(subtopicIndex, 1);
    setTopics(updatedTopics);
    setCurrentSubtopicIndex(null);

    toast.success("Subtopic deleted successfully");
  } catch (error) {
    console.error("Failed to delete subtopic:", error);
    toast.error("Failed to delete subtopic");
  }
};

  const handleAddAssessment = (topicIndex: number, subtopicIndex: number) => {
    const updatedTopics = [...topics];
    const newAssessment: Assessment = {
      id: uuidv4(),
      title: `Assessment for ${updatedTopics[topicIndex].subtopics[subtopicIndex].title}`,
      subtopicId: updatedTopics[topicIndex].subtopics[subtopicIndex].id || "",
      questions: []
    };
    updatedTopics[topicIndex].subtopics[subtopicIndex].assessments = [...(updatedTopics[topicIndex].subtopics[subtopicIndex].assessments || []), newAssessment];
    setTopics(updatedTopics);
  };

//function to update assessment title
const handleAutoSaveAssessmentTitle = async (topicIndex: number, subtopicIndex: number, assessmentIndex: number) => {
  const assessment = topics[topicIndex].subtopics[subtopicIndex].assessments[assessmentIndex];

  try {
    // Replace this with your actual save function or API call
    await saveAssessmentTitleToServer(assessment); // Example async function

    toast.success("Assessment name updated successfully");
  } catch (error) {
    toast.error("Failed to update assessment name");
    console.error("Error updating assessment name:", error);
  }
};
//This is where you’d call your backend to persist the updated title:

const saveAssessmentTitleToServer = async (assessment: any) => {
  // Example: await axios.put(`/api/assessments/${assessment.id}`, { title: assessment.title });
  return new Promise(resolve => setTimeout(resolve, 500)); // Simulated delay
};



//Added this to delete the assessments if needed.
  const handleDeleteAssessment = (topicIndex, subtopicIndex, assessmentIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].subtopics[subtopicIndex].assessments.splice(assessmentIndex, 1);
    setTopics(updatedTopics);
  };


  const handleAddQuestion = (topicIndex: number, subtopicIndex: number, assessmentIndex: number) => {
    const updatedTopics = [...topics];
    const newQuestion: Question = {
      id: uuidv4(),
      text: "New question",
      type: "multiple_choice",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctOption: 0
    };
    const assessments = updatedTopics[topicIndex].subtopics[subtopicIndex].assessments || [];
    if (assessments[assessmentIndex]) {
      assessments[assessmentIndex].questions = [...assessments[assessmentIndex].questions, newQuestion];
    }
    setTopics(updatedTopics);
  };
  const handleQuestionChange = (topicIndex: number, subtopicIndex: number, assessmentIndex: number, questionIndex: number, field: keyof Question, value: any) => {
    const updatedTopics = [...topics];
    const assessments = updatedTopics[topicIndex].subtopics[subtopicIndex].assessments || [];
    if (assessments[assessmentIndex] && assessments[assessmentIndex].questions[questionIndex]) {
      assessments[assessmentIndex].questions[questionIndex] = {
        ...assessments[assessmentIndex].questions[questionIndex],
        [field]: value
      };
    }
    setTopics(updatedTopics);
  };
  const handleOptionChange = (topicIndex: number, subtopicIndex: number, assessmentIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    const updatedTopics = [...topics];
    const assessments = updatedTopics[topicIndex].subtopics[subtopicIndex].assessments || [];
    if (assessments[assessmentIndex] && assessments[assessmentIndex].questions[questionIndex]) {
      const options = [...(assessments[assessmentIndex].questions[questionIndex].options || [])];
      options[optionIndex] = value;
      assessments[assessmentIndex].questions[questionIndex].options = options;
    }
    setTopics(updatedTopics);
  };
  const handleFileUpload = (topicIndex: number, subtopicIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      const key = `${topicIndex}-${subtopicIndex}`;
      setFileContent({
        ...fileContent,
        [key]: content
      });

      // Update subtopic content
      const updatedTopics = [...topics];
      updatedTopics[topicIndex].subtopics[subtopicIndex].content = content;
      setTopics(updatedTopics);
    };
    reader.readAsText(file);

    // Store the file reference
    setUploadedFiles({
      ...uploadedFiles,
      [`${topicIndex}-${subtopicIndex}`]: file
    });
  };
  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  const addInstructor = () => {
    if (newInstructor && !instructors.includes(newInstructor)) {
      setInstructors([...instructors, newInstructor]);
      setNewInstructor("");
    }
  };
  const removeInstructor = (instructorToRemove: string) => {
    setInstructors(instructors.filter(instructor => instructor !== instructorToRemove));
  };
  
  
  function onSubmit(values: z.infer<typeof courseFormSchema>) {
    // Create a new course
    const newCourse: Course = {
      id: (courses.length + 1).toString(),
      title: values.title,
      description: values.description,
      departmentIds: values.departmentIds,
      organizationIds: values.organizationIds,
      createdAt: new Date().toISOString(),
      publishedAt: null,
      topicCount: topics.length,
      enrollmentCount: 0,
      progress: 0,
      duration: values.duration || "Not specified",
      image: values.image,
      skills: skills,
      instructors: instructors,
      aiPersonaPrompt: values.aiPersonaPrompt,
      aiAbilityPrompt: values.aiAbilityPrompt,
      ragDocument: values.ragDocument,
      topics: topics,
      isPublished: false
    };

    // In a real app, we would save this course to a database
    // For now, we'll just simulate success
    toast.success("Course created successfully!", {
      description: "Your new course has been created."
    });

    // Navigate to the organization dashboard
    navigate(`/organization/${orgId}`);
  }


  /* THIS ,METHOD IS DOES NOT SENT DATA TO REAL BACKEND , JUST CREATING A NEW OBJECT MEMORY 
  const handlePublish = () => {
    if (form.formState.isValid) {
      const values = form.getValues();
      // Create a new course
      const newCourse: Course = {
        id: (courses.length + 1).toString(),
        title: values.title,
        description: values.description,
        departmentIds: values.departmentIds,
        organizationIds: values.organizationIds,
        createdAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        topicCount: topics.length,
        enrollmentCount: 0,
        progress: 0,
        duration: values.duration || "Not specified",
        image: values.image,
        skillsTaught: skills,
        instructors: instructors,
        aiPersonaPrompt: values.aiPersonaPrompt,
        aiAbilityPrompt: values.aiAbilityPrompt,
        ragDocument: values.ragDocument,
        topics: topics,
        isPublished: true
      };
      toast.success("Course published successfully!", {
        description: "Your course is now available to the selected organizations and departments."
      });
      navigate(`/organization/${orgId}`);
    } else {
      toast.error("Validation failed", {
        description: "Please complete all required fields before publishing."
      });
      form.trigger();
    }
  };
*/  

/*
  const handlePublish = async () => {
  if (form.formState.isValid) {
    const values = form.getValues();
    try {
      console.log("Form values:", values);

      await publishCourse(values.courseId, values.organizationIds, values.departmentIds);
      toast.success("Course published successfully!");
      navigate(`/organization/${orgId}`);
    } catch (error) {
      toast.error("Failed to publish course");
    }
  } else {
    toast.error("Validation failed");
    form.trigger();
  }
}
*/

const handlePublish = async () => {
  const values = form.getValues();

  if (!createdCourseId) {
    toast.error("Course ID not found. Please save the course first.");
    return;
  }

  const orgId = values.organizationIds?.[0];
  const deptIds = values.departmentIds || [];

  if (!orgId || deptIds.length === 0) {
    toast.error("Please select organization and departments before publishing.");
    return;
  }

  try {
    await publishCourse(createdCourseId, orgId, deptIds);
    toast.success("Course published successfully!");
    navigate(`/organization/${orgId}`);
  } catch (error) {
    toast.error("Failed to publish course");
    console.error(error);
  }
};



  const handleSaveBasicInfo = async () => {
    // Validate basic info before saving
    const values = form.getValues();
    
    // Check if any required field is empty
    if (!values.title || values.title.trim() === '') {
      toast.error('Changes not saved. Please enter a course title');
      return;
    }

    if (!values.description || values.description.trim() === '') {
      toast.error('Changes not saved. Please enter a course description');
      return;
    }
/*
    if (!values.departmentIds || values.departmentIds.length === 0) {
      toast.error('Changes not saved. Please select at least one department');
      return;
    }

    if (!values.organizationIds || values.organizationIds.length === 0) {
      toast.error('Changes not saved. Please select at least one organization');
      return;
    }
*/
    if (!values.duration || values.duration.trim() === '') {
      toast.error('Changes not saved. Please specify the course duration');
      return;
    }

    if (!values.image || values.image.trim() === '') {
      toast.error('Changes not saved. Please provide a course image URL');
      return;
    }

    // Additional validation for skills and instructors
    if (!skills.length) {
      toast.error('Changes not saved. Please add at least one skill');
      return;
    }

    if (!instructors.length) {
      toast.error('Changes not saved. Please add at least one instructor');
      return;
    }

    /* Trigger form validation
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Changes not saved. Please fill in all required fields correctly');
      return;
    }
    */

    setSavingBasicInfo(true);
    try {
      const basicInfo = {
        title: values.title,
        description: values.description,
       //departmentIds: values.departmentIds,
        //organizationIds: values.organizationIds,
        duration: values.duration,
        image_url: values.image, //renamed image to image_url
        skills: skills, //renamed skillsTaught to skills due to postmen
        instructors: instructors,
        ai_settings: {
        persona_prompt: values.aiPersonaPrompt,
        ability_prompt: values.aiAbilityPrompt,
      },
      };
      
      //const result = await courseService.saveBasicInfo(null, basicInfo);
       const result = await createCourse(basicInfo);

        const courseId = result?.course?._id || result?.courseId;
        if (courseId) {
          setCreatedCourseId(courseId); 
        }

        toast.success('Basic information saved successfully!');
      
    } catch (error) {
      console.error('Error saving basic info:', error);
      toast.error('Changes not saved. An error occurred while saving');
    } finally {
      setSavingBasicInfo(false);
    }
  };

  /*
  const handleSaveContent = async () => {
    // Validate if there are any topics to save
    if (topics.length === 0) {
      toast.error('Please add at least one topic');
      return;
    }

    setSavingContent(true);
    try {
      const result = await courseService.saveContent(null, { topics });
      if (result.success) {
        toast.success('Course content saved successfully!');
      } else {
        toast.error('Failed to save course content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save course content');
    } finally {
      setSavingContent(false);
    }
  };
*/
  const handleSaveAssessments = async () => {
    // Validate if there are any assessments to save
    const assessments = topics.flatMap(topic => 
      topic.subtopics.flatMap(subtopic => 
        subtopic.assessments || []
      )
    );

    if (assessments.length === 0) {
      toast.error('Please add at least one assessment');
      return;
    }

    setSavingAssessments(true);
    try {
      const result = await courseService.saveAssessments(null, assessments);
      if (result.success) {
        toast.success('Assessments saved successfully!');
      } else {
        toast.error('Failed to save assessments');
      }
    } catch (error) {
      console.error('Error saving assessments:', error);
      toast.error('Failed to save assessments');
    } finally {
      setSavingAssessments(false);
    }
  };



  /* my defined function to update topic name
  const handleSaveEditTopic = async () => {
    try {
      const result = await courseService.saveContent(null, { topics });
      if (result.success) {
        toast.success('Topic updated successfully!');
        seteditflag(false);
      } else {
        toast.error('Failed to update topic');
      }
    } catch (error) {
      console.error('Error updating topic:', error);
      toast.error('Failed to update topic');
    }
  };


const handleSaveTopic = async () => {
  try {
    if (!createdCourseId) {
      toast.error("Course ID not found. Please create the course first.");
      return;
    }

    const topic = topics[currentTopicIndex];

    ///calling to API call defintion that sents request to backend.
    const result = await createTopic({
      courseId: createdCourseId,
      title: topic.title,
      description: topic.description,
      order: currentTopicIndex, // optional, if your backend needs it
    });

    if (result.success) {
      toast.success("Topic saved successfully!");
    } else {
      toast.error("Failed to save topic");
    }
  } catch (error) {
    console.error("Error saving topic:", error);
    toast.error("Failed to save topic");
  }
};


  const handleSaveEditSubtopic = async () => {
    try {
      const result = await courseService.saveContent(null, { topics });
      if (result.success) {
        toast.success('Subtopic updated successfully!');
        setEditsubtopic(false);
      } else {
        toast.error('Failed to update subtopic');
      }
    } catch (error) {
      console.error('Error updating subtopic:', error);
      toast.error('Failed to update subtopic');
    }
  };

  const handleSaveSubtopic = async () => {
    try {
      const result = await courseService.saveContent(null, { topics });
      if (result.success) {
        toast.success('Subtopic saved successfully!');
      } else {
        toast.error('Failed to save subtopic');
      }
    } catch (error) {
      console.error('Error saving subtopic:', error);
      toast.error('Failed to save subtopic');
    }
  };
*/


  return <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" asChild className="h-10 w-10 rounded-full">
              <button onClick={() => navigate(`/organization/${orgId}`)}>
                <ChevronLeft className="h-5 w-5" />
              </button>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create New Course</h1>
              <p className="text-sm text-gray-500">Build your course structure, content, and assessments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 md:w-auto w-full mb-8">
            <TabsTrigger value="basic" className="gap-2">
              <BookOpen className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="assessments" className="gap-2">
              <CheckSquare className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Assessments</span>
            </TabsTrigger>
            <TabsTrigger value="publish" className="gap-2">
              <BookMarked className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Publish</span>
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Course Information</CardTitle>
                      <CardDescription>Basic information about the course</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField control={form.control} name="title" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Course Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Introduction to Web Development" {...field} />
                          </FormControl>
                          <FormDescription>
                            The title of your course as it will appear to learners.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="description" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Course Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe what your course is about and what learners will gain from it..." {...field} className="min-h-[100px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    
                    <FormField control={form.control} name="duration" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input placeholder="e.g. 6 weeks, 3 months" {...field} />
                              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Estimated time to complete this course.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>} />

                    <div>
     
                      <FormLabel>Skills Thaught</FormLabel>
                      <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
                        {skills.map((skill, index) => <Badge key={index} variant="outline" className="pl-3 h-8">
                            {skill}
                            <button type="button" className="ml-2 rounded-full hover:bg-gray-200 p-1" onClick={() => removeSkill(skill)}>
                              <span className="sr-only">Remove {skill}</span>
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>)}
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }} />
                        <Button type="button" size="sm" onClick={addSkill} variant="outline">
                          <Award className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    
                    </div>

                    <div>
                      <FormLabel>Instructors</FormLabel>
                      <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
                        {instructors.map((instructor, index) => <Badge key={index} variant="outline" className="pl-3 h-8">
                            {instructor}
                            <button type="button" className="ml-2 rounded-full hover:bg-gray-200 p-1" onClick={() => removeInstructor(instructor)}>
                              <span className="sr-only">Remove {instructor}</span>
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>)}
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Add an instructor..." value={newInstructor} onChange={e => setNewInstructor(e.target.value)} onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addInstructor();
                        }
                      }} />
                        <Button type="button" size="sm" onClick={addInstructor} variant="outline">
                          <Users className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <FormField control={form.control} name="image" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Course Image</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input placeholder="Enter image URL..." {...field} />
                              <div className="h-24 w-24 absolute right-2 top-1/2 transform -translate-y-1/2 border rounded overflow-hidden">
                                {field.value ? <img src={field.value} alt="Course" className="h-full w-full object-cover" /> : <div className="flex items-center justify-center h-full bg-gray-100">
                                    <BookOpen className="h-6 w-6 text-gray-400" />
                                  </div>}
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            URL of an image to represent your course.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>} />
                  </CardContent>
                  
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Assistance</CardTitle>
                    <CardDescription>Configure AI to assist with this course</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField control={form.control} name="aiPersonaPrompt" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>AI Persona Prompt</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g. You are an experienced web development instructor with 10+ years of industry experience." {...field} className="min-h-[100px]" />
                          </FormControl>
                          <FormDescription>
                            Define the persona that the AI will adopt when interacting with learners.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="aiAbilityPrompt" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>AI Ability Prompt</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g. You specialize in explaining complex programming concepts in an approachable way with real-world examples." {...field} className="min-h-[100px]" />
                          </FormControl>
                          <FormDescription>
                            Define what the AI is particularly good at in the context of this course.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="ragDocument" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Knowledge Base (RAG) Document</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste your knowledge base content here, or provide a document URL..." {...field} className="min-h-[100px]" />
                          </FormControl>
                          <FormDescription>
                            Provide a knowledge base for the AI to reference when answering questions.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>} />
                  </CardContent>
                </Card>


                    <div className="flex justify-end pt-6">        
                    <SaveButton
                        onSave={handleSaveBasicInfo}
                        type="basic"
                        isLoading={savingBasicInfo}
                      />
                    </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Course Content</CardTitle>
                      <CardDescription>Add topics and subtopics to your course</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-1 border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b font-medium flex items-center">
                          <span>Course Structure</span>
                          <Badge className="ml-2 bg-brand-600">{topics.length} topics</Badge>
                        </div>
                        <ScrollArea className="h-[500px] p-3">
                          {topics.length === 0 ? <div className="text-center py-8 text-gray-500">
                              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                              <p>No topics yet</p>
                              <p className="text-sm">Start by adding your first topic</p>
                            </div> : <div className="space-y-2">
                              {topics.map((topic, topicIndex) => <Collapsible key={topic.id || topicIndex} open={currentTopicIndex === topicIndex} onOpenChange={open => open ? setCurrentTopicIndex(topicIndex) : null} className="border rounded-md overflow-hidden">
                                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-gray-50 hover:bg-gray-100">
                                    <div className="font-medium truncate">{topic.title}</div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                      <Badge variant="outline" className="mr-2">
                                        {topic.subtopics?.length || 0} subtopics
                                      </Badge>
                                      <ChevronDown className="h-4 w-4" />
                                    </div>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="p-3 space-y-3 bg-white">
                                      <div className="space-y-2">
                                        <Button type="button" size="sm" variant="outline" className="w-full" onClick={() => handleAddSubtopic(topicIndex)}>
                                          <PlusCircle className="h-4 w-4 mr-2" />
                                          Add Subtopic
                                        </Button>
                                        
                                        {topic.subtopics?.map((subtopic, subtopicIndex) => <div key={subtopic.id || subtopicIndex} className={`p-2 rounded-md text-sm cursor-pointer ${currentSubtopicIndex === subtopicIndex && currentTopicIndex === topicIndex ? 'bg-brand-50 border border-brand-200' : 'hover:bg-gray-50'}`} onClick={() => {
                                    setCurrentTopicIndex(topicIndex);
                                    setCurrentSubtopicIndex(subtopicIndex);
                                  }}>
                                            {subtopic.title}
                                          </div>)}
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>)}
                            </div>}
                        </ScrollArea>
                      </div>

                      <div className="lg:col-span-2">
                        {currentTopicIndex !== null ? <div className="space-y-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Topic Details</h3>
                                <div className=" flex flex-row gap-2" >
                                  <span onClick={ ()=> handleEditTopic()}>
                                    <Edit className="h-6 w-6 mr-2"/>
                                  </span>
                                  <span onClick={() => handleDeleteTopic(currentTopicIndex)} >

                                <Trash2 className="h-6 w-6 mr-2" />
                                  </span>
                                </div>
                                {/* <Button type="button" size="sm" variant="destructive" onClick={() => handleDeleteTopic(currentTopicIndex)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Topic
                                </Button> */}
                              </div>
                              
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Topic Title</label>
                                  <Input value={topics[currentTopicIndex]?.title || ''} onChange={e => handleTopicChange(currentTopicIndex, 'title', e.target.value)} placeholder="Enter topic title"  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Topic Description</label>
                                  <Textarea value={topics[currentTopicIndex]?.description || ''} onChange={e => handleTopicChange(currentTopicIndex, 'description', e.target.value)} placeholder="Enter topic description" rows={3} />
                                </div>
                              </div>
                              {
                                editflag ? (
                                  <div>
                                    <Button variant="secondary" onClick={() => seteditflag(false)}>
                                      Cancel
                                    </Button>
                                    <SaveButton
                                      type="EditTopic"
                                      onSave={handleSaveEditTopic}
                                      
                                    />
                                  </div>
                                ) : (
                                  <SaveButton
                                    type="Topic"
                                    onSave={handleSaveTopic}
                                  />
                                )
                              }
                              {/* <SaveButton type="Topic"/> */}
                            </div>

                            {currentSubtopicIndex !== null && <div className="space-y-4 border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-medium">Subtopic Details</h3>
                                  <div className=" flex flex-row gap-2" >
                                  <span onClick={ ()=> setEditsubtopic(true)}>
                                    <Edit className="h-6 w-6 mr-2"/>
                                  </span>
                                  <span onClick={() => handleDeleteSubtopic(currentTopicIndex, currentSubtopicIndex) } >

                                <Trash2 className="h-6 w-6 mr-2" />
                                  </span>
                                </div>
                                  {/* <Button type="button" size="sm" variant="destructive" onClick={() => handleDeleteSubtopic(currentTopicIndex, currentSubtopicIndex)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Subtopic
                                  </Button> */}
                                </div>
                                
                                <div className="grid gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Subtopic Title</label>
                                    <Input value={topics[currentTopicIndex]?.subtopics[currentSubtopicIndex]?.title || ''} onChange={e => handleSubtopicChange(currentTopicIndex, currentSubtopicIndex, 'title', e.target.value)} placeholder="Enter subtopic title" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Subtopic Description</label>
                                    <Textarea value={topics[currentTopicIndex]?.subtopics[currentSubtopicIndex]?.description || ''} onChange={e => handleSubtopicChange(currentTopicIndex, currentSubtopicIndex, 'description', e.target.value)} placeholder="Enter subtopic description" rows={3} />
                                  </div>

                                {/*  <Tabs defaultValue="text" className="w-full"> */}
                                <Tabs
                                    value={topics[currentTopicIndex]?.subtopics[currentSubtopicIndex]?.contentType || "text"}
                                    onValueChange={(value) =>
                                      handleSubtopicChange(currentTopicIndex, currentSubtopicIndex, "contentType", value)
                                    }
                                    className="w-full"
                                  >

                                    <TabsList className="grid grid-cols-4 mb-4">
                                      <TabsTrigger value="text">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Text Content
                                      </TabsTrigger>
                                      <TabsTrigger value="video">
                                        <Video className="h-4 w-4 mr-2" />
                                        Video
                                      </TabsTrigger>
                                      {/*
                                      <TabsTrigger value="attachment">
                                        <File className="h-4 w-4 mr-2" />
                                        Files/Links
                                      </TabsTrigger>
                                      */}
                                      <TabsTrigger value="file">
                                        <File className="h-4 w-4 mr-2" />
                                        Files
                                      </TabsTrigger>

                                      <TabsTrigger value="link">
                                        <LinkIcon className="h-4 w-4 mr-2" />
                                        Links
                                      </TabsTrigger>

                                    </TabsList>

                                    <TabsContent value="text" className="space-y-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Text Content</label>
                                        <Textarea value={topics[currentTopicIndex]?.subtopics[currentSubtopicIndex]?.content || ''} onChange={e => handleSubtopicChange(currentTopicIndex, currentSubtopicIndex, 'content', e.target.value)} placeholder="Enter subtopic content or upload a file" rows={10} />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Upload Text File</label>
                                        <div className="flex items-center gap-2">
                                          <Input type="file" accept=".txt" onChange={e => handleFileUpload(currentTopicIndex, currentSubtopicIndex, e)} className="flex-1" />
                                          {uploadedFiles[`${currentTopicIndex}-${currentSubtopicIndex}`] && <Badge variant="outline">
                                              {uploadedFiles[`${currentTopicIndex}-${currentSubtopicIndex}`].name}
                                            </Badge>}
                                        </div>
                                      </div>
                                    </TabsContent>

<TabsContent value="video">
  <div className="space-y-2">
    <label className="text-sm font-medium">Video Name</label>
    <Input
      value={topics[currentTopicIndex]?.subtopics[currentSubtopicIndex]?.videoName || ""}
      onChange={(e) =>
        handleSubtopicChange(currentTopicIndex, currentSubtopicIndex, "videoName", e.target.value)
      }
      placeholder="Enter video name"
    />
    <label className="text-sm font-medium">Video URL</label>
    <Input
      value={topics[currentTopicIndex]?.subtopics[currentSubtopicIndex]?.videoUrl || ""}
      onChange={(e) =>
        handleSubtopicChange(currentTopicIndex, currentSubtopicIndex, "videoUrl", e.target.value)
      }
      placeholder="Enter video URL"
    />
  </div>
</TabsContent>


{/*
                                    <TabsContent value="attachment" className="space-y-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Attachments</label>
                                        <div className="p-4 border border-dashed rounded-md flex flex-col items-center justify-center space-y-2">
                                          <Upload className="h-8 w-8 text-gray-400" />
                                          <p className="text-sm text-gray-500">Drag and drop files here, or click to browse</p>
                                          <Input type="file" className="max-w-xs" multiple onChange={(e) => handleAttachmentFileUpload(e, currentTopicIndex, currentSubtopicIndex)}/>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Add Link</label>
                                        <div className="flex gap-2">
                                          <Input placeholder="Enter URL..." />
                                          <Input placeholder="Link title..." className="max-w-[30%]" />
                                          <Button type="button" size="sm" variant="outline">
                                            <LinkIcon className="h-4 w-4 mr-2" />
                                            Add
                                          </Button>
                                        </div>
                                      </div>
                                    </TabsContent>
                                  */}

                                  {/*For contentType='file'*/}
                                  <TabsContent value="file" className="space-y-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Upload Files</label>
                                      <div className="p-4 border border-dashed rounded-md flex flex-col items-center justify-center space-y-2">
                                        <Upload className="h-8 w-8 text-gray-400" />
                                        <p className="text-sm text-gray-500">Drag and drop files here, or click to browse</p>
                                        <Input
                                          type="file"
                                          className="max-w-xs"
                                          multiple
                                          onChange={(e) => handleAttachmentFileUpload(e, currentTopicIndex, currentSubtopicIndex)}
                                        />
                                      </div>
                                    </div>
                                  </TabsContent>

                                  {/*for contentType='link'*/}
                                  <TabsContent value="link" className="space-y-4">
                                    
                                      <label className="text-sm font-medium">Add Link</label>
                                      <div className="flex gap-2">
                                        <Input
                                          placeholder="Enter URL..."
                                          value={topics[currentTopicIndex]?.subtopics[currentSubtopicIndex]?.linkUrl || ""}
                                          onChange={(e) =>
                                            handleSubtopicChange(currentTopicIndex, currentSubtopicIndex, "linkUrl", e.target.value)
                                          }
                                        />
                                        <Input
                                          placeholder="Link title..."
                                          value={topics[currentTopicIndex]?.subtopics[currentSubtopicIndex]?.linkTitle || ""}
                                          onChange={(e) =>
                                            handleSubtopicChange(currentTopicIndex, currentSubtopicIndex, "linkTitle", e.target.value)
                                          }
                                          className="max-w-[30%]"
                                        />
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleAddLink(currentTopicIndex, currentSubtopicIndex)}
                                        >
                                          <LinkIcon className="h-4 w-4 mr-2" />
                                          Add
                                        </Button>
                                      </div>
                                    
                                  </TabsContent>

                                  </Tabs>
                                </div>
                                {
                                editSubTopic ? (
                                  <div>
                                    <Button variant="secondary" onClick={() => setEditsubtopic(false)}>
                                      Cancel
                                    </Button>
                                    <SaveButton
                                      type="EditSubTopic"
                                      onSave={handleSaveEditSubtopic}
                                    />
                                  </div>
                                ) : (
                                  <SaveButton
                                    type="SubTopic"
                                    onSave={() => handleSaveSubtopic(currentTopicIndex,currentSubtopicIndex)}
                                  />
                                )
                              }
                              </div>}
                          </div> : <div className="flex flex-col items-center justify-center h-full min-h-[400px] border rounded-lg p-6">
                            <FileText className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-medium mb-2">No topic selected</h3>
                            <p className="text-gray-500 text-center mb-6">
                              Create a new topic or select an existing one to start building your course content.
                            </p>
                            <Button onClick={handleAddTopic}>
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Create New Topic
                            </Button>
                          </div>}
                      </div>
                    </div>
                  </CardContent>
                  
                </Card>
              </TabsContent>

              <TabsContent value="assessments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Course Assessments</CardTitle>
                      <CardDescription>Create assessments for each subtopic</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-1 border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b font-medium">
                          Course Topics & Subtopics
                        </div>
                        <ScrollArea className="h-[600px]">
                          <div className="p-3 space-y-2">
                            {topics.length === 0 ? <div className="text-center py-8 text-gray-500">
                                <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                <p>No topics available</p>
                                <p className="text-sm">Add topics in the Content tab first</p>
                              </div> : topics.map((topic, topicIndex) => <Accordion key={topic.id || topicIndex} type="single" collapsible className="border rounded-md overflow-hidden">
                                  <AccordionItem value={`topic-${topicIndex}`} className="border-0">
                                    <AccordionTrigger className="px-3 py-2 hover:bg-gray-50">
                                      <div className="font-medium">{topic.title}</div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-0">
                                      <div className="space-y-1 pl-2">
                                        {topic.subtopics?.length > 0 ? topic.subtopics.map((subtopic, subtopicIndex) => <div key={subtopic.id || subtopicIndex} className="flex items-center justify-between p-2 text-sm hover:bg-gray-50 rounded cursor-pointer" onClick={() => {
                                    setCurrentTopicIndex(topicIndex);
                                    setCurrentSubtopicIndex(subtopicIndex);
                                  }}>
                                              <span>{subtopic.title}</span>
                                              <Badge variant="outline" className="text-xs">
                                                {subtopic.assessments?.length || 0} assessments
                                              </Badge>
                                            </div>) : <div className="p-2 text-sm text-gray-500">
                                            No subtopics in this topic
                                          </div>}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>)}
                          </div>
                        </ScrollArea>
                      </div>

                      <div className="lg:col-span-2">
                        {currentTopicIndex !== null && currentSubtopicIndex !== null ? <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-medium">
                                  Assessments for "{topics[currentTopicIndex]?.subtopics[currentSubtopicIndex]?.title}"
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Topic: {topics[currentTopicIndex]?.title}
                                </p>
                              </div>
                              <Button type="button" onClick={() => handleAddAssessment(currentTopicIndex, currentSubtopicIndex)}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Assessment
                              </Button>
                            </div>

                            {topics[currentTopicIndex]?.subtopics[currentSubtopicIndex]?.assessments?.length > 0 ? <div className="space-y-6">
                                {topics[currentTopicIndex].subtopics[currentSubtopicIndex].assessments.map((assessment, assessmentIndex) => <Card key={assessment.id || assessmentIndex}>
                                    <CardHeader className="py-3">
                                      <div className="flex items-center justify-between">
                                     {/*   
                                        <CardTitle className="text-lg">
                                          <Input value={assessment.title} onChange={e => {
                                    const updatedTopics = [...topics];
                                    updatedTopics[currentTopicIndex].subtopics[currentSubtopicIndex].assessments[assessmentIndex].title = e.target.value;
                                    setTopics(updatedTopics);
                                  }} className="max-w-md" />
                                        </CardTitle>
                                      */}

                                      {/*Auto Save For Assessment nmae*/}
                                      <CardTitle className="text-lg">
                                      <Input
                                        value={assessment.title}
                                        onChange={e => {
                                          const updatedTopics = [...topics];
                                          updatedTopics[currentTopicIndex].subtopics[currentSubtopicIndex].assessments[assessmentIndex].title = e.target.value;
                                          setTopics(updatedTopics);
                                        }}
                                       onBlur={() => {
                                          handleAutoSaveAssessmentTitle(currentTopicIndex, currentSubtopicIndex, assessmentIndex);
                                        }}
                                        className="max-w-md"
                                      />
                                    </CardTitle>


                                        <Button type="button" size="sm" variant="outline" onClick={() => handleAddQuestion(currentTopicIndex, currentSubtopicIndex, assessmentIndex)}>
                                          <PlusCircle className="h-4 w-4 mr-2" />
                                          Add Question
                                        </Button>


                                        <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-600 hover:bg-red-50"
                                        onClick={() => handleDeleteAssessment(currentTopicIndex, currentSubtopicIndex, assessmentIndex)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                      </Button>

                                      </div>
                                    </CardHeader>
                                    <CardContent className="pb-3">
                                      {assessment.questions.length === 0 ? <div className="text-center py-8 bg-gray-50 rounded-md">
                                          <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                          <p className="text-gray-500">No questions added yet</p>
                                          <Button type="button" size="sm" className="mt-4" onClick={() => handleAddQuestion(currentTopicIndex, currentSubtopicIndex, assessmentIndex)}>
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Add First Question
                                          </Button>
                                        </div> : <div className="space-y-6">
                                          {assessment.questions.map((question, questionIndex) => <div key={question.id || questionIndex} className="p-4 border rounded-md">
                                              <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1 space-y-2">
                                                  <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm bg-gray-100 px-2 py-1 rounded">Q{questionIndex + 1}</span>
                                                    <Input value={question.text} onChange={e => handleQuestionChange(currentTopicIndex, currentSubtopicIndex, assessmentIndex, questionIndex, 'text', e.target.value)} placeholder="Question text" className="flex-1" />
                                                  </div>
                                                  <Select value={question.type} onValueChange={value => handleQuestionChange(currentTopicIndex, currentSubtopicIndex, assessmentIndex, questionIndex, 'type', value)}>
                                                    <SelectTrigger className="w-[200px]">
                                                      <SelectValue placeholder="Question type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                                      <SelectItem value="descriptive">Descriptive</SelectItem>
                                                      <SelectItem value="audio">Audio</SelectItem>
                                                      <SelectItem value="video">Video</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <Button type="button" size="sm" variant="ghost" onClick={() => {
                                      const updatedTopics = [...topics];
                                      updatedTopics[currentTopicIndex].subtopics[currentSubtopicIndex].assessments[assessmentIndex].questions.splice(questionIndex, 1);
                                      setTopics(updatedTopics);
                                    }}>
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>

                                              {question.type === 'multiple_choice' && <div className="pl-7 space-y-3">
                                                  <p className="text-sm font-medium">Options</p>
                                                  {question.options?.map((option, optionIndex) => <div key={optionIndex} className="flex items-center gap-3">
                                                      <RadioGroup value={question.correctOption?.toString()} onValueChange={value => handleQuestionChange(currentTopicIndex, currentSubtopicIndex, assessmentIndex, questionIndex, 'correctOption', parseInt(value))} className="flex items-center">
                                                        <RadioGroupItem value={optionIndex.toString()} />
                                                      </RadioGroup>
                                                      <Input value={option} onChange={e => handleOptionChange(currentTopicIndex, currentSubtopicIndex, assessmentIndex, questionIndex, optionIndex, e.target.value)} placeholder={`Option ${optionIndex + 1}`} className="flex-1" />
                                                      <Button type="button" size="sm" variant="ghost" onClick={() => {
                                        const updatedTopics = [...topics];
                                        const options = [...(updatedTopics[currentTopicIndex].subtopics[currentSubtopicIndex].assessments[assessmentIndex].questions[questionIndex].options || [])];
                                        options.splice(optionIndex, 1);
                                        updatedTopics[currentTopicIndex].subtopics[currentSubtopicIndex].assessments[assessmentIndex].questions[questionIndex].options = options;
                                        setTopics(updatedTopics);
                                      }}>
                                                        <Trash2 className="h-4 w-4" />
                                                      </Button>
                                                    </div>)}
                                                  <Button type="button" size="sm" variant="outline" onClick={() => {
                                      const updatedTopics = [...topics];
                                      const options = [...(updatedTopics[currentTopicIndex].subtopics[currentSubtopicIndex].assessments[assessmentIndex].questions[questionIndex].options || [])];
                                      options.push(`Option ${options.length + 1}`);
                                      updatedTopics[currentTopicIndex].subtopics[currentSubtopicIndex].assessments[assessmentIndex].questions[questionIndex].options = options;
                                      setTopics(updatedTopics);
                                    }}>
                                                    <PlusCircle className="h-4 w-4 mr-2" />
                                                    Add Option
                                                  </Button>
                                                </div>}

                                              {question.type === 'descriptive' && <div className="pl-7">
                                                  <p className="text-sm font-medium">Sample Answer (optional)</p>
                                                  <Textarea placeholder="Enter a sample answer" rows={3} className="mt-2" />
                                                </div>}

                                              {(question.type === 'audio' || question.type === 'video') && <div className="pl-7">
                                                  <p className="text-sm font-medium">Instructions</p>
                                                  <Textarea placeholder={`Enter instructions for ${question.type} response`} rows={2} className="mt-2" />
                                                </div>}
                                            </div>)}
                                        </div>}
                                    </CardContent>
                                  </Card>)}
                              </div> : <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <CheckSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium mb-2">No assessments yet</h3>
                                <p className="text-gray-500 mb-6">
                                  Create your first assessment for this subtopic
                                </p>
                                <Button onClick={() => handleAddAssessment(currentTopicIndex, currentSubtopicIndex)}>
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Create Assessment
                                </Button>
                              </div>}
                          </div> : <div className="flex flex-col items-center justify-center h-full min-h-[400px] border rounded-lg p-6">
                            <CheckSquare className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-medium mb-2">No subtopic selected</h3>
                            <p className="text-gray-500 text-center mb-6">
                              Select a subtopic from the left panel to create assessments
                            </p>
                          </div>}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-6">
                    <SaveButton
                      onSave={handleSaveAssessments}
                      type="assessment"
                      isLoading={savingAssessments}
                    />
                  </CardFooter>
                </Card>
              </TabsContent>

                <TabsContent value="publish" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ready to Publish</CardTitle>
                      <CardDescription>Review your course before publishing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="font-medium">Course Details</h3>
                          <div className="space-y-2">
                            <div className="flex">
                              <div className="w-1/3 text-gray-500">Title:</div>
                              <div className="w-2/3 font-medium">{form.watch('title') || 'Not set'}</div>
                            </div>
                            <div className="flex">
                              <div className="w-1/3 text-gray-500">Duration:</div>
                              <div className="w-2/3">{form.watch('duration') || 'Not specified'}</div>
                            </div>
                            <div className="flex">
                              <div className="w-1/3 text-gray-500">Organizations:</div>
                              <div className="w-2/3">
                              {/*
                                {form.watch('organizationIds')?.map(id => organizations.find(o => o.id === id)?.name).join(', ') || 'None selected'}
                              */}
                              {/*Adding a Drop down list for shwoing all Organisations*/}

                              {/*
                              <Select
                                  value={form.watch('organizationIds')?.[0] || ''}
                                  onValueChange={(value) => {
                                    form.setValue('organizationIds', [value]);
                                    form.setValue('departmentIds', []);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select organization" />
                                  </SelectTrigger>
                                    <SelectContent>
                                      {organizations.map(org => (
                                        <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                              </Select>
                              */}

                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" className="w-full justify-between">
                                        {form.watch('organizationIds')?.length
                                          ? organizations
                                              .filter(org => form.watch('organizationIds')?.includes(org.id))
                                              .map(org => org.name)
                                              .join(', ')
                                          : "Select organizations"}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] max-h-[250px] overflow-auto">
                                      <div className="space-y-2">
                                        {organizations.map(org => {
                                          const checked = form.watch('organizationIds')?.includes(org.id)
                                          return (
                                            <label
                                              key={org.id}
                                              className="flex items-center space-x-2 cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(e) => {
                                                  const selected = new Set(form.watch('organizationIds') || [])
                                                  if (e.target.checked) {
                                                    selected.add(org.id)
                                                  } else {
                                                    selected.delete(org.id)
                                                  }
                                                  form.setValue('organizationIds', Array.from(selected))
                                                  form.setValue('departmentIds', []) // reset departments
                                                }}
                                              />
                                              <span>{org.name}</span>
                                            </label>
                                          )
                                        })}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                               </div>
                            </div>
                            <div className="flex">
                              <div className="w-1/3 text-gray-500">Departments:</div>
                              <div className="w-2/3">
                              {/*
                                {form.watch('departmentIds')?.map(id => departments.find(d => d.id === id)?.name).join(', ') || 'None selected'}
                              */}
                              {/*Adding a dropdown list down resepective departments under specific organnisation*/}
                              
                               {(form.watch('organizationIds')?.length
                                ? departments
                                    .filter(dep =>
                                      form.watch('organizationIds')?.includes(dep.organizationId)
                                    )
                                    .map(dep => dep.name)
                                    .join(', ')
                                : 'None selected')}
                              {/*
                              <Select
                                value={form.watch('departmentIds')?.[0] || ''}
                                onValueChange={(value) => form.setValue('departmentIds', [value])}
                                disabled={!form.watch('organizationIds')?.length}
                               >
                                
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments
                                    .filter(dep => dep.organizationId === form.watch('organizationIds')?.[0])
                                    .map(dep => (
                                      <SelectItem key={dep.id} value={dep.id}>{dep.name}</SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              */}

                                </div>
                            </div>
                            <div className="flex">
                              <div className="w-1/3 text-gray-500">Skills:</div>
                              <div className="w-2/3">{skills.join(', ') || 'None added'}</div>
                            </div>
                            <div className="flex">
                              <div className="w-1/3 text-gray-500">Instructors:</div>
                              <div className="w-2/3">{instructors.join(', ') || 'None added'}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="font-medium">Content Summary</h3>
                          <div className="space-y-2">
                            <div className="flex">
                              <div className="w-1/3 text-gray-500">Topics:</div>
                              <div className="w-2/3">{topics.length}</div>
                            </div>
                            <div className="flex">
                              <div className="w-1/3 text-gray-500">Subtopics:</div>
                              <div className="w-2/3">
                                {topics.reduce((total, topic) => total + (topic.subtopics?.length || 0), 0)}
                              </div>
                            </div>
                            <div className="flex">
                              <div className="w-1/3 text-gray-500">Assessments:</div>
                              <div className="w-2/3">
                                {topics.reduce((total, topic) => {
                                return total + topic.subtopics?.reduce((subtotal, subtopic) => {
                                  return subtotal + (subtopic.assessments?.length || 0);
                                }, 0) || 0;
                              }, 0)}
                              </div>
                            </div>
                            <div className="flex">
                              <div className="w-1/3 text-gray-500">Questions:</div>
                              <div className="w-2/3">
                                {topics.reduce((total, topic) => {
                                return total + topic.subtopics?.reduce((subtotal, subtopic) => {
                                  return subtotal + subtopic.assessments?.reduce((qTotal, assessment) => {
                                    return qTotal + (assessment.questions?.length || 0);
                                  }, 0) || 0;
                                }, 0) || 0;
                              }, 0)}
                              </div>
                            </div>
                            <div className="flex">
                              <div className="w-1/3 text-gray-500">AI Support:</div>
                              <div className="w-2/3">
                                {form.watch('aiPersonaPrompt') || form.watch('aiAbilityPrompt') || form.watch('ragDocument') ? 'Configured' : 'Not configured'}
                              </div>
                            </div>
                          </div>
                        </div>


                        <div className="space-y-3  w-[205%]">
                        <h3 className="font-medium">AI Assistance Information</h3>
                          <div className="space-y-2 p-3 bg-gray-50 rounded border">
                            <div>
                              <div className="text-sm font-semibold text-gray-600 mb-1">AI Persona Prompt</div>
                              <div className="text-sm whitespace-pre-line">{form.watch('aiPersonaPrompt') || 'Not provided'}</div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-600 mt-4 mb-1">AI Ability Prompt</div>
                              <div className="text-sm whitespace-pre-line">{form.watch('aiAbilityPrompt') || 'Not provided'}</div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-600 mt-4 mb-1">RAG Document</div>
                              <div className="text-sm whitespace-pre-line">{form.watch('ragDocument') || 'Not provided'}</div>
                            </div>
                          </div>
                        </div>

                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-medium">Course Description</h3>
                        <div className="p-3 bg-gray-50 rounded border">
                          {form.watch('description') || 'No description provided'}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-medium">Course Structure</h3>
                        <div className="p-3 bg-gray-50 rounded border overflow-auto max-h-[300px]">
                          <ul className="space-y-2">
                            {topics.length > 0 ? topics.map((topic, i) => <li key={topic.id || i} className="space-y-2">
                                <div className="font-medium">{i + 1}. {topic.title}</div>
                                {topic.subtopics && topic.subtopics.length > 0 && <ul className="pl-6 space-y-1">
                                    {topic.subtopics.map((subtopic, j) => <li key={subtopic.id || j} className="text-sm">
                                        {i + 1}.{j + 1} {subtopic.title}
                                        {subtopic.assessments && subtopic.assessments.length > 0 && <span className="ml-2 text-xs bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">
                                            {subtopic.assessments.length} assessment(s)
                                          </span>}
                                      </li>)}
                                  </ul>}
                              </li>) : <li className="text-gray-500">No topics added yet</li>}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 pt-6">
                      <Button type="button" variant="outline" onClick={() => navigate(`/organization/${orgId}`)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="outline">
                        <Save className="h-4 w-4 mr-2" />
                        Save as Draft
                      </Button>
                      <Button type="button" className="bg-brand-600 hover:bg-brand-700" onClick={handlePublish}>
                        <BookMarked className="h-4 w-4 mr-2" />
                        Publish Course
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>;
};
export default CourseCreationPage;