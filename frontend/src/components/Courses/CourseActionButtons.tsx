
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Users, 
  BarChart3, 
  FileText, 
  Share 
} from "lucide-react";
import { toast } from "sonner";

interface CourseActionButtonsProps {
  courseId: string;
  organizationId: string;
}

const CourseActionButtons: React.FC<CourseActionButtonsProps> = ({ 
  courseId, 
  organizationId 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        onClick={() => navigate(`/organization/${organizationId}/course/${courseId}/registrations`)}
      >
        <Users className="mr-2 h-4 w-4" />
        Manage Registrations
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => navigate(`/organization/${organizationId}/course/${courseId}/create-assessment`)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Assessment
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => navigate(`/organization/${organizationId}/analytics?courseId=${courseId}`)}
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Analytics
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => toast.success("Course materials exported")}
      >
        <FileText className="mr-2 h-4 w-4" />
        Export
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => {
          // Copy to clipboard logic would go here
          navigator.clipboard.writeText(
            `${window.location.origin}/organization/${organizationId}/course/${courseId}`
          );
          toast.success("Course link copied to clipboard");
        }}
      >
        <Share className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  );
};

export default CourseActionButtons;
