
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  User, 
  Search, 
  Filter, 
  ArrowUpDown,
  ChevronDown,
  CheckSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { assessmentResults, users, organizations, departments } from "@/data/mockData";
import { AssessmentResult, User as UserType } from "@/types";

// Create mock assessment result data with users
const mockResults: (AssessmentResult & { user: UserType })[] = assessmentResults.map(result => {
  const user = users.find(u => u.id === result.userId);
  return {
    ...result,
    user: user as UserType
  };
});

const AssessmentResultsPage: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<string>(orgId || "all");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedResult, setSelectedResult] = useState<(AssessmentResult & { user: UserType }) | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>("all");
  
  const organization = organizations.find(org => org.id === orgId);
  
  // Filter results based on search query and filters
  const filteredResults = mockResults.filter(result => {
    // Filter by organization
    if (selectedOrg !== "all" && result.user.organizationId !== selectedOrg) return false;
    
    // Filter by department
    if (selectedDept !== "all" && result.user.departmentId !== selectedDept) return false;
    
    // Filter by search query
    if (searchQuery && !result.user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });
  
  // Group by organization for tabs
  const resultsByOrg = organizations.map(org => ({
    org,
    results: mockResults.filter(r => r.user.organizationId === org.id)
  }));
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" asChild>
            <Link to={`/organization/${orgId}`}>
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CheckSquare className="h-7 w-7" />
              Assessment Results
            </h1>
            <p className="text-muted-foreground">
              View and analyze candidate assessment results
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search candidates..."
            className="pl-9 w-full md:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          
          <Button variant="outline" className="w-full md:w-auto">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={orgId || "all"} className="w-full">
        <TabsList className="flex overflow-x-auto">
          <TabsTrigger value="all">All Organizations</TabsTrigger>
          {organizations.map(org => (
            <TabsTrigger key={org.id} value={org.id}>
              {org.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <AssessmentResultCard 
                  key={result.id} 
                  result={result} 
                  onClick={() => setSelectedResult(result)} 
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
                <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No results found</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "Try adjusting your search criteria" 
                    : "There are no assessment results available"}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {resultsByOrg.map(({ org, results }) => (
          <TabsContent key={org.id} value={org.id} className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.length > 0 ? (
                results
                  .filter(r => !searchQuery || r.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .filter(r => selectedDept === "all" || r.user.departmentId === selectedDept)
                  .map((result) => (
                    <AssessmentResultCard 
                      key={result.id} 
                      result={result}
                      onClick={() => setSelectedResult(result)}
                    />
                  ))
              ) : (
                <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
                  <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No results for {org.name}</h3>
                  <p className="text-muted-foreground">
                    There are no assessment results available for this organization
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {selectedResult && (
        <Dialog open={!!selectedResult} onOpenChange={(open) => !open && setSelectedResult(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Assessment Results for {selectedResult.user.name}
              </DialogTitle>
              <DialogDescription>
                Detailed view of candidate responses and scores
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="md:col-span-1 space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedResult.user.avatar} alt={selectedResult.user.name} />
                    <AvatarFallback>{selectedResult.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedResult.user.name}</h3>
                    <p className="text-sm text-gray-500">{selectedResult.user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Organization:</span>
                    <span className="font-medium">
                      {organizations.find(o => o.id === selectedResult.user.organizationId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Department:</span>
                    <span className="font-medium">
                      {departments.find(d => d.id === selectedResult.user.departmentId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assessment:</span>
                    <span className="font-medium">
                      Course Assessment
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">
                      {new Date(selectedResult.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium">
                      {new Date(selectedResult.submittedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <h4 className="font-medium">Score Summary</h4>
                  <div className="flex items-center gap-3">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-lg font-medium ${
                      selectedResult.score >= 80 
                        ? 'bg-green-100 text-green-800' 
                        : selectedResult.score >= 60 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedResult.score}%
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {selectedResult.score >= 80 
                          ? 'Excellent' 
                          : selectedResult.score >= 60 
                            ? 'Satisfactory' 
                            : 'Needs Improvement'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Math.round(selectedResult.answers.length * selectedResult.score / 100)} of {selectedResult.answers.length} questions answered correctly
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <h4 className="font-medium">Filter Results</h4>
                  <div className="space-y-2">
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        <SelectItem value="topic1">Introduction to the Course</SelectItem>
                        <SelectItem value="topic2">Core Concepts</SelectItem>
                        <SelectItem value="topic3">Advanced Techniques</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedSubtopic} onValueChange={setSelectedSubtopic}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subtopic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subtopics</SelectItem>
                        <SelectItem value="subtopic1">Getting Started</SelectItem>
                        <SelectItem value="subtopic2">Basic Principles</SelectItem>
                        <SelectItem value="subtopic3">Implementation Strategies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="font-medium mb-4">Assessment Details</h3>
                <ScrollArea className="h-[500px] pr-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i} className="mb-4">
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">Question {i + 1}</CardTitle>
                            <CardDescription>
                              {i % 2 === 0 ? 'Multiple Choice' : 'Descriptive'}
                            </CardDescription>
                          </div>
                          <Badge 
                            variant={i % 3 === 0 ? "outline" : "default"} 
                            className={i % 3 === 0 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : ""
                            }
                          >
                            {i % 3 === 0 ? 'Correct' : 'Incorrect'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">
                          {i % 2 === 0 
                            ? "Which of the following statements is true about the concept discussed in this module?" 
                            : "Explain how you would implement the technique covered in this section in a real-world scenario."}
                        </p>
                        
                        {i % 2 === 0 ? (
                          <div className="space-y-2">
                            {[...Array(4)].map((_, j) => (
                              <div 
                                key={j} 
                                className={`p-3 rounded-md border ${
                                  j === 1 
                                    ? 'bg-green-50 border-green-200' 
                                    : j === 2 && i % 3 !== 0 
                                      ? 'bg-red-50 border-red-200' 
                                      : ''
                                }`}
                              >
                                <div className="flex gap-2">
                                  <span className={j === 1 ? 'text-green-600 font-medium' : ''}>
                                    {j === 0 ? 'A.' : j === 1 ? 'B.' : j === 2 ? 'C.' : 'D.'}
                                  </span>
                                  <span>Option {j + 1} {j === 1 && '(Correct answer)'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-3 rounded-md border bg-gray-50">
                              <p className="text-sm text-gray-500 mb-1">Candidate's Response:</p>
                              <p>
                                This is the answer provided by the candidate for the descriptive question. 
                                The response demonstrates an understanding of the core concepts but lacks depth 
                                in certain key areas that were covered in the course material.
                              </p>
                            </div>
                            
                            <div className="p-3 rounded-md border bg-green-50 border-green-200">
                              <p className="text-sm text-green-600 mb-1">Sample Answer:</p>
                              <p>
                                An ideal response would include a clear explanation of the implementation strategy, 
                                with specific examples and reference to best practices discussed in the course. 
                                The answer should demonstrate both theoretical understanding and practical application.
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="text-sm text-gray-500 py-3 flex justify-between">
                        <span>Topic: {i % 3 === 0 ? 'Introduction' : i % 3 === 1 ? 'Core Concepts' : 'Advanced Techniques'}</span>
                        <span>Subtopic: {i % 2 === 0 ? 'Fundamentals' : 'Application'}</span>
                      </CardFooter>
                    </Card>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface AssessmentResultCardProps {
  result: AssessmentResult & { user: UserType };
  onClick: () => void;
}

const AssessmentResultCard: React.FC<AssessmentResultCardProps> = ({ result, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full cursor-pointer hover:shadow-md transition-all" onClick={onClick}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={result.user.avatar} alt={result.user.name} />
                <AvatarFallback>{result.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{result.user.name}</CardTitle>
                <CardDescription>{result.user.email}</CardDescription>
              </div>
            </div>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${
              result.score >= 80 
                ? 'bg-green-100 text-green-800' 
                : result.score >= 60 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-red-100 text-red-800'
            }`}>
              {result.score}%
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Course:</span>
              <span className="font-medium">Advanced Skills Development</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Department:</span>
              <span>{departments.find(d => d.id === result.user.departmentId)?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Organization:</span>
              <span>{organizations.find(o => o.id === result.user.organizationId)?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date:</span>
              <span>{new Date(result.submittedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="outline" className="w-full" onClick={onClick}>
            View Details
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AssessmentResultsPage;
