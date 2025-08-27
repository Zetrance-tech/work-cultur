


// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import {api} from "@/services/api"

// interface Assessment {
//   _id: string;
//   title: string;
//   description: string;
//   createdAt?: string; 
// }

// interface SubtopicAssessment {
//   subtopicId: string;
//   assessments: Assessment[];
// }

// interface AssessmentStepProps {
//   data: any;
//   onUpdate: (data: any) => void;
//   onNext: () => void;
//   onPrev: () => void;
//   authToken: string;
// }

// const AssessmentStep = ({ data, onUpdate, onNext, onPrev , authToken}: AssessmentStepProps) => {
//   const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(null);
//   const [selectedSubtopicIndex, setSelectedSubtopicIndex] = useState<number | null>(null);
//   const [assessments, setAssessments] = useState<SubtopicAssessment[]>(data.assessments || data.subtopicAssessments || []);
//   const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);
//   const [currentAssessment, setCurrentAssessment] = useState<Assessment>({ _id: "", title: "", description: "" });
//   const { toast } = useToast();
 
//   console.log("assessments --->",assessments)
//   const topics = data.topics || [];

//   const getSubtopicAssessments = (subtopicId: string) => {
//     return assessments.find(sa => sa.subtopicId === subtopicId)?.assessments || [];
//   };

//   const saveCurrentAssessment = async () => {
//     if (!currentAssessment.title.trim()) {
//       toast({
//         title: "Invalid Assessment",
//         description: "Assessment needs a title.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (selectedTopicIndex === null || selectedSubtopicIndex === null) {
//       toast({
//         title: "Error",
//         description: "Please select a topic and subtopic before saving.",
//         variant: "destructive",
//       });
//       return;
//     }

//     const subtopicId = topics[selectedTopicIndex].subtopics[selectedSubtopicIndex].id;

//     try {
//       const payload = {
//         courseId: data.id,
//         topicId: topics[selectedTopicIndex].id,
//         subtopics: [
//           {
//             subtopicId,
//             assessments: [{ title: currentAssessment.title, description: currentAssessment.description }]
//           }
//         ]
//       };
 
//       const response = await fetch(api.CREATE_ASSIMENT, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const responseData = await response.json();
        
//         const updatedAssessments = responseData.data; 
       
//         setAssessments(prev => {
//           const newAssessments = [...prev];
//           const existing = newAssessments.find(sa => sa.subtopicId === subtopicId);
//           if (existing) {
//             existing.assessments = updatedAssessments;
//           } else {
//             newAssessments.push({ subtopicId, assessments: updatedAssessments });
//           }
//           return newAssessments;
//         });

//         toast({ title: "Success", description: "Assessment saved successfully for the subtopic!" });
//         onUpdate({ assessments: [...assessments, { subtopicId, assessments: updatedAssessments }] });
//         setCurrentAssessment({ _id: "", title: "", description: "" });
//         setIsCreatingAssessment(false);
//       } else {
//         throw new Error("Failed to save assessment");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save assessment. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Course Assessments</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Select Topic</Label>
//               <div className="grid gap-2">
//                 {topics.map((topic: any, index: number) => (
//                   <Card 
//                     key={topic.id || index}
//                     className={`cursor-pointer transition-colors ${
//                       selectedTopicIndex === index ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
//                     }`}
//                     onClick={() => {
//                       setSelectedTopicIndex(index);
//                       setSelectedSubtopicIndex(null);
//                     }}
//                   >
//                     <CardContent className="p-3">
//                       <h4 className="font-medium">{topic.title}</h4>
//                       <Badge variant="secondary" className="mt-1">
//                         {topic.subtopics.length} subtopic(s)
//                       </Badge>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>

//             {selectedTopicIndex !== null && (
//               <div className="space-y-2">
//                 <Label>Select Subtopic</Label>
//                 <div className="grid gap-2">
//                   {topics[selectedTopicIndex].subtopics.map((subtopic: any, index: number) => {
//                     const subtopicAssessments = getSubtopicAssessments(subtopic.id || subtopic._id  || "");
//                     return (
//                       <Card 
//                         key={subtopic.id || index}
//                         className={`cursor-pointer transition-colors ${
//                           selectedSubtopicIndex === index ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
//                         }`}
//                         onClick={() => {
//                           setSelectedSubtopicIndex(index);
//                           setIsCreatingAssessment(false);
//                         }}
//                       >
//                         <CardContent className="p-3">
//                           <div className="flex justify-between items-center">
//                             <h4 className="font-medium">{subtopic.title}</h4>
//                             <Badge variant="outline">
//                               {subtopicAssessments.length} assessment(s)
//                             </Badge>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {selectedTopicIndex !== null && selectedSubtopicIndex !== null && (
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-semibold">
//                     Assessments for: {topics[selectedTopicIndex].subtopics[selectedSubtopicIndex].title}
//                   </h3>
//                   <Button onClick={() => setIsCreatingAssessment(true)}>
//                     <Plus className="mr-2 h-4 w-4" />
//                     Add Assessment
//                   </Button>
//                 </div>

