
import { FileText, Video, Download, FileCheck, Link } from "lucide-react";
import { useCourse, ContentType } from "@/contexts/CourseContext";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import TopicItem from "@/components/course/TopicItem";

const getIconForContentType = (type: ContentType) => {
  switch (type) {
    case 'text':
      return <FileText className="w-4 h-4" />;
    case 'video':
      return <Video className="w-4 h-4" />;
    case 'download':
      return <Download className="w-4 h-4" />;
    case 'assessment':
      return <FileCheck className="w-4 h-4" />;
    case 'link':
      return <Link className="w-4 h-4" />;
  }
};

const TopicList = () => {
  const { 
    course, 
    currentTopicId, 
    setCurrentTopicId, 
    currentSubTopicId, 
    setCurrentSubTopicId 
  } = useCourse();

  if (!course) return null;

  const selectSubTopic = (topicId: string, subTopicId: string) => {
    setCurrentTopicId(topicId);
    setCurrentSubTopicId(subTopicId);
  };

  // When a topic is selected in the accordion, also set it as current
  const handleTopicSelect = (value: string) => {
    if (value) {
      setCurrentTopicId(value);
      // When opening a topic, select the first subtopic
      const topic = course.topics.find(t => t.id === value);
      if (topic && topic.subTopics.length > 0) {
        setCurrentSubTopicId(topic.subTopics[0].id);
      }
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="pr-4 p-2">
        <Accordion 
          type="single" 
          collapsible 
          className="w-full" 
          value={currentTopicId}
          onValueChange={handleTopicSelect}
        >
          {course.topics?.map((topic) => (
            <TopicItem 
              key={topic.id} 
              topic={topic}
              currentSubTopicId={currentSubTopicId}
              onSelectSubTopic={selectSubTopic}
              getIconForContentType={getIconForContentType}
            />
          ))}
        </Accordion>
      </div>
    </ScrollArea>
  );
};

export default TopicList;

