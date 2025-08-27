

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ChevronLeft, Plus, X, BookOpen, Users, FileText, Award, CheckCircle } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import {api} from "@/services/api"


// interface PublishStepProps {
//   data: any;
//   onUpdate: (data: any) => void;
//   onPrev: () => void;
//   authToken: string;
// }

// const PublishStep = ({ data, onUpdate, onPrev, authToken }: PublishStepProps) => {
//   const [linkedEntities, setLinkedEntities] = useState<any[]>([]);
//   const [selectedOrganization, setSelectedOrganization] = useState<string>("");
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("");
//   const [isPublishing, setIsPublishing] = useState(false);
//   const [publishedCourse, setPublishedCourse] = useState<any>(null);
//   const [courseLink, setCourseLink] = useState<string>("");
//   const { toast } = useToast();

//   const organizations = JSON.parse(localStorage.getItem('organizations') || '[]');
//   const avatars = JSON.parse(localStorage.getItem('avatars') || '[]')

//   console.log("avatars from localstorage-->",avatars)

//   const addOrganization = () => {
//     if (!selectedOrganization) return;

//     const org = organizations.find((o: any) => o._id === selectedOrganization);
//     if (!org) return;

//     setLinkedEntities((prev) => [
//       ...prev,
//       {
//         organization: org._id,
//         organizationName: org.name,
//         departments: [],
//       },
//     ]);
//     setSelectedOrganization("");
//   };

//   const addDepartment = (orgIndex: number) => {
//     if (!selectedDepartment) return;

//     const org = organizations.find((o: any) => o._id === linkedEntities[orgIndex].organization);
//     const dept = org?.departments.find((d: any) => d._id === selectedDepartment);
//     if (!dept) return;

//     setLinkedEntities((prev) =>
//       prev.map((entity, index) =>
//         index === orgIndex
//           ? {
//               ...entity,
//               departments: [...entity.departments, { _id: dept._id, name: dept.name }],
//             }
//           : entity
//       )
//     );
//     setSelectedDepartment("");
//   };

//   const removeOrganization = (index: number) => {
//     setLinkedEntities((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeDepartment = (orgIndex: number, deptIndex: number) => {
//     setLinkedEntities((prev) =>
//       prev.map((entity, index) =>
//         index === orgIndex
//           ? {
//               ...entity,
//               departments: entity.departments.filter((_, i) => i !== deptIndex),
//             }
//           : entity
//       )
//     );
//   };

//   const publishCourse = async () => {
//     setIsPublishing(true);
//     try {
//       const payload = {
//         courseId: data.id,
//         status: "published",
//         linked_entities: linkedEntities.map((entity) => ({
//           organization: entity.organization,
//           departments: entity.departments.map((dept: any) => ({ _id: dept._id })),
//         })),
//       };
//       const response = await fetch(api.PUBLISH_COURSE, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         const courseData = result.data.course;
//         setPublishedCourse(courseData);
//         setCourseLink(result.data.courseLink);
//         toast({
//           title: "Course Published!",
//           description: "Your course has been successfully published and is now available.",
//         });
//       } else {
//         throw new Error("Failed to publish course");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to publish course. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   const topics = data.topics || [];
//   const totalSubtopics = topics.reduce((sum: number, topic: any) => sum + (topic.subtopics?.length || 0), 0);
//   const assessments = data.assessments || [];
//   const totalAssessments = assessments.reduce((sum: number, sa: any) => sum + (sa.assessments?.length || 0), 0);

