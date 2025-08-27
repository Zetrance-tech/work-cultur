
import { useState, useEffect ,useMemo} from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Save, Loader2, Plus, Edit, Trash2Icon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
//import { api } from "@/services/api";
import { api } from "../../services/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, PlusCircle, Users, FileText, Award, CheckCircle, Bot, Lock ,Trash2} from "lucide-react";
import { fork } from "child_process";
import axios from "axios";
import { useNavigate, useParams ,useLocation} from "react-router-dom";

interface BasicInfoStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  authToken: string;
  isGlobalEditMode: boolean;
  setIsGlobalEditMode: (value: boolean) => void;
  onGlobalCancel: () => void;
}

const BasicInfoStep = ({ data, onUpdate, onNext, authToken, isGlobalEditMode, setIsGlobalEditMode, onGlobalCancel }: BasicInfoStepProps) => {
  const [formData, setFormData] = useState({
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
    ...data,
  });
  const [newSkill, setNewSkill] = useState("");
  const [newInstructor, setNewInstructor] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(!data.id); // Enable fields for new course
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
////////////////////////////////////////
const isEditMode = isGlobalEditMode;

const avatars = useMemo(() => {
  try {
    return JSON.parse(localStorage.getItem("avatars") || "[]");
  } catch {
    return [];
  }
}, []);

const [selectedAvatar, setSelectedAvatar] = useState<string>(() => {
  // In edit mode, use the existing avatar from course data
  if (isEditMode) {
    return data.courseAvatar?._id || data.courseAvatar || data.avatarId || "";
  }
  // In create mode, start with empty selection
  return "";
});


console.log("intail avatar selectin--->", selectedAvatar)

const selectedAvatarInfo = useMemo(() => {
  return avatars.find((avatar: any) => avatar._id === selectedAvatar);
}, [avatars, selectedAvatar]);

  // Fetch avatars
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch(api.GET_AVATARS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          localStorage.setItem('avatars', JSON.stringify(result.data));
          toast({
            title: "Avatars Fetched Successfully",
            description: "All avatars fetched successfully",
          });
        } else {
          throw new Error("Failed to fetch avatars");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch avatars. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchAvatars();
  }, [authToken, toast]);



  //////////////////////////////

  // Update form data when props change
  useEffect(() => {

    console.log("Received data in BasicInfoStep:", data); 

    setFormData((prev) => ({
      ...prev,
      ...data,
      // avatarId:selectedAvatar,
      ai_settings: {
        persona_prompt: data.ai_settings?.persona_prompt || "",
        ability_prompt: data.ai_settings?.ability_prompt || "",
        rag_documents: data.ai_settings?.rag_documents || [],
      },
    }));
    setEditMode(!data.id); // Enable fields for new course, disable for existing
  }, [data]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAISettingChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ai_settings: { ...prev.ai_settings, [field]: value },
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addInstructor = () => {
    if (newInstructor.trim()) {
      setFormData((prev) => ({
        ...prev,
        instructors: [...prev.instructors, newInstructor.trim()],
      }));
      setNewInstructor("");
    }
  };

  const removeInstructor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructors: prev.instructors.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setSaveMessage("Course title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setSaveMessage("Course description is required");
      return false;
    }
    return true;
  };

  const createCourse = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setSaveMessage("");
    console.log("basic infor --->", formData);
    try {
      const response = await fetch(api.CREATE_COURSE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        const course_id = result.data.course._id;

        //const updatedData = { ...formData, id: result.data.course._id };
        const updatedData = { ...formData, id: course_id };

        setFormData(updatedData);
        onUpdate(updatedData);
        //setIsGlobalEditMode(true); // Set to edit mode for the newly created course
        setEditMode(false); // Disable fields after saving
        setSaveMessage("Course created successfully!");
        toast({
          title: "Success",
          description: "Course created successfully!",
        });

        // Redirect to content step with course ID in URL
          navigate(`/admin/courses/create/course/${course_id}/content`);

      } else {
        throw new Error(`Failed to create course: ${response.statusText}`);
      }
    } catch (error: any) {
      setSaveMessage(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: `Failed to create course: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateCourse = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setSaveMessage("");

    try {
      const editedData = { ...formData, courseId: formData.id };
      const response = await fetch(api.UPDATE_COURSE, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        onUpdate(editedData);
        setEditMode(false); // Disable fields after saving
        setSaveMessage("Course information updated successfully!");
        toast({
          title: "Success",
          description: "Course information updated successfully!",
        });
      } else {
        throw new Error(`Failed to update course: ${response.statusText}`);
      }
    } catch (error: any) {
      setSaveMessage(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: `Failed to update course: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    if (formData.id) {
      updateCourse();
    } else {
      createCourse();
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setSaveMessage("");
  };

  const handleCancelEdit = () => {
    setFormData((prev) => ({ ...prev, ...data }));
    setSaveMessage("");
    setEditMode(false);
  };

  const handleGlobalCancel = () => {
    setFormData({
      title: "",
      description: "",
      duration: "",
      image_url: "",
      skills: [],
      instructors: [],
      avatarId: "",
      ai_settings: {
        persona_prompt: "",
        ability_prompt: "",
        rag_documents: [],
      },
    });
    setIsGlobalEditMode(false);
    setEditMode(true); // Enable fields for new course
    setSaveMessage("");
    onGlobalCancel();
  };

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    setFormData((prev) => ({
      ...prev,
      avatarId,
    }));
  };



  const deleteBasicInfo = async (id: string) => {
    setDeletingCourse(id);
    try {
      const response = await axios.delete(api.DELETE_COURSE, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        data: { courseId: id },
      });

      if (response.status === 200) {
        onGlobalCancel();
        setSaveMessage("");
        toast({
          title: "Success", 
          description: "Course deleted successfully!"
        });
      } else {
        toast({
          title: "Error", 
          description: "Failed to delete course",
          variant: "destructive",
        });
        throw new Error(`Failed to delete course: ${response.statusText}`);
        
      }
    }
     catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete course: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setDeletingCourse(null);
    }
  };

  {/*
  return (
    <div className="space-y-6">
      
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">

        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Information</CardTitle>
            {formData.id && isGlobalEditMode && (
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <span className="bg-green-100 px-2 py-1 rounded-md">
                  Editing existing course
                </span>
              </p>
            )}
            <div className="flex gap-2">
              {!editMode && formData.id && (
                <div className="flex gap-3 items-center">
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Course Info
                  </Button>
                  <Button variant="outline" onClick={handleGlobalCancel}>
                    Cancel Edit
                  </Button>
               

                  <Button
                variant="outline"
                size="sm"
                onClick={()=>deleteBasicInfo(formData.id)}
                className={`${deletingCourse === formData.id ? 'text-gray-400' : 'text-red-600 hover:text-red-700'}`}
                disabled={isSaving || deletingCourse === formData.id}
              >
                {deletingCourse === formData.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
                </div>


                  
              )}
              {editMode && (
                <>
                  {formData.id && (
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {isSaving
                      ? "Saving..."
                      : formData.id
                      ? "Save Changes"
                      : "Create Course"}
                  </Button>
                </>
              )}
            </div>
          </div>
          {saveMessage && (
            <div
              className={`text-sm mt-2 ${
                saveMessage.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
            >
              {saveMessage}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Web Development Fundamentals"
                disabled={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="e.g., 8 weeks"
                disabled={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
          </div>

          <div className="space-y-2 min-h-10">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="A comprehensive course covering..."
              rows={3}
              disabled={!editMode}
              className={`min-h-40 ${!editMode ? "bg-gray-50" : ""}`}
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Course Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange("image_url", e.target.value)}
              placeholder="https://example.com/course-image.jpg"
              disabled={!editMode}
              className={!editMode ? "bg-gray-50" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {skill}
                  {editMode && (
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {editMode && (
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button type="button" variant="outline" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Instructors</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.instructors.map((instructor: string, index: number) => (
                <Badge key={index} variant="outline">
                  {instructor}
                  {editMode && (
                    <button
                      onClick={() => removeInstructor(index)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {editMode && (
              <div className="flex gap-2">
                <Input
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  placeholder="Add an instructor"
                  onKeyPress={(e) => e.key === "Enter" && addInstructor()}
                />
                <Button type="button" variant="outline" onClick={addInstructor}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

  {/* Avatar Selection Section */}
  {/*
      <Card>
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
                    onClick={() => handleAvatarSelect(avatar._id)}
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
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Assistant Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="persona_prompt">Persona Prompt</Label>
            <Textarea
              id="persona_prompt"
              value={formData.ai_settings.persona_prompt}
              onChange={(e) => handleAISettingChange("persona_prompt", e.target.value)}
              placeholder="You are a web development instructor with 10 years of experience..."
              rows={3}
              disabled={!editMode}
              className={`min-h-32 ${!editMode ? "bg-gray-50" : ""}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ability_prompt">Ability Prompt</Label>
            <Textarea
              id="ability_prompt"
              value={formData.ai_settings.ability_prompt}
              onChange={(e) => handleAISettingChange("ability_prompt", e.target.value)}
              placeholder="You can help students understand concepts, debug code..."
              rows={3}
              disabled={!editMode}
              className={`min-h-32 ${!editMode ? "bg-gray-50" : ""}`}
            />
          </div>
        </CardContent>
      </Card>
*/}

      {/* <Card>
        <CardHeader>
          <CardTitle>Knowlaged based</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="persona_prompt">Knowlaged based</Label>
           
          </div>
        </CardContent>
      </Card> */}

      {/*
      <div className="flex justify-between items-center">
        <div>
          {saveMessage && !saveMessage.includes("Error") && formData.id && (
            <div className="text-sm text-green-600 flex items-center">
              <span className="mr-2">✓</span>
              {saveMessage}
            </div>
          )}
        </div>
        <Button
          onClick={onNext}
          size="lg"
          disabled={!formData.id || editMode}
        >
          Continue to Content
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoStep;
*/}