//                 {(() => {
//                   const subtopicId = topics[selectedTopicIndex].subtopics[selectedSubtopicIndex].id || "";
//                   const subtopicAssessments = getSubtopicAssessments(subtopicId);
//                   return subtopicAssessments.map((assessment: Assessment, assessmentIndex: number) => (
//                     <Card key={assessment._id || assessmentIndex}>
//                       <CardHeader>
//                         <CardTitle className="text-base">{assessment.title}</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="space-y-2">
//                           <div>
//                             <Label className="text-sm font-semibold">Description:</Label>
//                             <p className="text-sm text-gray-600">{assessment.description || "No description provided"}</p>
//                           </div>
//                           {assessment.createdAt && (
//                             <div>
//                               <Label className="text-sm font-semibold">Created At:</Label>
//                               <p className="text-sm text-gray-600">{new Date(assessment.createdAt).toLocaleString()}</p>
//                             </div>
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ));
//                 })()}

//                 {isCreatingAssessment && (
//                   <Card className="border-blue-200">
//                     <CardHeader>
//                       <CardTitle className="text-lg">Create New Assessment</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                       <div className="space-y-2">
//                         <Label>Assessment Title</Label>
//                         <Input
//                           value={currentAssessment.title}
//                           onChange={(e) => setCurrentAssessment(prev => ({ ...prev, title: e.target.value }))}
//                           placeholder="Enter assessment title"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label>Description</Label>
//                         <Textarea
//                           value={currentAssessment.description}
//                           onChange={(e) => setCurrentAssessment(prev => ({ ...prev, description: e.target.value }))}
//                           placeholder="Enter assessment description"
//                           rows={3}
//                         />
//                       </div>

//                       <div className="flex gap-2">
//                         <Button onClick={saveCurrentAssessment}>Save Assessment</Button>
//                         <Button variant="outline" onClick={() => setIsCreatingAssessment(false)}>
//                           Cancel
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       <div className="flex justify-between">
//         <Button variant="outline" onClick={onPrev}>
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Previous
//         </Button>
//         <Button onClick={onNext}>
//           Next
//           <ChevronRight className="ml-2 h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default AssessmentStep;


///////////////////////////////////////////////////


import { useEffect,useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronLeft, ChevronRight, Edit, Save, X ,Trash2Icon} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
//import {api} from "@/services/api"
import { api } from "../../services/api";
import axios from "axios";
import { useNavigate ,useParams} from "react-router-dom";

interface Assessment {
  _id: string;
  title: string;
  description: string;
  createdAt?: string; 
}

interface SubtopicAssessment {
  subtopicId: string;
  assessments: Assessment[];
}

interface AssessmentStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  authToken: string;
}

