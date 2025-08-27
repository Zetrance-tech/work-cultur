
import React from "react";
import { Course } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { id, title, description, topicCount, enrollmentCount, createdAt, publishedAt } = course;

  const createdDate = new Date(createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  
  const isPublished = !!publishedAt;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{title}</h3>
          {isPublished ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Published
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Draft
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="flex flex-col items-center">
              <BookOpen className="h-5 w-5 text-gray-500 mb-1" />
              <span className="text-lg font-medium">{topicCount}</span>
              <span className="text-xs text-muted-foreground">Topics</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex flex-col items-center">
              <Users className="h-5 w-5 text-gray-500 mb-1" />
              <span className="text-lg font-medium">{enrollmentCount}</span>
              <span className="text-xs text-muted-foreground">Enrollments</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-5 pb-4">
        <div className="text-xs text-muted-foreground">
          Created {timeAgo}
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link to={`/course/${id}`}>
            View <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