return (
  <div className="space-y-6 text-white">
    {/* Course Information Card */}
    {/*<Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 overflow-hidden">*/}
    <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] rounded-xl text-white">

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Course Information</CardTitle>
          {formData.id && location.pathname.includes('/edit') && (
            <p className="text-sm text-green-400 mt-1 flex items-center">
              <span className="bg-green-500/10 px-2 py-1 rounded-md">
                Editing existing course
              </span>
            </p>
          )}
          <div className="flex gap-2">
            { formData.id && location.pathname.includes('/edit') && (
              <div className="flex gap-3 items-center">
                <Button variant="outline" onClick={handleEdit} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Course Info
                </Button>
                <Button variant="outline" onClick={handleGlobalCancel} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20">
                  Cancel Edit
                </Button>
                {/*
                <Button
                  //variant="outline"
                  size="sm"
                  onClick={() => deleteBasicInfo(formData.id)}
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 ${deletingCourse === formData.id ? 'text-gray-400 ' : 'text-red-400 hover:text-red-500'}`}
                  disabled={isSaving || deletingCourse === formData.id}
                >
                  {deletingCourse === formData.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
                */}
                <button
                    onClick={() => deleteBasicInfo(formData.id)}
                    disabled={isSaving || deletingCourse === formData.id}
                    className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-md px-3 py-2 text-sm ${
                      deletingCourse === formData.id
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-400 hover:text-red-500 hover:bg-white/10'
                    }`}
                  >
                    {deletingCourse === formData.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>

              </div>
            )}
            {editMode && (
              <>
                {formData.id && (
                  <Button variant="outline" onClick={handleCancelEdit} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20">
                    Cancel
                  </Button>
                )}
                {/*
                <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isSaving ? "Saving..." : formData.id ? "Save Changes" : "Create Course"}
                </Button>
                */}
              </>
            )}
          </div>
        </div>
        {saveMessage && (
          <div className={`text-sm mt-2 ${saveMessage.includes("Error") ? "text-red-400" : "text-green-400"}`}>{saveMessage}</div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Web Development Fundamentals"
                disabled={!editMode}
                //className={!editMode ? "bg-gray-50" : ""}
                className={`bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400 ${
                  !editMode ? 'opacity-50 cursor-not-allowed' : ''
                }`}


              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="e.g., 8 weeks"
                disabled={!editMode}
                //className={!editMode ? "bg-gray-50" : ""}
                 className={`bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400 ${
                  !editMode ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          <div className="space-y-2 min-h-10">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="A comprehensive course covering..."
              rows={3}
              disabled={!editMode}
              //className={`min-h-40 ${!editMode ? "bg-gray-50" : ""}`}
               className={`bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400 ${
                  !editMode ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Course Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange("image_url", e.target.value)}
              placeholder="https://example.com/course-image.jpg"
              disabled={!editMode}
              //className={!editMode ? "bg-gray-50" : ""}
              className={`bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400 ${
                !editMode ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {skill}
                  
                  {editMode && (
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )} 
                  
                </Badge>
              ))}
            </div>
            {editMode && (
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  //onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  onKeyPress={(e) => {
                  if (e.key === "Enter") {
                      e.preventDefault(); // prevents form submission
                      addSkill();
                    }
                  }}
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400 ${
                    !editMode ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                <Button type="button" variant="outline" onClick={addSkill} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Instructors</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.instructors.map((instructor: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-white text-black border border-white/30 shadow-sm">
                  {instructor}
                  {editMode && (
                    <button
                      onClick={() => removeInstructor(index)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {editMode && (
              <div className="flex gap-2">
                <Input
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  placeholder="Add an instructor"
                  //onKeyPress={(e) => e.key === "Enter" && addInstructor()}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInstructor();
                    }
                  }}
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400 ${
                    !editMode ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                <Button type="button" variant="outline" onClick={addInstructor} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
    </Card>

    {/* Avatar Section Card */}
    <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] rounded-xl text-white">
    <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Course Avatar
          {isEditMode && <Lock className="h-4 w-4 text-amber-500" />}
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
                    
                    //className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    //  selectedAvatar === avatar._id
                    //    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    //    : "border-gray-200 hover:border-gray-300"
                    //}`}
                    
                    className={`border border-white/10 bg-white/5 backdrop-blur-md rounded-lg p-4 cursor-pointer transition-all hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] ${
                      selectedAvatar === avatar._id
                        ? "ring-2 ring-cyan-300"
                        : "hover:border-white/20"
                    }`}

                    onClick={() => handleAvatarSelect(avatar._id)}
                  >
                    <div className="text-center space-y-3">
                      {/*<div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"> */}
                      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center">

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
                        <p className="text-xs text-white/60">ID: {avatar._id}</p>
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
    </Card>

    {/* AI Settings Card */}
    <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] rounded-xl text-white">
      <CardHeader>
        <CardTitle>AI Assistant Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="persona_prompt">Persona Prompt</Label>
          <Textarea
            id="persona_prompt"
            value={formData.ai_settings.persona_prompt}
            onChange={(e) => handleAISettingChange("persona_prompt", e.target.value)}
            placeholder="You are a web development instructor with 10 years of experience..."
            rows={3}
            disabled={!editMode}
           // className={`min-h-32 ${!editMode ? "bg-white/10" : "bg-white/5"} text-white`} 
           //className={`min-h-32 ${!editMode ? "bg-white/10 backdrop-blur-sm border border-white/10 text-white" : ""}`}
           className={`bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400 ${
              !editMode ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ability_prompt">Ability Prompt</Label>
          <Textarea
            id="ability_prompt"
            value={formData.ai_settings.ability_prompt}
            onChange={(e) => handleAISettingChange("ability_prompt", e.target.value)}
            placeholder="You can help students understand concepts, debug code..."
            rows={3}
            disabled={!editMode}
            //className={`min-h-32 ${!editMode ? "bg-white/10" : "bg-white/5"} text-white`}
            className={`bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400 ${
              !editMode ? "opacity-50 cursor-not-allowed" : ""
            }`}

          />
        </div>
      </CardContent>
    </Card>

{/*
    <div className="flex justify-between items-center">
      <div>
        {saveMessage && !saveMessage.includes("Error") && formData.id && (
          <div className="text-sm text-green-400 flex items-center">
            <span className="mr-2">✓</span>
            {saveMessage}
          </div>
        )}
      </div>
      <Button onClick={onNext} size="lg" disabled={!formData.id || editMode} className="bg-blue-600 hover:bg-blue-700 text-white">
        Continue to Content
      </Button>
    </div>
    */}


    <div className="flex justify-between items-center mt-6">
    <div>
      {saveMessage && !saveMessage.includes("Error") && formData.id && (
        <div className="text-sm text-green-400 flex items-center">
          <span className="mr-2">✓</span>
          {saveMessage}
        </div>
      )}
    </div>

    <div className="flex gap-4">
      {/* Create/Save Button at bottom */}
      {editMode && (
        <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Saving..." : formData.id ? "Save Changes" : "Create Course"}
        </Button>
      )}

      {/* Show only if course created & not in edit mode */}
      {!editMode && formData.id && (
        <Button onClick={onNext} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
          Continue to Content
        </Button>
      )}
    </div>
  </div>

  </div>
);
};

export default BasicInfoStep;
