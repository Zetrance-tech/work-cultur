import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Save, X, ArrowLeft,ArrowRight} from "lucide-react";
import { useNavigate,useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
//import { api } from '@/api'; // Import the API constants
import { api } from '../services/api'; // Import the API constants

interface QuestionOption {
  value: string;
  label: string;
}

interface Question {
  _id?: string;
  assessmentId: string;
  order?: number;
  questionText: string;
  questionType: 'multiple_choice' | 'descriptive' | 'video' | 'audio';
  options?: QuestionOption[];
  correctAnswer?: string[];
  sampleAnswer?: string;
  instructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

const AddQuestion = () => {
  const { assessmentId,courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  //const isEditMode = location.pathname.includes("/edit/");//used to detect whether url contain edit
  const isEditMode = location.state?.isEditMode ?? false; // fallback to false

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    assessmentId: assessmentId || '',
    questionText: '',
    questionType: 'multiple_choice',
    options: [{ value: '', label: '' }, { value: '', label: '' }],
    correctAnswer: [],
    sampleAnswer: '',
    instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{title: string, description: string, variant?: string} | null>(null);

  const showToast = (toastData: {title: string, description: string, variant?: string}) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    if (assessmentId) {
      fetchQuestions();
    }
  }, [assessmentId]);

  //FRONTED API CALL TO  FETCH QUESTIONS FROM BACKEND
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      /*
      const response = await axios.post(
        api.GET_QUESTIONS_BY_ASSESSMENT,
        { assessmentId },
        {
          headers: {
            //'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Authorization': `Bearer ${localStorage.getItem('workcultur_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      */
      const response = await axios.get(
        `${api.GET_QUESTIONS_BY_ASSESSMENT}/${assessmentId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('workcultur_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("API response for GET_QUESTIONS_BY_ASSESSMENT:",response);
      setQuestions(response.data.data.questions || []);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentQuestion({
      assessmentId: assessmentId || '',
      questionText: '',
      questionType: 'multiple_choice',
      options: [{ value: '', label: '' }, { value: '', label: '' }],
      correctAnswer: [],
      sampleAnswer: '',
      instructions: ''
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleQuestionTypeChange = (type: string) => {
    const newQuestion = { ...currentQuestion, questionType: type as Question['questionType'] };
    
    if (type === 'multiple_choice') {
      newQuestion.options = [{ value: '', label: '' }, { value: '', label: '' }];
      newQuestion.correctAnswer = [];
      newQuestion.sampleAnswer = '';
    } else {
      newQuestion.options = [];
      newQuestion.correctAnswer = [];
      if (type === 'descriptive') {
        newQuestion.instructions = '';
      } else {
        newQuestion.sampleAnswer = '';
      }
    }
    
    setCurrentQuestion(newQuestion);
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), { value: '', label: '' }]
    }));
  };

  const removeOption = (index: number) => {
    const currentOptions = currentQuestion.options || [];
    
    if (currentQuestion.questionType === 'multiple_choice' && currentOptions.length <= 2) {
      showToast({
        title: "Warning",
        description: "Multiple choice questions must have at least 2 options",
        variant: "destructive"
      });
      return;
    }

    const optionToRemove = currentOptions[index];
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || [],
      correctAnswer: prev.correctAnswer?.filter(answer => answer !== optionToRemove.label) || []
    }));
  };

  const updateOption = (index: number, field: 'value' | 'label', value: string) => {
    const oldValue = currentQuestion.options?.[index]?.value || '';
    
    setCurrentQuestion(prev => {
      const newOptions = prev.options?.map((option, i) => {
        if (i === index) {
          const newOption = { ...option, [field]: value };
          if (field === 'label') {
            newOption.value = value;
          }
          return newOption;
        }
        return option;
      }) || [];
      
      let newcorrectAnswer = prev.correctAnswer || [];
      if (field === 'label' && oldValue && newcorrectAnswer.includes(oldValue)) {
        newcorrectAnswer = newcorrectAnswer.map(answer => 
          answer === oldValue ? value : answer
        );
      }
      
      return {
        ...prev,
        options: newOptions,
        correctAnswer: newcorrectAnswer
      };
    });
  };

  const handleCorrectAnswerChange = (optionValue: string) => {
    const optionLabel = currentQuestion.options?.find(opt => opt.value === optionValue)?.label || optionValue;
    
    setCurrentQuestion(prev => ({
      ...prev,
      correctAnswer: [optionLabel]
    }));
  };

  const validateQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      showToast({
        title: "Validation Error",
        description: "Question text is required",
        variant: "destructive"
      });
      return false;
    }

    if (currentQuestion.questionType === 'multiple_choice') {
      const validOptions = currentQuestion.options?.filter(opt => opt.label.trim());
      if (!validOptions || validOptions.length < 2) {
        showToast({
          title: "Validation Error",
          description: "At least 2 valid options are required for multiple choice questions",
          variant: "destructive"
        });
        return false;
      }
      
      if (!currentQuestion.correctAnswer || currentQuestion.correctAnswer.length !== 1) {
        showToast({
          title: "Validation Error",
          description: "Exactly one correct answer must be selected",
          variant: "destructive"
        });
        return false;
      }

      const optionLabels = validOptions.map(opt => opt.label);
      if (!optionLabels.includes(currentQuestion.correctAnswer[0])) {
        showToast({
          title: "Validation Error",
          description: "The selected correct answer doesn't match any option",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  //FRONTEND API CALL TO SAVE OR UPDATE QUESTION.
   const saveQuestion = async () => {
    if (!validateQuestion()) return;

    console.log("editingId:", editingId);  // Should not be undefined for updates

    setLoading(true);
    try {
      const payload = {
        assessmentId: currentQuestion.assessmentId,
        questionText: currentQuestion.questionText,
        questionType: currentQuestion.questionType,
        options: currentQuestion.questionType === 'multiple_choice' 
          ? currentQuestion.options?.filter(opt => opt.label.trim())
          : [],
        correctAnswer: currentQuestion.correctAnswer,
        sampleAnswer: currentQuestion.sampleAnswer,
        instructions: currentQuestion.instructions,
        ...(editingId && { questionId: editingId })
      };

      console.log("Sending question payload to Backend:", payload);


      const response = await axios.post(
        editingId ? api.UPDATE_QUESTION : api.CREATE_QUESTION,
        payload,
        {
          headers: {
            //'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Authorization': `Bearer ${localStorage.getItem('workcultur_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("API response after saving quesiton:",response);
      showToast({
        title: "Success",
        description: editingId ? "Question updated successfully" : "Question created successfully"
      });
      
      fetchQuestions();
      resetForm();
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save question",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  //API CALL TO GET QUESTION FOR EDIT
  const editQuestion = async (question: Question) => {
    try {
      const response = await axios.post(
        api.GET_QUESTION_BY_ID,
        { questionId: question._id },
        {
          headers: {
            //'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Authorization': `Bearer ${localStorage.getItem('workcultur_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const fetchedQuestion = response.data.data.question;
      if (fetchedQuestion.questionType === 'multiple_choice' && (!fetchedQuestion.options || fetchedQuestion.options.length < 2)) {
        fetchedQuestion.options = [
          ...(fetchedQuestion.options || []),
          ...Array(2 - (fetchedQuestion.options?.length || 0)).fill({ value: '', label: '' })
        ];
      }
      
      setCurrentQuestion(fetchedQuestion);
      setEditingId(fetchedQuestion._id || null);
      setIsCreating(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch question details",
        variant: "destructive"
      });
    }
  };

  {/*
    const updateQuestion = async () => {
    
    console.log("editingId:", editingId);
    console.log("currentQuestion:", currentQuestion);

    try {
      
      const response = await axios.post(
        api.UPDATE_QUESTION,
        {
          questionId: editingId, // or currentQuestion._id
          updatedData: currentQuestion
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('workcultur_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Update response:", response.data);
      //  Refresh and reset
      await fetchQuestions();
      setIsCreating(true);
      setEditingId(null);
      setCurrentQuestion(null);

      showToast({
        title: "Success",
        description: "Question updated successfully",
        variant: "default"
      });

      // Optionally refresh questions list here
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update question",
        variant: "destructive"
      });
    }
  };

*/}
//API CALL TO DELETE QUESTION
  const deleteQuestion = async (questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    setLoading(true);
    try {
      await axios.post(
        api.DELETE_QUESTION,
        { questionId },
        {
          headers: {
            //'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Authorization': `Bearer ${localStorage.getItem('workcultur_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      showToast({
        title: "Success",
        description: "Question deleted successfully"
      });
      fetchQuestions();
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete question",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionForm = () => (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle>
          {editingId ? 'Edit Question' : 'Add New Question'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Question Text</Label>
          <Textarea
            value={currentQuestion.questionText}
            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, questionText: e.target.value }))}
            placeholder="Enter your question"
            rows={3}
          />
        </div>

{/*
        <div className="space-y-2">
          <Label>Question Type</Label>
          <Select value={currentQuestion.questionType} onValueChange={handleQuestionTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              <SelectItem value="descriptive">Descriptive</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>
*/}
        {currentQuestion.questionType === 'multiple_choice' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Options</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 border rounded-lg">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={currentQuestion.correctAnswer?.includes(option.label) || false}
                  onChange={() => handleCorrectAnswerChange(option.value)}
                  className="h-4 w-4"
                />
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option.label}
                  onChange={(e) => updateOption(index, 'label', e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(index)}
                  disabled={currentQuestion.options!.length <= 2}
                  className={currentQuestion.options!.length <= 2 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {currentQuestion.questionType === 'descriptive' && (
          <div className="space-y-2">
            <Label>Sample Answer (optional)</Label>
            <Textarea
              value={currentQuestion.sampleAnswer}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, sampleAnswer: e.target.value }))}
              placeholder="Enter a sample answer"
              rows={4}
            />
          </div>
        )}

        {(currentQuestion.questionType === 'video' || currentQuestion.questionType === 'audio') && (
          <div className="space-y-2">
            <Label>Instructions</Label>
            <Textarea
              value={currentQuestion.instructions}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, questionText: e.target.value }))}
              placeholder={`Enter instructions for ${currentQuestion.questionType} response`}
              rows={3}
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={saveQuestion} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : (editingId ? 'Update Question' : 'Save Question')}
          </Button>
          <Button variant="outline" onClick={resetForm}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          <div className="font-semibold">{toast.title}</div>
          <div className="text-sm">{toast.description}</div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => /* navigate(`/admin/courses/edit/${courseId}/assessments`)*/
          {
            if (!courseId) return;
            
            if (isEditMode && courseId ) {
              //navigate(`/admin/courses/edit/${courseId}/assessments`);
              navigate(`/admin/courses/edit/${courseId}/content`);
            } else {
              navigate(`/admin/courses/create/course/${courseId}/content`);
            }
          }
        }  className="bg-black text-white border border-white/20 hover:bg-black cursor-pointer">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Manage Questions</h1>
          <p className="text-gray-600">Assessment ID: {assessmentId}</p>
        </div>

        <div className="absolute top-16 right-6 z-50">
          <Button variant="outline" onClick={() => /* navigate(`/admin/courses/edit/${courseId}/assessments`)*/
            {
              if (!courseId) return;

              //if(location.pathname.includes("create")){
                navigate(`/admin/courses/create/course/${courseId}/publish`);
              //}else{
                //navigate(`/admin/courses/edit/${courseId}/publish`);
              //}
            }
          }  className="bg-black text-white border border-white/20 hover:bg-black cursor-pointer">Next
            <ArrowRight className="h-4 w-4 mr-2" />        
          </Button>
        </div>
      </div>

      {(isCreating || editingId) && renderQuestionForm()}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Questions ({questions.length})</CardTitle>
            <Button onClick={() => setIsCreating(true)} disabled={isCreating || editingId !== null}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-center py-4">Loading questions...</div>}
          
          {!loading && questions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No questions created yet.</p>
              <p className="text-sm">Click "Add Question" to create your first question.</p>
            </div>
          )}

          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question._id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Q{index + 1}</span>
                        <Badge variant="secondary">{question.questionType.replace('_', ' ')}</Badge>
                      </div>
                      <p className="text-gray-700">{question.questionText}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editQuestion(question)}
                        disabled={editingId !== null || isCreating}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteQuestion(question._id!)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {question.questionType === 'multiple_choice' && question.options && (
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Options:</Label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`question-${question._id}`}
                            checked={question.correctAnswer?.includes(option.label) || false}
                            readOnly
                            className="h-4 w-4"
                          />
                          <span className="text-sm">{option.label}</span>
                          {question.correctAnswer?.includes(option.label) && (
                            <Badge variant="default" className="text-xs">Correct</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
                
                {question.questionType === 'descriptive' && question.sampleAnswer && (
                  <CardContent>
                    <div>
                      <Label className="text-sm font-semibold">Sample Answer:</Label>
                      <p className="text-sm text-gray-600 mt-1">{question.sampleAnswer}</p>
                    </div>
                  </CardContent>
                )}
                
                {(question.questionType === 'video' || question.questionType === 'audio') && question.instructions && (
                  <CardContent>
                    <div>
                      <Label className="text-sm font-semibold">Instructions:</Label>
                      <p className="text-sm text-gray-600 mt-1">{question.instructions}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddQuestion;
