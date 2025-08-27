

import { useState, MutableRefObject } from "react";
import { useCourse } from "@/contexts/CourseContext";
import TextContent from "@/components/course/TextContent";
import VideoContent from "@/components/course/VideoContent";
import DownloadContent from "@/components/course/DownloadContent";
import LinkContent from "@/components/course/LinkContent";
import AssessmentContent from "@/components/course/AssessmentContent";

interface ContentDisplayProps {
  isReading: boolean;
  setIsReading: (isReading: boolean) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  abortSignal?: AbortSignal;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  isReading,
  setIsReading,
  isPaused,
  setIsPaused,
  audioRef,
  abortSignal
}) => {
  const { currentTopicId, currentSubTopicId, course } = useCourse();
  const [view, setView] = useState<"content" | "assessments">("content");

  if (!course || !currentTopicId || !currentSubTopicId) {
    return <div className="p-4 text-gray-500">No content available.</div>;
  }

  const currentTopic = course.topics.find(t => t.id === currentTopicId);
  const currentSubTopic = currentTopic?.subTopics.find(st => st.id === currentSubTopicId);

  if (!currentTopic || !currentSubTopic) {
    return <div className="p-4 text-gray-500">No content available.</div>;
  }

  const renderContent = () => {
    switch (currentSubTopic.type) {
      case "text":
        return (
          <TextContent
            isReading={isReading}
            subTopic={currentSubTopic}
            setIsReading={setIsReading}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            // audioRef={audioRef}
            // abortSignal={abortSignal}
          />
        );
      case "video":
        return <VideoContent subTopic={currentSubTopic} />;
      case "download":
        return <DownloadContent subTopic={currentSubTopic} />;
      case "link":
        return <LinkContent title={currentSubTopic.title} links={currentSubTopic.links} />;
      default:
        return <div className="p-4 text-gray-500">Content not available</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full overflow-auto">
      <div className="p-2 border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => setView("content")}
            className={`text-xl font-semibold pb-2 transition-colors ${
              view === "content"
                ? "text-gray-900 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-selected={view === "content"}
          >
            Content
          </button>
          <button
            onClick={() => setView("assessments")}
            disabled={!currentSubTopic.assessmentIds?.length}
            className={`text-xl font-semibold pb-2 transition-colors ${
              view === "assessments"
                ? "text-gray-900 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            } ${!currentSubTopic.assessmentIds?.length ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-selected={view === "assessments"}
          >
            Assessments
          </button>
        </div>
      </div>
      <div className="p-4">{view === "content" ? renderContent() : <AssessmentContent title={currentSubTopic.title} assessments={currentSubTopic.assessmentIds} />}</div>
    </div>
  );
};

export default ContentDisplay;