//   return (
//     <div className="space-y-6">
//       {/* Published Course Details */}
//       {publishedCourse && (
//         <Card className="border-green-500 border-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-green-600">
//               <CheckCircle className="h-5 w-5" />
//               Course Published Successfully
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <p className="text-lg font-semibold">
//                 {publishedCourse.title} ({publishedCourse._id})
//               </p>
//               <div className="space-y-1">
//                 <Label className="text-sm font-semibold">Linked Organizations:</Label>
//                 {publishedCourse.linked_entities?.length > 0 ? (
//                   publishedCourse.linked_entities.map((entity: any, index: number) => {
//                     const org = organizations.find((o: any) => o._id === entity.organization);
//                     return (
//                       <div key={index} className="ml-2">
//                         <p className="text-sm font-medium">
//                           {org ? `${org.name}(${org._id})` : entity.organization}
//                         </p>
//                         <div className="ml-4 space-y-1">
//                           {entity.departments?.length > 0 ? (
//                             entity.departments.map((dept: any, deptIndex: number) => {
//                               const deptData = org?.departments.find((d: any) => d._id === dept);
//                               return (
//                                 <p key={deptIndex} className="text-sm">
//                                   - {deptData ? `${deptData.name}(${deptData._id})` : dept}
//                                 </p>
//                               );
//                             })
//                           ) : (
//                             <p className="text-sm text-gray-500">No departments linked</p>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <p className="text-sm text-gray-500">No organizations linked</p>
//                 )}
//               </div>
//               <p className="text-sm">
//                 <span className="font-semibold">Status:</span>{" "}
//                 <span className="text-green-600">{publishedCourse.status}</span>
//               </p>
//               {courseLink && (
//                 <div className="mt-4">
//                   <Button
//                     asChild
//                     className="bg-blue-600 hover:bg-blue-700"
//                   >
//                     <a href={courseLink} target="_blank" rel="noopener noreferrer">
//                       View Course
//                     </a>
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Course Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <BookOpen className="h-5 w-5" />
//             Course Summary
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-semibold text-lg">{data.title || "Course Title"}</h3>
//                 <p className="text-gray-600 mt-1">{data.description || "No description provided"}</p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-3 bg-blue-50 rounded-lg">
//                   <FileText className="h-6 w-6 text-blue-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-blue-600">{topics.length}</div>
//                   <div className="text-sm text-gray-600">Topics</div>
//                 </div>
//                 <div className="text-center p-3 bg-green-50 rounded-lg">
//                   <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-green-600">{totalSubtopics}</div>
//                   <div className="text-sm text-gray-600">Subtopics</div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-3 bg-purple-50 rounded-lg">
//                   <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-purple-600">{totalAssessments}</div>
//                   <div className="text-sm text-gray-600">Assessments</div>
//                 </div>
//                 <div className="text-center p-3 bg-orange-50 rounded-lg">
//                   <Users className="h-6 w-6 text-orange-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-orange-600">{data.instructors?.length || 0}</div>
//                   <div className="text-sm text-gray-600">Instructors</div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <Label className="text-sm font-semibold">Duration</Label>
//                 <p className="text-gray-600">{data.duration || "Not specified"}</p>
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Skills Covered</Label>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {data.skills?.length > 0 ? (
//                     data.skills.map((skill: string, index: number) => (
//                       <Badge key={index} variant="secondary">{skill}</Badge>
//                     ))
//                   ) : (
//                     <span className="text-gray-500 text-sm">No skills added</span>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Instructors</Label>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {data.instructors?.length > 0 ? (
//                     data.instructors.map((instructor: string, index: number) => (
//                       <Badge key={index} variant="outline">{instructor}</Badge>
//                     ))
//                   ) : (
//                     <span className="text-gray-500 text-sm">No instructors added</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {topics.length > 0 && (
//             <>
//               <Separator />
//               <div>
//                 <h4 className="font-semibold mb-3">Course Content Structure</h4>
//                 <div className="space-y-3">
//                   {topics.map((topic: any, index: number) => (
//                     <div key={topic.id || index} className="border rounded-lg p-3">
//                       <h5 className="font-medium">{topic.title}</h5>
//                       <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
//                       <div className="mt-2 space-y-1">
//                         {topic.subtopics?.map((subtopic: any, subIndex: number) => (
//                           <div key={subtopic.id || subIndex} className="ml-4 text-sm">
//                             <span className="text-gray-500">•</span> {subtopic.title}
//                           </div>
//                         ))}
//                       </div>
//                       <Badge variant="secondary" className="mt-2">
//                         {topic.subtopics?.length || 0} subtopic(s)
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* Organization Linking */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Link to Organizations</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex gap-2">
//             <Select onValueChange={setSelectedOrganization} value={selectedOrganization}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select organization" />
//               </SelectTrigger>
//               <SelectContent>
//                 {organizations.map((org: any) => (
//                   <SelectItem key={org._id} value={org._id}>
//                     {`${org.name}(${org._id})`}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Button onClick={addOrganization}>
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>

//           {linkedEntities.map((entity: any, orgIndex: number) => {
//             const org = organizations.find((o: any) => o._id === entity.organization);
//             return (
//               <Card key={orgIndex} className="border-dashed">
//                 <CardContent className="p-4">
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <Label className="font-semibold">Organization ID:</Label>
//                       <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">
//                         {`${entity.organizationName}(${entity.organization})`}
//                       </p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeOrganization(orgIndex)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-sm">Department IDs:</Label>
//                     <div className="flex flex-wrap gap-1 mb-2">
//                       {entity.departments.map((dept: any, deptIndex: number) => (
//                         <Badge key={deptIndex} variant="outline">
//                           {`${dept.name}(${dept._id})`}
//                           <button
//                             onClick={() => removeDepartment(orgIndex, deptIndex)}
//                             className="ml-1 text-gray-500 hover:text-gray-700"
//                           >
//                             <X className="h-3 w-3" />
//                           </button>
//                         </Badge>
//                       ))}
//                     </div>
//                     <div className="flex gap-2">
//                       <Select onValueChange={setSelectedDepartment} value={selectedDepartment}>
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select department" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {org?.departments.map((dept: any) => (
//                             <SelectItem key={dept._id} value={dept._id}>
//                               {`${dept.name}(${dept._id})`}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => addDepartment(orgIndex)}
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </CardContent>
//       </Card>

//       {/* Actions */}
//       <div className="flex justify-between">
//         <Button variant="outline" onClick={onPrev}>
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Previous
//         </Button>
//         <Button
//           onClick={publishCourse}
//           disabled={isPublishing}
//           size="lg"
//           className="bg-green-600 hover:bg-green-700"
//         >
//           {isPublishing ? "Publishing..." : "Publish Course"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PublishStep;



//////////////////////////origna wokring code//////////////////////////


// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ChevronLeft, Plus, X, BookOpen, Users, FileText, Award, CheckCircle, Bot } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import {api} from "@/services/api"


// interface PublishStepProps {
//   data: any;
//   onUpdate: (data: any) => void;
//   onPrev: () => void;
//   authToken: string;
// }

// const PublishStep = ({ data, onUpdate, onPrev, authToken }: PublishStepProps) => {
//   const [linkedEntities, setLinkedEntities] = useState<any[]>([]);
//   const [selectedOrganization, setSelectedOrganization] = useState<string>("");
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("");
//   const [selectedAvatar, setSelectedAvatar] = useState<string>("");
//   const [isPublishing, setIsPublishing] = useState(false);
//   const [publishedCourse, setPublishedCourse] = useState<any>(null);
//   const [courseLink, setCourseLink] = useState<string>("");
//   const { toast } = useToast();

//   const organizations = JSON.parse(localStorage.getItem('organizations') || '[]');
//   const avatars = JSON.parse(localStorage.getItem('avatars') || '[]')
//   console.log("data at publish --->",data)
//   console.log("avatars from localstorage-->",avatars)

//   const addOrganization = () => {
//     if (!selectedOrganization) return;

//     const org = organizations.find((o: any) => o._id === selectedOrganization);
//     if (!org) return;

//     setLinkedEntities((prev) => [
//       ...prev,
//       {
//         organization: org._id,
//         organizationName: org.name,
//         departments: [],
//       },
//     ]);
//     setSelectedOrganization("");
//   };

//   const addDepartment = (orgIndex: number) => {
//     if (!selectedDepartment) return;

//     const org = organizations.find((o: any) => o._id === linkedEntities[orgIndex].organization);
//     const dept = org?.departments.find((d: any) => d._id === selectedDepartment);
//     if (!dept) return;

//     setLinkedEntities((prev) =>
//       prev.map((entity, index) =>
//         index === orgIndex
//           ? {
//               ...entity,
//               departments: [...entity.departments, { _id: dept._id, name: dept.name }],
//             }
//           : entity
//       )
//     );
//     setSelectedDepartment("");
//   };

//   const removeOrganization = (index: number) => {
//     setLinkedEntities((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeDepartment = (orgIndex: number, deptIndex: number) => {
//     setLinkedEntities((prev) =>
//       prev.map((entity, index) =>
//         index === orgIndex
//           ? {
//               ...entity,
//               departments: entity.departments.filter((_, i) => i !== deptIndex),
//             }
//           : entity
//       )
//     );
//   };

//   const publishCourse = async () => {
//     setIsPublishing(true);
//     try {
//       const payload = {
//         courseId: data.id,
//         status: "published",
//         linked_entities: linkedEntities.map((entity) => ({
//           organization: entity.organization,
//           departments: entity.departments.map((dept: any) => ({ _id: dept._id })),
//         })),
//         ...(selectedAvatar && { avatarId: selectedAvatar }),
//       };

//       console.log("publish payloade --->", payload)
//       const response = await fetch(api.PUBLISH_COURSE, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         const courseData = result.data.course;
//         setPublishedCourse(courseData);
//         setCourseLink(result.data.courseLink);
//         toast({
//           title: "Course Published!",
//           description: "Your course has been successfully published and is now available.",
//         });
//       } else {
//         throw new Error("Failed to publish course");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to publish course. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsPublishing(false);
//     }
//   };


  

//   const topics = data.topics || [];
//   const totalSubtopics = topics.reduce((sum: number, topic: any) => sum + (topic.subtopics?.length || 0), 0);
//   const assessments = data.assessments || data.subtopicAssessments  || [];
//   const totalAssessments = assessments.reduce((sum: number, sa: any) => sum + (sa.assessments?.length || 0), 0);

//   return (
//     <div className="space-y-6">
//       {/* Published Course Details */}
//       {publishedCourse && (
//         <Card className="border-green-500 border-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-green-600">
//               <CheckCircle className="h-5 w-5" />
//               Course Published Successfully
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <p className="text-lg font-semibold">
//                 {publishedCourse.title} ({publishedCourse._id})
//               </p>
//               <div className="space-y-1">
//                 <Label className="text-sm font-semibold">Linked Organizations:</Label>
//                 {publishedCourse.linked_entities?.length > 0 ? (
//                   publishedCourse.linked_entities.map((entity: any, index: number) => {
//                     const org = organizations.find((o: any) => o._id === entity.organization);
//                     return (
//                       <div key={index} className="ml-2">
//                         <p className="text-sm font-medium">
//                           {org ? `${org.name}(${org._id})` : entity.organization}
//                         </p>
//                         <div className="ml-4 space-y-1">
//                           {entity.departments?.length > 0 ? (
//                             entity.departments.map((dept: any, deptIndex: number) => {
//                               const deptData = org?.departments.find((d: any) => d._id === dept);
//                               return (
//                                 <p key={deptIndex} className="text-sm">
//                                   - {deptData ? `${deptData.name}(${deptData._id})` : dept}
//                                 </p>
//                               );
//                             })
//                           ) : (
//                             <p className="text-sm text-gray-500">No departments linked</p>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <p className="text-sm text-gray-500">No organizations linked</p>
//                 )}
//               </div>
//               <p className="text-sm">
//                 <span className="font-semibold">Status:</span>{" "}
//                 <span className="text-green-600">{publishedCourse.status}</span>
//               </p>
//               {courseLink && (
//                 <div className="mt-4">
//                   <Button
//                     asChild
//                     className="bg-blue-600 hover:bg-blue-700"
//                   >
//                     <a href={courseLink} target="_blank" rel="noopener noreferrer">
//                       View Course
//                     </a>
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Course Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <BookOpen className="h-5 w-5" />
//             Course Summary
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-semibold text-lg">{data.title || "Course Title"}</h3>
//                 <p className="text-gray-600 mt-1">{data.description || "No description provided"}</p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-3 bg-blue-50 rounded-lg">
//                   <FileText className="h-6 w-6 text-blue-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-blue-600">{topics.length}</div>
//                   <div className="text-sm text-gray-600">Topics</div>
//                 </div>
//                 <div className="text-center p-3 bg-green-50 rounded-lg">
//                   <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-green-600">{totalSubtopics}</div>
//                   <div className="text-sm text-gray-600">Subtopics</div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-3 bg-purple-50 rounded-lg">
//                   <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-purple-600">{totalAssessments}</div>
//                   <div className="text-sm text-gray-600">Assessments</div>
//                 </div>
//                 <div className="text-center p-3 bg-orange-50 rounded-lg">
//                   <Users className="h-6 w-6 text-orange-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-orange-600">{data.instructors?.length || 0}</div>
//                   <div className="text-sm text-gray-600">Instructors</div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <Label className="text-sm font-semibold">Duration</Label>
//                 <p className="text-gray-600">{data.duration || "Not specified"}</p>
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Skills Covered</Label>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {data.skills?.length > 0 ? (
//                     data.skills.map((skill: string, index: number) => (
//                       <Badge key={index} variant="secondary">{skill}</Badge>
//                     ))
//                   ) : (
//                     <span className="text-gray-500 text-sm">No skills added</span>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Instructors</Label>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {data.instructors?.length > 0 ? (
//                     data.instructors.map((instructor: string, index: number) => (
//                       <Badge key={index} variant="outline">{instructor}</Badge>
//                     ))
//                   ) : (
//                     <span className="text-gray-500 text-sm">No instructors added</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {topics.length > 0 && (
//             <>
//               <Separator />
//               <div>
//                 <h4 className="font-semibold mb-3">Course Content Structure</h4>
//                 <div className="space-y-3">
//                   {topics.map((topic: any, index: number) => (
//                     <div key={topic.id || index} className="border rounded-lg p-3">
//                       <h5 className="font-medium">{topic.title}</h5>
//                       <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
//                       <div className="mt-2 space-y-1">
//                         {topic.subtopics?.map((subtopic: any, subIndex: number) => (
//                           <div key={subtopic.id || subIndex} className="ml-4 text-sm">
//                             <span className="text-gray-500">•</span> {subtopic.title}
//                           </div>
//                         ))}
//                       </div>
//                       <Badge variant="secondary" className="mt-2">
//                         {topic.subtopics?.length || 0} subtopic(s)
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* Avatar Selection */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Bot className="h-5 w-5" />
//             Select Course Avatar
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {avatars.map((avatar: any, index: number) => (
//               <div
//                 key={avatar._id || index}
//                 className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
//                   selectedAvatar === avatar._id
//                     ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//                 onClick={() => setSelectedAvatar(avatar._id)}
//               >
//                 <div className="text-center space-y-3">
//                   {/* Avatar Image */}
//                   <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
//                     {avatar.avatarImage?.url ? (
//                       <img
//                         src={avatar.avatarImage.url}
//                         alt={avatar.avatarName}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <Bot className="h-8 w-8 text-gray-400" />
//                     )}
//                   </div>
                  
//                   {/* Avatar Name */}
//                   <div>
//                     <h4 className="font-medium text-sm">{avatar.avatarName}</h4>
//                     <p className="text-xs text-gray-500 mt-1">ID: {avatar.avatarAzureResourcesId}</p>
//                   </div>

//                   {/* Avatar Voice */}
//                   {avatar.avatarVoiceId && (
//                     <div className="text-xs">
//                       <Badge variant="outline" className="text-xs">
//                         Voice: {avatar.avatarVoiceId}
//                       </Badge>
//                     </div>
//                   )}

//                   {/* Selection Indicator */}
//                   {selectedAvatar === avatar.avatarAzureResourcesId && (
//                     <div className="flex items-center justify-center">
//                       <CheckCircle className="h-4 w-4 text-blue-600" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {avatars.length === 0 && (
//             <div className="text-center py-8 text-gray-500">
//               <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
//               <p>No avatars available</p>
//             </div>
//           )}

//           {selectedAvatar && (
//             <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//               <p className="text-sm text-blue-800">
//                 <span className="font-medium">Selected Avatar:</span>{' '}
//                 {avatars.find((a: any) => a._id === selectedAvatar)?.avatarName} 
//                 <span className="font-mono ml-2">({selectedAvatar})</span>
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Organization Linking */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Link to Organizations</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex gap-2">
//             <Select onValueChange={setSelectedOrganization} value={selectedOrganization}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select organization" />
//               </SelectTrigger>
//               <SelectContent>
//                 {organizations.map((org: any) => (
//                   <SelectItem key={org._id} value={org._id}>
//                     {`${org.name}(${org._id})`}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Button onClick={addOrganization}>
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>

//           {linkedEntities.map((entity: any, orgIndex: number) => {
//             const org = organizations.find((o: any) => o._id === entity.organization);
//             return (
//               <Card key={orgIndex} className="border-dashed">
//                 <CardContent className="p-4">
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <Label className="font-semibold">Organization ID:</Label>
//                       <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">
//                         {`${entity.organizationName}(${entity.organization})`}
//                       </p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeOrganization(orgIndex)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-sm">Department IDs:</Label>
//                     <div className="flex flex-wrap gap-1 mb-2">
//                       {entity.departments.map((dept: any, deptIndex: number) => (
//                         <Badge key={deptIndex} variant="outline">
//                           {`${dept.name}(${dept._id})`}
//                           <button
//                             onClick={() => removeDepartment(orgIndex, deptIndex)}
//                             className="ml-1 text-gray-500 hover:text-gray-700"
//                           >
//                             <X className="h-3 w-3" />
//                           </button>
//                         </Badge>
//                       ))}
//                     </div>
//                     <div className="flex gap-2">
//                       <Select onValueChange={setSelectedDepartment} value={selectedDepartment}>
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select department" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {org?.departments.map((dept: any) => (
//                             <SelectItem key={dept._id} value={dept._id}>
//                               {`${dept.name}(${dept._id})`}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => addDepartment(orgIndex)}
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </CardContent>
//       </Card>

//       {/* Actions */}
//       <div className="flex justify-between">
//         <Button variant="outline" onClick={onPrev}>
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Previous
//         </Button>
//         <Button
//           onClick={publishCourse}
//           disabled={isPublishing}
//           size="lg"
//           className="bg-green-600 hover:bg-green-700"
//         >
//           {isPublishing ? "Publishing..." : "Publish Course"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PublishStep;




/////////////////////with new feature/////////////////////////////



// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ChevronLeft, Plus, X, BookOpen, Users, FileText, Award, CheckCircle, Bot } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { api } from "@/services/api";

// interface PublishStepProps {
//   data: any;
//   onUpdate: (data: any) => void;
//   onPrev: () => void;
//   authToken: string;
// }

// const PublishStep = ({ data, onUpdate, onPrev, authToken }: PublishStepProps) => {
//   // Initialize linkedEntities with data.linked_entities if available
//   const [linkedEntities, setLinkedEntities] = useState<any[]>(() => {
//     if (data.linked_entities && Array.isArray(data.linked_entities)) {
//       return data.linked_entities.map((entity: any) => ({
//         organization: entity.organization._id || entity.organization,
//         organizationName: entity.organization.name || entity.organizationName || "Unknown",
//         departments: entity.departments.map((dept: any) => ({
//           _id: dept._id,
//           name: dept.name || "Unknown",
//         })),
//       }));
//     }
//     return [];
//   });
//   const [selectedOrganization, setSelectedOrganization] = useState<string>("");
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("");
//   const [selectedAvatar, setSelectedAvatar] = useState<string>(data.courseAvatar?._id || data.courseAvatar || "");
//   const [isPublishing, setIsPublishing] = useState(false);
//   const [publishedCourse, setPublishedCourse] = useState<any>(null);
//   const [courseLink, setCourseLink] = useState<string>("");
//   const { toast } = useToast();

//   const organizations = JSON.parse(localStorage.getItem("organizations") || "[]");
//   const avatars = JSON.parse(localStorage.getItem("avatars") || "[]");

//   // Update parent component with linkedEntities and avatar
//   useEffect(() => {
//     onUpdate({
//       ...data,
//       linked_entities: linkedEntities,
//       courseAvatar: selectedAvatar,
//     });
//   }, [linkedEntities, selectedAvatar, onUpdate]);

//   const addOrganization = () => {
//     if (!selectedOrganization) return;

//     const org = organizations.find((o: any) => o._id === selectedOrganization);
//     if (!org) return;

//     setLinkedEntities((prev) => [
//       ...prev,
//       {
//         organization: org._id,
//         organizationName: org.name,
//         departments: [],
//       },
//     ]);
//     setSelectedOrganization("");
//   };

//   const addDepartment = (orgIndex: number) => {
//     if (!selectedDepartment) return;

//     const org = organizations.find((o: any) => o._id === linkedEntities[orgIndex].organization);
//     const dept = org?.departments.find((d: any) => d._id === selectedDepartment);
//     if (!dept) return;

//     setLinkedEntities((prev) =>
//       prev.map((entity, index) =>
//         index === orgIndex
//           ? {
//               ...entity,
//               departments: [...entity.departments, { _id: dept._id, name: dept.name }],
//             }
//           : entity
//       )
//     );
//     setSelectedDepartment("");
//   };

//   const removeOrganization = (index: number) => {
//     setLinkedEntities((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeDepartment = (orgIndex: number, deptIndex: number) => {
//     setLinkedEntities((prev) =>
//       prev.map((entity, index) =>
//         index === orgIndex
//           ? {
//               ...entity,
//               departments: entity.departments.filter((_, i) => i !== deptIndex),
//             }
//           : entity
//       )
//     );
//   };

//   const publishCourse = async () => {
//     setIsPublishing(true);
//     try {
//       const payload = {
//         courseId: data.id,
//         status: "published",
//         linked_entities: linkedEntities.map((entity) => ({
//           organization: entity.organization,
//           departments: entity.departments.map((dept: any) => ({ _id: dept._id })),
//         })),
//         ...(selectedAvatar && { avatarId: selectedAvatar }),
//       };

//       const response = await fetch(api.PUBLISH_COURSE, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         const courseData = result.data.course;
//         setPublishedCourse(courseData);
//         setCourseLink(result.data.courseLink);
//         toast({
//           title: "Course Published!",
//           description: "Your course has been successfully published and is now available.",
//         });
//       } else {
//         throw new Error("Failed to publish course");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to publish course. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   const topics = data.topics || [];
//   const totalSubtopics = topics.reduce((sum: number, topic: any) => sum + (topic.subtopics?.length || 0), 0);
//   const assessments = data.assessments || data.subtopicAssessments || [];
//   const totalAssessments = assessments.reduce((sum: number, sa: any) => sum + (sa.assessments?.length || 0), 0);

//   //persist single avatar even in edit mode
//   // useEffect(() => {
//   //   const existingAvatar = avatars.some((avatar: any) => avatar._id === data.courseAvatar);
//   //   console.log("existing avatar --->", existingAvatar);
//   // }, [data.courseAvatar]);

//   return (
//     <div className="space-y-6">
//       {/* Published Course Details */}
//       {publishedCourse && (
//         <Card className="border-green-500 border-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-green-600">
//               <CheckCircle className="h-5 w-5" />
//               Course Published Successfully
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <p className="text-lg font-semibold">
//                 {publishedCourse.title} ({publishedCourse._id})
//               </p>
//               <div className="space-y-1">
//                 <Label className="text-sm font-semibold">Linked Organizations:</Label>
//                 {publishedCourse.linked_entities?.length > 0 ? (
//                   publishedCourse.linked_entities.map((entity: any, index: number) => {
//                     const org = organizations.find((o: any) => o._id === entity.organization);
//                     return (
//                       <div key={index} className="ml-2">
//                         <p className="text-sm font-medium">
//                           {org ? `${org.name}(${org._id})` : entity.organization}
//                         </p>
//                         <div className="ml-4 space-y-1">
//                           {entity.departments?.length > 0 ? (
//                             entity.departments.map((dept: any, deptIndex: number) => {
//                               const deptData = org?.departments.find((d: any) => d._id === dept);
//                               return (
//                                 <p key={deptIndex} className="text-sm">
//                                   - {deptData ? `${deptData.name}(${deptData._id})` : dept}
//                                 </p>
//                               );
//                             })
//                           ) : (
//                             <p className="text-sm text-gray-500">No departments linked</p>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <p className="text-sm text-gray-500">No organizations linked</p>
//                 )}
//               </div>
//               <p className="text-sm">
//                 <span className="font-semibold">Status:</span>{" "}
//                 <span className="text-green-600">{publishedCourse.status}</span>
//               </p>
//               {courseLink && (
//                 <div className="mt-4">
//                   <Button asChild className="bg-blue-600 hover:bg-blue-700">
//                     <a href={courseLink} target="_blank" rel="noopener noreferrer">
//                       View Course
//                     </a>
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Course Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <BookOpen className="h-5 w-5" />
//             Course Summary
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-semibold text-lg">{data.title || "Course Title"}</h3>
//                 <p className="text-gray-600 mt-1">{data.description || "No description provided"}</p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-3 bg-blue-50 rounded-lg">
//                   <FileText className="h-6 w-6 text-blue-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-blue-600">{topics.length}</div>
//                   <div className="text-sm text-gray-600">Topics</div>
//                 </div>
//                 <div className="text-center p-3 bg-green-50 rounded-lg">
//                   <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-green-600">{totalSubtopics}</div>
//                   <div className="text-sm text-gray-600">Subtopics</div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-3 bg-purple-50 rounded-lg">
//                   <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-purple-600">{totalAssessments}</div>
//                   <div className="text-sm text-gray-600">Assessments</div>
//                 </div>
//                 <div className="text-center p-3 bg-orange-50 rounded-lg">
//                   <Users className="h-6 w-6 text-orange-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-orange-600">{data.instructors?.length || 0}</div>
//                   <div className="text-sm text-gray-600">Instructors</div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <Label className="text-sm font-semibold">Duration</Label>
//                 <p className="text-gray-600">{data.duration || "Not specified"}</p>
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Skills Covered</Label>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {data.skills?.length > 0 ? (
//                     data.skills.map((skill: string, index: number) => (
//                       <Badge key={index} variant="secondary">{skill}</Badge>
//                     ))
//                   ) : (
//                     <span className="text-gray-500 text-sm">No skills added</span>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Instructors</Label>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {data.instructors?.length > 0 ? (
//                     data.instructors.map((instructor: string, index: number) => (
//                       <Badge key={index} variant="outline">{instructor}</Badge>
//                     ))
//                   ) : (
//                     <span className="text-gray-500 text-sm">No instructors added</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {topics.length > 0 && (
//             <>
//               <Separator />
//               <div>
//                 <h4 className="font-semibold mb-3">Course Content Structure</h4>
//                 <div className="space-y-3">
//                   {topics.map((topic: any, index: number) => (
//                     <div key={topic.id || index} className="border rounded-lg p-3">
//                       <h5 className="font-medium">{topic.title}</h5>
//                       <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
//                       <div className="mt-2 space-y-1">
//                         {topic.subtopics?.map((subtopic: any, subIndex: number) => (
//                           <div key={subtopic.id || subIndex} className="ml-4 text-sm">
//                             <span className="text-gray-500">•</span> {subtopic.title}
//                           </div>
//                         ))}
//                       </div>
//                       <Badge variant="secondary" className="mt-2">
//                         {topic.subtopics?.length || 0} subtopic(s)
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Display Linked Organizations and Departments from data */}
//           {data.linked_entities?.length > 0 && (
//             <>
//               <Separator />
//               <div>
//                 <h4 className="font-semibold mb-3">Linked Organizations and Departments</h4>
//                 <div className="space-y-3">
//                   {data.linked_entities.map((entity: any, index: number) => (
//                     <div key={index} className="border rounded-lg p-3">
//                       <p className="font-medium">
//                         {entity.organization.name || entity.organizationName} (
//                         {entity.organization._id || entity.organization})
//                       </p>
//                       <div className="ml-4 space-y-1">
//                         {entity.departments?.length > 0 ? (
//                           entity.departments.map((dept: any, deptIndex: number) => (
//                             <p key={deptIndex} className="text-sm">
//                               - {dept.name} ({dept._id})
//                             </p>
//                           ))
//                         ) : (
//                           <p className="text-sm text-gray-500">No departments linked</p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* Avatar Selection */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Bot className="h-5 w-5" />
//             Select Course Avatar
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {avatars.map((avatar: any, index: number) => (
//               <div
//                 key={avatar._id || index}
//                 className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
//                   selectedAvatar === avatar._id
//                     ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//                 onClick={() => setSelectedAvatar(avatar._id)}
//               >
//                 <div className="text-center space-y-3">
//                   <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
//                     {avatar.avatarImage?.url ? (
//                       <img
//                         src={avatar.avatarImage.url}
//                         alt={avatar.avatarName}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <Bot className="h-8 w-8 text-gray-400" />
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-sm">{avatar.avatarName}</h4>
//                     <p className="text-xs text-gray-500 mt-1">ID: {avatar._id}</p>
//                   </div>
//                   {avatar.avatarVoiceId && (
//                     <div className="text-xs">
//                       <Badge variant="outline" className="text-xs">
//                         Voice: {avatar.avatarVoiceId}
//                       </Badge>
//                     </div>
//                   )}
//                   {selectedAvatar === avatar._id && (
//                     <div className="flex items-center justify-center">
//                       <CheckCircle className="h-4 w-4 text-blue-600" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//           {avatars.length === 0 && (
//             <div className="text-center py-8 text-gray-500">
//               <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
//               <p>No avatars available</p>
//             </div>
//           )}
//           {selectedAvatar && (
//             <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//               <p className="text-sm text-blue-800">
//                 <span className="font-medium">Selected Avatar:</span>{" "}
//                 {avatars.find((a: any) => a._id === selectedAvatar)?.avatarName}
//                 <span className="font-mono ml-2">({selectedAvatar})</span>
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Organization Linking */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Link to Organizations</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex gap-2">
//             <Select onValueChange={setSelectedOrganization} value={selectedOrganization}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select organization" />
//               </SelectTrigger>
//               <SelectContent>
//                 {organizations.map((org: any) => (
//                   <SelectItem key={org._id} value={org._id}>
//                     {`${org.name} (${org._id})`}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Button onClick={addOrganization}>
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>

//           {linkedEntities.map((entity: any, orgIndex: number) => {
//             const org = organizations.find((o: any) => o._id === entity.organization);
//             return (
//               <Card key={orgIndex} className="border-dashed">
//                 <CardContent className="p-4">
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <Label className="font-semibold">Organization ID:</Label>
//                       <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">
//                         {`${entity.organizationName} (${entity.organization})`}
//                       </p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeOrganization(orgIndex)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-sm">Department IDs:</Label>
//                     <div className="flex flex-wrap gap-1 mb-2">
//                       {entity.departments.map((dept: any, deptIndex: number) => (
//                         <Badge key={deptIndex} variant="outline">
//                           {`${dept.name} (${dept._id})`}
//                           <button
//                             onClick={() => removeDepartment(orgIndex, deptIndex)}
//                             className="ml-1 text-gray-500 hover:text-gray-700"
//                           >
//                             <X className="h-3 w-3" />
//                           </button>
//                         </Badge>
//                       ))}
//                     </div>
//                     <div className="flex gap-2">
//                       <Select onValueChange={setSelectedDepartment} value={selectedDepartment}>
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select department" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {org?.departments.map((dept: any) => (
//                             <SelectItem key={dept._id} value={dept._id}>
//                               {`${dept.name} (${dept._id})`}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => addDepartment(orgIndex)}
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </CardContent>
//       </Card>

//       {/* Actions */}
//       <div className="flex justify-between">
//         <Button variant="outline" onClick={onPrev}>
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Previous
//         </Button>
//         <Button
//           onClick={publishCourse}
//           disabled={isPublishing}
//           size="lg"
//           className="bg-green-600 hover:bg-green-700"
//         >
//           {isPublishing ? "Publishing..." : "Publish Course"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PublishStep;



//////////////////////////////////////////////////////////////


// import { useState, useEffect, useCallback, useMemo } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ChevronLeft, Plus, X, BookOpen, Users, FileText, Award, CheckCircle, Bot, Lock } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { api } from "@/services/api";

// interface PublishStepProps {
//   data: any;
//   onUpdate: (data: any) => void;
//   onPrev: () => void;
//   authToken: string;
//   isGlobalEditMode: boolean;
//   setIsGlobalEditMode?: (value: boolean) => void;
// }

// const PublishStep = ({ data, onUpdate, onPrev, authToken, isGlobalEditMode, setIsGlobalEditMode }: PublishStepProps) => {
//   // Detect edit mode if not passed as prop
//   const actualEditMode = isGlobalEditMode ;
//   console.log("actualEditMode--->",actualEditMode)

//   // Memoize organizations and avatars to prevent re-renders
//   const organizations = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("organizations") || "[]");
//     } catch {
//       return [];
//     }
//   }, []);

//   const avatars = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("avatars") || "[]");
//     } catch {
//       return [];
//     }
//   }, []);

//   // Initialize linkedEntities with data.linked_entities if available
//   const [linkedEntities, setLinkedEntities] = useState<any[]>(() => {
//     if (data.linked_entities && Array.isArray(data.linked_entities)) {
//       return data.linked_entities.map((entity: any) => ({
//         organization: entity.organization._id || entity.organization,
//         organizationName: entity.organization.name || entity.organizationName || "Unknown",
//         departments: entity.departments.map((dept: any) => ({
//           _id: dept._id,
//           name: dept.name || "Unknown",
//         })),
//       }));
//     }
//     return [];
//   });

//   const [selectedOrganization, setSelectedOrganization] = useState<string>("");
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("");
//   const [selectedAvatar, setSelectedAvatar] = useState<string>(data.courseAvatar?._id || data.courseAvatar || "");
//   const [isPublishing, setIsPublishing] = useState(false);
//   const [publishedCourse, setPublishedCourse] = useState<any>(null);
//   const [courseLink, setCourseLink] = useState<string>("");
//   const { toast } = useToast();

//   // Memoize computed values to prevent unnecessary re-renders
//   const computedStats = useMemo(() => {
//     const topics = data.topics || [];
//     const totalSubtopics = topics.reduce((sum: number, topic: any) => sum + (topic.subtopics?.length || 0), 0);
//     const assessments = data.assessments || data.subtopicAssessments || [];
//     console.log("assessments --->", assessments)
//     const totalAssessments = assessments.reduce((sum: number, sa: any) => sum + (sa.assessments?.length || 0), 0);
//     console.log("totalAssessments --->", totalAssessments)
    
//     return {
//       topics,
//       totalSubtopics,
//       assessments,
//       totalAssessments
//     };
//   }, [data.topics, data.assessments, data.subtopicAssessments]);

//   // Memoize selected avatar info
//   const selectedAvatarInfo = useMemo(() => {
//     return avatars.find((avatar: any) => avatar._id === selectedAvatar);
//   }, [avatars, selectedAvatar]);

//   // Update parent component with linkedEntities and avatar (memoized callback)
//   const updateParent = useCallback(() => {
//     onUpdate({
//       ...data,
//       linked_entities: linkedEntities,
//       courseAvatar: selectedAvatar,
//     });
//   }, [ linkedEntities, selectedAvatar]);

//   useEffect(() => {
//     updateParent();
//   }, [updateParent]);

//   const addOrganization = useCallback(() => {
//     if (!selectedOrganization) return;

//     const org = organizations.find((o: any) => o._id === selectedOrganization);
//     if (!org) return;

//     setLinkedEntities((prev) => [
//       ...prev,
//       {
//         organization: org._id,
//         organizationName: org.name,
//         departments: [],
//       },
//     ]);
//     setSelectedOrganization("");
//   }, [selectedOrganization, organizations]);

//   const addDepartment = useCallback((orgIndex: number) => {
//     if (!selectedDepartment) return;

//     const org = organizations.find((o: any) => o._id === linkedEntities[orgIndex].organization);
//     const dept = org?.departments.find((d: any) => d._id === selectedDepartment);
//     if (!dept) return;

//     setLinkedEntities((prev) =>
//       prev.map((entity, index) =>
//         index === orgIndex
//           ? {
//               ...entity,
//               departments: [...entity.departments, { _id: dept._id, name: dept.name }],
//             }
//           : entity
//       )
//     );
//     setSelectedDepartment("");
//   }, [selectedDepartment, organizations, linkedEntities]);

//   const removeOrganization = useCallback((index: number) => {
//     setLinkedEntities((prev) => prev.filter((_, i) => i !== index));
//   }, []);

//   const removeDepartment = useCallback((orgIndex: number, deptIndex: number) => {
//     setLinkedEntities((prev) =>
//       prev.map((entity, index) =>
//         index === orgIndex
//           ? {
//               ...entity,
//               departments: entity.departments.filter((_, i) => i !== deptIndex),
//             }
//           : entity
//       )
//     );
//   }, []);

//   const publishCourse = useCallback(async () => {
//     // setIsPublishing(true);
//     try {
//       const payload = {
//         courseId: data.id,
//         status: `${isPublishing ? "published" : "draft"}`,
//         linked_entities: linkedEntities.map((entity) => ({
//           organization: entity.organization,
//           departments: entity.departments.map((dept: any) => ({ _id: dept._id })),
//         })),
//         ...(selectedAvatar && { avatarId: selectedAvatar }),
//       };

//       const response = await fetch(api.PUBLISH_COURSE, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         const courseData = result.data.course;
//         setPublishedCourse(courseData);
//         setCourseLink(result.data.courseLink);
//         toast({
//           title: "Course Published!",
//           description: "Your course has been successfully published and is now available.",
//         });
//       } else {
//         throw new Error("Failed to publish course");
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to publish course. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsPublishing(false);
//     }
//   }, [data.id, linkedEntities, selectedAvatar, authToken, toast]);

//   return (
//     <div className="space-y-6">
//       {/* Published Course Details */}
//       {publishedCourse && (
//         <Card className="border-green-500 border-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-green-600">
//               <CheckCircle className="h-5 w-5" />
//               Course Published Successfully
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <p className="text-lg font-semibold">
//                 {publishedCourse.title} ({publishedCourse._id})
//               </p>
//               <div className="space-y-1">
//                 <Label className="text-sm font-semibold">Linked Organizations:</Label>
//                 {publishedCourse.linked_entities?.length > 0 ? (
//                   publishedCourse.linked_entities.map((entity: any, index: number) => {
//                     const org = organizations.find((o: any) => o._id === entity.organization);
//                     return (
//                       <div key={index} className="ml-2">
//                         <p className="text-sm font-medium">
//                           {org ? `${org.name}(${org._id})` : entity.organization}
//                         </p>
//                         <div className="ml-4 space-y-1">
//                           {entity.departments?.length > 0 ? (
//                             entity.departments.map((dept: any, deptIndex: number) => {
//                               const deptData = org?.departments.find((d: any) => d._id === dept);
//                               return (
//                                 <p key={deptIndex} className="text-sm">
//                                   - {deptData ? `${deptData.name}(${deptData._id})` : dept}
//                                 </p>
//                               );
//                             })
//                           ) : (
//                             <p className="text-sm text-gray-500">No departments linked</p>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <p className="text-sm text-gray-500">No organizations linked</p>
//                 )}
//               </div>
//               <p className="text-sm">
//                 <span className="font-semibold">Status:</span>{" "}
//                 <span className="text-green-600">{publishedCourse.status}</span>
//               </p>
//               {courseLink && (
//                 <div className="mt-4">
//                   <Button asChild className="bg-blue-600 hover:bg-blue-700">
//                     <a href={courseLink} target="_blank" rel="noopener noreferrer">
//                       View Course
//                     </a>
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Course Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <BookOpen className="h-5 w-5" />
//             Course Summary
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-semibold text-lg">{data.title || "Course Title"}</h3>
//                 <p className="text-gray-600 mt-1">{data.description || "No description provided"}</p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-3 bg-blue-50 rounded-lg">
//                   <FileText className="h-6 w-6 text-blue-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-blue-600">{computedStats.topics.length}</div>
//                   <div className="text-sm text-gray-600">Topics</div>
//                 </div>
//                 <div className="text-center p-3 bg-green-50 rounded-lg">
//                   <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-green-600">{computedStats.totalSubtopics}</div>
//                   <div className="text-sm text-gray-600">Subtopics</div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-3 bg-purple-50 rounded-lg">
//                   <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-purple-600">{computedStats.totalAssessments}</div>
//                   <div className="text-sm text-gray-600">Assessments</div>
//                 </div>
//                 <div className="text-center p-3 bg-orange-50 rounded-lg">
//                   <Users className="h-6 w-6 text-orange-600 mx-auto mb-1" />
//                   <div className="text-2xl font-bold text-orange-600">{data.instructors?.length || 0}</div>
//                   <div className="text-sm text-gray-600">Instructors</div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <Label className="text-sm font-semibold">Duration</Label>
//                 <p className="text-gray-600">{data.duration || "Not specified"}</p>
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Skills Covered</Label>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {data.skills?.length > 0 ? (
//                     data.skills.map((skill: string, index: number) => (
//                       <Badge key={index} variant="secondary">{skill}</Badge>
//                     ))
//                   ) : (
//                     <span className="text-gray-500 text-sm">No skills added</span>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <Label className="text-sm font-semibold">Instructors</Label>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {data.instructors?.length > 0 ? (
//                     data.instructors.map((instructor: string, index: number) => (
//                       <Badge key={index} variant="outline">{instructor}</Badge>
//                     ))
//                   ) : (
//                     <span className="text-gray-500 text-sm">No instructors added</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {computedStats.topics.length > 0 && (
//             <>
//               <Separator />
//               <div>
//                 <h4 className="font-semibold mb-3">Course Content Structure</h4>
//                 <div className="space-y-3">
//                   {computedStats.topics.map((topic: any, index: number) => (
//                     <div key={topic.id || index} className="border rounded-lg p-3">
//                       <h5 className="font-medium">{topic.title}</h5>
//                       <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
//                       <div className="mt-2 space-y-1">
//                         {topic.subtopics?.map((subtopic: any, subIndex: number) => (
//                           <div key={subtopic.id || subIndex} className="ml-4 text-sm">
//                             <span className="text-gray-500">•</span> {subtopic.title}
//                           </div>
//                         ))}
//                       </div>
//                       <Badge variant="secondary" className="mt-2">
//                         {topic.subtopics?.length || 0} subtopic(s)
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Display Linked Organizations and Departments from data */}
//           {data.linked_entities?.length > 0 && (
//             <>
//               <Separator />
//               <div>
//                 <h4 className="font-semibold mb-3">Linked Organizations and Departments</h4>
//                 <div className="space-y-3">
//                   {data.linked_entities.map((entity: any, index: number) => (
//                     <div key={index} className="border rounded-lg p-3">
//                       <p className="font-medium">
//                         {entity.organization.name || entity.organizationName} (
//                         {entity.organization._id || entity.organization})
//                       </p>
//                       <div className="ml-4 space-y-1">
//                         {entity.departments?.length > 0 ? (
//                           entity.departments.map((dept: any, deptIndex: number) => (
//                             <p key={deptIndex} className="text-sm">
//                               - {dept.name} ({dept._id})
//                             </p>
//                           ))
//                         ) : (
//                           <p className="text-sm text-gray-500">No departments linked</p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* Avatar Selection - Hidden in edit mode */}
//       {!actualEditMode&& (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Bot className="h-5 w-5" />
//               Select Course Avatar
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {avatars.map((avatar: any, index: number) => (
//                 <div
//                   key={avatar._id || index}
//                   className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
//                     selectedAvatar === avatar._id
//                       ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                   onClick={() => setSelectedAvatar(avatar._id)}
//                 >
//                   <div className="text-center space-y-3">
//                     <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
//                       {avatar.avatarImage?.url ? (
//                         <img
//                           src={avatar.avatarImage.url}
//                           alt={avatar.avatarName}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <Bot className="h-8 w-8 text-gray-400" />
//                       )}
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-sm">{avatar.avatarName}</h4>
//                       <p className="text-xs text-gray-500 mt-1">ID: {avatar._id}</p>
//                     </div>
//                     {avatar.avatarVoiceId && (
//                       <div className="text-xs">
//                         <Badge variant="outline" className="text-xs">
//                           Voice: {avatar.avatarVoiceId}
//                         </Badge>
//                       </div>
//                     )}
//                     {selectedAvatar === avatar._id && (
//                       <div className="flex items-center justify-center">
//                         <CheckCircle className="h-4 w-4 text-blue-600" />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {avatars.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
//                 <p>No avatars available</p>
//               </div>
//             )}
//             {selectedAvatar && (
//               <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                 <p className="text-sm text-blue-800">
//                   <span className="font-medium">Selected Avatar:</span>{" "}
//                   {selectedAvatarInfo?.avatarName}
//                   <span className="font-mono ml-2">({selectedAvatar})</span>
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* Show selected avatar info in edit mode (locked) */}
//       {actualEditMode  && selectedAvatar && selectedAvatarInfo && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Bot className="h-5 w-5" />
//               Course Avatar
//               <Lock className="h-4 w-4 text-amber-600" />
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center space-x-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
//               <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
//                 {selectedAvatarInfo.avatarImage?.url ? (
//                   <img
//                     src={selectedAvatarInfo.avatarImage.url}
//                     alt={selectedAvatarInfo.avatarName}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <Bot className="h-8 w-8 text-gray-400" />
//                 )}
//               </div>
//               <div className="flex-1">
//                 <h4 className="font-medium text-lg">{selectedAvatarInfo.avatarName}</h4>
//                 <p className="text-sm text-gray-600 font-mono mt-1">ID: {selectedAvatar}</p>
//                 {selectedAvatarInfo.avatarVoiceId && (
//                   <Badge variant="outline" className="text-xs mt-2">
//                     Voice: {selectedAvatarInfo.avatarVoiceId}
//                   </Badge>
//                 )}
//                 <div className="mt-3 p-2 bg-amber-100 rounded text-sm text-amber-800">
//                   <div className="flex items-center gap-2">
//                     <Lock className="h-4 w-4" />
//                     <span className="font-medium">Avatar is locked in edit mode and cannot be changed</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Show message if no avatar selected in edit mode */}
//       {actualEditMode && !selectedAvatar && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Bot className="h-5 w-5" />
//               Course Avatar
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-center py-8 text-gray-500">
//               <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
//               <p>No avatar was selected for this course</p>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Organization Linking */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Link to Organizations</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex gap-2">
//             <Select onValueChange={setSelectedOrganization} value={selectedOrganization}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select organization" />
//               </SelectTrigger>
//               <SelectContent>
//                 {organizations.map((org: any) => (
//                   <SelectItem key={org._id} value={org._id}>
//                     {`${org.name} (${org._id})`}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Button onClick={addOrganization}>
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>

//           {linkedEntities.map((entity: any, orgIndex: number) => {
//             const org = organizations.find((o: any) => o._id === entity.organization);
//             return (
//               <Card key={orgIndex} className="border-dashed">
//                 <CardContent className="p-4">
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <Label className="font-semibold">Organization ID:</Label>
//                       <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">
//                         {`${entity.organizationName} (${entity.organization})`}
//                       </p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeOrganization(orgIndex)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-sm">Department IDs:</Label>
//                     <div className="flex flex-wrap gap-1 mb-2">
//                       {entity.departments.map((dept: any, deptIndex: number) => (
//                         <Badge key={deptIndex} variant="outline">
//                           {`${dept.name} (${dept._id})`}
//                           <button
//                             onClick={() => removeDepartment(orgIndex, deptIndex)}
//                             className="ml-1 text-gray-500 hover:text-gray-700"
//                           >
//                             <X className="h-3 w-3" />
//                           </button>
//                         </Badge>
//                       ))}
//                     </div>
//                     <div className="flex gap-2">
//                       <Select onValueChange={setSelectedDepartment} value={selectedDepartment}>
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select department" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {org?.departments.map((dept: any) => (
//                             <SelectItem key={dept._id} value={dept._id}>
//                               {`${dept.name} (${dept._id})`}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => addDepartment(orgIndex)}
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </CardContent>
//       </Card>

//       {/* Actions */}
//       <div className="flex justify-between">
//         <Button variant="outline" onClick={onPrev}>
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Previous
//         </Button>
//         <div className=" flex gap-3">

//         <Button
//           onClick={() => {
//             setIsPublishing(false);
//             publishCourse();
//           }}
//           disabled={isPublishing}
//           size="lg"
//           className=" bg-blue-600 hover:bg-blue-500 text-white"
//         >
//           {"save as Draft"}
//         </Button>

//         <Button
//           onClick={() => {
//             setIsPublishing(true);
//             publishCourse();
//           }}
//           disabled={isPublishing}
//           size="lg"
//           className="bg-green-600 hover:bg-green-700"
//         >
//           { actualEditMode ? "Update Course" : "Publish Course"}
//           {/* {isPublishing ? "Publishing..." : "Publish Course"} */}
//         </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PublishStep;



///////////////////////correc////////


import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Plus, X, BookOpen, Users, FileText, Award, CheckCircle, Bot, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
//import { api } from "@/services/api";
import { api } from "../../services/api";
import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";


interface PublishStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onPrev: () => void;
  authToken: string;
  isGlobalEditMode: boolean;
  setIsGlobalEditMode?: (value: boolean) => void;
}

const PublishStep = ({ data, onUpdate, onPrev, authToken, isGlobalEditMode, setIsGlobalEditMode }: PublishStepProps) => {
  // Determine if we're in edit mode based on whether the course has an ID
  const isEditMode = isGlobalEditMode;
  
  const [organizations, setOrganizations] = useState<any[]>([]);
  const navigate = useNavigate();


  const [courseData, setCourseData] = useState<any>(null); // or type it better later
  const { courseId } = useParams();
  const pathname = window.location.pathname;
  const isEditModeFromPath = window.location.pathname.includes("/edit/");

  //const [linkedEntities, setLinkedEntities] = useState([]);

{/*
  // Memoize organizations and avatars to prevent re-renders
  const organizations = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("organizations") || "[]");
    } catch {
      return [];
    }
  }, []);
*/}

{/*
useEffect(() => {
  const fetchOrganizations = async () => {
    try {
      const res = await fetch(api.GET_ALL_ORGANIZATIONS, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const json = await res.json();
      console.log("Fetching Organizations before publishing :", json);

      if (json.success && Array.isArray(json.data)) {
        setOrganizations(json.data);
        localStorage.setItem("organizations", JSON.stringify(json.data)); // optional
      } else {
        console.warn("Failed to fetch organizations:", json.message);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  fetchOrganizations();
}, [authToken]);
*/}

{/*
useEffect(() => {
  const fetchOrganizations = async () => {
    try {
      const response = await fetch(api.GET_ALL_ORGANIZATIONS_API, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const json = await response.json();

      if (!Array.isArray(json.data)) {
        console.error("Expected an array but got:", json.data);
        return;
      }

      setOrganizations(json.data);
      localStorage.setItem("organizations", JSON.stringify(json.data));
    } catch (err) {
      console.error("Error fetching organizations:", err);
    }
  };

  fetchOrganizations();
}, [authToken]);
*/}

useEffect(() => {
  const fetchOrganizations = async () => {
    try {
      const response = await fetch(api.GET_ALL_ORGANIZATIONS_API, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const json = await response.json();

      if (!Array.isArray(json.data.organizations)) {
        console.error("Expected an array but got:", json.data);
        return;
      }

      setOrganizations(json.data.organizations);
      localStorage.setItem("organizations", JSON.stringify(json.data.organizations));
    } catch (err) {
      console.error("Error fetching organizations:", err);
    }
  };

  fetchOrganizations();
}, [authToken]);


const avatars = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("avatars") || "[]");
    } catch {
      return [];
    }
  }, []);

  /*
  // Initialize linkedEntities with data.linked_entities if available
  const [linkedEntities, setLinkedEntities] = useState<any[]>(() => {
    if (data.linked_entities && Array.isArray(data.linked_entities)) {
      return data.linked_entities.map((entity: any) => ({
        organization: entity.organization._id || entity.organization,
        organizationName: entity.organization.name || entity.organizationName || "Unknown",
        departments: entity.departments.map((dept: any) => ({
          _id: dept._id,
          name: dept.name || "Unknown",
        })),
      }));
    }
    return [];
  });
  */
    const [linkedEntities, setLinkedEntities] = useState<any[]>(() => {
      if (data.basicInfo?.organizations && Array.isArray(data.basicInfo.organizations)) {
        return data.basicInfo.organizations.map((org: any) => ({
          organization: org._id,
          organizationName: org.name,
          departments: org.departments.map((dept: any) => ({
            _id: dept._id,
            name: dept.name,
          })),
        }));
      }
      return [];
    });


  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  
  // Initialize selectedAvatar based on course data
  const [selectedAvatar, setSelectedAvatar] = useState<string>(() => {
    // In edit mode, use the existing avatar from course data
    if (isEditMode) {
      return data.courseAvatar?._id || data.courseAvatar || data.avatarId || "";
    }
    // In create mode, start with empty selection
    return "";
  });
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedCourse, setPublishedCourse] = useState<any>(null);
  const [courseLink, setCourseLink] = useState<string>("");
  const { toast } = useToast();

  // Memoize computed values to prevent unnecessary re-renders
  const computedStats = useMemo(() => {
    const topics = data.topics || [];
    const totalSubtopics = topics.reduce((sum: number, topic: any) => sum + (topic.subtopics?.length || 0), 0);
    const assessments = data.assessments || data.subtopicAssessments || [];
    const totalAssessments = assessments.reduce((sum: number, sa: any) => sum + (sa.assessments?.length || 0), 0);
    
    return {
      topics,
      totalSubtopics,
      assessments,
      totalAssessments
    };
  }, [data.topics, data.assessments, data.subtopicAssessments]);

  // Memoize selected avatar info
  const selectedAvatarInfo = useMemo(() => {
    return avatars.find((avatar: any) => avatar._id === selectedAvatar);
  }, [avatars, selectedAvatar]);

  
useEffect(() => {
  if (data?.linked_entities?.length > 0 && organizations.length > 0) {
    const initialEntities = data.linked_entities.map((entity: any) => {
      const org = organizations.find((o: any) => o._id === entity.organization);
      const departments = entity.departments.map((dept: any) => {
        const fullDept = org?.departments.find((d: any) => d._id === dept._id || d._id === dept); // handles both _id object and string
        return fullDept ? { _id: fullDept._id, name: fullDept.name } : dept;
      });

      return {
        organization: entity.organization,
        organizationName: org?.name || "",
        departments,
      };
    });

    setLinkedEntities(initialEntities);
  }
}, [data, organizations]);

  // Update parent component with linkedEntities and avatar (memoized callback)
  const updateParent = useCallback(() => {
    onUpdate({
      ...data,
      linked_entities: linkedEntities,
      courseAvatar: selectedAvatar,
    });
  }, [data, linkedEntities, selectedAvatar, onUpdate]);

  useEffect(() => {
    updateParent();
  }, [updateParent]);

  
//using  to fethc orgs & dept
useEffect(() => {
  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`${api.GET_COURSE_BY_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const json = await response.json();

      if (!json.data) {
        console.error("❌ Expected course data but got:", json);
        return;
      }

      const course = json.data;
      setCourseData(course);

      // Optionally set selected orgs/depts here if using form state
      // setSelectedOrganizations(course.linkedOrganizations);
      // setSelectedDepartments(course.linkedDepartments);

      console.log("✅ Loaded course data:", course);
    } catch (err) {
      console.error("❌ Error fetching course details:", err);
    }
  };

  if (courseId) {
    fetchCourseDetails();
  }
}, [authToken, courseId]);


useEffect(() => {
  if (courseData?.organizations && courseData.organizations.length > 0) {
    const formatted = courseData.organizations.map((org) => ({
      organization: { _id: org._id, name: org.name },
      departments: org.departments, // assumes these already include _id and name
    }));
    console.log("Setting linkedEntities to:", formatted); // debug
    setLinkedEntities(formatted);
  }
}, [courseData]);


//get linked orgs and department
useEffect(() => {
  const fetchLinkedEntities = async () => {
    try {
      const response = await fetch("https://wc-backend.zetrance.com/api/v1/courses/get-linked-entities/${courseId}", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ courseId }),
      });

      const result = await response.json();

      if (!result?.linked_entities) {
        console.error("No linked entities found:", result);
        return;
      }

      console.log("✅ Linked Entities:", result.linked_entities);
      setLinkedEntities(result.linked_entities);
    } catch (error) {
      console.error("❌ Error fetching linked entities:", error);
    }
  };

  if (courseId) {
    fetchLinkedEntities();
  }
}, [courseId, authToken]);


  const addOrganization = useCallback(() => {
    if (!selectedOrganization) return;

    const org = organizations.find((o: any) => o._id === selectedOrganization);
    if (!org) return;

    setLinkedEntities((prev) => [
      ...prev,
      {
        organization: org._id,
        organizationName: org.name,
        departments: [],
      },
    ]);
    setSelectedOrganization("");
  }, [selectedOrganization, organizations]);

  const addDepartment = useCallback((orgIndex: number) => {
    if (!selectedDepartment) return;

    const org = organizations.find((o: any) => o._id === linkedEntities[orgIndex].organization);
    const dept = org?.departments.find((d: any) => d._id === selectedDepartment);
    if (!dept) return;

    setLinkedEntities((prev) =>
      prev.map((entity, index) =>
        index === orgIndex
          ? {
              ...entity,
              departments: [...entity.departments, { _id: dept._id, name: dept.name }],
            }
          : entity
      )
    );
    setSelectedDepartment("");
  }, [selectedDepartment, organizations, linkedEntities]);

  const removeOrganization = useCallback((index: number) => {
    setLinkedEntities((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeDepartment = useCallback((orgIndex: number, deptIndex: number) => {
    setLinkedEntities((prev) =>
      prev.map((entity, index) =>
        index === orgIndex
          ? {
              ...entity,
              departments: entity.departments.filter((_, i) => i !== deptIndex),
            }
          : entity
      )
    );
  }, []);


  

  //function to update linked orgs & deparmtents
const saveLinkedEntities = async () => {
  try {
    if (!courseData?._id || linkedEntities.length === 0) {
      console.warn("❗Course ID or linked entities missing");
      return;
    }

    const payload = {
      courseId: courseData._id,
      linked_entities: linkedEntities,
    };

    const response = await axios.put(
      "https://wc-backend.zetrance.com/api/v1/courses/update-linked-entities",
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Linked entities updated:", response.data);
  } catch (error: any) {
    console.error("❌ Error updating linked entities:", error.response?.data || error.message);
  }
};


  const publishCourse = useCallback(async (isDraft = false) => {
    setIsPublishing(true);
    try {
      const payload = {
        courseId: data.id || data._id,
        status: isDraft ? "draft" : "published",
        linked_entities: linkedEntities.map((entity) => ({
          organization: entity.organization,
          departments: entity.departments.map((dept: any) => ({ _id: dept._id })),
        })),
        ...(selectedAvatar && { avatarId: selectedAvatar }),
      };

      const response = await fetch(api.PUBLISH_COURSE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        const courseData = result.data.course;
        setPublishedCourse(courseData);
        setCourseLink(result.data.courseLink);
        toast({
          title: isDraft ? "Course Saved as Draft!" : "Course Published!",
          description: isDraft 
            ? "Your course has been saved as a draft." 
            : "Your course has been successfully published and is now available.",
        });
      } else {
        throw new Error("Failed to publish course");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  }, [data.id, data._id, linkedEntities, selectedAvatar, authToken, toast]);

  //helper function to redirect admin to all course after course publish
  const handleViewCourse = () => {
    navigate("/admin/courses");
  }

  return (
    <div className="space-y-6">
      {/* Published Course Details */}
      {publishedCourse && (
        <Card className="border-green-500 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Course {publishedCourse.status === 'draft' ? 'Saved as Draft' : 'Published Successfully'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                {publishedCourse.title} ({publishedCourse._id})
              </p>
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Linked Organizations:</Label>
                {publishedCourse.linked_entities?.length > 0 ? (
                  publishedCourse.linked_entities.map((entity: any, index: number) => {
                    const org = organizations.find((o: any) => o._id === entity.organization);
                    return (
                      <div key={index} className="ml-2">
                        <p className="text-sm font-medium">
                          {org ? `${org.name}(${org._id})` : entity.organization}
                        </p>
                        <div className="ml-4 space-y-1">
                          {entity.departments?.length > 0 ? (
                            entity.departments.map((dept: any, deptIndex: number) => {
                              const deptData = org?.departments.find((d: any) => d._id === dept);
                              return (
                                <p key={deptIndex} className="text-sm">
                                  - {deptData ? `${deptData.name}(${deptData._id})` : dept}
                                </p>
                              );
                            })
                          ) : (
                            <p className="text-sm text-gray-500">No departments linked</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No organizations linked</p>
                )}
              </div>
              <p className="text-sm">
                <span className="font-semibold">Status:</span>{" "}
                <span className={publishedCourse.status === 'draft' ? "text-orange-600" : "text-green-600"}>
                  {publishedCourse.status}
                </span>
              </p>
              {courseLink && publishedCourse.status === 'published' && (
                <div className="mt-4">
                  {/*
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <a href={courseLink} target="_blank" rel="noopener noreferrer">
                      View Course
                    </a>
                  </Button>
                  */}
                  <Button onClick={handleViewCourse} className="bg-blue-600 hover:bg-blue-700">
                    View Course
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Summary */}
        

      <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-md rounded-xl p-6 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{data.title || "Course Title"}</h3>
                <p className="text-white-50 mt-1">{data.description || "No description provided"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg  bg-white/5 backdrop-blur-md border border-white/10 text-white">
                  <FileText className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-blue-600">{computedStats.topics.length}</div>
                  <div className="text-sm text-white 50">Topics</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white">
                  <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-green-600">{computedStats.totalSubtopics}</div>
                  <div className="text-sm text-white 50">Subtopics</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white">
                  <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-purple-600">{computedStats.totalAssessments}</div>
                  <div className="text-sm text-white 50">Assessments</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white">
                  <Users className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-orange-600">{data.instructors?.length || 0}</div>
                  <div className="text-sm text-white 50">Instructors</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Duration</Label>
                <p className="text-white-50">{data.duration || "Not specified"}</p>
              </div>

              <div>
                <Label className="text-sm font-semibold">Skills Covered</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.skills?.length > 0 ? (
                    data.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills added</span>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Instructors</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.instructors?.length > 0 ? (
                    data.instructors.map((instructor: string, index: number) => (
                      <Badge key={index} variant="secondary">{instructor}</Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No instructors added</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {computedStats.topics.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="font-semibold mb-3">Course Content Structure</h2>
                <div className="space-y-3">
                  {computedStats.topics.map((topic: any, index: number) => (
                    <div key={topic.id || index} className="border rounded-lg p-3">
                      <h5 className="font-medium">{topic.title}</h5>
                      <p className="text-sm text-white 50 mt-1">{topic.description}</p>
                      <div className="mt-2 space-y-1">
                        {topic.subtopics?.map((subtopic: any, subIndex: number) => (
                          <div key={subtopic.id || subIndex} className="ml-4 text-sm">
                            <span className="text-gray-500">•</span> {subtopic.title}
                          </div>
                        ))}
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        {topic.subtopics?.length || 0} subtopic(s)
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Display Linked Organizations and Departments from data */}
          {/*
          {data.linked_entities?.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Linked Organizations and Departments</h4>
                <div className="space-y-3">
                  {data.linked_entities.map((entity: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <p className="font-medium">
                        {entity.organization.name || entity.organizationName} (
                        {entity.organization._id || entity.organization})
                      </p>
                      <div className="ml-4 space-y-1">
                        {entity.departments?.length > 0 ? (
                          entity.departments.map((dept: any, deptIndex: number) => (
                            <p key={deptIndex} className="text-sm">
                              - {dept.name} ({dept._id})
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No departments linked</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          */}
          
          {linkedEntities.map((entry) => (
            <div key={entry.organization._id} className="mb-4">
              <div className="font-bold text-blue-600">{entry.organization.name}</div>
              <ul className="ml-4 list-disc">
                {entry.departments.map((dept) => (
                  <li key={dept._id}>{dept.name}</li>
                ))}
              </ul>
            </div>
          ))}


          {data.linked_entities?.length > 0 && (
            <>
              <Separator />
                <div>
                  <h4 className="font-semibold mb-3">Linked Organizations and Departments</h4>

                  {/*  Render if there are linked entities */}
                  {Array.isArray(data.linked_entities) && data.linked_entities.length > 0 ? (
                    <div className="space-y-3">
                      {data.linked_entities.map((entity: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <p className="font-medium">
                            {entity.organization?.name || entity.organizationName} (
                            {entity.organization?._id || entity.organization})
                          </p>
                          <div className="ml-4 space-y-1">
                            {entity.departments?.length > 0 ? (
                              entity.departments.map((dept: any, deptIndex: number) => (
                                <p key={deptIndex} className="text-sm">
                                  - {dept.name} ({dept._id})
                                </p>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">No departments linked</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    //  This renders when linked_entities exists but is empty
                    <p className="text-sm italic text-muted-foreground">
                      No linked organizations found.
                    </p>
                  )}
                </div>

            </>
          )}

        </CardContent>
      </Card>

      {/* Avatar Selection Section */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Course Avatar
            {isEditMode && <Lock className="h-4 w-4 text-amber-600" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditMode ? (
            // CREATE MODE: Show all avatars for selection
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {avatars.map((avatar: any, index: number) => (
                  <div
                    key={avatar._id || index}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedAvatar === avatar._id
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedAvatar(avatar._id)}
                  >
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {avatar.avatarImage?.url ? (
                          <img
                            src={avatar.avatarImage.url}
                            alt={avatar.avatarName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Bot className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{avatar.avatarName}</h4>
                        <p className="text-xs text-gray-500 mt-1">ID: {avatar._id}</p>
                      </div>
                      {avatar.avatarVoiceId && (
                        <div className="text-xs">
                          <Badge variant="outline" className="text-xs">
                            Voice: {avatar.avatarVoiceId}
                          </Badge>
                        </div>
                      )}
                      {selectedAvatar === avatar._id && (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {avatars.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No avatars available</p>
                </div>
              )}
              {selectedAvatar && selectedAvatarInfo && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Selected Avatar:</span>{" "}
                    {selectedAvatarInfo.avatarName}
                    <span className="font-mono ml-2">({selectedAvatar})</span>
                  </p>
                </div>
              )}
            </>
          ) : (
            // EDIT MODE: Show locked avatar or no avatar message
            <>
              {selectedAvatar && selectedAvatarInfo ? (
                <div className="flex items-center space-x-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {selectedAvatarInfo.avatarImage?.url ? (
                      <img
                        src={selectedAvatarInfo.avatarImage.url}
                        alt={selectedAvatarInfo.avatarName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Bot className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{selectedAvatarInfo.avatarName}</h4>
                    <p className="text-sm text-gray-600 font-mono mt-1">ID: {selectedAvatar}</p>
                    {selectedAvatarInfo.avatarVoiceId && (
                      <Badge variant="outline" className="text-xs mt-2">
                        Voice: {selectedAvatarInfo.avatarVoiceId}
                      </Badge>
                    )}
                    <div className="mt-3 p-2 bg-amber-100 rounded text-sm text-amber-800">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span className="font-medium">Avatar is locked in edit mode and cannot be changed</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No avatar was assigned to this course</p>
                  <p className="text-sm mt-1">Avatar selection is locked in edit mode</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card> */}

      {/* Organization Linking */}
      <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-md rounded-xl p-6 text-white">
        <CardHeader>
          <CardTitle>Link to Organizations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select onValueChange={setSelectedOrganization} value={selectedOrganization}>
              <SelectTrigger   className="w-full bg-black/80 backdrop-blur-md border border-white/10 text-white placeholder-white/60 shadow-sm focus:ring-0 focus:outline-none">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent className="bg-black/10 text-white border border-white/10">
                {organizations.map((org: any) => (
                  <SelectItem key={org._id} value={org._id}>
                    {`${org.name} (${org._id})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addOrganization}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {linkedEntities.map((entity: any, orgIndex: number) => {
            const org = organizations.find((o: any) => o._id === entity.organization);
            return (
              <Card key={orgIndex} className="border-dashed">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Label className="font-semibold">Organization ID:</Label>
                      <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                        {`${entity.organizationName} (${entity.organization})`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOrganization(orgIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Department IDs:</Label>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {entity.departments.map((dept: any, deptIndex: number) => (
                        <Badge key={deptIndex} variant="outline">
                          {`${dept.name} (${dept._id})`}
                          <button
                            onClick={() => removeDepartment(orgIndex, deptIndex)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Select onValueChange={setSelectedDepartment} value={selectedDepartment}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {org?.departments.map((dept: any) => (
                            <SelectItem key={dept._id} value={dept._id}>
                              {`${dept.name} (${dept._id})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addDepartment(orgIndex)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="bg-black text-white border border-white/20 hover:bg-black">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <div className="flex gap-3">
          {/* <Button
            onClick={() => publishCourse(true)}
            disabled={isPublishing}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            {isPublishing ? "Saving..." : "Save as Draft"}
          </Button> */}

          <Button
            onClick={() => publishCourse(false)}
            disabled={isPublishing}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            {isPublishing ? "Publishing..." : (isEditModeFromPath ? "Update Course" : "Publish Course")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublishStep;