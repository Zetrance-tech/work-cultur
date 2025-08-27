
import React, { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import SaveButton from "@/components/Courses/SaveButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface RagUploadFormProps {
  onContentAdded: (content: string) => void;
}

const RagUploadForm: React.FC<RagUploadFormProps> = ({ onContentAdded }) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "text/plain") {
        toast.error("Please upload only .txt files");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onContentAdded(event.target.result as string);
          toast.success("File content loaded successfully");
        }
      };
      reader.onerror = () => {
        toast.error("Error reading file");
      };
      reader.readAsText(file);
      setFiles([file]);
      
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Implement your save logic here
    toast.success("Content saved successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base Content</CardTitle>
        <CardDescription>
          Upload a text file (.txt) containing your course knowledge base content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed rounded-md border-gray-300 p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              TXT files only (Max 10MB)
            </p>
          </div>
          
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Uploaded Files</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFile(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <SaveButton onSave={handleSave} type="content" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RagUploadForm;
