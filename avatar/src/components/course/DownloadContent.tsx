

import { SubTopic } from "@/contexts/CourseContext";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadContentProps {
  subTopic: SubTopic;
}

const DownloadContent = ({ subTopic }: DownloadContentProps) => {
  const handleDownloadClick = (fileUrl: string, fileName: string) => {
    // In a real implementation, this would trigger a file download
    // For demo purposes, we'll create a temporary link to simulate download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

   
    alert(`Downloading ${fileName}`);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-6">{subTopic.title}</h3>
      {subTopic.files && subTopic.files.length > 0 ? (
        <div className="space-y-4">
          {subTopic.files.map((file, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 mr-4">
                {file.type.toLowerCase() === "pdf" ? (
                  <div className="w-10 h-12 bg-red-500 flex items-center justify-center rounded text-white font-bold text-xs">
                    PDF
                  </div>
                ) : file.type.toLowerCase() === "docx" ? (
                  <div className="w-10 h-12 bg-blue-600 flex items-center justify-center rounded text-white font-bold text-xs">
                    DOCX
                  </div>
                ) : file.type.toLowerCase() === "xlsx" ? (
                  <div className="w-10 h-12 bg-green-600 flex items-center justify-center rounded text-white font-bold text-xs">
                    XLS
                  </div>
                ) : (
                  <div className="w-10 h-12 bg-blue-500 flex items-center justify-center rounded text-white font-bold text-xs">
                    FILE
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">Click to download ({file.type.toUpperCase()})</p>
              </div>
              <Button
                variant="outline"
                className="flex-shrink-0"
                onClick={() => handleDownloadClick(file.url, file.name)}
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No files available for download.</p>
      )}
    </div>
  );
};

export default DownloadContent;



