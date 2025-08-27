
import { useState } from "react";
import { Topic, SubTopic, ContentType } from "@/contexts/CourseContext";
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

interface TopicItemProps {
  topic: Topic;
  currentSubTopicId: string | null;
  onSelectSubTopic: (topicId: string, subTopicId: string) => void;
  getIconForContentType: (type: ContentType) => JSX.Element;
}

const TopicItem = ({ 
  topic, 
  currentSubTopicId, 
  onSelectSubTopic,
  getIconForContentType 
}: TopicItemProps) => {
  return (
    <AccordionItem value={topic.id} className="border-b border-gray-200">
      <AccordionTrigger className="py-2 px-3 hover:bg-gray-100 rounded-md font-medium">
        {topic.title}
      </AccordionTrigger>
      <AccordionContent>
        <div className="pl-2 pr-2 py-1">
          {topic.subTopics.map((subTopic) => (
            <button
              key={subTopic.id}
              className={`w-full flex items-center gap-2 p-2 text-left rounded-md hover:bg-gray-50 transition-colors ${
                currentSubTopicId === subTopic.id ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => onSelectSubTopic(topic.id, subTopic.id)}
            >
              {getIconForContentType(subTopic.type)}
              <span>{subTopic.title}</span>
            </button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TopicItem;


