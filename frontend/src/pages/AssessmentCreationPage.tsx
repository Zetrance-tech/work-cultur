import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { 
  CheckSquare, 
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  Edit,
  MessageSquare,
  Video,
  Radio,
  GripVertical,
  FileQuestion
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { courses, topics, subtopics, assessments, questions as existingQuestions } from "@/data/mockData";
import { Question, Assessment } from "@/types";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  subtopicId: z.string({
    required_error: "Please select a subtopic.",
  }),
});

type QuestionType = 'multiple_choice' | 'descriptive' | 'audio' | 'video';

const AssessmentCreationPage: React.FC = () => {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>("multiple_choice");
  const [options, setOptions] = useState<string[]>([""]);
  const [correctOption, setCorrectOption] = useState<number>(0);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  
  const course = courses.find(c => c.id === courseId && 
    (c.organizationIds.includes(orgId || '') || c.organizationId === orgId)
  );
  const courseSubtopics = course ? subtopics.filter(st => 
    topics.some(t => t.courseId === courseId && t.id === st.topicId)
  ) : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtopicId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (questions.length === 0) {
      toast.error("Please add at least one question to the assessment.");
      return;
    }

    const newAssessment: Assessment = {
      id: (assessments.length + 1).toString(),
      title: values.title,
      subtopicId: values.subtopicId,
      questions: questions,
    };

    toast.success("Assessment created successfully!", {
      description: "Your new assessment has been created.",
    });

    navigate(`/organization/${orgId}/course/${courseId}`);
  }

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
      
      if (correctOption === index) {
        setCorrectOption(0);
      } else if (correctOption > index) {
        setCorrectOption(correctOption - 1);
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addQuestion = () => {
    if (!newQuestionText.trim()) {
      toast.error("Question text cannot be empty");
      return;
    }

    const newQuestion: Question = {
      id: `new-${questions.length + 1}`,
      text: newQuestionText,
      type: newQuestionType,
    };

    if (newQuestionType === 'multiple_choice') {
      const validOptions = options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        toast.error("Multiple choice questions require at least 2 options");
        return;
      }
      newQuestion.options = validOptions;
      newQuestion.correctOption = correctOption;
    }

    setQuestions([...questions, newQuestion]);
    resetQuestionForm();
  };

  const updateQuestion = () => {
    if (editingQuestion === null) return;
    
    if (!newQuestionText.trim()) {
      toast.error("Question text cannot be empty");
      return;
    }

    const updatedQuestions = [...questions];
    const updatedQuestion: Question = {
      ...updatedQuestions[editingQuestion],
      text: newQuestionText,
      type: newQuestionType,
    };

    if (newQuestionType === 'multiple_choice') {
      const validOptions = options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        toast.error("Multiple choice questions require at least 2 options");
        return;
      }
      updatedQuestion.options = validOptions;
      updatedQuestion.correctOption = correctOption;
    } else {
      delete updatedQuestion.options;
      delete updatedQuestion.correctOption;
    }

    updatedQuestions[editingQuestion] = updatedQuestion;
    setQuestions(updatedQuestions);
    resetQuestionForm();
  };

  const editQuestion = (index: number) => {
    const question = questions[index];
    setNewQuestionText(question.text);
    setNewQuestionType(question.type);
    
    if (question.type === 'multiple_choice' && question.options) {
      setOptions(question.options);
      setCorrectOption(question.correctOption || 0);
    } else {
      setOptions([""]);
      setCorrectOption(0);
    }
    
    setEditingQuestion(index);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    
    if (editingQuestion === index) {
      resetQuestionForm();
    } else if (editingQuestion !== null && editingQuestion > index) {
      setEditingQuestion(editingQuestion - 1);
    }
  };

  const resetQuestionForm = () => {
    setNewQuestionText("");
    setNewQuestionType("multiple_choice");
    setOptions([""]);
    setCorrectOption(0);
    setEditingQuestion(null);
  };

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'multiple_choice':
        return <Radio className="h-4 w-4" />;
      case 'descriptive':
        return <MessageSquare className="h-4 w-4" />;
      case 'audio':
        return <FileQuestion className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <CheckSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="icon" 
              asChild
              className="h-10 w-10 rounded-full"
            >
              <button onClick={() => navigate(`/organization/${orgId}/course/${courseId}`)}>
                <ChevronLeft className="h-5 w-5" />
              </button>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create Assessment</h1>
              <p className="text-sm text-gray-500">
                Add a new assessment or quiz to your course
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Details</CardTitle>
                    <CardDescription>Basic information about this assessment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assessment Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Final Quiz, Knowledge Check" {...field} />
                          </FormControl>
                          <FormDescription>
                            The title of your assessment as it will appear to learners.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subtopicId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Related Subtopic</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subtopic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {courseSubtopics.map((subtopic) => (
                                <SelectItem key={subtopic.id} value={subtopic.id}>
                                  {subtopic.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The subtopic this assessment is related to.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4 mt-8">
                  <Button type="button" variant="outline" onClick={() => navigate(`/organization/${orgId}/course/${courseId}`)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Assessment
                  </Button>
                </div>
              </form>
            </Form>

            <Card>
              <CardHeader>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add questions to your assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {questions.map((question, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-50 p-4 rounded-md border relative"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-white h-8 w-8 rounded-full flex items-center justify-center border">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                {getQuestionTypeIcon(question.type)}
                                <span className="ml-1 capitalize">
                                  {question.type.replace('_', ' ')}
                                </span>
                              </span>
                            </div>
                            <p className="font-medium">{question.text}</p>
                            
                            {question.type === 'multiple_choice' && question.options && (
                              <div className="mt-3 ml-2 space-y-2">
                                {question.options.map((option, optIndex) => (
                                  <div key={optIndex} className="flex items-center gap-2">
                                    <div className={`h-4 w-4 rounded-full border ${optIndex === question.correctOption ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}></div>
                                    <span className={optIndex === question.correctOption ? 'font-medium' : ''}>
                                      {option}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button type="button" size="icon" variant="ghost" onClick={() => editQuestion(index)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button type="button" size="icon" variant="ghost" onClick={() => removeQuestion(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded-md">
                    <FileQuestion className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No questions yet</h3>
                    <p className="text-gray-500 mb-4">
                      Add your first question to get started
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-6 rounded-md border">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingQuestion !== null ? "Edit Question" : "Add New Question"}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="question-text">Question</Label>
                      <Textarea 
                        id="question-text"
                        placeholder="Enter your question here..."
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Question Type</Label>
                      <RadioGroup 
                        value={newQuestionType} 
                        onValueChange={(value) => setNewQuestionType(value as QuestionType)}
                        className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="multiple_choice" id="multiple_choice" />
                          <Label htmlFor="multiple_choice" className="flex items-center">
                            <Radio className="h-4 w-4 mr-2" />
                            Multiple Choice
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="descriptive" id="descriptive" />
                          <Label htmlFor="descriptive" className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Descriptive
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="audio" id="audio" />
                          <Label htmlFor="audio" className="flex items-center">
                            <FileQuestion className="h-4 w-4 mr-2" />
                            Audio Response
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="video" id="video" />
                          <Label htmlFor="video" className="flex items-center">
                            <Video className="h-4 w-4 mr-2" />
                            Video Response
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {newQuestionType === 'multiple_choice' && (
                      <div>
                        <Label className="mb-2 block">Answer Options</Label>
                        {options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <div className="flex-shrink-0">
                              <input 
                                type="radio" 
                                checked={correctOption === index}
                                onChange={() => setCorrectOption(index)}
                                className="h-4 w-4"
                              />
                            </div>
                            <Input 
                              placeholder={`Option ${index + 1}`} 
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              size="icon" 
                              variant="ghost"
                              onClick={() => removeOption(index)}
                              disabled={options.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addOption}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-3 pt-2">
                      {editingQuestion !== null && (
                        <Button type="button" variant="outline" onClick={resetQuestionForm}>
                          Cancel
                        </Button>
                      )}
                      <Button 
                        type="button" 
                        onClick={editingQuestion !== null ? updateQuestion : addQuestion}
                        className="bg-brand-600 hover:bg-brand-700"
                      >
                        {editingQuestion !== null ? (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Update Question
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Assessment Summary</CardTitle>
                <CardDescription>Overview of your assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-1">
                    {form.watch("title") || "Untitled Assessment"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {form.watch("subtopicId") 
                      ? courseSubtopics.find(st => st.id === form.watch("subtopicId"))?.title
                      : "No subtopic selected"}
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <div className="flex justify-between mb-2">
                      <span>Total Questions:</span>
                      <span className="font-medium">{questions.length}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex gap-1 items-center">
                        <Radio className="h-3 w-3" />
                        <span>Multiple Choice:</span>
                      </div>
                      <span className="text-right">
                        {questions.filter(q => q.type === 'multiple_choice').length}
                      </span>
                      
                      <div className="flex gap-1 items-center">
                        <MessageSquare className="h-3 w-3" />
                        <span>Descriptive:</span>
                      </div>
                      <span className="text-right">
                        {questions.filter(q => q.type === 'descriptive').length}
                      </span>
                      
                      <div className="flex gap-1 items-center">
                        <FileQuestion className="h-3 w-3" />
                        <span>Audio:</span>
                      </div>
                      <span className="text-right">
                        {questions.filter(q => q.type === 'audio').length}
                      </span>
                      
                      <div className="flex gap-1 items-center">
                        <Video className="h-3 w-3" />
                        <span>Video:</span>
                      </div>
                      <span className="text-right">
                        {questions.filter(q => q.type === 'video').length}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Requirements:</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`h-4 w-4 rounded-full ${form.watch("title") ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <span>Assessment title</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`h-4 w-4 rounded-full ${form.watch("subtopicId") ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <span>Subtopic selected</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`h-4 w-4 rounded-full ${questions.length > 0 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <span>At least one question</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="pt-2">
                  <Button 
                    type="button" 
                    className="w-full gap-2"
                    disabled={!form.watch("title") || !form.watch("subtopicId") || questions.length === 0}
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    <Save className="h-4 w-4" />
                    Save Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCreationPage;
