import { FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Assessment {
  id: string;
  title: string;
}

interface AssessmentContentProps {
  title: string;
  assessments: Assessment[];
}

const AssessmentContent = ({ title, assessments }: AssessmentContentProps) => {
  return (
    <div className="space-y-4 p-4">
      <h3 className="text-xl font-semibold mb-6">{title}</h3>
      {assessments.length === 0 ? (
        <p className="text-gray-500">No assessments available.</p>
      ) : (
        assessments.map((assessment, index) => (
          <div
            key={index}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0 mr-4">
              <FileCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-grow">
              <p className="font-medium text-gray-800">{assessment.title}</p>
              <p className="text-sm text-gray-500">
                Complete this assessment to test your knowledge
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => alert(`Taking assessment: ${assessment.id}`)}
            >
              Take Assessment
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default AssessmentContent;
