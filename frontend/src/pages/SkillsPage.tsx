
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  BookOpen, 
  ChevronLeft, 
  Filter, 
  Search, 
  Plus, 
  Users,
  Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { organizations, skills, users } from "@/data/mockData";
import { motion } from "framer-motion";

const SkillsPage: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const organization = organizations.find(org => org.id === orgId);
  const orgSkills = skills.filter(skill => skill.organizationId === orgId);
  
  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Shield className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Organization Not Found</h2>
        <p className="text-gray-500 mb-6">The organization you're looking for doesn't exist or has been removed.</p>
        <Button asChild variant="outline">
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }
  
  // Get unique categories
  const categories = Array.from(new Set(orgSkills.map(skill => skill.category)));
  
  // Filter skills based on search query and selected category
  const filteredSkills = orgSkills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? skill.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  // Get the users for this organization
  const orgUsers = users.filter(user => user.organizationId === orgId);
  
  // Calculate skill gaps
  const skillCoverage = orgSkills.map(skill => {
    const usersWithSkill = orgUsers.filter(user => user.skills?.includes(skill.name));
    const coverage = orgUsers.length > 0 ? (usersWithSkill.length / orgUsers.length) * 100 : 0;
    return {
      ...skill,
      coverage,
      gap: 100 - coverage
    };
  });
  
  // Sort by biggest gaps
  const sortedByGap = [...skillCoverage].sort((a, b) => b.gap - a.gap);
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
              className="rounded-full"
            >
              <Link to={`/organization/${orgId}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Skills Management
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track and manage skills across {organization.name}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="all">All Skills</TabsTrigger>
          <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col md:flex-row gap-4 items-start my-6">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search skills..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedCategory === null ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="h-9"
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="h-9"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <TabsContent value="all">
          <motion.div 
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSkills.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-gray-50 rounded-lg">
                <Shield className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No skills found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? "Try a different search term" : "Get started by adding your first skill"}
                </p>
                {!searchQuery && (
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Skill
                  </Button>
                )}
              </div>
            ) : (
              filteredSkills.map(skill => (
                <motion.div key={skill.id} variants={itemAnimation}>
                  <Card className="hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{skill.name}</span>
                        <Badge variant="outline">{skill.category}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-500">{skill.description}</p>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{skill.userCount} users</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-gray-500" />
                          <span>{skill.courseCount} courses</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="gaps">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-medium">Skill Gap Analysis</h3>
              <p className="text-sm text-gray-500">
                Skills where your organization needs the most improvement
              </p>
            </div>
            <div className="divide-y">
              {sortedByGap.slice(0, 5).map(skill => (
                <div key={skill.id} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-sm text-gray-500">{skill.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">{skill.gap.toFixed(0)}% gap</div>
                    <div className="text-sm text-gray-500">{skill.userCount} users have this skill</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <div className="text-center py-16">
            <Filter className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">Skill Trends</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Track how skills are evolving over time in your organization.
              This feature is coming soon.
            </p>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Request Feature
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillsPage;