const AssessmentStep = ({ data, onUpdate, onNext, onPrev , authToken}: AssessmentStepProps) => {
  console.log(" Received course data:", data);
  console.log(" Topics received in AssessmentStep:", data.topics);


  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(null);
  const [selectedSubtopicIndex, setSelectedSubtopicIndex] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<SubtopicAssessment[]>(data.assessments || data.subtopicAssessments || []);
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment>({ _id: "", title: "", description: "" });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const pathname = window.location.pathname;
  const isEditModeFromPath = pathname.includes("/edit/");


  useEffect(() => {
  if (data?.assessments?.length) {
    setAssessments(data.assessments);
  }
}, [data?.assessments]);


// Auto-select first topic + subtopic when available
useEffect(() => {
  if (selectedTopicIndex === null && data?.topics?.length) {
    setSelectedTopicIndex(0);
    if (data.topics[0]?.subtopics?.length) {
      setSelectedSubtopicIndex(0);
    }
  }
}, [data?.topics]);



  console.log("assessments --->",assessments)
  const topics = data.topics || [];
  //const topics = data.topics ?? data.content?.topics ?? [];


  console.log("📘 Topics:", topics);
  console.log("📘 Selected Topic Index:", selectedTopicIndex);
  console.log("📘 Selected Subtopic Index:", selectedSubtopicIndex);



  
  const getSubtopicAssessments = (subtopicId: string) => {
    return assessments.find(sa => sa.subtopicId === subtopicId)?.assessments || [];
  };

  const handleEditAssessment = (assessment: Assessment) => {
    setEditingAssessmentId(assessment._id);
    setCurrentAssessment({
      _id: assessment._id,
      title: assessment.title,
      description: assessment.description,
      createdAt: assessment.createdAt
    });
    setIsCreatingAssessment(false);
  };

  const handleCancelEdit = () => {
    setEditingAssessmentId(null);
    setCurrentAssessment({ _id: "", title: "", description: "" });
  };

const saveEditedAssessment = async () => {
  if (!currentAssessment.title.trim()) {
    toast({
      title: "Invalid Assessment", 
      description: "Assessment needs a title.",
      variant: "destructive",
    });
    return;
  }

  try {
    const payload = {
      assessmentId: currentAssessment._id,
      title: currentAssessment.title,
      description: currentAssessment.description
    };

    console.log("edit assessment --->", payload);

    const responseData  = await axios.put(
      api.EDIT_ASSESSMENT(courseId),
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("responseData --->", responseData);
    
    // Update the local state with edited assessment
    setAssessments(prev => {
      return prev.map(subtopicAssessment => {
        return {
          ...subtopicAssessment,
          assessments: subtopicAssessment.assessments.map(assessment => 
            assessment._id === currentAssessment._id 
              ? { ...assessment, title: currentAssessment.title, description: currentAssessment.description }
              : assessment
          )
        };
      });
    });

    toast({ 
      title: "Success", 
      description: "Assessment updated successfully!" 
    });
    
    // Update parent component data
    onUpdate({ assessments });
    
    // Reset editing state
    setEditingAssessmentId(null);
    setCurrentAssessment({ _id: "", title: "", description: "" });

  } catch (error) {
    console.error("Error updating assessment:", error);
    toast({
      title: "Error",
      description: "Failed to update assessment. Please try again.",
      variant: "destructive",
    });
  }
};

  const saveCurrentAssessment = async () => {
    if (!currentAssessment.title.trim()) {
      toast({
        title: "Invalid Assessment",
        description: "Assessment needs a title.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTopicIndex === null || selectedSubtopicIndex === null) {
      toast({
        title: "Error",
        description: "Please select a topic and subtopic before saving.",
        variant: "destructive",
      });
      return;
    }

    const subtopicId = topics[selectedTopicIndex].subtopics[selectedSubtopicIndex].id;

    try {
      const payload = {
        courseId: data.id,
        topicId: topics[selectedTopicIndex].id,
        subtopics: [
          {
            subtopicId,
            assessments: [{ title: currentAssessment.title, description: currentAssessment.description }]
          }
        ]
      };
 
      console.log("🚨 CheckingcourseId =", data.id);
      console.log("👉 Checking CREATE_ASSIMENT URL:", api.CREATE_ASSESSMENT);

      const response = await fetch(api.CREATE_ASSESSMENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        const updatedAssessments = responseData.data; 
       
        setAssessments(prev => {
          const newAssessments = [...prev];
          const existing = newAssessments.find(sa => sa.subtopicId === subtopicId);
          if (existing) {
            existing.assessments = updatedAssessments;
          } else {
            newAssessments.push({ subtopicId, assessments: updatedAssessments });
          }
          return newAssessments;
        });

        toast({ title: "Success", description: "Assessment saved successfully for the subtopic!" });
        onUpdate({ assessments: [...assessments, { subtopicId, assessments: updatedAssessments }] });
        setCurrentAssessment({ _id: "", title: "", description: "" });
        setIsCreatingAssessment(false);
      } else {
        throw new Error("Failed to save assessment");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // const handleDeleteAssessment = async (assessment: Assessment) => {
  //   if (confirm("Are you sure you want to delete this assessment?")) {
  //     try {
  //       const response = await axios.delete(api.DELETE_ASSIMENT, {
  //         data: {
  //           assessmentId: assessment?._id,
  //           subtopicId: topics[selectedTopicIndex].subtopics[selectedSubtopicIndex].id || ""
  //         },
  //         headers: {
  //           "Authorization": `Bearer ${authToken}`
  //         }
  //       });
  //       if(response.status === 200){
  //         setAssessments((prev) => prev.filter((subtopicAssessment) => subtopicAssessment.subtopicId !== assessment.subtopicId));
  //         toast({ title: "Success", description: "Assessment deleted successfully!" });
  //         onUpdate({ assessments: [...assessments.filter((subtopicAssessment) => subtopicAssessment.subtopicId !== assessment.subtopicId)] });
  //       }
  //     } catch (error) {
  //       console.log("error while deleting the assessment", error)
  //     }
  //   }
  // };

  const addQuestion = (assessmentId: string) => {
   //navigate(`/add-question/${assessmentId}`);
    //navigate(`add-question/${assessmentId}`);
      //navigate(`/admin/courses/add-question/${assessmentId}`);
    navigate(`/admin/courses/${courseId}/add-question/${assessmentId}`, {
        state: { isEditMode: isEditModeFromPath }, // or true/false);
    });
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border border-white/10 shadow-md rounded-xl p-6 text-white">
        <CardHeader>
          <CardTitle>Course Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Topic</Label>
              <div className="grid gap-2">
                {topics.map((topic: any, index: number) => (
                  <Card 
                    key={topic.id || index}

                    className={`cursor-pointer bg-black text-black border border-white/10 backdrop-blur-md transition-colors ${
                      selectedTopicIndex === index ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    
                   
                    onClick={() => {
                      setSelectedTopicIndex(index);
                      setSelectedSubtopicIndex(null);
                      setEditingAssessmentId(null);
                      setIsCreatingAssessment(false);
                    }}
                  >
                    <CardContent className="p-3">
                      <h4 className="font-medium">{topic.title}</h4>
                      <Badge variant="secondary" className="mt-1">
                        {topic.subtopics.length} subtopic(s)
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {selectedTopicIndex !== null && (
              <div className="space-y-2">
                <Label>Select Subtopic</Label>
                <div className="grid gap-2">
                  {topics[selectedTopicIndex].subtopics.map((subtopic: any, index: number) => {
                    const subtopicAssessments = getSubtopicAssessments(subtopic.id || subtopic._id  || "");
                    return (
                      <Card 
                        key={subtopic.id || index}
                        className={`cursor-pointer transition-colors ${
                          selectedSubtopicIndex === index ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSelectedSubtopicIndex(index);
                          setIsCreatingAssessment(false);
                          setEditingAssessmentId(null);
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{subtopic.title}</h4>
                            <Badge variant="outline">
                              {subtopicAssessments.length} assessment(s)
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedTopicIndex !== null && selectedSubtopicIndex !== null && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Assessments for: {topics[selectedTopicIndex].subtopics[selectedSubtopicIndex].title}
                  </h3>
                  <Button 
                    onClick={() => {
                      setIsCreatingAssessment(true);
                      setEditingAssessmentId(null);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Assessment
                  </Button>
                </div>

                {(() => {
                  const subtopicId = topics[selectedTopicIndex].subtopics[selectedSubtopicIndex].id || "";
                  const subtopicAssessments = getSubtopicAssessments(subtopicId);
                  return subtopicAssessments.map((assessment: Assessment, assessmentIndex: number) => (
                    <Card key={assessment._id || assessmentIndex}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{assessment.title}</CardTitle>
                         <div className="flex gap-2">
                         <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAssessment(assessment)}
                            disabled={editingAssessmentId === assessment._id}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addQuestion(assessment._id)}
                           
                          >
                           View Questions
                          </Button>
                          
                         </div>
                        </div>
                        
                      </CardHeader>
                      <CardContent>
                        {editingAssessmentId === assessment._id ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Assessment Title</Label>
                              <Input
                                value={currentAssessment.title}
                                onChange={(e) => setCurrentAssessment(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter assessment title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={currentAssessment.description}
                                onChange={(e) => setCurrentAssessment(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter assessment description"
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={saveEditedAssessment}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </Button>
                              <Button variant="outline" onClick={handleCancelEdit}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <Label className="text-sm font-semibold">Description:</Label>
                              <p className="text-sm text-gray-600">{assessment.description || "No description provided"}</p>
                            </div>
                            {assessment.createdAt && (
                              <div>
                                <Label className="text-sm font-semibold">Created At:</Label>
                                <p className="text-sm text-gray-600">{new Date(assessment.createdAt).toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ));
                })()}

                {isCreatingAssessment && (
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Create New Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Assessment Title</Label>
                        <Input
                          value={currentAssessment.title}
                          onChange={(e) => setCurrentAssessment(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter assessment title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={currentAssessment.description}
                          onChange={(e) => setCurrentAssessment(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter assessment description"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={saveCurrentAssessment}>Save Assessment</Button>
                        <Button variant="outline" onClick={() => setIsCreatingAssessment(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="bg-black text-white border border-white/20 hover:bg-black">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={onNext}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AssessmentStep;