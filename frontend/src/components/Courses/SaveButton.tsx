import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface SaveButtonProps {
  onSave: () => void | Promise<void>;
  type?: "content" | "assessment" | "changes" | "department" | "user" | "Topic" | "EditTopic" | "EditSubTopic" | "SubTopic" | "basic";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ 
  onSave, 
  type = "content", 
  isLoading: externalLoading,
  disabled: externalDisabled,
  className
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  
  // Use either external loading state or internal
  const isSaving = externalLoading !== undefined ? externalLoading : internalLoading;
  const isDisabled = externalDisabled !== undefined ? externalDisabled : isSaving;
  
  
  const getDisplayText = () => {
    switch (type) {
      case "content":
        return isSaving ? "Saving content..." : "Save Content";
      case "assessment":
        return isSaving ? "Saving assessments..." : "Save Assessments";
      case "department":
        return isSaving ? "Saving department..." : "Save Department";
      case "user":
        return isSaving ? "Saving user..." : "Save User";
      case "Topic":
        return isSaving ? "Saving topic..." : "Save Topic";
      case "EditTopic":
        return isSaving ? "Saving topic..." : "Save Edit";
      case "SubTopic":
        return isSaving ? "Saving subtopic..." : "Save Subtopic";
      case "EditSubTopic":
        return isSaving ? "Saving subtopic..." : "Save Edit";
      case "basic":
        return isSaving ? "Saving basic info..." : "Save Basic Info";
      case "changes":
      default:
        return isSaving ? "Saving changes..." : "Save Changes";
    }
  };

  const getSuccessMessage = () => {
    switch (type) {
      case "content":
        return "Content saved successfully";
      case "assessment":
        return "Assessment saved successfully";
      case "department":
        return "Department saved successfully";
      case "user":
        return "User saved successfully";
      case "changes":
      default:
        return "Changes saved successfully";
    }
  };

  const handleSave = async () => {
    // Only use internal loading state if external is not provided
    if (externalLoading === undefined) {
      setInternalLoading(true);
    }
    
    try {
      // If onSave returns a promise, await it
      const result = onSave();
      if (result instanceof Promise) {
        await result;
      }
      //toast.success(getSuccessMessage());
    } catch (error) {
      //toast.error(`Error saving ${type}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      if (externalLoading === undefined) {
        setInternalLoading(false);
      }
    }
  };

  return (
    <Button 
      onClick={handleSave} 
      disabled={isDisabled}
      variant="outline"
      className={className}
    >
      <Save className="mr-2 h-4 w-4" />
      
      { getDisplayText()}
      {/* isSaving ? "Saving..." : "Save"*/ }

    </Button>
  );
};

export default SaveButton;
